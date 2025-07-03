import React from "react";
import './Track.css'

function Track({track, isRemoval, onAdd, onRemove}){
    const addTrack = () => {
        onAdd(track);
    };

    const removeTrack = () =>{
        onRemove(track);
    };

    const renderAction = () =>{
        return isRemoval ? (
            <button onClick={removeTrack}>-</button>
        ) : (
            <button onClick={addTrack}>+</button>
        )
    }

    return (
        <div className="Track">
            <div className="Track-Information">
                <h3>{track?.name || 'Track Name'}</h3>
                <p>{track?.artist || 'Artist'} | {track?.album || 'Album'}</p>
            </div>
            {renderAction()}
        </div>
    )

}

export default Track;