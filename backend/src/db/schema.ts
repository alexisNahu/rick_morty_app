import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(), // Postgres maneja UUIDs nativamente
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type SelectUser = InferSelectModel<typeof Users>;
export type InsertUser = InferInsertModel<typeof Users>;
