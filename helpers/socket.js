const socketIO = require("socket.io");
const {createServer} = require("http");
const {UserChat} = require("../models");
const port = process.env.SOCKET_PORT || 3003;

// Keep track of connected clients and their usernames
const clients = {};

const socketServer = (app) => {
  const server = createServer(app);
  const io = socketIO(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://sociagram.vercel.app"
          : "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("set_id", (userId) => {
      clients[socket.id] = userId;
    });

    socket.on(
      "chat_message",
      ({
        userIdReceiver,
        message,
        username,
        name,
        avatar,
        usernameReceiver,
        nameReceiver,
        avatarReceiver,
      }) => {
        const userIdSender = clients[socket.id];
        const toSocketId = Object.keys(clients).find(
          (key) => clients[key] === userIdReceiver
        );

        if (userIdSender && toSocketId && message) {
          io.to(toSocketId).emit("chat_message", {
            UserId: userIdSender,
            UserIdReceiver: userIdReceiver,
            message,
            User: {
              UserId: userIdSender,
              username,
              name,
              avatar,
            },
          });
          UserChat.create({
            UserId: userIdSender,
            UserIdReceiver: userIdReceiver,
            usernameReceiver,
            nameReceiver,
            avatarReceiver,
            message,
          })
            .then((res) => {
              console.log("CREATED", res);
            })
            .catch((err) => {
              console.log("ERROR CATCH", err);
            });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      delete clients[socket.id];
    });
  });

  server.listen(port, () => console.log(`Server started at port ${port}...`));
};

module.exports = socketServer;
