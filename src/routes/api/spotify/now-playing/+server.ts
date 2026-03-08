import { Spotify } from '$lib';
import { getSessionData } from '$lib/server/db/session';
import { json } from '@sveltejs/kit';

export const GET = async ({params, cookies, url}): Promise<Response> => {
    let session = getSessionData()
    
    let tokenCookie = cookies.get("token-0") || null;
    if(!tokenCookie) tokenCookie = session?.access_token || null;

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