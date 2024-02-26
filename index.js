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

const routes = require('./routes/index');

app.use(routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
