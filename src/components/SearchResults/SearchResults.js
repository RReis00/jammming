import React from "react";
import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

// Displays the list of tracks returned from a search
function SearchResults({ tracks, onAdd }) {
  return (
    <div className="SearchResults">
      <h2>Results</h2>

      {/* Reuse TrackList component to display the search results */}
      <TrackList
        tracks={tracks} // array of track objects to show
        isRemoval={false} // false = shows "+" button (add to playlist)
        onAdd={onAdd} // callback to add a track to the playlist
      />
    </div>
  );
}

export default SearchResults;
