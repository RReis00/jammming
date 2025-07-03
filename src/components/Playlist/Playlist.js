import React from "react";
import TrackList from "../TrackList/TrackList";
import './Playlist.css'

function Playlist({playlistName, playlistTracks, onRemove, onNameChange, onSave}){
    const handleNameChange = ({target}) => {
        onNameChange(target.value);
    }

    return (
        <div className="Playlist">
            <input defaultValue={playlistName} onChange={handleNameChange}/>
            <TrackList 
                tracks={playlistTracks} 
                isRemoval={true} 
                onRemove={onRemove}
            />
            <button 
                className="Playlist-save" 
                onClick={onSave}
                disabled={!playlistTracks.length}
                >
                    SAVE TO SPOTIFY
            </button>
        </div>
    )
}

export default Playlist;