import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearch } from './SearchContext';

const SearchBar = () => {
  const { isSignedIn } = useUser();
  const { setSearchQuery } = useSearch();
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (!isSignedIn) {
      alert("❗ You must sign in to use that feature.");
      return;
    }

    console.log("🔍 Searching for:", input);
    setSearchQuery(input); // Update global query
  };

  return (
    <div className='container'>
      <input
        type="text"
        className='searchBar container roboto-info'
        placeholder='Enter bill name or number'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input
        className="search-button container roboto-main"
        type="button"
        value="SEARCH"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;


