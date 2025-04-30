import React from 'react';
import { useUser } from '@clerk/clerk-react';

const SearchBar = () => {
  const { isSignedIn } = useUser();

  const handleSearch = () => {
    if (!isSignedIn) {
      alert("❗ You must sign in to use that feature.");
      return;
    }

    // Continue with actual search behavior if logged in
    console.log("🔍 Search clicked (logged in)");
  };

  return (
    <div className='container'>
      <input type="text" className='searchBar container roboto-info' placeholder='Enter bill name or number' />
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

