// Dependencies
const express = require('express');
const bodyParser = require('body-parser');

// Init and config
const app = express();
const hostname = '127.0.0.1';
const port = 3001;
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

// Middlewares
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/notesRoutes.js'));

// Start server
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });
