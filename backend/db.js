const mongoose = require('mongoose')
require('dotenv').config();

const mongoURI = process.env.MONGO_URI ;

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB ${mongoURI}`))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB Server");
})

db.on('error', (err) => {
    console.log("MongoDB Connection Error:", err);
})

db.on("disconnected", () => {
    console.log("MongoDB Disconnected");
})

module.exports = db;