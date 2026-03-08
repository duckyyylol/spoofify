import { Spotify } from '$lib';
import { json } from '@sveltejs/kit';

export const GET = async ({params, cookies, url}): Promise<Response> => {
    let tokenCookie = cookies.get("token-0") || null;

    let spotify = new Spotify(tokenCookie);

    let np = await spotify.getCurrentUser();

    if(!np) return json(null);

    return json(np);
}