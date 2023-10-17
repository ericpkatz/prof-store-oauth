const {
  fetchAddresses,
  createAddress
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');

app.get('/', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchAddresses(req.user.id));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await createAddress({ user_id: req.user.id, ...req.body }));
  }
  catch(ex){
    next(ex);
  }
});

module.exports = app;
