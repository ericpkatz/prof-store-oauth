const express = require('express');
const app = express();
app.use(express.json());
app.engine('html', require('ejs').renderFile);

const path = require('path');

const homePage = path.join(__dirname, '../index.html');

app.get('/', (req, res)=> res.render(homePage, { GOOGLE_API: process.env.GOOGLE_API}));

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use('/api', require('./api'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err, message: err.message });
});

module.exports = app;


