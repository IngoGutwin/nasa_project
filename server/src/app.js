const path = require('node:path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api_v_1 = require('./routes/api');

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//   }),
// );
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/v1', api_v_1);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
