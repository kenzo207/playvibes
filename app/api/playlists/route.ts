import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getUserBySpotifyId } from '@/lib/db/users'
import { publishPlaylist } from '@/lib/db/playlists'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserBySpotifyId((session.user as any).id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { spotify_playlist_id, name, description, image_url, track_count } = body

        if (!spotify_playlist_id || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const playlist = await publishPlaylist({
            user_id: user.id,
            spotify_playlist_id,
            name,
            description,
            image_url,
            track_count,
        })

        return NextResponse.json({ playlist })
    } catch (error) {
        console.error('Error publishing playlist:', error)
        return NextResponse.json(
            { error: 'Failed to publish playlist' },
            { status: 500 }
        )
    }
}
