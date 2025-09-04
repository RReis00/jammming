// Spotify app credentials
const clientId = "bed39067ce6748bfb0402440d205f864";

// Must exactly match the Redirect URI configured in the Spotify Developer Dashboard
const redirectUri = "https://jammerge.netlify.app/";

// Required scope for creating public playlists
const scope = "playlist-modify-public";

// In-memory cache for the access token (will be lost on page reload)
let accessToken;

//Generates a random code_verifier for PKCE.
function generateCodeVerifier(length = 128) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let codeVerifier = "";
  for (let i = 0; i < length; i++) {
    codeVerifier += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  return codeVerifier;
}

//Creates a code_challenge from the code_verifier (SHA-256 + base64url encoding).
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  // Convert to base64url (no padding, '+' → '-', '/' → '_')
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const Spotify = {
  /**
   * Gets an access token.
   * 1) If already cached, return it.
   * 2) If no "code" in the URL: start PKCE flow and redirect to Spotify.
   * 3) If "code" is present: exchange it for an access token.
   */
  async getAccessToken() {
    if (accessToken) return accessToken;

    // Check for ?code=... in the URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // If there’s no code yet → start the authorization flow
    if (!code) {
      const codeVerifier = generateCodeVerifier();
      // Save the verifier locally so we can use it after redirect
      localStorage.setItem("code_verifier", codeVerifier);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Construct the authorization URL
      const authUrl =
        `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${codeChallenge}`;

      // Redirect user to Spotify login/consent screen
      window.location = authUrl;
      return;
    }

    // If we already have a "code" → exchange it for an access token
    const codeVerifier = localStorage.getItem("code_verifier");
    localStorage.removeItem("code_verifier"); // cleanup

    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const data = await response.json();
      // Example response: { access_token, token_type, scope, expires_in, refresh_token? }
      accessToken = data.access_token;

      // Remove the ?code= from the browser’s URL bar
      window.history.replaceState({}, document.title, window.location.pathname);

      return accessToken;
    } catch (error) {
      console.error("Error obtaining access token: ", error);
    }
  },

  /**
   * Search for tracks using a search term.
   * Returns a simplified list with {id, name, artist, album, uri}.
   */
  async search(term) {
    const token = await this.getAccessToken();
    if (!token) return [];

    const endpoint = `https://api.spotify.com/v1/search?type=track&limit=30&q=${encodeURIComponent(
      term
    )}`;

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      return (
        json.tracks?.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists?.[0]?.name || "Unknown",
          album: track.album.name,
          uri: track.uri,
        })) || []
      );
    } catch (error) {
      console.error("Spotify Search Error:", error);
      return [];
    }
  },

  /**
   * Creates a new playlist and adds tracks to it.
   * Requires the playlist-modify-public/private scope.
   */
  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = await this.getAccessToken();
    if (!token) return;

    try {
      // 1) Get the current user’s ID
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      const userId = userData.id;

      // 2) Create the playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      // 3) Add tracks to the playlist
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });

      return true;
    } catch (error) {
      console.error("Saving Playlist Error: ", error);
      return false;
    }
  },
};

export default Spotify;
