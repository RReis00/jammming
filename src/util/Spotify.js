const clientId = "bed39067ce6748bfb0402440d205f864";
const redirectUri = "https://jammerge.netlify.app/";
const scope = 'playlist-modify-public';
let accessToken;

function generateCodeVerifier(length = 128){
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for(let i = 0; i < length; i++){
        codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return codeVerifier;
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");    
}

const Spotify = {
    async getAccessToken(){
        if(accessToken) return accessToken;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if(!code){
            const codeVerifier = generateCodeVerifier();
            localStorage.setItem("code_verifier", codeVerifier);
            const codeChallenge = await generateCodeChallenge(codeVerifier);

            const authUrl = `https://accounts.spotify.com/authorize?` +
                `client_id=${clientId}` +
                `&response_type=code` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent(scope)}` +
                `&code_challenge_method=S256` +
                `&code_challenge=${codeChallenge}`;

            window.location = authUrl;
            return;
        }

        const codeVerifier = localStorage.getItem("code_verifier");
        localStorage.removeItem("code_verifier");
        const body = new URLSearchParams({
            client_id: clientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        });

        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body
            });

            const data = await response.json();
            accessToken = data.access_token;
            window.history.replaceState({}, document.title, window.location.pathname);
            return accessToken;
        } catch(error){
            console.error("Error obtaining access token: ", error);
        }
    },

    async search(term) {
        const token = await this.getAccessToken();
        if(!token) return [];

        const endpoint = `https://api.spotify.com/v1/search?type=track&limit=10&q=${encodeURIComponent(term)}`;

        try {
            const response = await fetch(endpoint, {
                headers: { Authorization : `Bearer ${token}` },
            });
            const json = await response.json();
            return json.tracks?.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists?.[0]?.name || "Unknown",
                album: track.album.name,
                uri: track.uri,
            })) || [];
        } catch(error) {
            console.error('Spotify Search Error:', error);
            return [];
        }
    },

    async savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) return;

        const token = await this.getAccessToken();
        if(!token) return;
        try {
            const userResponse = await fetch("https://api.spotify.com/v1/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = await userResponse.json();
            const userId = userData.id;

            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            });

            const playlistData = await playlistResponse.json();
            const playlistId = playlistData.id;

            await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uris: trackUris })
            });

            return true;
        } catch (error) {
            console.error("Saving Playlist Error: ", error);
            return false;
        }
    }
};


export default Spotify;