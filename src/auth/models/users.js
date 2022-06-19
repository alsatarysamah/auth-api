"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = (sequelize, DataTypes) => {
  const model = sequelize.define("u1a", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
    },
    role: {
      type: DataTypes.ENUM('admin', 'writer', 'editor', 'user'),
      defaultValue: 'user',
  },
  actions: {
    // {'read', 'create', 'update', 'delete'}
    //('read','create','update','delete')
    type: DataTypes.VIRTUAL,
    get() {
        //acl >>> access control list
        const acl = {
            user: ['read'],
            writer: ['read', 'create'],
            editor: ['read', 'create', 'update'],
            admin: ['read', 'create', 'update', 'delete']
        }
        return acl[this.role];
    }
}
  });

  model.beforeCreate = async function (password) {
    let hashedPass = await bcrypt.hash(password, 10);

    return hashedPass;
  };

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username }, });

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {

      let newToken = jwt.sign({ username: user.username },process.env.SECRET,{
        expiresIn: "15m"});
        // console.log('************************', newToken);
        user.token = newToken;
      return user;
    }
    throw new Error("Invalid User");
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET||"samah");
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = users;