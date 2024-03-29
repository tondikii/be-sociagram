const {Post, User, PostComment, PostLike} = require("../models");

const createPost = async (ctx, next) => {
  try {
    const {request} = ctx;
    const {
      user: {id},
    } = request;
    const {files, caption} = request.body;
    const post = await Post.create({
      UserId: id,
      files,
      caption,
      likes: [],
    });
    ctx.body = {data: post, error: []};
    ctx.status = 201;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const fetchPosts = async (ctx, next) => {
  try {
    const {request} = ctx;
    const {username, limit = 12} = request.query;
    let page = request.query.page || 1;
    if (page < 1) page = 1; // handle if page received less than 1
    const offset = (page - 1) * limit; // indeks start from
    const where = {};
    if (username) {
      const foundUser = await User.findOne({where: {username}});
      where.UserId = foundUser?.id || 0;
    }
    const excludeUser = [
      "password",
      "followers",
      "following",
      "gender",
      "bio",
      "email",
      "name",
      "createdAt",
      "updatedAt",
    ];
    const posts = await Post.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: {exclude: excludeUser},
        },
        {
          model: PostComment,
          include: [
            {
              model: User,
              attributes: {
                exclude: excludeUser,
              },
            },
          ],
        },
        {model: PostLike},
      ],
      where,
      order: [["createdAt", "DESC"]],
    });
    ctx.body = {data: posts, error: ""};
    ctx.status = 200;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const likeUnLike = async (ctx) => {
  try {
    const {request} = ctx;
    const {
      user: {id: UserId},
    } = request;
    const {PostId} = request.body;
    const foundPostLike = await PostLike.findOne({where: {PostId, UserId}});
    if (foundPostLike) {
      await PostLike.destroy({
        where: {
          id: foundPostLike?.id,
        },
        force: true,
      });
      ctx.body = {data: foundPostLike, error: []};
    } else {
      const postLike = await PostLike.create({
        PostId,
        UserId,
      });
      ctx.body = {data: postLike, error: []};
    }
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const postsLiked = async (ctx) => {
  try {
    const {
      user: {id},
    } = ctx.request;
    const excludeIds = ["UserId", "PostId"];
    const excludeDate = ["createdAt", "updatedAt"];
    const excludeUser = [
      "password",
      "followers",
      "following",
      "gender",
      "bio",
      "email",
      "name",
      ...excludeDate,
    ];
    const posts = await PostLike.findAll({
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: {exclude: excludeUser},
            },
            {
              model: PostComment,
              attributes: {exclude: [...excludeIds, ...excludeDate]},
              include: [{model: User, attributes: {exclude: excludeUser}}],
            },
            {
              model: PostLike,
              attributes: {exclude: excludeDate},
            },
          ],
        },
      ],
      where: {UserId: id},
    });
    ctx.status = 200;
    ctx.body = {data: posts};
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {createPost, fetchPosts, likeUnLike, postsLiked};
