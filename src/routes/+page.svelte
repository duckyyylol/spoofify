<script lang="ts">
    import { ButtonCard, Column, getUserData, InfoCard } from "duckylib";

    let user = $state(getUserData());

    async function fetchQueue(): Promise<QueueItem[]> {
        let q: QueueItem[] = await (await fetch(`/api/queue`)).json()
        return q.sort((a, b) => b.addedTimestamp - a.addedTimestamp) || [];
    }

    let queue: QueueItem[] = $state([]);
</script>

{#each queue as item}
    <h1>{queue.indexOf(item) + 1}. {item.title} - {item.artist}</h1>
{/each}


