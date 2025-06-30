import React, {useState} from 'react';

function SearchBar({onSearch}){
    const [term, setTerm] = useState('');

    const handleTermChange = ({target}) => {
        setTerm(target.value);
    };

    const search = () => {
        if (term.trim()) onSearch(term);
    }

    return (
        <div className='SearchBar'>
            <input 
                placeholder='Enter a Song, Album, Artist'
                onChange={handleTermChange}
                value={term}
                onKeyDown={(e) => e.key === 'Enter' && search()}
            />
            <button onClick={search}>Search</button>
        </div>
    )
}

export default SearchBar;