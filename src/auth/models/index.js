'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const users = require('./users.js');
const DataCollection=require("./lib/data-collection");
const foodModel=require("./food");
const clothesModel=require("./clothes");
const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const foodTable = foodModel(sequelize, DataTypes);
const foodCollection=new DataCollection(foodTable);
const clothesTable=clothesModel(sequelize, DataTypes);

const clothesCollection = new DataCollection(clothesTable);
module.exports = {
  db: sequelize,
  users: users(sequelize, DataTypes),
  foodCollection:foodCollection,
  clothesCollection:clothesCollection,
};
