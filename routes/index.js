const KoaRouter = require("koa-router");
const userRoutes = require("./user");

const router = new KoaRouter({prefix: "/api"});

router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());

module.exports = router;
