"use strict";
const {Model} = require("sequelize");
const {hashPassword} = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post);
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "User Id is required"},
          notEmpty: {msg: "User Id cannot be empty"},
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "Username is required"},
          notEmpty: {msg: "Username cannot be empty"},
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "Email is required"},
          notEmpty: {msg: "Email cannot be empty"},
          isEmail: {msg: "Invalid email format"},
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {msg: "Password is required"},
          notEmpty: {msg: "Password cannot be empty"},
          minLength(value) {
            if (value.length < 8) {
              throw new Error(
                "Password should be more than equal 8 characters"
              );
            }
          },
        },
      },
      avatar: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      followers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      following: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.password = hashPassword(instance.password);
          instance.avatar = "";
          instance.name = "";
          instance.bio = "";
          instance.gender = "";
          instance.followers = [];
          instance.following = [];
        },
      },
    }
  );
  return User;
};
