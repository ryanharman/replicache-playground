CREATE TABLE `replicache_replicache_client` (
	`id` char(36) NOT NULL,
	`client_group_id` char(36) NOT NULL,
	`last_mutation_id` bigint NOT NULL DEFAULT 0,
	`last_modified_version` int NOT NULL,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	CONSTRAINT `replicache_replicache_client_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replicache_replicache_client_group` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`space_id` char(36) NOT NULL,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	CONSTRAINT `replicache_replicache_client_group_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replicache_replicache_space` (
	`id` char(36) NOT NULL,
	`version` int NOT NULL,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	CONSTRAINT `replicache_replicache_space_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replicache_todo` (
	`id` char(24) NOT NULL,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	`space_id` char(36) NOT NULL,
	`title` char(256) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	CONSTRAINT `replicache_todo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `replicache_replicache_client_group` ADD CONSTRAINT `replicache_replicache_client_group_space_id_replicache_replicache_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `replicache_replicache_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `replicache_todo` ADD CONSTRAINT `replicache_todo_space_id_replicache_replicache_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `replicache_replicache_space`(`id`) ON DELETE no action ON UPDATE no action;