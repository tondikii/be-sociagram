const createPost = async (ctx, next) => {
  try {
    ctx.body = "feeds";
  } catch (error) {
    ctx.app.emit("error", err, ctx);
  }
};
