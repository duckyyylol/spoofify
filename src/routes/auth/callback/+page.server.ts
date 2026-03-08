import { browser } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import { setUserData, UserRoles } from 'duckylib'

export const load = async ({fetch, cookies, url}) => {
    console.log("CALLBACK")
    let fromPath = url.searchParams.get("from") || "/";

    let currentUser: SpotifyUser | null = await (await fetch(`/api/users/@me`)).json()

    console.log("CALLBACK USER", currentUser)

    if(!currentUser) {
        if(!url.searchParams.has("out")) return redirect(308, "/auth")
        return {user: null};
    } else {
        return {user: {avatarUrl: currentUser.images[0].url, id: currentUser.id, role: UserRoles.ADMIN, username: currentUser.display_name}}
    }
}