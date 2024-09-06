import { pgTable, varchar, timestamp, boolean, text, integer, bigint, uuid } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
  id: varchar('id').primaryKey(),
  accessToken: varchar('accessToken'),
  expires: timestamp('expires'),
  isOnline: boolean('isOnline').notNull(),
  scope: varchar('scope'),
  shop: varchar('shop').notNull(),
  state: varchar('state').notNull(),
  apiKey: varchar('apiKey').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const onlineAccessInfo = pgTable('OnlineAccessInfo', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: varchar('sessionId').unique(),
  expiresIn: integer('expiresIn').notNull(),
  associatedUserScope: varchar('associatedUserScope').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const associatedUser = pgTable('AssociatedUser', {
  id: uuid('id').defaultRandom().primaryKey(),
  onlineAccessInfoId: uuid('onlineAccessInfoId').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: bigint('userId', { mode: 'number' }).notNull(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName').notNull(),
  email: varchar('email').notNull(),
  accountOwner: boolean('accountOwner').notNull(),
  locale: varchar('locale').notNull(),
  collaborator: boolean('collaborator').notNull(),
  emailVerified: boolean('emailVerified').notNull(),
});