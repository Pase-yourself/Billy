const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // stores provided clerk id
    clerk_id: {
        type: String,
        require: true,
        unqiue: true
    },
    username: { 
        type: String,
        // ensures user enters this field. Otherwise, reject. 
        required: true,
        // unique ensures only one of this is used by all users. Otherwise, reject.
        unique: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    following:[
        {
            // references the model 'Bill' and collection 'bills'
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'bills'
        }
    ]
});

const UserModel = mongoose.model('users', userSchema);

// Mongoose model for the User collection
module.exports = UserModel;