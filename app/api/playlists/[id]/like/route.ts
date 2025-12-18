import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getUserBySpotifyId } from '@/lib/db/users'
import { likePlaylist, unlikePlaylist, isPlaylistLiked } from '@/lib/db/playlists'

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserBySpotifyId((session.user as any).id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const playlistId = parseInt(params.id)
        const isLiked = await isPlaylistLiked(user.id, playlistId)

        if (isLiked) {
            await unlikePlaylist(user.id, playlistId)
            return NextResponse.json({ liked: false })
        } else {
            await likePlaylist(user.id, playlistId)
            return NextResponse.json({ liked: true })
        }
    } catch (error) {
        console.error('Error toggling like:', error)
        return NextResponse.json(
            { error: 'Failed to toggle like' },
            { status: 500 }
        )
    }
}
