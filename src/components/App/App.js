import React, {use, useState} from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'

function App() {

  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: 'Watch the World Burn',
      artist: 'Falling in Reverse',
      album: 'Popular Monster',
      uri: 'spotify:track:6rqhFgasdf9MLmUQDhG696'
    },
    {
      id: 2,
      name: 'Somebody',
      artist: 'FISHER',
      album: 'Somebody',
      uri: 'spotify:track:6rqhFgdsffnb7MLmUQDhG9'
    },
    {
      id: 3,
      name: 'I Fall Apart',
      artist: 'Post Malone',
      album: 'Stoney',
      uri: 'spotify:track:4rrrgdbbKwnb9MLmUQDhG6'
    }
  ])

  const [playlistName, setPlaylistName] = useState('Rock');

  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 4,
      name: 'Last Resort',
      artist: 'Papa Roach',
      album: 'Ready to Rumble',
      uri: 'spotify:track:4rrrgfropwnb9MLmUQDhG6'
    },
    {
      id: 5,
      name: 'Popular Monster',
      artist: 'Falling in Reverse',
      album: 'Popular Monster',
      uri: 'spotify:track:4rrrgdbbKwnb9ydlpQDhG6'
    }
  ])

  const addTrack = (track) =>{
    if(playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }

    setPlaylistTracks(prevTracks => [...prevTracks, track]);
  }

  const removeTrack = (track) => {
    setPlaylistTracks(prevTracks => 
      prevTracks.filter(savedTrack => savedTrack.id !== track.id)
    );
  }

  const updatePlaylistName = (name) =>{
    setPlaylistName(name);
    console.log(name);
  }

  const savePlaylist = () => {
    const savedTracks = playlistTracks.map(track => track.uri);
    console.log(playlistName);
    console.log(savedTracks);

    setPlaylistTracks([]);
    setPlaylistName('New Playlist');
  }

  return (
    <div className="App">
      <h1>Something</h1>
      <SearchBar />
      <div className='App-playlist'>
        <SearchResults 
          tracks={searchResults} 
          onAdd={addTrack}
        />
        <Playlist 
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
