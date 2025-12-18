import SpotifyProvider from 'next-auth/providers/spotify'

const scopes = [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
].join(' ')

const params = {
    scope: scopes,
}

const LOGIN_URL = `https://accounts.spotify.com/authorize?${new URLSearchParams(params).toString()}`

export const spotifyProvider = SpotifyProvider({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    authorization: LOGIN_URL,
})

export async function refreshAccessToken(token: any) {
    try {
        const url = 'https://accounts.spotify.com/api/token'

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.error('Error refreshing access token:', error)
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}
