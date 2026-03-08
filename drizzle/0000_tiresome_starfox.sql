CREATE TABLE `queueItems` (
	`id` text PRIMARY KEY NOT NULL,
	`songId` text NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`addedTimestamp` integer NOT NULL
);
