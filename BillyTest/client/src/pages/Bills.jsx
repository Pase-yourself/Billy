import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import MasterCard from "../components/MasterCard";
import { useSearch } from '../components/SearchContext';

const Bills = () => {
  const { user: clerkUser } = useUser();
  const { searchQuery } = useSearch();
  const [bills, setBills] = useState([]);
  const [mongoUser, setMongoUser] = useState(null);

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
        .then(data => setMongoUser(data.user))
        .catch(err => console.error('❌ Failed to fetch Mongo user:', err));
    }
  }, [clerkUser]);

  useEffect(() => {
    fetch('http://localhost:3000/api/bills')
      .then(res => res.json())
      .then(data => setBills(data))
      .catch(err => console.error("Error fetching bills:", err));
  }, []);

  if (!mongoUser) return <p>Loading user...</p>;

  const filteredBills = bills.filter(bill =>
    bill.bill_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>All Bills</h2>
      <MasterCard bill={filteredBills} user={mongoUser} />
    </div>
  );
};

export default Bills;


