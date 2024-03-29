"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.hasMany(models.PostComment);
      Post.hasMany(models.PostLike);
    }
  }
  Post.init(
    {
      files: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
      caption: {type: DataTypes.STRING, allowNull: false},
      UserId: {type: DataTypes.STRING, allowNull: false},
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
