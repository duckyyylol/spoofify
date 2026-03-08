import { PRIVATE_API_KEY } from '$env/static/private';
import { Spotify } from '$lib';
import { getSessionData } from '$lib/server/db/session.js';
import { json } from '@sveltejs/kit';

export const GET = async ({params, cookies, url, request}): Promise<Response> => {
    let tokenCookie = cookies.get("token-0") || null;
    let session = getSessionData()
    if(!tokenCookie) tokenCookie = session?.access_token || null;

    // let apiKey = request.headers.has("api-key") ? request.headers.get("api-key") : null;
    // if(!apiKey || apiKey !== PRIVATE_API_KEY) return json(null);

    let spotify = new Spotify(tokenCookie);

    let np = await spotify.getPlaybackState();

    if(!np || !np?.is_playing) {
        if(session) await spotify.refreshToken(cookies, session.refresh_token);
        return json(null);
    }

    let track: SearchedTrack = {
        id: np.item.id,
        album: np.item.album.name,
        artist: spotify.formatArtists(np.item.artists),
        href: np.item.href,
        imageUrl: np.item.album.images[0].url,
        title: np.item.name,
        uri: np.item.uri

    }

    return json(track);
}