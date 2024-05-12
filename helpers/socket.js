const {Server} = require("socket.io");
const {UserChat} = require("../models");

// Keep track of connected clients and their usernames
const clients = {};

const socketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://sociagram.vercel.app", "http://localhost:3001"],
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

        if (userIdSender && message) {
          if (toSocketId) {
            io.to(toSocketId).emit("chat_message", {
              UserId: userIdSender,
              UserIdReceiver: userIdReceiver,
              messages: [
                {
                  UserId: userIdSender,
                  UserIdReceiver: userIdReceiver,
                  usernameReceiver,
                  nameReceiver,
                  avatarReceiver,
                  message: message,
                  createdAt: new Date().toISOString(),
                },
              ],
              User: {
                id: userIdSender,
                username,
                name,
                avatar,
              },
            });
          }

          UserChat.create({
            UserId: userIdSender,
            UserIdReceiver: userIdReceiver,
            usernameReceiver,
            nameReceiver,
            avatarReceiver,
            message,
          })
            .then(() => {})
            .catch(() => {});
        }
      }
    );

    socket.on("disconnect", () => {
      delete clients[socket.id];
    });
  });

  return httpServer;
};

module.exports = socketServer;
