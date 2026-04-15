import { getAppConfig } from "$lib/server/db/app_config"
import { json } from "@sveltejs/kit"

export const GET = async (): Promise<Response> => {
    return json(getAppConfig());
}