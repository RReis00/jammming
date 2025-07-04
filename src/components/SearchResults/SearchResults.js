import React from "react";
import TrackList from '../TrackList/TrackList'
import './SearchResults.css'

function SearchResults({tracks, onAdd, playlistTracks}){
    const filteredTracks = tracks.filter(
        track => !playlistTracks.some(playlistTrack => playlistTrack.id === track.id)
    );

    return (
        <div className="SearchResults">
            <h2>Results</h2>
            <TrackList 
                tracks={filteredTracks} 
                isRemoval={false} 
                onAdd={onAdd}
            /> 
        </div>
    )
}

export default SearchResults;