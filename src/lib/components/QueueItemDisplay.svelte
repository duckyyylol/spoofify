<script lang="ts">
    import { Row, Text } from "duckylib";
    
    import { onMount } from "svelte";
    import { MediaQuery } from "svelte/reactivity";
    import { PUBLIC_MOBILE_SIZE_PX, PUBLIC_TABLET_SIZE_PX } from "$env/static/public";

    interface QueueItemProps {
        track: SearchedTrack;
        index: number;
    }

    let { track, index }: QueueItemProps = $props();

    let tabletQuery = new MediaQuery(`max-width:${parseInt(PUBLIC_TABLET_SIZE_PX) + 200}px`)
</script>

<div>
    <Row>
        <p id="index">#{index + 1}</p>
        <Row>
            <img src="{track.imageUrl}" alt="">
        <Row justifyContent="space-between" alignItems="center" textWrap={true}>
            <p id="title"><a href="https://open.spotify.com/track/{track.uri.split(":")[2]}" target="_blank">{track.title}</a></p>
            <!-- <p id="sep"></p> -->
            {#if !tabletQuery.current}
            <p id="artist">{track.artist}</p>
            {/if}
        </Row>
        </Row>
    </Row>
</div>

<style>
    @font-face {
        font-family: "Borsok";
        src: url("$lib/assets/fonts/borsok.otf") format("otf");
        src: url("$lib/assets/fonts/borsok.ttf") format("truetype");
    }

    div {
        font-family: "Borsok";
        max-width: 700px;
        width: 50%;
        min-width: 370px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-radius: var(--border-sm);
        padding: 0.33em 0.66em;

        background-color: var(--crust);

        
    }

    img {
        height: 2.33em;
        aspect-ratio: 1/1;
        border-radius: var(--border-sm);
    }

    #title {
        text-align: left;
        font-size: 1.3em;
        /* width: 100%; */
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #index {
        /* width: 100%; */
        font-size: 1em;
        opacity: 0.5;
    }

    #artist {
        text-align: left;
        /* width: 100%; */
        font-size: 1.1em;

        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>