import { pgTable, text, timestamp, integer, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (managed by Better Auth)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified"),
  name: text("name"),
  image: text("image"),
  spotifyId: text("spotify_id").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Accounts table for OAuth tokens (managed by Better Auth)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  tokenType: text("token_type"),
  scope: text("scope"),
});

// Sessions table (managed by Better Auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Verification table (managed by Better Auth)
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shared playlists table
export const sharedPlaylists = pgTable("shared_playlists", {
  id: text("id").primaryKey(),
  spotifyPlaylistId: text("spotify_playlist_id").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  trackCount: integer("track_count").default(0),
  genres: text("genres").array(),
  moods: text("moods").array(),
  activities: text("activities").array(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Playlist likes table
export const playlistLikes = pgTable(
  "playlist_likes",
  {
    playlistId: text("playlist_id")
      .notNull()
      .references(() => sharedPlaylists.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playlistId, table.userId] }),
  })
);

// Playlist comments table
export const playlistComments = pgTable("playlist_comments", {
  id: text("id").primaryKey(),
  playlistId: text("playlist_id")
    .notNull()
    .references(() => sharedPlaylists.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved playlists table
export const savedPlaylists = pgTable(
  "saved_playlists",
  {
    playlistId: text("playlist_id")
      .notNull()
      .references(() => sharedPlaylists.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playlistId, table.userId] }),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  sharedPlaylists: many(sharedPlaylists),
  playlistLikes: many(playlistLikes),
  playlistComments: many(playlistComments),
  savedPlaylists: many(savedPlaylists),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const sharedPlaylistsRelations = relations(sharedPlaylists, ({ one, many }) => ({
  user: one(users, {
    fields: [sharedPlaylists.userId],
    references: [users.id],
  }),
  likes: many(playlistLikes),
  comments: many(playlistComments),
  saves: many(savedPlaylists),
}));

export const playlistLikesRelations = relations(playlistLikes, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [playlistLikes.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [playlistLikes.userId],
    references: [users.id],
  }),
}));

export const playlistCommentsRelations = relations(playlistComments, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [playlistComments.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [playlistComments.userId],
    references: [users.id],
  }),
}));

export const savedPlaylistsRelations = relations(savedPlaylists, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [savedPlaylists.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [savedPlaylists.userId],
    references: [users.id],
  }),
}));
