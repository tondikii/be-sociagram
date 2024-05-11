const KoaRouter = require("koa-router");
// const userRoutes = require("./user");
// const postRoutes = require("./post");
// const postCommentRoutes = require("./postComment");
// const userChatRoutes = require("./userChat");

const router = new KoaRouter();

router.get("/", async (ctx) => {
  try {
    ctx.status = 200;
    ctx.body = "Welcome to Sociagram";
    return ctx;
  } catch (error) {
    ctx.body = "Error Sociagram on Vercel";
    return ctx;
  }
});

// router.use(userRoutes.routes());
// router.use(userRoutes.allowedMethods());
// router.use(postRoutes.routes());
// router.use(postRoutes.allowedMethods());
// router.use(postCommentRoutes.routes());
// router.use(postCommentRoutes.allowedMethods());
// router.use(userChatRoutes.routes());
// router.use(userChatRoutes.allowedMethods());

module.exports = router;
