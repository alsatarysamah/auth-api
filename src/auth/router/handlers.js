'use strict';
require("dotenv").config();
const { users } = require('../models/index.js');
const bcrypt=require("bcrypt");

async function handleSignup(req, res, next) {
  try {
 
  req.body.password = await bcrypt.hash(req.body.password, 10);  
  const userRecord = await users.create(req.body);
  // users.role = req.body.role;
    const output = {
      user: userRecord,
      role:userRecord.role,
      token: userRecord.token,
      action:userRecord.action
    };
    res.status(201).json(output);
  } catch (e) {

    next(e);
  }
}

async function handleSignin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };
    res.status(200).json(user);
  } catch (e) {
  
    next(e);
  }
}

async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({});
    const list = userRecords.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
  
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret
}
