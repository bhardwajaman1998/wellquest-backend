const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = 3000;

const path = require('path');
app.use(express.json());
app.use(cors());

require('./models/db');

// Import routes
const routes = require('./routes/index'); // index contains all the routes

// Use routes
app.use(routes);
// console.log(process.env.BASE_URL);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
