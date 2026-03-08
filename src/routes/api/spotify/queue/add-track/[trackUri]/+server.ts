import { PRIVATE_API_KEY } from "$env/static/private";
import { Spotify } from "$lib";
import { addQueueItem } from "$lib/server/db/queue.js";
import { getSessionData } from "$lib/server/db/session.js";
import { json } from "@sveltejs/kit"

export const POST = async ({ params, cookies, request }): Promise<Response> => {
    let trackUri = params.trackUri;
    console.log(trackUri)
    let tokenCookie = cookies.get("token-0") || null;
    let spotify = new Spotify(tokenCookie)

    let apiKey = request.headers.has("api-key") ? request.headers.get("api-key") : null;
    console.log(request.headers.get("api-key"))
    console.log(apiKey)
    if (!apiKey || apiKey !== PRIVATE_API_KEY) return json(null);

    let session = getSessionData();
    if (!tokenCookie) tokenCookie = session?.access_token || null;

    spotify.setToken(tokenCookie)

    try {

        let trackData: SpotifyTrack | null = await spotify.getTrack(trackUri)
        console.log("trackData", trackData)
        if (!trackData) {
            if(session) {
                await spotify.refreshToken(cookies, session.refresh_token)
            } 
            return json(false);
        }


        let addedSpotify: boolean = await spotify.addToQueue(trackData.uri);

        if (!addedSpotify) {
            if(session) {
                await spotify.refreshToken(cookies, session.refresh_token)
            } 
            return json(false)
        } else {
            let addedDbQueue = addQueueItem({ artist: spotify.formatArtists(trackData.artists), songId: trackData.id, title: trackData.name, addedTimestamp: Date.now(), album: trackData.album.name })

            if (!addedDbQueue) {
                return json(false);
            } else {
                return json(true);
            }
        }
    } catch (e) {
        console.log(e)
        try {

        } catch (err) { }
        return json(false)
    }
}