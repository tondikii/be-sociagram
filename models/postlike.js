"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostLike.belongsTo(models.User);
      PostLike.belongsTo(models.Post);
    }
  }
  PostLike.init(
    {
      UserId: {type: DataTypes.INTEGER, allowNull: false},
      PostId: {type: DataTypes.INTEGER, allowNull: false},
    },
    {
      sequelize,
      modelName: "PostLike",
    }
  );
  return PostLike;
};
