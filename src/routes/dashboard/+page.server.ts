import { redirect } from "@sveltejs/kit"
import { getUserData } from "duckylib"

export const load = async ({cookies}) => {
    if(!getUserData() || !cookies.get("token-0")) return redirect(302, "/");
}