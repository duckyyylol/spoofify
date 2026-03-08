<script lang="ts">
    import { Text } from "duckylib";
    import { onMount } from "svelte";

    let nowPlaying: SearchedTrack | null = $state(null);

    onMount(async () => {
        nowPlaying =
            (await (await fetch(`/api/spotify/now-playing`)).json()) || null;

        setInterval(async () => {
            let np = (await (await fetch(`/api/spotify/now-playing`)).json()) ||
                null;
            if(np.id !== nowPlaying?.id) {
                switching = true;
            }
            setTimeout(() => {
                switching = false;
                nowPlaying = np;
            }, 1e3)
                
                
        }, 10e3);
    });

    let switching = $state(false);
</script>

<div id="main" class="{switching ? "out" : "in"}">
    <img src={nowPlaying?.imageUrl} alt="" />
    <div id="details-outer">
        <p id="label">NOW PLAYING</p>
        <div id="details-inner">
            <p id="title">{nowPlaying?.title || "Nothing is Playing"}</p>
            <p id="artist">{nowPlaying?.artist || "Someone in your Dreams"}</p>
            <p id="album">{nowPlaying?.album || "Nobody's Greatest Hits"}</p>
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
            transform: translateX(0)
        }

        100% {
            opacity: 0;
            transform: translateX(-1000px);
        }
    }

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateX(-1000px)
        }

        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes spin {
        0% {
            transform: rotateX(0)
        }

        100% {
            transform: rotateX(360deg);
        }
    }

    .in {
        animation: 1s slideIn forwards ease-in-out;
    }

    .out {
        animation: 1s slideOut forwards ease-in-out;
    }

    .spin {
        animation: 1s spin forwards ease-in-out;

    }

    :root {
        --purple-1: rgb(144, 85, 161, 0.7);
        --purple-2: rgb(174, 79, 201, 0.7);
        --text-pink: #e7aaff;
        --shadow: #561269;
        --stroke: #27132c;
    }

    div {
        font-family: "Borsok" !important;
        font-weight: 100;
    }

    img {
        height: 150px;
        aspect-ratio: 1/1;

        border-radius: 4px;
        box-shadow: 2px 4px 10.9px 0 var(--shadow);
    }

    #label {
        font-size: 1.5em;
        color: var(--text-pink);
    }

    #title {
        color: white;
        font-size: 1.8em;
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
        color: var(--text-pink);
        font-size: 1em;
        width: 100%;

        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #main {
        border-radius: 4px;
        border: 4px solid var(--stroke);
        background: linear-gradient(
            98deg,
            var(--purple-1) 0%,
            var(--purple-2) 100%
        );

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
