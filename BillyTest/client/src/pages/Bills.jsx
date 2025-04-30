import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import MasterCard from "../components/MasterCard";

const Bills = () => {
  const { user: clerkUser } = useUser();
  const [bills, setBills] = useState([]);
  const [mongoUser, setMongoUser] = useState(null);

  // Fetch MongoDB user using Clerk user info
  useEffect(() => {
    if (clerkUser) {
      const emailObject = clerkUser.emailAddresses?.[0];
      const email = emailObject?.emailAddress || "fallback@example.com";
      const username = clerkUser.username || email;

      fetch('http://localhost:3000/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: clerkUser.id,
          username,
          email
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('✅ MongoDB user loaded:', data.user);
          setMongoUser(data.user);
        })
        .catch(err => console.error('❌ Failed to fetch Mongo user:', err));
    }
  }, [clerkUser]);

  // Fetch all bills
  useEffect(() => {
    fetch('http://localhost:3000/api/bills')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched all bills:", data);
        setBills(data);
      })
      .catch(err => console.error("Error fetching bills:", err));
  }, []);

  if (!mongoUser) return <p>Loading user...</p>;

  return (
    <div>
      <h2>All Bills</h2>
      <MasterCard bill={bills} user={mongoUser} />
    </div>
  );
};

export default Bills;

