const KoaRouter = require("koa-router");
const {
  signUp,
  signIn,
  find,
  detail,
  editProfile,
  followUnFollow,
  followers,
  following,
} = require("../controllers/user");
const authentication = require("../middlewares/authentication");
const multerImage = require("../middlewares/multerImage");

const router = new KoaRouter({prefix: "/users"});

router.post("/signUp", signUp);
router.post("/signIn", signIn);

router.use(authentication);
router.get("/find", find);
router.get("/followers/:id", followers);
router.get("/following/:id", following);
router.get("/", detail);
router.get("/:username", detail);
router.put(
  "/edit",
  multerImage.fields([{name: "file", maxCount: 1}]),
  editProfile
);
router.put("/follow", followUnFollow);

module.exports = router;
