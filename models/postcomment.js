"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostComment.belongsTo(models.User);
      PostComment.belongsTo(models.Post);
    }
  }
  PostComment.init(
    {
      comment: {type: DataTypes.STRING, allowNull: false},
      UserId: {type: DataTypes.NUMBER, allowNull: false},
      PostId: {type: DataTypes.NUMBER, allowNull: false},
    },
    {
      sequelize,
      modelName: "PostComment",
    }
  );
  return PostComment;
};
