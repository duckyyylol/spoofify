import { Spotify } from '$lib';
import { getSessionData } from '$lib/server/db/session.js';
import { json } from '@sveltejs/kit';

export const GET = async ({params, cookies, url, request}): Promise<Response> => {
    let tokenCookie = cookies.get("token-0") || null;
    let apikey = request.headers.get("api-key") || null;

    if(!tokenCookie && apikey) {
        let sessionData = getSessionData();
        if(sessionData) tokenCookie = sessionData.access_token;
    }

    console.log("TOKEN COOKIE", tokenCookie)

    let spotify = new Spotify(tokenCookie);

    let np = await spotify.getCurrentUser();

    if(!np) return json(null);

    return json(np);
}