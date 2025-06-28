import React from 'react';

function SearchBar(){
    return (
        <div className='SearchBar'>
            <input placeholder='Enter a Song, Album, Artist'/>
            <button>Search</button>
        </div>
    )
}

export default SearchBar;