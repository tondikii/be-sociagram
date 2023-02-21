const {Post, User} = require("../models");
const {uuidGenerator} = require("../helpers/uuid");
const {Op} = require("sequelize");

const createPost = async (ctx, next) => {
  try {
    const {request} = ctx;
    const {
      user: {UserId},
    } = request;
    let postId = "";
    const {files, caption} = request.body;
    if (UserId && files) {
      postId = uuidGenerator();
    }
    const post = await Post.create({
      UserId,
      files,
      caption,
      postId,
      likes: [],
    });
    ctx.body = {data: post, error: []};
    ctx.status = 201;
  } catch (err) {
    console.log({err});
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const fetchPosts = async (ctx, next) => {
  try {
    const {request} = ctx;
    const {username} = request.query;
    const limit = request.query.limit || 12; // limit length of the posts
    let page = request.query.page || 1;
    if (page < 1) page = 1; // handle if page received less than 1
    const offset = (page - 1) * limit; // indeks start from
    const where = {};
    if (username) {
      console.log({username});
      const foundUser = await User.findOne({where: {username}});
      console.log({foundUser});
      where.UserId = foundUser?.id || 0;
    }
    console.log({where});
    const posts = await Post.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: User,
        },
      ],
      where,
      order: [["createdAt", "DESC"]],
    });
    ctx.body = {data: posts, error: ""};
    ctx.status = 201;
  } catch (err) {
    console.log({err});
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const likeUnLike = async (ctx) => {
  try {
    const {request} = ctx;
    const {
      user: {userId},
    } = request;
    const {postId} = request.body;
    const foundPost = await Post.findOne({where: {postId}});
    let likes = foundPost?.likes || [];
    const isLiked = likes.find((id) => id === userId);
    if (isLiked) {
      likes = [...likes.filter((id) => id !== userId)];
    } else {
      likes.push(userId);
    }
    const updatedPost = await Post.update(
      {likes},
      {where: {postId}, returning: true, plain: true}
    );
    ctx.body = {data: updatedPost[1], error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {createPost, fetchPosts, likeUnLike};
