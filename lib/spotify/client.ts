import SpotifyWebApi from 'spotify-web-api-node'

export function createSpotifyClient(accessToken: string) {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })

    spotifyApi.setAccessToken(accessToken)

    return spotifyApi
}

export async function getUserPlaylists(accessToken: string) {
    const spotifyApi = createSpotifyClient(accessToken)

    try {
        const data = await spotifyApi.getUserPlaylists()
        return data.body.items
    } catch (error) {
        console.error('Error fetching user playlists:', error)
        throw error
    }
}

export async function getPlaylist(accessToken: string, playlistId: string) {
    const spotifyApi = createSpotifyClient(accessToken)

    try {
        const data = await spotifyApi.getPlaylist(playlistId)
        return data.body
    } catch (error) {
        console.error('Error fetching playlist:', error)
        throw error
    }
}

export async function savePlaylistToSpotify(
    accessToken: string,
    userId: string,
    playlistId: string
) {
    const spotifyApi = createSpotifyClient(accessToken)

    try {
        // First, get the playlist tracks
        const playlist = await spotifyApi.getPlaylist(playlistId)
        const trackUris = playlist.body.tracks.items.map(item => item.track.uri)

        // Create a new playlist for the user
        const newPlaylist = await spotifyApi.createPlaylist(userId, {
            name: playlist.body.name,
            description: playlist.body.description || '',
            public: false,
        })

        // Add tracks to the new playlist
        if (trackUris.length > 0) {
            await spotifyApi.addTracksToPlaylist(newPlaylist.body.id, trackUris)
        }

        return newPlaylist.body
    } catch (error) {
        console.error('Error saving playlist to Spotify:', error)
        throw error
    }
}
