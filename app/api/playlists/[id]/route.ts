import { NextRequest, NextResponse } from 'next/server'
import { getPlaylistById } from '@/lib/db/playlists'
import { getPlaylist } from '@/lib/spotify/client'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const playlistId = parseInt(params.id)

        if (isNaN(playlistId)) {
            return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 })
        }

        const playlist = await getPlaylistById(playlistId)

        if (!playlist) {
            return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
        }

        // Fetch tracks from Spotify (you'll need a valid access token)
        // For now, we'll return empty tracks array
        // In production, you'd use a service account or cache the tracks
        const tracks: any[] = []

        return NextResponse.json({ playlist, tracks })
    } catch (error) {
        console.error('Error fetching playlist:', error)
        return NextResponse.json(
            { error: 'Failed to fetch playlist' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const { unpublishPlaylist } = await import('@/lib/db/playlists')
        await unpublishPlaylist(params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error unpublishing playlist:', error)
        return NextResponse.json(
            { error: 'Failed to unpublish playlist' },
            { status: 500 }
        )
    }
}
