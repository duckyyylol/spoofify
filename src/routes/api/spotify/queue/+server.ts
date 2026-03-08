import { Spotify } from '$lib';
import { getSessionData } from '$lib/server/db/session';
import { json } from '@sveltejs/kit';

export const GET = async ({params, cookies, url}): Promise<Response> => {
    let tokenCookie = cookies.get("token-0") || null;
    let session = getSessionData();
    if(!tokenCookie) tokenCookie = session?.access_token || null;

    let spotify = new Spotify(tokenCookie);

    let np = await spotify.getQueue();

    if(!np) return json(null);
    

    let tracks: SearchedTrack[] = np.queue.map(t => ({
        id: t.id,
        album: t.album.name,
        artist: t.artists.map(a => a.name).join(", "),
        href: t.href,
        imageUrl: t.album.images[0].url,
        title: t.name,
        uri: t.uri

    }))

    return json(tracks);
}