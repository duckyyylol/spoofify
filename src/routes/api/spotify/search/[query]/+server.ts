import { PRIVATE_API_KEY } from "$env/static/private";
import { Spotify } from "$lib";
import { addQueueItem } from "$lib/server/db/queue.js";
import { getSessionData } from "$lib/server/db/session.js";
import { json } from "@sveltejs/kit"

export const GET = async ({ params, cookies, request }): Promise<Response> => {
    let session = getSessionData();



    let query = params.query;
    let tokenCookie = cookies.get("token-0") || null;
    if (!tokenCookie) tokenCookie = session?.access_token || null;

    let apiKey = request.headers.has("api-key") ? request.headers.get("api-key") : null;
    if (!apiKey || apiKey !== PRIVATE_API_KEY) return json(null);


    let spotify = new Spotify(tokenCookie)
    try {
        let results = await spotify.search(query);

        return json(results);

    } catch (e) {
        console.log(e)
        return json([])
    }
}