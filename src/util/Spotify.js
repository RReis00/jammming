const clientId = "bed39067ce6748bfb0402440d205f864";
const redirectUri = "https://jammerge.netlify.app/";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location = accessUrl;
    }
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&limit=20&q=${encodeURIComponent(term)}`;

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      return json.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists?.[0]?.name || "Desconhecido",
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Erro na pesquisa Spotify:", error);
      return [];
    }
  },
};

export default Spotify;

