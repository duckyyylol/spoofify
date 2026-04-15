import { getAppConfig, updateAppConfig } from '$lib/server/db/app_config';
import type { app_config } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const POST = async ({params}): Promise<Response> => {
    let key: string = params.key;
    let value: string | number | boolean = params.value;
    let appConfig: any = getAppConfig();

    if(!appConfig || appConfig?.[key] === undefined) return json(false);

    if(key.includes("color") && !value.startsWith("#")) value = `#${value}`;

    if((key === "border_radius") && (Number.isNaN(Number(value)) || Number(value) > 40 || Number(value) < 0)) return json(false);
    if((key === "stroke_width") && (Number.isNaN(Number(value)) || Number(value) > 10 || Number(value) < 0)) return json(false);

    if(key === "border_radius" || key === "stroke_width") value = Math.round(Number(value));

    if(key.includes("show_")) value = value === "true";
    
    try {
        appConfig[key] = value;
        updateAppConfig(appConfig)

        return json(true);
    } catch(e) {
        return json(false);
    }
}