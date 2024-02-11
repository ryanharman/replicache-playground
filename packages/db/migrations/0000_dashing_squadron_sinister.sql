CREATE TABLE `replicache_replicache_client` (
	`id` char(36) NOT NULL,
	`mutation_id` bigint NOT NULL DEFAULT 0,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	`client_group_id` char(36) NOT NULL,
	`client_version` int NOT NULL,
	CONSTRAINT `replicache_replicache_client_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replicache_replicache_version` (
	`id` char(36) NOT NULL,
	`version` int NOT NULL,
	`time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`time_deleted` timestamp,
	CONSTRAINT `replicache_replicache_version_id` PRIMARY KEY(`id`)
);
