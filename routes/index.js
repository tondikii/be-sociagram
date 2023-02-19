const KoaRouter = require("koa-router");
const userRoutes = require("./user");
const postRoutes = require("./post");

const router = new KoaRouter({prefix: "/api"});

router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());
router.use(postRoutes.routes());
router.use(postRoutes.allowedMethods());

module.exports = router;
