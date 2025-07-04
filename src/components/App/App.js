import React, {useState, useEffect} from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify';

function App() {

  const [searchResults, setSearchResults] = useState([])

  const [playlistName, setPlaylistName] = useState('New Playlist');

  const [playlistTracks, setPlaylistTracks] = useState([])

  const [rawResults, setRawResults] = useState([]);

  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState('');

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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  const savePlaylist = async () => {
    setIsSaving(true);
    const savedTracks = playlistTracks.map(track => track.uri);
    const success = await Spotify.savePlaylist(playlistName, savedTracks);

    if(success){
      setPlaylistTracks([]);
      setPlaylistName('New Playlist');
      showToast('✔ Playlist saved to Spotify!');
    } else {
      showToast('✖ Error saving playlist!');
    }
    setIsSaving(false);
  }

  const search = async (term) => {
    if (!term.trim()) return;

    const results = await Spotify.search(term);
    setRawResults(results);
  }

  useEffect(() => {
    const filtered = rawResults.filter(
      track => !playlistTracks.some(playlistTrack => playlistTrack.id === track.id)
    );

    const finalResults = filtered.slice(0, 10);

      setSearchResults(finalResults);
  }, [playlistTracks, rawResults])


  useEffect(() => {
    const handleRestoreSearch = (e) => {
      const restoredTerm = e.detail;
      if(restoredTerm) {
        Spotify.search(restoredTerm).then(setRawResults);
      }
    };

    window.addEventListener("restoreSearch", handleRestoreSearch);
    return () => {
      window.removeEventListener("restoreSearch", handleRestoreSearch);
    };
  }, []);




  if(isSaving){
    return (
      <div className='LoadingScreen'>
        <h2>Saving your playlist</h2>
        <div className='spinner'></div>
      </div>
    );
  }

  return (
    <>
      {toast && <div className='toast'>{toast}</div>}
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
    </>
    
  );
}

export default App;
