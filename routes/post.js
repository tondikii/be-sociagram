const KoaRouter = require("koa-router");
const {createPost, fetchPosts, likeUnLike} = require("../controllers/post");
const authentication = require("../middlewares/authentication");

const router = new KoaRouter({prefix: "/posts"});

router.use(authentication);
router.get("/", fetchPosts);
router.post("/create", createPost);
router.put("/like", likeUnLike);

module.exports = router;
