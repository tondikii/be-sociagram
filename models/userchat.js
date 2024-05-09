"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserChat.belongsTo(models.User);
    }
  }
  UserChat.init(
    {
      UserId: {type: DataTypes.INTEGER, allowNull: false},
      UserIdReceiver: {type: DataTypes.INTEGER, allowNull: false},
      usernameReceiver: {type: DataTypes.STRING, allowNull: false},
      nameReceiver: {type: DataTypes.STRING, allowNull: false},
      avatarReceiver: {type: DataTypes.STRING, allowNull: false},
      message: {type: DataTypes.STRING, allowNull: false},
    },
    {
      sequelize,
      modelName: "UserChat",
    }
  );
  return UserChat;
};
