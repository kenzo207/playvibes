import { query } from './client'

export interface Playlist {
    id: number
    user_id: number
    spotify_playlist_id: string
    name: string
    description: string | null
    image_url: string | null
    track_count: number
    is_public: boolean
    published_at: Date
    created_at: Date
    updated_at: Date
}

export interface PlaylistWithUser extends Playlist {
    user_display_name: string
    user_image_url: string | null
    likes_count: number
    is_liked?: boolean
}

export async function getPublicPlaylists(
    limit = 20,
    offset = 0
): Promise<PlaylistWithUser[]> {
    const result = await query(
        `SELECT 
      p.*,
      u.display_name as user_display_name,
      u.image_url as user_image_url,
      COUNT(pl.id) as likes_count
     FROM playlists p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN playlist_likes pl ON p.id = pl.playlist_id
     WHERE p.is_public = true
     GROUP BY p.id, u.display_name, u.image_url
     ORDER BY p.published_at DESC
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    )
    return result.rows
}

export async function getPlaylistById(id: number): Promise<PlaylistWithUser | null> {
    const result = await query(
        `SELECT 
      p.*,
      u.display_name as user_display_name,
      u.image_url as user_image_url,
      COUNT(pl.id) as likes_count
     FROM playlists p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN playlist_likes pl ON p.id = pl.playlist_id
     WHERE p.id = $1
     GROUP BY p.id, u.display_name, u.image_url`,
        [id]
    )
    return result.rows[0] || null
}

export async function getUserPlaylists(userId: number): Promise<Playlist[]> {
    const result = await query(
        'SELECT * FROM playlists WHERE user_id = $1 ORDER BY published_at DESC',
        [userId]
    )
    return result.rows
}

export async function publishPlaylist(data: {
    user_id: number
    spotify_playlist_id: string
    name: string
    description?: string
    image_url?: string
    track_count: number
}): Promise<Playlist> {
    const result = await query(
        `INSERT INTO playlists (user_id, spotify_playlist_id, name, description, image_url, track_count, is_public)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     ON CONFLICT (spotify_playlist_id) 
     DO UPDATE SET 
       name = EXCLUDED.name,
       description = EXCLUDED.description,
       image_url = EXCLUDED.image_url,
       track_count = EXCLUDED.track_count,
       is_public = true,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
        [
            data.user_id,
            data.spotify_playlist_id,
            data.name,
            data.description || null,
            data.image_url || null,
            data.track_count,
        ]
    )
    return result.rows[0]
}

export async function unpublishPlaylist(spotifyPlaylistId: string): Promise<void> {
    await query(
        'UPDATE playlists SET is_public = false WHERE spotify_playlist_id = $1',
        [spotifyPlaylistId]
    )
}

export async function likePlaylist(userId: number, playlistId: number): Promise<void> {
    await query(
        'INSERT INTO playlist_likes (user_id, playlist_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, playlistId]
    )
}

export async function unlikePlaylist(userId: number, playlistId: number): Promise<void> {
    await query(
        'DELETE FROM playlist_likes WHERE user_id = $1 AND playlist_id = $2',
        [userId, playlistId]
    )
}

export async function isPlaylistLiked(
    userId: number,
    playlistId: number
): Promise<boolean> {
    const result = await query(
        'SELECT 1 FROM playlist_likes WHERE user_id = $1 AND playlist_id = $2',
        [userId, playlistId]
    )
    return result.rows.length > 0
}
