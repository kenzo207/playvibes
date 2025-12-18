import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getUserPlaylists } from '@/lib/spotify/client'
import { getUserBySpotifyId } from '@/lib/db/users'
import { getUserPlaylists as getDbUserPlaylists } from '@/lib/db/playlists'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get Spotify playlists
        const spotifyPlaylists = await getUserPlaylists(session.accessToken as string)

        // Get user from database
        const user = await getUserBySpotifyId((session.user as any).id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get published playlists from database
        const dbPlaylists = await getDbUserPlaylists(user.id)
        const publishedIds = new Set(dbPlaylists.map(p => p.spotify_playlist_id))

        // Merge data
        const playlists = spotifyPlaylists.map((sp: any) => ({
            id: sp.id,
            name: sp.name,
            description: sp.description,
            images: sp.images,
            tracks: { total: sp.tracks.total },
            isPublished: publishedIds.has(sp.id),
        }))

        return NextResponse.json({ playlists })
    } catch (error) {
        console.error('Error fetching Spotify playlists:', error)
        return NextResponse.json(
            { error: 'Failed to fetch playlists' },
            { status: 500 }
        )
    }
}
