import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'

function App() {
  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar />
      <div className='App-playlist'>
        <SearchResults />
        <Playlist />
      </div>
    </div>
  );
}

export default App;
