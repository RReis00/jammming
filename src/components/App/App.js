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
      album: 'Popular Monster'
    },
    {
      id: 2,
      name: 'Somebody',
      artist: 'FISHER',
      album: 'Somebody'
    },
    {
      id: 3,
      name: 'I Fall Apart',
      artist: 'Post Malone',
      album: 'Stoney'
    }
  ])

  const [playlistName, setPlaylistName] = useState('Rock');

  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 4,
      name: 'Last Resort',
      artist: 'Papa Roach',
      album: 'Ready to Rumble'
    },
    {
      id: 5,
      name: 'Popular Monster',
      artist: 'Falling in Reverse',
      album: 'Popular Monster'
    }
  ])

  return (
    <div className="App">
      <h1>Something</h1>
      <SearchBar />
      <div className='App-playlist'>
        <SearchResults tracks={searchResults}/>
        <Playlist 
          playlistName={playlistName}
          playlistTracks={playlistTracks}
        />
      </div>
    </div>
  );
}

export default App;
