const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    bill_id: String,
    bill_summary: String,
    bill_source: String,
    bill_text: String,
    bill_actions: [
        {
            action_chamber: String,
            action_date: Date,
            action_description: String,
        }
    ],
    bill_sponsors: [
        {
            first_name: String,
            last_name: String,
            party: String,
            primary: Boolean
        }
    ],
    bill_followers: [
        {
            // references the model 'User' and collection 'users'
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
    ]
});

const BillsModel = mongoose.model('bills', billSchema);

module.exports = BillsModel;