import React from "react";
import Track from "../Track/Track";
import "./TrackList.css";

// Reusable list component to display multiple tracks
function TrackList({ tracks, isRemoval, onAdd, onRemove }) {
  return (
    <div className="TrackList">
      {tracks.map((track) => (
        <Track
          key={track.id} // unique key for React reconciliation
          track={track} // the track object (id, name, artist, album, uri)
          isRemoval={isRemoval} // determines if the button should be "Add" or "Remove"
          onAdd={onAdd} // callback to add track (used in SearchResults)
          onRemove={onRemove} // callback to remove track (used in Playlist)
        />
      ))}
    </div>
  );
}

export default TrackList;
