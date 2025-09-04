import React from "react";
import TrackList from "../TrackList/TrackList";
import "./Playlist.css";

// Displays the current playlist being built by the user
function Playlist({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
}) {
  // Handle changes to the playlist name (input field)
  const handleNameChange = ({ target }) => {
    onNameChange(target.value);
  };

  return (
    <div className="Playlist">
      {/* Playlist name input (editable by user) */}
      <input defaultValue={playlistName} onChange={handleNameChange} />

      {/* List of tracks in the playlist (with remove "-" buttons) */}
      <TrackList
        tracks={playlistTracks}
        isRemoval={true} // true → show "-" buttons
        onRemove={onRemove} // callback to remove tracks
      />

      {/* Save button (disabled if playlist is empty) */}
      <button
        className="Playlist-save"
        onClick={onSave}
        disabled={!playlistTracks.length}
      >
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;
