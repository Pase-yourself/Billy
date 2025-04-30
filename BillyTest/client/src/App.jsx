import './App.css';
import { Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { SignInPage, SignUpPage } from './components/Auth';

// Pages
import Landing from './pages/Landing.jsx';
import Bills from './pages/Bills.jsx';
import Favorites from './pages/Favorites.jsx';
import NotFound from './pages/NotFound.jsx';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Header />
      <br />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        {/* Temporary route for forced refresh logic */}
        <Route path="/temp-refresh" element={<div></div>} />

        <Route
          path="/bills"
          element={
            <SignedIn>
              <Bills />
            </SignedIn>
          }
        />

        <Route
          path="/favorites"
          element={
            <SignedIn>
              <Favorites />
            </SignedIn>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <br />
      <Footer />
    </>
  );
}

export default App;

