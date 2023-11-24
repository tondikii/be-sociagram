require("dotenv").config();

const Koa = require("koa");
const cors = require("@koa/cors");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const {Server} = require("socket.io");
const {createServer} = require("http");

const routes = require("./routes");
const errorsHandler = require("./middlewares/errorsHandler");

const port = process.env.PORT || 3002;
const app = new Koa();

app.use(cors());

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

const socketServer = createServer(app);
const io = new Server(socketServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "domain production"
        : "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id.substring(0, 5)}`);
  socket.on("send_chat", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_chat", data);
  });
});

app.use(routes.routes());
app.use(routes.allowedMethods());

app.on("error", errorsHandler);

app.listen(port, () => console.log(`Server started at port ${port}...`));

socketServer.listen(3003, () =>
  console.log(`Socket Server started at port ${3003}...`)
);

module.exports = app;
