import React from "react";
import "./Track.css";

// Represents a single track in either SearchResults or Playlist
function Track({ track, isRemoval, onAdd, onRemove }) {
  // Call parent handler to add this track to the playlist
  const addTrack = () => {
    onAdd(track);
  };

  // Call parent handler to remove this track from the playlist
  const removeTrack = () => {
    onRemove(track);
  };

  // Decide which button to render:
  // "+" if in search results, "-" if in playlist
  const renderAction = () => {
    return isRemoval ? (
      <button onClick={removeTrack}>-</button>
    ) : (
      <button onClick={addTrack}>+</button>
    );
  };

  return (
    <div className="Track">
      <div className="Track-Information">
        {/* Display track name and artist/album info.
        Fallbacks ("Track Name", "Artist", "Album") are used if data is missing */}
        <h3>{track?.name || "Track Name"}</h3>
        <p>
          {track?.artist || "Artist"} | {track?.album || "Album"}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;
