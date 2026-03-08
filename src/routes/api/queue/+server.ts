import { PRIVATE_API_KEY } from "$env/static/private";
import { deleteQueueItem, getQueue } from "$lib/server/db/queue"
import { json } from "@sveltejs/kit"

export const GET = async ({ fetch, request }): Promise<Response> => {
    let spotifyQueue: QueueItem[] | null = await (await fetch(`/api/spotify/queue`)).json()

    // let apiKey = request.headers.has("api-key") ? request.headers.get("api-key") : null;
    // if (!apiKey || apiKey !== PRIVATE_API_KEY) return json(null);

    // let q = getQueue();

    // console.log(spotifyQueue)

    // q.forEach(qi => {
    //     if(!(spotifyQueue || []).find(q => q.songId === qi.songId)) {
    //         deleteQueueItem(qi.songId);
    //     }
    // })

    // q = getQueue();

    // q = q.sort((a, b) => a.addedTimestamp - b.addedTimestamp)

    

    return json(spotifyQueue);
}