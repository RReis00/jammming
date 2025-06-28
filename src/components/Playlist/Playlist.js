import React from "react";
import TrackList from "../TrackList/TrackList";

function Playlist(){
    return (
        <div className="Playlist">
            <input defaultValue='New Playlist'/>
            <TrackList tracks={[]} isRemoval={true}/>
            <button className="Playlist-save">SAVE TO SPOTIFY</button>
        </div>
    )
}

export default Playlist;