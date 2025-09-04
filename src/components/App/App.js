import React, { useState, useEffect } from "react";
import "./App.css";

// Child components
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

// Spotify utility for API calls
import Spotify from "../../util/Spotify";

function App() {
  // -----------------------------
  // State
  // -----------------------------
  const [searchResults, setSearchResults] = useState([]); // Tracks to show in the search results
  const [playlistName, setPlaylistName] = useState("New Playlist"); // Name of the current playlist
  const [playlistTracks, setPlaylistTracks] = useState([]); // Tracks currently in the playlist
  const [rawResults, setRawResults] = useState([]); // Raw results directly from Spotify before filtering
  const [isSaving, setIsSaving] = useState(false); // Saving state (for loading screen)
  const [toast, setToast] = useState(""); // Toast message feedback (✔ or ✖)

  // -----------------------------
  // Handlers
  // -----------------------------

  // Add a track to the playlist (ignore duplicates)
  const addTrack = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  };

  // Remove a track from the playlist
  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  // Update playlist name when user edits it
  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  // Show temporary toast message for 2s
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // Save playlist to Spotify
  const savePlaylist = async () => {
    setIsSaving(true); // Show loading screen
    const savedTracks = playlistTracks.map((track) => track.uri);
    const success = await Spotify.savePlaylist(playlistName, savedTracks);

    if (success) {
      // Reset state after successful save
      setPlaylistTracks([]);
      setPlaylistName("New Playlist");
      showToast("✔ Playlist saved to Spotify!");
    } else {
      showToast("✖ Error saving playlist!");
    }
    setIsSaving(false);
  };

  // Search Spotify for a term
  const search = async (term) => {
    if (!term.trim()) return; // Ignore empty input
    const results = await Spotify.search(term);
    setRawResults(results);
  };

  // -----------------------------
  // Effects
  // -----------------------------

  // Whenever playlistTracks or rawResults change,
  // filter out tracks already in playlist from search results
  // and limit to 10 items
  useEffect(() => {
    const filtered = rawResults.filter(
      (track) =>
        !playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    );

    const finalResults = filtered.slice(0, 10);
    setSearchResults(finalResults);
  }, [playlistTracks, rawResults]);

  // -----------------------------
  // Render
  // -----------------------------

  // Special case: show loading screen while saving playlist
  if (isSaving) {
    return (
      <div className="LoadingScreen">
        <h2>Saving your playlist</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}

      <div className="App">
        <h1>JamMerge</h1>

        {/* Search bar to search for tracks */}
        <SearchBar onSearch={search} />

        <div className="App-playlist">
          {/* Left: search results list */}
          <SearchResults tracks={searchResults} onAdd={addTrack} />

          {/* Right: playlist editor */}
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </>
  );
}

export default App;
