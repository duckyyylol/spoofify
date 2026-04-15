<script lang="ts">
    import { Column, Row, Text, Typewriter } from "duckylib";
    import { getContext, onMount } from "svelte";
    import defaultImage from "$lib/assets/favicon.png";

    let nowPlaying: SearchedTrack | null = $state(null);

    async function fetchNowPlaying(): Promise<SearchedTrack | null> {
        return (await (await fetch(`/api/spotify/now-playing`)).json()) || null;
    }

    async function fetchConfig(): Promise<any> {
        return (await (await fetch(`/api/config`))).json();
    }

    onMount(async () => {
        nowPlaying = await fetchNowPlaying();
        config = await fetchConfig();

        setInterval(async () => {
            config = await fetchConfig();
        },5e2)

        setInterval(async () => {
            let np = await fetchNowPlaying();
            
            if (np && np.id !== nowPlaying?.id) {
                switching = true;
            }
            setTimeout(() => {
                switching = false;
                nowPlaying = np;
            }, 1e3);
        }, 10e3);
    });

    let switching = $state(false);

    let animations: { [key: string]: { in: string; out: string } } = {
        flip: {
            in: "flipIn",
            out: "flipOut",
        },
        turn: {
            in: "turnIn",
            out: "turnOut",
        },
        slide: {
            in: "in",
            out: "out",
        },
    };

    let getConfig = $state(() => {
        if(!config) {
            return {
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
            }
        } else return config;
    })

    let config: any = $state(null);



    let colorMode: "gradient" | "solid" = $derived(getConfig().background_mode);

    let animation: "flip" | "turn" | "slide" = $derived(getConfig().animation_style);

    let showAlbum = $derived(getConfig().show_album || false);

    let c1: string = $derived(getConfig().color_1);
    let c2: string = $derived(getConfig().color_2);
    let sC: string = $derived(getConfig().shadow_color);

    let color1: string = $derived(c1 + "b3");
    let color2: string = $derived(c2 + "b3");
    let shadowColor: string = $derived(sC + "b9");
    let textColor: string = $derived(getConfig().text_color)
    let strokeColor: string = $derived(getConfig().stroke_color);

    let borderRadiusPx: number = $derived(getConfig().border_radius);
    let strokeWidthPx: number = $derived(getConfig().stroke_width);

    let borderRadius: string = $derived(`${borderRadiusPx}px`);
    let strokeWidth: string = $derived(`${strokeWidthPx}px`);
</script>

<div
    id="main"
    class="{switching
        ? animations[animation].out
        : animations[animation].in} {colorMode}"
    style="--color-1: {color1};--color-2: {color2};--text-color: {textColor};--stroke: {strokeColor};--shadow: {shadowColor};--border-radius: {borderRadius};--stroke-width: {strokeWidth};"
>
    <img
        src={nowPlaying?.imageUrl || defaultImage}
        alt=""
        style={nowPlaying?.imageUrl
            ? "box-shadow: 2px 4px 10.9px 0 var(--shadow);"
            : ""}
    />
    <div id="details-outer">
        <p id="label">NOW PLAYING</p>
        <div id="details-inner">
            <p id="title">{nowPlaying?.title || "Nothing is Playing"}</p>
            <p id="artist">{nowPlaying?.artist || "Someone in your Dreams"}</p>
            {#if showAlbum}
            <p id="album">{nowPlaying?.album || "Nobody's Greatest Hits"}</p>
            {/if}
        </div>
    </div>
</div>

<style>
    @font-face {
        font-family: "Borsok";
        src: url("$lib/assets/fonts/borsok.otf") format("otf");
        src: url("$lib/assets/fonts/borsok.ttf") format("truetype");
    }

    @keyframes slideOut {
        0% {
            opacity: 1;
            transform: translateX(0);
        }

        100% {
            opacity: 0;
            transform: translateX(-1000px);
        }
    }

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateX(-1000px);
        }

        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes spin {
        0% {
            transform: rotateX(0);
        }

        100% {
            transform: rotateX(360deg);
        }
    }

    @keyframes pageTurn1 {
        0% {
            transform: rotateY(-90deg);
            transform-origin: 0;
        }

        100% {
            transform: rotateY(0);
        }
    }

    @keyframes pageTurn2 {
        0% {
            transform: rotateY(0);
        }

        100% {
            transform-origin: 0;
            transform: rotateY(-90deg);
        }
    }

    @keyframes flipOut {
        0% {
            transform-origin: 0;
            transform: rotate(0deg) translateX(0px) translateY(0px);
            opacity: 1;
        }

        100% {
            transform-origin: 0;
            transform: rotate(-90deg) translateX(150px) translateY(20px);
            opacity: 0;
        }
    }

    @keyframes flipIn {
        0% {
            transform-origin: 0;
            transform: rotate(-90deg) translateX(150px) translateY(20px);
            opacity: 0;
        }

        100% {
            transform-origin: 0;
            transform: rotate(0deg) translateX(0px) translateY(0px);
            opacity: 1;
        }
    }

    .in {
        animation: 1s slideIn forwards ease-in-out;
    }

    .out {
        animation: 1s slideOut forwards ease-in-out;
    }

    .turnIn {
        animation: 1s pageTurn1 forwards ease-in-out;
    }

    .turnOut {
        animation: 1s pageTurn2 forwards ease-in-out;
    }

    .flipOut {
        animation: 0.33s flipOut forwards ease-out;
    }

    .flipIn {
        animation: 0.5s flipIn forwards ease-out;
    }

    .spin {
        animation: 1s spin forwards ease-in-out;
    }

    /* :root {
        --color-1: #9055a1b3;
        --color-2: #ae4fc9b3;
        --text-color: #e7aaff;
        --shadow: #561269b9;
        --stroke: #27132c;
    } */

    div {
        font-family: "Borsok" !important;
        font-weight: 100;
    }

    img {
        height: 150px;
        aspect-ratio: 1/1;

        border-radius: var(--border-radius);
    }

    #label {
        font-size: 1.33em;
        color: var(--text-color);
    }

    #title {
        color: white;
        font-size: 1.9em;
        width: 100%;

        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #artist {
        color: white;
        font-size: 1.2em;
        width: 100%;

        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #album {
        color: var(--text-color);
        font-size: 1em;
        width: 100%;

        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .gradient {
        background: linear-gradient(
            98deg,
            var(--color-1) 0%,
            var(--color-2) 100%
        );
    }

    .solid {
        background-color: var(--color-1);
    }

    #main {
        border-radius: var(--border-radius);
        border: var(--stroke-width) solid var(--stroke);

        min-width: 500px;
        width: fit-content;
        max-width: 700px;
        height: auto;
        max-height: 250px;

        padding: 1em 2em;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 1.33em;
    }

    #details-outer {
        height: 150px;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: space-bewteen;
        gap: 1em;
    }

    #details-inner {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.33em;
    }
</style>
