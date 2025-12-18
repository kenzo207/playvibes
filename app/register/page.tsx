"use client";

import LoginPage from "../login/page";

// For now, PlayVibes uses social auth via Spotify exclusively.
// We redirect to the login page or reuse the component to maintain stability.
export default function RegisterPage() {
  return <LoginPage />;
}
