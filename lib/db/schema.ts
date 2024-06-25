import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import db from "@/lib/db/dbConnection";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password"),
  goolgeId: text("google_id").unique(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter;
