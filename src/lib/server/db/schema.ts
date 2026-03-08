import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const queueItems = sqliteTable('queueItems', {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
	songId: text('songId').notNull(),
	title: text('title').notNull(),
	artist: text('artist').notNull(),
	album: text('album').notNull(),
	addedTimestamp: integer("addedTimestamp").notNull().$defaultFn(() => Date.now())
});

export const session = sqliteTable('session', {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
	access_token: text("access_token").notNull(),
	expires_in: integer("expires_in").notNull(),
	refresh_token: text("refresh_token").notNull(),
	scope: text("scope").notNull(),
	token_type: text("token_type").notNull()
})
