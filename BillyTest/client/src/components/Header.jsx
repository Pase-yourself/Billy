import React, { useEffect } from 'react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Buttons from './Buttons'
import { useUser, UserButton, SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

const Header = () => {
  const { user } = useUser();

  // Auto-create user in MongoDB after Clerk login
  useEffect(() => {
    if (user) {
      const fallbackEmail = "no-email@example.com";
      const emailObject = user.emailAddresses?.[0];
      const email = emailObject?.emailAddress || fallbackEmail;
      const username = user.username || email;
  
      console.log("Creating user with:", { username, email, clerk_id: user.id });
  
      if (!username || !email) {
        console.error("Missing username or email, skipping user creation.");
        return;
      }
  
      fetch('http://localhost:3000/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: user.id,
          username,
          email
        })
      })
        .then(res => res.json())
        .then(data => console.log('✅ User synced with backend:', data))
        .catch(err => console.error('❌ Failed to sync user:', err));
    }
  }, [user]);

  return (
    <div>
      {/* Top section: Logo, Search, and Auth Controls */}
      <div className='container' style={{ justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo />
          <SearchBar />
        </div>

        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
            <SignOutButton>
              <button className="all-faves-buttons roboto-main" style={{ marginLeft: '10px' }}>
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Link to="/sign-in" className="all-faves-buttons roboto-main">
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* Buttons below the header */}
      <div className='container-all-faves'>
        <Buttons />
      </div>
    </div>
  )
}

export default Header
