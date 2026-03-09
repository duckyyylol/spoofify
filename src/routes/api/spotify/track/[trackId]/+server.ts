import { PRIVATE_API_KEY } from "$env/static/private";
import { Spotify } from "$lib";
import { getSessionData } from "$lib/server/db/session";
import { json } from "@sveltejs/kit";

export const GET = async ({params, cookies, request}) => {
    let session = getSessionData();

    let trackId = params.trackId;

    let tokenCookie = cookies.get("token-0") || null;
    if (!tokenCookie) tokenCookie = session?.access_token || null;

    const spotify = new Spotify(tokenCookie);

    // let apiKey = request.headers.has("api-key") ? request.headers.get("api-key") : null;
    // if (!apiKey || apiKey !== PRIVATE_API_KEY) return json(null);

    let trackData = await spotify.getTrackById(trackId);

    return json(trackData)
}