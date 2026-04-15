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

export const app_config = sqliteTable("app_config", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
	background_mode: text("background_mode").notNull().default("gradient"),
	animation_style: text("animation_style").notNull().default("slide"),
	stroke_width: integer("stroke_width").notNull().default(4),
	border_radius: integer("border_radius").notNull().default(4),
	color_1: text("color_1").notNull().default("#9055a1"),
	color_2: text("color_2").notNull().default("#ae4fc9"),
	shadow_color: text("shadow_color").notNull().default("#561269"),
	text_color: text("text_color").notNull().default("#e7aaff"),
	stroke_color: text("stroke_color").notNull().default("#27132c"),
	show_album: integer("show_album", {mode: "boolean"}).notNull().default(true)
})
