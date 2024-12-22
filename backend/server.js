require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const mongoURI = process.env.MONGO_URI ;

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB ${mongoURI}`))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
