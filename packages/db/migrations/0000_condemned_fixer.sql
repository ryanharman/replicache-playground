CREATE TABLE IF NOT EXISTS "replicache_replicache_client" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"client_group_id" char(36) NOT NULL,
	"last_mutation_id" bigint DEFAULT 0 NOT NULL,
	"last_modified_version" integer NOT NULL,
	"time_created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replicache_replicache_client_group" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"space_id" char(36) NOT NULL,
	"time_created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replicache_replicache_space" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"time_created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replicache_todo" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"time_created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"time_deleted" timestamp,
	"space_id" char(36) NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
