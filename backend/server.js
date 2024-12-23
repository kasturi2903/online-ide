const express = require('express');
const app = express()
const db = require("./db");
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
