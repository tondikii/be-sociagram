const KoaRouter = require("koa-router");
const {createPost, fetchPosts} = require("../controllers/post");
const authentication = require("../middlewares/authentication");

const router = new KoaRouter({prefix: "/posts"});

router.use(authentication);
router.get("/:username", fetchPosts);
router.post("/create", createPost);

module.exports = router;
