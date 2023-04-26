const {Post, User, PostComment, PostLike} = require("../models");

const postsLiked = async (ctx) => {
  try {
    const {
      user: {id: UserId},
    } = ctx.request;
    const posts = await Post.findAll({
      include: [
        {
          model: User,
        },
        {model: PostComment},
      ],
    });
    const filteredPosts = posts.filter(({dataValues}) =>
      dataValues?.likes.find((id) => id === UserId)
    );
    console.log({filteredPosts, UserId});
    ctx.status = 200;
    ctx.body = {data: filteredPosts};
  } catch (error) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};
