CREATE TABLE IF NOT EXISTS "AssociatedUser" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onlineAccessInfoId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" bigint NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" varchar NOT NULL,
	"accountOwner" boolean NOT NULL,
	"locale" varchar NOT NULL,
	"collaborator" boolean NOT NULL,
	"emailVerified" boolean NOT NULL,
	CONSTRAINT "AssociatedUser_onlineAccessInfoId_unique" UNIQUE("onlineAccessInfoId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OnlineAccessInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" varchar,
	"expiresIn" integer NOT NULL,
	"associatedUserScope" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "OnlineAccessInfo_sessionId_unique" UNIQUE("sessionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"accessToken" varchar,
	"expires" timestamp,
	"isOnline" boolean NOT NULL,
	"scope" varchar,
	"shop" varchar NOT NULL,
	"state" varchar NOT NULL,
	"apiKey" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
