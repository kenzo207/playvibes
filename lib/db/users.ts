import { query } from './client'

export interface User {
    id: number
    spotify_id: string
    email: string
    display_name: string | null
    image_url: string | null
    created_at: Date
    updated_at: Date
}

export async function getUserBySpotifyId(spotifyId: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE spotify_id = $1', [spotifyId])
    return result.rows[0] || null
}

export async function getUserById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
}

export async function createUser(data: {
    spotify_id: string
    email: string
    display_name?: string
    image_url?: string
}): Promise<User> {
    const result = await query(
        `INSERT INTO users (spotify_id, email, display_name, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [data.spotify_id, data.email, data.display_name || null, data.image_url || null]
    )
    return result.rows[0]
}

export async function updateUser(
    spotifyId: string,
    data: {
        email?: string
        display_name?: string
        image_url?: string
    }
): Promise<User> {
    const fields = []
    const values = []
    let paramCount = 1

    if (data.email !== undefined) {
        fields.push(`email = $${paramCount++}`)
        values.push(data.email)
    }
    if (data.display_name !== undefined) {
        fields.push(`display_name = $${paramCount++}`)
        values.push(data.display_name)
    }
    if (data.image_url !== undefined) {
        fields.push(`image_url = $${paramCount++}`)
        values.push(data.image_url)
    }

    values.push(spotifyId)

    const result = await query(
        `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE spotify_id = $${paramCount}
     RETURNING *`,
        values
    )
    return result.rows[0]
}
