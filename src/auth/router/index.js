'use strict';
require("dotenv").config();
const express = require('express');
const authRouter = express.Router();
// const foodRout=express.Router();

const basic = require('../middleware/basic');
const bearerAuth = require('../middleware/bearer.js');
const acl=require("../middleware/acl")
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
} = require('./handlers.js');

authRouter.post('/signup', handleSignup);
authRouter.post('/signin', basic, handleSignin);
authRouter.get('/users', bearerAuth, handleGetUsers);
authRouter.get('/secret', bearerAuth, handleSecret);

module.exports = authRouter;
