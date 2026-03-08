import { PRIVATE_CLIENT_ID } from '$env/static/private';
import { PUBLIC_REDIRECT_URI, PUBLIC_SPOTIFY_BASE_ACCOUNT_URL } from '$env/static/public';
import { Spotify } from '$lib';
import { deleteSessionData, setSessionData } from '$lib/server/db/session.js';
import { json, redirect } from '@sveltejs/kit'

const scopes: string[] = ["user-modify-playback-state", "user-read-currently-playing", "user-read-playback-state"]

export const GET = async ({ cookies, fetch, url }): Promise<Response> => {
    let fromPath = url.searchParams.get("from") || "/"

    let tokenCookie = cookies.get("token-0") || null;
    let refreshTokenCookie = cookies.get("token-r") || null;

    let spotifyAuthUrl = new URL(PUBLIC_SPOTIFY_BASE_ACCOUNT_URL + "/authorize")
    spotifyAuthUrl.searchParams.append("response_type", "code");
    spotifyAuthUrl.searchParams.append("state", fromPath);
    spotifyAuthUrl.searchParams.append("scope", scopes.join(" "));
    spotifyAuthUrl.searchParams.append("client_id", PRIVATE_CLIENT_ID);
    spotifyAuthUrl.searchParams.append("redirect_uri", PUBLIC_REDIRECT_URI);
    spotifyAuthUrl.searchParams.append("show_dialog", "true");

    let spotify = new Spotify(tokenCookie);

    if (url.searchParams.has("code")) {
        fromPath = url.searchParams.get("state") || fromPath || "/"
        // do code stuff
        let token: TokenResponse | null = await spotify.exchangeCode(url.searchParams.get("code") as string);
        if (token && token.access_token) {
            console.log(token);
            spotify.setToken(token.access_token);
            let tokenUser = await spotify.getCurrentUser();
            
            // console.log("USER", tokenUser)
            
            if (tokenUser) {
                setSessionData(token)
                let expires_in = token.expires_in;

                cookies.set("token-0", token.access_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })
                cookies.set("token-r", token.refresh_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })


                return redirect(308, `/auth/callback?from=${fromPath}`)
            } else {
                // auth failed
                return redirect(308, "/")
            }

        } else {
            // auth failed
            return redirect(308, "/")
        }

    } else {
        if (tokenCookie) {
            // continue checking token
            let tokenUser = await spotify.getCurrentUser();

            // console.log("USER", tokenUser)

            if (tokenUser) {
                
                return redirect(308, `/auth/callback?from=${fromPath}`)
            } else {
                // auth failed
                return redirect(308, "/")
            }

        } else {
            if (refreshTokenCookie) {
                //refresh token
                let token: TokenResponse | null = await spotify.refreshToken(cookies, refreshTokenCookie);
                if (token && token.access_token) {
                    console.log(token);
                    spotify.setToken(token.access_token);
                    let tokenUser = await spotify.getCurrentUser();

                    // console.log("USER", tokenUser)

                    if (tokenUser) {
                        let expires_in = token.expires_in;
                        setSessionData(token)

                        cookies.set("token-0", token.access_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })
                        cookies.set("token-r", token.refresh_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })


                        return redirect(308, `/auth/callback?from=${fromPath}`)
                    } else {
                        // auth failed
                        return redirect(308, "/")
                    }

                } else {
                    // auth failed
                    cookies.delete("token-0", {path: "/"})
                    cookies.delete("token-r", {path: "/"})
                    deleteSessionData(tokenCookie || "")
                    return redirect(308, "/")
                }
            } else {
                // should probably redirect now
                return redirect(308, spotifyAuthUrl)
            }
        }
    }


    return json(null);
}