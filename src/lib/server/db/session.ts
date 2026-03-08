import type { RunResult } from "better-sqlite3";
import { db } from ".";
import { session } from "./schema";
import { eq } from "drizzle-orm";

export function setSessionData(data: typeof session.$inferInsert): TokenResponse {
    if((db.select().from(session).where(eq(session.access_token, data.access_token)).get() || null) !== null) {
        return db.insert(session).values(data).returning().get();
    } else {
        return db.update(session).set(data).returning().get();
    }
}

export async function deleteSessionData(access_token: string): Promise<RunResult> {
    return await db.delete(session).where(eq(session.access_token, access_token)).execute();
}

export function getSessionData(): TokenResponse | null {
    return db.select().from(session).all()?.[0] || null;
}