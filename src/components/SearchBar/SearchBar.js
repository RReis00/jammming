import React, {useState} from 'react';
import './SearchBar.css'

// Functional component with a search input and button
function SearchBar({onSearch}){
    // Local state for the search term typed by the user
    const [term, setTerm] = useState('');

    // Update state whenever the user types in the input field
    const handleTermChange = ({target}) => {
        setTerm(target.value);
    };

    // Trigger search if input is not empty
    const search = () => {
        if (term.trim()) onSearch(term);
    }

    return (
        <div className='SearchBar'>
            <input 
                placeholder='Enter a Song, Album, Artist'
                onChange={handleTermChange} // updates "term" as the user types
                value={term}                // controlled input bound to state
                onKeyDown={(e) => e.key === 'Enter' && search()} // allow "Enter" key to trigger search
            />
            <button onClick={search}>Search</button>
        </div>
    )
}

export default SearchBar;
