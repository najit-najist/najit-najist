CREATE TABLE IF NOT EXISTS "outgoing_email_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"from" varchar NOT NULL,
	"to" varchar NOT NULL,
	"html_body" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"did_send" boolean DEFAULT false
);
