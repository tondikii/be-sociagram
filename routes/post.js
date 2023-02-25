const KoaRouter = require("koa-router");
const {
  createPost,
  fetchPosts,
  likeUnLike,
  postsLiked,
} = require("../controllers/post");
const authentication = require("../middlewares/authentication");

const router = new KoaRouter({prefix: "/posts"});

router.use(authentication);
router.get("/", fetchPosts);
router.post("/create", createPost);
router.put("/like", likeUnLike);
router.get("/likes", postsLiked);

module.exports = router;
