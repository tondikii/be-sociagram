// require("dotenv").config();

const Koa = require("koa");
const KoaRouter = require("koa-router");
// const cors = require("@koa/cors");
// const json = require("koa-json");
// const bodyParser = require("koa-bodyparser");

// const routes = require("../routes");
// const errorsHandler = require("../middlewares/errorsHandler");
// const socketServer = require("../helpers/socket");

// const port = process.env.PORT || 3002;
const app = new Koa();

// app.use(cors());

// // Middleware Koa

// // json formatter
// app.use(json());

// // bodyParser middleware
// app.use(bodyParser());

// // logger
// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get("X-Response-Time");
// });

// // x-response-time
// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.set("X-Response-Time", `${ms}ms`);
// });

// app.use(routes.routes());
// app.use(routes.allowedMethods());

// app.on("error", errorsHandler);

// const server = app.listen(port, () =>
//   console.log(`Server started at port ${port}...`)
// );
// socketServer(server);

const router = new KoaRouter();
router.get("/", async (ctx) => {
  try {
    ctx.status = 200;
    ctx.body = "Express on Vercel";
    return ctx;
  } catch (error) {
    ctx.body = "ERROR";
    return ctx;
  }
});
app.use(router.routes());

app.listen(3003, () => console.log("Server ready on port 3003."));

module.exports = app;
