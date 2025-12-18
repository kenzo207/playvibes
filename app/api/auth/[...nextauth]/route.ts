import NextAuth, { NextAuthOptions } from 'next-auth'
import { spotifyProvider, refreshAccessToken } from '@/lib/auth/spotify-provider'
import { query } from '@/lib/db/client'

export const authOptions: NextAuthOptions = {
    providers: [spotifyProvider],

    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
                    user,
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            // Access token has expired, try to refresh it
            return refreshAccessToken(token)
        },

        async session({ session, token }) {
            session.user = token.user as any
            session.accessToken = token.accessToken as string
            session.error = token.error as string | undefined

            return session
        },

        async signIn({ user, account, profile }) {
            if (!account || !profile) return false

            try {
                // Check if user exists
                const existingUser = await query(
                    'SELECT * FROM users WHERE spotify_id = $1',
                    [profile.id]
                )

                if (existingUser.rows.length === 0) {
                    // Create new user
                    await query(
                        `INSERT INTO users (spotify_id, email, display_name, image_url)
             VALUES ($1, $2, $3, $4)`,
                        [
                            profile.id,
                            (profile as any).email,
                            (profile as any).display_name,
                            (profile as any).images?.[0]?.url || null,
                        ]
                    )
                } else {
                    // Update existing user
                    await query(
                        `UPDATE users 
             SET email = $1, display_name = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP
             WHERE spotify_id = $4`,
                        [
                            (profile as any).email,
                            (profile as any).display_name,
                            (profile as any).images?.[0]?.url || null,
                            profile.id,
                        ]
                    )
                }

                return true
            } catch (error) {
                console.error('Error in signIn callback:', error)
                return false
            }
        },
    },

    pages: {
        signIn: '/',
        error: '/',
    },

    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
