import { createAuthClient } from "better-auth/react";

// Auto-detect base URL for production if not explicitly set
const getBaseURL = () => {
  // In browser, use current origin (most reliable)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // If on Vercel (SSR), use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local development SSR
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;

// Helper function to sign in with Spotify
export const signInWithSpotify = (callbackURL: string = "/browse") => {
  return signIn.social({
    provider: "spotify",
    callbackURL,
  });
};
