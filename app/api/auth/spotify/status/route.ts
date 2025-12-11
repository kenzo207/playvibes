import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);

    if (!accessToken) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      accessToken,
    });
  } catch (error) {
    console.error("Error checking Spotify status:", error);
    return NextResponse.json({ error: "Failed to check Spotify status" }, { status: 500 });
  }
}
