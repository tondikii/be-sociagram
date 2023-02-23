const KoaRouter = require("koa-router");
const {
  createComment,
  fetchPostComments,
} = require("../controllers/postComment");
const authentication = require("../middlewares/authentication");

const router = new KoaRouter({prefix: "/postComments"});

router.use(authentication);
router.get("/:PostId", fetchPostComments);
router.post("/", createComment);

module.exports = router;
