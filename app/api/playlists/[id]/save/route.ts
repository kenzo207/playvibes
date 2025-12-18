import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getPlaylistById } from '@/lib/db/playlists'
import { savePlaylistToSpotify } from '@/lib/spotify/client'

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const playlistId = params.id
        const playlist = await getPlaylistById(playlistId)

        if (!playlist) {
            return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
        }

        const savedPlaylist = await savePlaylistToSpotify(
            session.accessToken as string,
            (session.user as any).id,
            playlist.spotify_playlist_id
        )

        return NextResponse.json({ playlist: savedPlaylist })
    } catch (error) {
        console.error('Error saving playlist to Spotify:', error)
        return NextResponse.json(
            { error: 'Failed to save playlist' },
            { status: 500 }
        )
    }
}
