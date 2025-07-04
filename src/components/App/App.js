import React, {useState} from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify';

function App() {

  const [searchResults, setSearchResults] = useState([])

  const [playlistName, setPlaylistName] = useState('New Playlist');

  const [playlistTracks, setPlaylistTracks] = useState([])

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
  }

  const savePlaylist = async () => {
    const savedTracks = playlistTracks.map(track => track.uri);
    const success = await Spotify.savePlaylist(playlistName, savedTracks);

    if(success){
      setPlaylistTracks([]);
      setPlaylistName('New Playlist');
      alert('Playlist successfully saved to Spotify!');
    } else {
      alert('Error saving playlist on Spotify!');
    }
  }

  const search = (term) => {
    if (!term.trim()) return;

    Spotify.search(term).then(results => {
      const filtered = results.filter(track =>
        !playlistTracks.some(playlistTrack => playlistTrack.id === track.id)
      );

      setSearchResults(filtered.slice(0, 10));
    });
  }

  return (
    <div className="App">
      <h1>JamMerge</h1>
      <SearchBar 
        onSearch={search}
      />
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
