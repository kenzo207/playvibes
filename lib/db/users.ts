import { query } from './client'

export interface User {
    id: string
    spotify_id: string
    email: string | null
    display_name: string | null
    image_url: string | null
    created_at: Date
    updated_at: Date
}

export async function getUserBySpotifyId(spotifyId: string): Promise<User | null> {
    try {
        const result = await query(
            'SELECT * FROM users WHERE spotify_id = $1',
            [spotifyId]
        )
        return result.rows[0] || null
    } catch (error) {
        console.error('Error getting user by Spotify ID:', error)
        throw error
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const result = await query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        )
        return result.rows[0] || null
    } catch (error) {
        console.error('Error getting user by ID:', error)
        throw error
    }
}

export async function createUser(data: {
    spotify_id: string
    email?: string
    display_name?: string
    image_url?: string
}): Promise<User> {
    try {
        const result = await query(
            `INSERT INTO users (spotify_id, email, display_name, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [data.spotify_id, data.email || null, data.display_name || null, data.image_url || null]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
}

export async function updateUser(id: string, data: {
    email?: string
    display_name?: string
    image_url?: string
}): Promise<User> {
    try {
        const result = await query(
            `UPDATE users 
       SET email = COALESCE($1, email),
           display_name = COALESCE($2, display_name),
           image_url = COALESCE($3, image_url)
       WHERE id = $4
       RETURNING *`,
            [data.email, data.display_name, data.image_url, id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}
