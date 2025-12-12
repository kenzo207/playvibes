import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { users, accounts, sessions, verification } from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verification,
    },
  }),
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
      ],
      mapProfileToUser: (profile) => {
        console.log("Spotify profile received:", profile);
        return {
          // Better Auth handles ID generation. We just map fields.
          email: profile.email,
          name: profile.display_name,
          image: profile.images?.[0]?.url,
          spotifyId: profile.id,
        };
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  logger: {
    level: "debug",
    disabled: false,
  },
});
