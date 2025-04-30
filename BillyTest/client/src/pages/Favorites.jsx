import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import MasterCard from "../components/MasterCard";

const Favorites = () => {
  const { user } = useUser();
  const location = useLocation(); // 🔁 Tracks route changes
  const [bills, setBills] = useState([]);
  const [mongoUserId, setMongoUserId] = useState(null);

  // Step 1: Lookup MongoDB user by Clerk ID
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/users/clerk/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setMongoUserId(data._id);
        })
        .catch(err => console.error("Failed to fetch MongoDB user:", err));
    }
  }, [user]);

  // Step 2: Fetch favorite bills (reruns on path change)
  useEffect(() => {
    if (mongoUserId) {
      fetch(`http://localhost:3000/api/user/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: mongoUserId })
      })
        .then(res => res.json())
        .then(data => {
          console.log("✅ Refetched favorites on navigation:", data);
          setBills(data);
        })
        .catch(err => console.error("Failed to fetch user's followed bills:", err));
    }
  }, [mongoUserId, location.pathname]); // 🔁 Refetch on nav to /favorites

  return (
    <div>
      <h2>Favorites</h2>
      {bills.length === 0 ? (
        <p>You haven't favorited any bills yet.</p>
      ) : (
        <MasterCard
          bill={bills}
          user={{ _id: mongoUserId, following: bills.map(b => b._id) }}
        />
      )}
    </div>
  );
};

export default Favorites;

