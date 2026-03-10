<script lang="ts">
    import QueueItemDisplay from "$lib/components/QueueItemDisplay.svelte";
    import {
        ButtonCard,
        Column,
        Heading,
        InfoCard,
    } from "duckylib";
    import { onMount } from "svelte";
    import defaultImage from "$lib/assets/favicon.png";

    // let user = $state(getUserData());

    async function fetchQueue(): Promise<SearchedTrack[]> {
        let q: SearchedTrack[] = await (await fetch(`/api/queue`)).json();
        return q;
    }

    async function fetchNowPlaying(): Promise<SearchedTrack | null> {
        let q: SearchedTrack = await (await fetch(`/api/now-playing`)).json();
        return q;
    }

    onMount(async () => {
        queue = await fetchQueue();
        nowPlaying = await fetchNowPlaying();

        setInterval(async () => {
            queue = await fetchQueue();
            nowPlaying = await fetchNowPlaying();
        }, 10e3);
    });

    let queue: SearchedTrack[] = $state([]);
    let nowPlaying: SearchedTrack | null = $state(null);
</script>

<Column widthPercent={100} textWrap={true} heightPx="fit" gapEm={2}>
    <Column widthPercent={100} textWrap={true} heightPx="fit" gapEm={2}>
        <Heading size={2} weight="bold">Now Playing</Heading>
        <Column heightPx="fit">
            {#if nowPlaying !== null}
                <QueueItemDisplay track={nowPlaying} index={0} />
            {:else}
                <QueueItemDisplay
                    track={{
                        album: "Nobody's Greatest Hits",
                        title: "Nothing is Playing",
                        artist: "Nobody",
                        href: "",
                        uri: "",
                        imageUrl: defaultImage,
                        id: "",
                    }}
                    index={0}
                />
            {/if}
        </Column>
    </Column>

    {#if queue.length > 0}
        <Column widthPercent={100} textWrap={true} heightPx="fit" gapEm={2}>
            <Heading size={2} weight="bold">Song Queue ({queue.length})</Heading
            >
            <Column heightPx="fit">
                {#each queue as track}
                    <QueueItemDisplay
                        {track}
                        index={queue.indexOf(track) + 1}
                    />
                {/each}
            </Column>
        </Column>
    {/if}
</Column>
