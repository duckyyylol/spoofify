<script lang="ts">
    import { browser } from "$app/environment";
    import { Button, Column, getTheme, Heading, HorizontalRule, Markdown, Row, Text } from "duckylib";
    import { onMount } from "svelte";
    import ColorPicker from "svelte-awesome-color-picker";

    async function fetchConfig(): Promise<any> {
        return (await await fetch(`/api/config`)).json();
    }

    async function updateConfig(
        key: string,
        value: string | number,
    ): Promise<boolean> {
        return (
            (
                await await fetch(`/api/config/set/${key}/${value}`, {
                    method: "POST",
                })
            ).json() || false
        );
    }

    async function exportConfig(): Promise<boolean> {
        if(!browser) return false;

        try {

            let intlFormatter = new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: 'long'  
            })
            
            let elem = document.createElement("a");
            elem.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(await fetchConfig()))}`);
            elem.setAttribute("download", `spoofify_export_${intlFormatter.format(new Date()).replaceAll(",", "").replaceAll(" ", "_")}.json`)
            
            elem.style.display = "none";
            
            elem.click();
            elem.remove();

            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async function importConfig(): Promise<boolean> {
        if(!browser) return false;

        if(!file) return false;

        try {

            let content = await file.text();
            let json = JSON.parse(content)

            await updateConfigWithObject(json);

            file = null;
            return true;
        } catch(e) {
            return false;
        }
        
    }

    async function updateConfigWithObject(data: any): Promise<boolean[]> {
        

        let res: boolean[] = [];
        Object.entries(data).forEach(async ([key, value]) => {
            if (typeof value === "string") {
                value = value.replace("#", "").trim();
                res = [
                    ...res,
                    await updateConfig(key, value as string),
                ];
            }
            res = [...res, await updateConfig(key, value as number)];
        });

        return res;
    }

    onMount(async () => {
        config = await fetchConfig();

        setInterval(async () => {
            config = await fetchConfig();
        }, 5e2);
    });

    let defaultConfig = {
        background_mode: "gradient",
        animation_style: "slide",
        color_1: "#9055a1",
        color_2: "#ae4fc9",
        shadow_color: "#561269",
        text_color: "#e7aaff",
        stroke_color: "#27132c",
        border_radius: 4,
        stroke_width: 4,
        show_album: true
    };

    let config: any = $state(defaultConfig);

    async function resetConfigPrompt(): Promise<boolean[]> {
        let cont = confirm("This will clear all settings, including custom colors.\n\nPerhaps export your settings first?");
        if(cont) {
            file = null;
            return await updateConfigWithObject(defaultConfig);
        } else return [];
    }

    let colorMode: "gradient" | "solid" = $derived(config.background_mode);

    let animation: "flip" | "turn" | "slide" = $derived(config.animation_style);

    let c1: string = $derived(config.color_1);
    let c2: string = $derived(config.color_2);
    let sC: string = $derived(config.shadow_color);

    let color1: string = $derived(c1 + "b3");
    let color2: string = $derived(c2 + "b3");
    let shadowColor: string = $derived(sC + "b9");
    let textColor: string = $derived(config.text_color);
    let strokeColor: string = $derived(config.stroke_color);

    let borderRadiusPx: number = $derived(config.border_radius);
    let strokeWidthPx: number = $derived(config.stroke_width);

    let borderRadius: string = $derived(`${borderRadiusPx}px`);
    let strokeWidth: string = $derived(`${strokeWidthPx}px`);

    let file: File | null = $state(null)
</script>

<Column
    widthPx="fit"
    heightPx="fit"
    alignItems="flex-start"
    justifyContent="center"
    marginTopPx={20}
    flexWrap={true}
>
<Column
    widthPx="fit"
    heightPx="fit"
    alignItems="flex-start"
    justifyContent="center"
    marginBottomPx={20}
    flexWrap={true}
>
    <Heading size={4} weight="bolder">Backup Options</Heading>
    <Row widthPx="fill"
    heightPx="fit"
    alignItems="center"
    justifyContent="flex-start" flexWrap={true}>
    <Button label="Backup Settings" type="primary" onclick={async () => {
        let res = await exportConfig();
        alert(res ? "Please select a location to save your settings export." : "Failed to Export Settings")
    }} />
    {#if file}
    <Button label="Import Settings" type={file ? "success" : "secondary"} onclick={async () => {
        if(file) {
            let res = await importConfig();
            alert(res ? "Imported Previous Settings" : "Failed to Import Settings")
        }
    }} />
    {/if}
    <input type="file" style="display: none;" name="if" id="if" max={1} min={1} accept=".json" onchange={async (e) => {
        console.log("FILES", e.currentTarget.files)
        file = e.currentTarget.files?.item(0) || null;
    }}>
    <Button label={file ? `${file.name}` : "Select Import File"} onclick={() => {
        if(browser) {
            document.getElementById("if")?.click();
        }
    }} />
    <Button label="Default Settings" type="danger" onclick={async () => {
        let res = await resetConfigPrompt();
    }} />
</Row>
</Column>
<HorizontalRule />
    <select
        name="mode"
        id="mode"
        bind:value={
            () => colorMode,
            (v) => {
                updateConfig("background_mode", v);
                colorMode = v;
            }
        }
    >
        <option value="" disabled>Background Mode</option>
        <option value="solid">Solid</option>
        <option value="gradient">Gradient</option>
    </select>

    <select
        name="anim"
        id="anim"
        bind:value={
            () => animation,
            (v) => {
                updateConfig("animation_style", v);
                animation = v;
            }
        }
    >
        <option value="" disabled>Animation Style</option>
        <option value="flip">Flip</option>
        <option value="slide">Slide</option>
        <option value="turn">Turn</option>
    </select>

    <Column
        widthPx="fit"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
    >
        <Text>Show Album?</Text>
        <Text sizeEm={0.8} classList={["italic", "yellow"]}>May change the width of the overlay</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <input
                type="checkbox"
                name="sal"
                id="sal"
                bind:checked={
                    () => config.show_album,
                    (v) => {
                        updateConfig("show_album", v);
                        config.show_album = v;
                    }
                }
            />
            {config.show_album ? "Album Visible" : "Album Hidden"}
        </Row>
    </Column>

    <Column
        widthPx="fit"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
    >
        <Text>Border Radius</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <input
                type="range"
                min={0}
                max={40}
                name="br"
                id="br"
                bind:value={
                    () => borderRadiusPx,
                    (v) => {
                        console.log("RANGE UPDATED", v);
                        updateConfig("border_radius", v);
                        borderRadiusPx = v;
                    }
                }
            />
            {borderRadiusPx === 0 ? "Square Corners" : borderRadius}
        </Row>
    </Column>

    <Column
        widthPx="fit"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
    >
        <Text>Border Width</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <input
                type="range"
                min={0}
                max={10}
                name="sw"
                id="sw"
                bind:value={() => strokeWidthPx, (v) => {
                    updateConfig("stroke_width", v);
                    strokeWidthPx = v;
                }}
            />
            {strokeWidthPx === 0 ? "No Border" : strokeWidth}
        </Row>
    </Column>

    <Column
        widthPx="fill"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
        backgroundColor={color1}
    >
        <Text>Background Color{colorMode !== "gradient" ? "" : " 1"}</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <div class="dark">
                <ColorPicker isAlpha={false} isDark={true} isTextInput={true} textInputModes={["hex"]} label={color1} name="co" bind:hex={() => c1, (v) => {
                updateConfig("color_1", v.replace("#", "").trim());
                c1 = v;
            }} />
            </div>
        </Row>
    </Column>
    {#if colorMode === "gradient"}
        <Column
            widthPx="fill"
            heightPx="fit"
            alignItems="flex-start"
            justifyContent="center"
            gapEm={0.5}
            backgroundColor={color2}
        >
            <Text>Background Color 2</Text>
            <Row
                widthPx="fit"
                heightPx="fit"
                alignItems="center"
                justifyContent="flex-start"
                gapEm={0.5}
            >
                <div class="dark">
                <ColorPicker isAlpha={false} isDark={true} isTextInput={true} textInputModes={["hex"]} label={color2} name="co2" bind:hex={() => c2, (v) => {
                updateConfig("color_2", v.replace("#", "").trim());
                c2 = v;
            }} />
            </div>
            </Row>
        </Column>
    {/if}
    <Column
        widthPx="fill"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
        backgroundColor={strokeColor}
    >
        <Text>Border Color</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <div class="dark">
                <ColorPicker isAlpha={false} isDark={true} isTextInput={true} textInputModes={["hex"]} label={strokeColor} name="cos" bind:hex={() => strokeColor, (v) => {
                updateConfig("stroke_color", v.replace("#", "").trim());
                strokeColor = v;
            }} />
            </div>
        </Row>
    </Column>
    <Column
        widthPx="fill"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
        backgroundColor={color1}
    >
    <div style="color: {textColor};">
        <Text weight="black" inheritColor={true}>Accent Text Color</Text>
    </div>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <div class="dark">
                <ColorPicker isAlpha={false} isDark={true} isTextInput={true} textInputModes={["hex"]} label={textColor} name="cot" bind:hex={() => textColor, (v) => {
                updateConfig("text_color", v.replace("#", "").trim());
                textColor = v;
            }} />
            </div>
        </Row>
    </Column>
    <Column
        widthPx="fill"
        heightPx="fit"
        alignItems="flex-start"
        justifyContent="center"
        gapEm={0.5}
        backgroundColor={shadowColor}
    >
        <Text>Shadow Color</Text>
        <Row
            widthPx="fit"
            heightPx="fit"
            alignItems="center"
            justifyContent="flex-start"
            gapEm={0.5}
        >
            <div class="dark">
                <ColorPicker isAlpha={false} isDark={true} isTextInput={true} textInputModes={["hex"]} label={shadowColor} name="co" bind:hex={() => sC, (v) => {
                updateConfig("shadow_color", v.replace("#", "").trim());
                sC = v;
            }} />
            </div>
        </Row>
    </Column>
</Column>

<style>
    .dark {
        --cp-bg-color: var(--crust);
        --cp-border-color: var(--mantle);
        --cp-text-color: var(--text);
        --cp-input-color: var(--mantle);
        --cp-button-hover-color: var(--surface-2);
        --focus-color: var(--accent);

        --picker-indicator-size: 1em;
        --input-size: 1.33em;
        --slider-width: 0.66em;
        --picker-width: 200px;
        --picker-height: 125px;
    }
</style>
