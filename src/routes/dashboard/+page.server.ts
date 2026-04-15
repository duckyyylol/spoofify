import { redirect } from "@sveltejs/kit"

export const load = async ({cookies}) => {
    if(!cookies.get("token-0")) return redirect(302, "/");
}