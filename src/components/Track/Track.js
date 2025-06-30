import React from "react";

function Track({track, isRemoval, onAdd}){
    const addTrack = () => {
        onAdd(track);
    };

    const removeTrack = () =>{

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