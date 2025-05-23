require("dotenv").config();

const Koa = require("koa");
const {createServer} = require("http");

const cors = require("@koa/cors");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");

const routes = require("../routes");
const errorsHandler = require("../middlewares/errorsHandler");

const port = process.env.PORT || 3002;
const app = new Koa();

app.use(cors());

// Middleware Koa

// json formatter
app.use(json());

// bodyParser middleware
app.use(bodyParser());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(routes.routes());
app.use(routes.allowedMethods());

app.on("error", errorsHandler);

const server = createServer(app.callback());

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = app;
