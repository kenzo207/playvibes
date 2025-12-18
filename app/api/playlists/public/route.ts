import { NextRequest, NextResponse } from 'next/server'
import { getPublicPlaylists } from '@/lib/db/playlists'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const playlists = await getPublicPlaylists(limit, offset)

        return NextResponse.json({ playlists })
    } catch (error) {
        console.error('Error fetching public playlists:', error)
        return NextResponse.json(
            { error: 'Failed to fetch playlists' },
            { status: 500 }
        )
    }
}
