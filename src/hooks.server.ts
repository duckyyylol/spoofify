import { createAppConfig } from '$lib/server/db/app_config'

export const handle = ({event, resolve}) => {
    createAppConfig();

    return resolve(event);
}