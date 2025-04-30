require('dotenv').config();
const mongoose = require('mongoose');

const { URI, DATABASE, DB_PASS, DB_USER } = process.env

const URL = `${URI}/${DATABASE}`;

const connObj = {
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS
}

mongoose.connect(URL, connObj)
.then(() => console.log(`Connected to ${DATABASE} db`))
.catch((err) =>console.log(`Error connecting: ${err}`))