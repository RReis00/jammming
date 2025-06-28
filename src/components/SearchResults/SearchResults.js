import React from "react";
import TrackList from '../TrackList/TrackList'

function SearchResults({tracks}){
    return (
        <div className="SearchResults">
            <h2>Results</h2>
            <TrackList tracks={tracks} isRemoval={false} /> 
        </div>
    )
}

export default SearchResults;