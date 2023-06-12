const {PostComment, User} = require("../models");

const createComment = async (ctx) => {
  try {
    const {request} = ctx;
    const {
      user: {id},
    } = request;
    const {PostId, comment} = request.body;
    ctx.body = "success";
    const createdComment = await PostComment.create({
      PostId,
      comment,
      UserId: id,
    });
    const foundComment = await PostComment.findByPk(createdComment?.id, {
      include: [
        {
          model: User,
        },
      ],
    });
    ctx.body = {data: foundComment, error: []};
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const fetchPostComments = async (ctx) => {
  try {
    const {PostId = 0} = ctx.request.params;
    const postComments = await PostComment.findAll({
      include: [
        {
          model: User,
        },
      ],
      where: {PostId: +PostId},
    });
    ctx.body = {data: postComments, error: ""};
    ctx.status = 200;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {createComment, fetchPostComments};
