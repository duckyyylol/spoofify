import { PRIVATE_CLIENT_ID } from '$env/static/private';
import { PUBLIC_REDIRECT_URI, PUBLIC_SPOTIFY_BASE_ACCOUNT_URL } from '$env/static/public';
import { Spotify } from '$lib';
import { json, redirect } from '@sveltejs/kit'

const scopes: string[] = ["user-modify-playback-state", "user-read-currently-playing", "user-read-playback-state"]

export const GET = async ({ cookies, fetch, url }): Promise<Response> => {
    cookies.delete("token-0", {path: "/"})
    cookies.delete("token-r", {path: "/"})

    redirect(308, "/auth/callback?out")

    return json(null);
}