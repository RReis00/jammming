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
                {track.preview ? (
                    <audio controls className="Track-AudioPreview">
                        <source src={track.preview} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    ) : (
                        <p className="NoPreview">🎧 Preview indisponível</p>
                    )}
            </div>
            {renderAction()}
        </div>
    )

}

export default Track;