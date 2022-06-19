'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router/index.js');
const foodRouter=require("../src/auth/router/foodV1");
const cloRouter=require("../src/auth/router/clothesV1");

const cloRouter2=require("../src/auth/router/clothesV2");
const foodRouter2=require("../src/auth/router/foodV2");

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
app.use(foodRouter);
app.use(cloRouter);

app.use(foodRouter2);
app.use(cloRouter2);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
