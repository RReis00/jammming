import React from "react";
import Track from "../Track/Track";

function TrackList({ tracks, isRemoval, onAdd}) {
    return (<div className="TrackList">
        {tracks.map(track =>(
            <Track 
                key={track.id} 
                track={track} 
                isRemoval={isRemoval} 
                onAdd={onAdd}
            />
        ))}
    </div>)
}

export default TrackList;