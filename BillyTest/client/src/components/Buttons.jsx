import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Buttons = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleProtectedNav = (path) => {
    if (!isSignedIn) {
      alert("❗ You must sign in to use that feature.");
    } else {
      if (window.location.pathname === path) {
        // Force refresh of route logic (reloads Favorites)
        navigate('/temp-refresh', { replace: true });
        setTimeout(() => navigate(path), 0); // redirect back to /favorites
      } else {
        navigate(path);
      }
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
