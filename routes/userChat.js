const KoaRouter = require("koa-router");
const {fetchChat} = require("../controllers/userChat");
const authentication = require("../middlewares/authentication");

const router = new KoaRouter({prefix: "/userChats"});

router.use(authentication);
router.get("/", fetchChat);

module.exports = router;
