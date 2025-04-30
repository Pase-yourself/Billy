const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const mongodb = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// Bring in our DB connection
require('./connections/mongoConn.js');

const Bill = require('./models/Bill.js');
const User = require('./models/User.js');

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const _ = "🥥";

// Root route
app.get('/', (req, res) => {
    res.send(`I am the ${_} route.`);
});

// -------------------- POST ROUTES --------------------

// POST get all favorite bills for a user
app.post("/api/user/favorites", (req, res) => {
    const { user_id } = req.body;
  
    User.findById(user_id)
      .populate('following') // populate bill documents
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user.following); // return populated bill documents
      })
      .catch(err => {
        console.error("❌ Error fetching favorite bills:", err);
        res.status(500).json({ message: "Server error fetching favorites." });
      });
  });

// POST create user
app.post("/api/user/create", (req, res) => {
    const { clerk_id, username, email } = req.body;
  
    // Validate required fields
    if (!clerk_id || !username || !email) {
      return res.status(400).json({ message: "Missing required fields (clerk_id, username, or email)" });
    }
  
    // Check if user already exists
    User.findOne({ clerk_id })
      .then(existingUser => {
        if (existingUser) {
          console.log("👤 User already exists:", existingUser.username);
          return res.status(200).json({ message: "User already exists", user: existingUser });
        }
  
        // Create new user
        return User.create({ clerk_id, username, email })
          .then(createdUser => {
            console.log("✅ Successfully created user:", createdUser.username);
            res.status(201).json({ message: "User created", user: createdUser });
          })
          .catch(err => {
            console.error("❌ Error creating user:", err.message);
            res.status(400).json({ message: err.message || "Could not create user" });
          });
      })
      .catch(err => {
        console.error("❌ DB error during user lookup:", err.message);
        res.status(500).json({ message: "Database error" });
      });
  });
  

// -------------------- GET ROUTES --------------------

app.get("/api/bills", (req, res) => {
    Bill.find({})
      .then(bills => {
        console.log("returned all bills:\n", bills);
        res.status(200).json(bills);
      })
      .catch(err => {
        console.log("oh no, an error (unable to retrieve all bills):\n", err);
        res.status(400).json({ message: "Unable to retrieve bills at this time." });
      });
  });
  

app.get("/api/bills/:id", (req, res) => {
    const { id: bill_id } = req.params;

    Bill.find({ bill_id })
        .then(bill => {
            if (bill.length) {
                res.status(200).json(bill);
            } else {
                res.status(404).json({ message: "Could not find specified bill." });
            }
        })
        .catch(err => {
            console.log("❌ Error retrieving bill:", err);
            res.status(400).json({ message: "Unable to retrieve specified bill at this time." });
        });
});

app.get("/api/user/following", (req, res) => {
    const { user_id } = req.body;

    User.findById(user_id, { _id: 0, following: 1 })
        .then(following => {
            if (!following) {
                res.status(404).json({ message: "User not found." });
            } else {
                res.status(200).json(following["following"]);
            }
        })
        .catch(err => {
            console.log("❌ Error retrieving following list:", err);
            res.status(400).json({ message: "Unable to retrieve user's following list." });
        });
});

app.get('/api/users', (req, res) => {
    User.find({}).sort({ username: -1 })
        .then(results => res.json(results))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "Unable to retrieve users at this time." });
        });
});

app.get('/api/users/clerk/:clerkId', (req, res) => {
    const { clerkId } = req.params;

    User.findOne({ clerk_id: clerkId })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        })
        .catch(err => {
            console.error("Error fetching user by Clerk ID:", err);
            res.status(500).json({ message: "Server error fetching user" });
        });
});

// -------------------- PUT ROUTES --------------------

app.put("/api/bills/followers", (req, res) => {
    const { bill_id, user_id } = req.body;

    Bill.updateOne(
        { _id: new mongodb.ObjectId(bill_id) },
        { $addToSet: { "bill_followers": user_id } }
    )
        .then(result => res.status(200).json({ message: "Bill successfully being tracked by user", updated: result }))
        .catch(err => {
            console.log("❌ Could not add user to bill's followers:", err);
            res.status(400).json({ message: "Could not track bill." });
        });
});

app.put("/api/user/following", (req, res) => {
    const { bill_id, user_id } = req.body;

    User.updateOne(
        { _id: new mongodb.ObjectId(user_id) },
        { $addToSet: { "following": bill_id } }
    )
        .then(result => res.status(200).json({ message: "User successfully following bill", updated: result }))
        .catch(err => {
            console.log("❌ Could not add bill to user's following:", err);
            res.status(400).json({ message: "Could not follow bill." });
        });
});

// -------------------- DELETE ROUTES --------------------

app.delete("/api/bills/followers", (req, res) => {
    const { bill_id, user_id } = req.body;

    Bill.updateOne(
        { _id: new mongodb.ObjectId(bill_id) },
        { $pull: { "bill_followers": user_id } }
    )
        .then(result => res.status(200).json({ message: "Bill no longer being tracked by user", updated: result }))
        .catch(err => {
            console.log("❌ Could not remove user from bill's followers:", err);
            res.status(400).json({ message: "Could not untrack bill." });
        });
});

app.delete("/api/user/following", (req, res) => {
    const { bill_id, user_id } = req.body;

    User.updateOne(
        { _id: new mongodb.ObjectId(user_id) },
        { $pull: { "following": bill_id } }
    )
        .then(result => res.status(200).json({ message: "User no longer following bill", updated: result }))
        .catch(err => {
            console.log("❌ Could not remove bill from user's following:", err);
            res.status(400).json({ message: "Could not unfollow bill." });
        });
});

// -------------------- SERVER --------------------

app.listen(PORT, () => console.log(`🚀 App listening on PORT ${PORT}`));



// You were supposed to be a Hero, Bryan!
// Hmm... I'm thinkin' I like that name.

// Don't you see. This world is MINE to CRAFT.