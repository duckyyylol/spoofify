import { PRIVATE_CLIENT_ID, PRIVATE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_REDIRECT_URI, PUBLIC_SPOTIFY_BASE_ACCOUNT_URL, PUBLIC_SPOTIFY_BASE_API_URL } from "$env/static/public";
import axios from "axios";
import { getSessionData, setSessionData } from "./server/db/session";
import type { Cookies } from "@sveltejs/kit";

export default class Spotify {
    token: string | null;

    constructor(token: string | null) {
        this.token = token;
    }

    private async makeRequest(endpoint: string, method: "GET" | "POST", body: any = null): Promise<Axios.AxiosXHR<any> | null> {
        let r = null;
        switch (method) {
            case "GET": {
                console.log("GET REQUEST")
                r = await axios({ url: `${PUBLIC_SPOTIFY_BASE_API_URL}${endpoint}`, method: "GET", headers: { Authorization: `Bearer ${this.token}` } })

            }
            case "POST": {
                if (body !== null) r = await axios.post(`${PUBLIC_SPOTIFY_BASE_API_URL}${endpoint}`, body, { headers: { Authorization: `Bearer ${this.token}` } })
                if (body === null) {
                    r = await axios.post(`${PUBLIC_SPOTIFY_BASE_API_URL}${endpoint}`, null, { headers: { Authorization: `Bearer ${this.token}` } })
                }
            }
        }

        return r;
    }

    private async get(endpoint: string): Promise<Axios.AxiosXHR<any>> {
        return await axios.get(`${PUBLIC_SPOTIFY_BASE_API_URL}${endpoint}`, { headers: { Authorization: `Bearer ${this.token}` } })
    }

    async exchangeCode(code: string): Promise<TokenResponse | null> {
        console.log(`Basic ${Buffer.from(`${PRIVATE_CLIENT_ID}:${PRIVATE_CLIENT_SECRET}`).toString("base64")}`)

        let params = new URLSearchParams();
        params.append("code", code)
        params.append("grant_type", "authorization_code")
        params.append("redirect_uri", PUBLIC_REDIRECT_URI)

        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${Buffer.from(`${PRIVATE_CLIENT_ID}:${PRIVATE_CLIENT_SECRET}`).toString("base64")}`
        }

        const res = await axios.post(`${PUBLIC_SPOTIFY_BASE_ACCOUNT_URL}/api/token`, params, { params: params, headers })

        if (!(res.data as TokenResponse)?.access_token) return null;

        return res.data as TokenResponse || null;
    }

    async refreshToken(cookies: Cookies, refresh_token: string): Promise<TokenResponse | null> {
        console.log(`Basic ${Buffer.from(`${PRIVATE_CLIENT_ID}:${PRIVATE_CLIENT_SECRET}`).toString("base64")}`)

        let params = new URLSearchParams();
        params.append("refresh_token", refresh_token)
        params.append("grant_type", "refresh_token")
        params.append("client_id", PRIVATE_CLIENT_ID)

        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${Buffer.from(`${PRIVATE_CLIENT_ID}:${PRIVATE_CLIENT_SECRET}`).toString("base64")}`
        }

        try {

            const res = await axios.post(`${PUBLIC_SPOTIFY_BASE_ACCOUNT_URL}/api/token`, params, { params: params, headers })

            if (!(res.data as TokenResponse)?.access_token) return null;

            let token = res.data as TokenResponse;
            if(!token.refresh_token) token.refresh_token = refresh_token;

            console.log("REFRESHED", token)

            await setSessionData(token)
            let expires_in = token.expires_in;

            cookies.set("token-0", token.access_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })
            cookies.set("token-r", token.refresh_token, { path: "/", maxAge: expires_in, expires: new Date(Date.now() + (expires_in * 1000)) })

            return res.data as TokenResponse || null;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    setToken(new_token: string | null): Spotify {
        this.token = new_token;
        return this;
    }

    async getCurrentUser(): Promise<SpotifyUser | null> {
        const res = await this.get("/me").catch(e => console.log(e))
        // .catch(e => console.log(e))
        if (!res || !res.data) return null;
        return res.data;
    }

    async getPlaybackState(): Promise<PlaybackState | null> {
        const res = await this.get(`/me/player/currently-playing`).catch(e => console.log(e))
        if (!res || !res.data) {
            return null;
        }
        return res.data;
    }

    async getQueue(): Promise<SpotifyQueue | null> {
        try {
            const res = await this.get(`/me/player/queue`)

            if (!res || !res.data) return null;

            return res.data;
        } catch (e) {

            return null;
        }
    }

    async search(query: string) {
        const q = encodeURI(query);
        const res = await this.get(`/search?q=${q}&type=track`).catch(e => console.log(e))
        if (!res || !res.data) return null;
        return res.data;
    }

    async addToQueue(track_uri: string): Promise<boolean> {
        try {
            const res = await this.makeRequest(`/me/player/queue?uri=${track_uri}`, "POST");

            if (!res || res.status !== 200) return false;
            return true;
        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getTrack(track_uri: string): Promise<SpotifyTrack | null> {
        try {
            const res = await this.get(`/tracks/${track_uri.split(":")[2]}`);

            if (!res || !res.data || res.status !== 200) return null;
            return res.data as SpotifyTrack;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async getTrackById(track_id: string): Promise<SpotifyTrack | null> {
        try {
            const res = await this.get(`/tracks/${track_id}`);

            if (!res || !res.data || res.status !== 200) return null;
            return res.data as SpotifyTrack;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    formatArtists(artists: SpotifyArtist[]): string {
        return artists.map(a => a.name).join(", ");
    }
}