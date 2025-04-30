import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from './SearchContext'; // adjust path if needed

const Buttons = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch(); // ✅ hook into context

  const handleProtectedNav = (path) => {
    if (!isSignedIn) {
      alert("❗ You must sign in to use that feature.");
      return;
    }

    // ✅ Clear search query for both routes
    if (path === "/bills" || path === "/favorites") {
      setSearchQuery("");
    }

    if (window.location.pathname === path) {
      // Force refresh of route logic
      navigate('/temp-refresh', { replace: true });
      setTimeout(() => navigate(path), 0);
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <button
        className="all-faves-buttons roboto-main"
        type="button"
        onClick={() => handleProtectedNav("/bills")}
      >
        View All
      </button>

      <button
        className="all-faves-buttons roboto-main"
        type="button"
        onClick={() => handleProtectedNav("/favorites")}
      >
        View Favorites
      </button>
    </div>
  );
};

export default Buttons;

