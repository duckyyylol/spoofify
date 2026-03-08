import type { RunResult } from "better-sqlite3";
import { db } from ".";
import { queueItems } from "./schema";
import { eq } from "drizzle-orm";

export function addQueueItem(data: typeof queueItems.$inferInsert): QueueItem {
    return db.insert(queueItems).values(data).returning().get();
}

export function getQueue(): QueueItem[] {
    return db.select().from(queueItems).all() || [];
}

export async function deleteQueueItem(songId: string): Promise<RunResult> {
    return await db.delete(queueItems).where(eq(queueItems.songId, songId)).execute();
}