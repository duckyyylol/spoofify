import type { RunResult } from "better-sqlite3";
import { db } from ".";
import { session } from "./schema";
import { eq } from "drizzle-orm";

export async function setSessionData(data: typeof session.$inferInsert): Promise<TokenResponse> {
    console.log("SET SESSION DATA", data)
    return db.transaction((tx) => {
        tx.delete(session).run();
        return tx.insert(session).values(data).returning().get();
    })
}

export async function deleteSessionData(access_token: string): Promise<RunResult> {
    return await db.delete(session).where(eq(session.access_token, access_token)).execute();
}

export function getSessionData(): TokenResponse | null {
    return db.select().from(session).all()?.[0] || null;
}