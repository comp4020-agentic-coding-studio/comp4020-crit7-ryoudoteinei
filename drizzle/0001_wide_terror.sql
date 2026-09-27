CREATE TABLE `saved_slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`course_code` text NOT NULL,
	`activity` text NOT NULL,
	`day` text NOT NULL,
	`start_minute` integer NOT NULL,
	`end_minute` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `saved_slots_owner_idx` ON `saved_slots` (`owner`);