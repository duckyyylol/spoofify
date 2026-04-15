import { eq } from "drizzle-orm"
import { db } from "."
import { app_config } from "./schema"


export const createAppConfig = () => {
    let res = db.select().from(app_config).all()?.[0] || null;
    if(!res) {
        return db.insert(app_config).values({}).returning().get();
    } else return res;
}

export const updateAppConfig = (data: typeof app_config.$inferInsert) => {
    let ac = createAppConfig();
    return db.update(app_config).set(data).where(eq(app_config.id, ac.id)).returning().get();
}

export const getAppConfig = () => {
    return db.select().from(app_config).all()?.[0] || null;
}