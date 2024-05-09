const {Op} = require("sequelize");
const {UserChat, User} = require("../models");

const fetchChat = async (ctx) => {
  try {
    const {
      user: {id},
    } = ctx.request;
    const userChats = await UserChat.findAll({
      where: {
        [Op.or]: [{UserId: id}, {UserIdReceiver: id}],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "followers",
              "following",
              "gender",
              "bio",
              "email",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    const userChatObjects = userChats.map((userChat) =>
      userChat.get({plain: true})
    );

    const temp = [];
    const result = userChatObjects.reduce((acc, obj) => {
      const userIndex = acc.findIndex((item) => item.User.id === obj.UserId);

      let userReceiverIndex = -1;
      if (userIndex === -1) {
        userReceiverIndex = acc.findIndex(
          (item) => item.User.id === obj.UserIdReceiver
        );
      }
      if (userIndex === -1 && obj.UserId !== id) {
        acc.push({
          User: obj.User,
          messages: [{...obj, User: undefined}],
        });
      } else if (userReceiverIndex >= 0) {
        acc[userReceiverIndex].messages.push({...obj, User: undefined});
      } else if (userIndex >= 0) {
        acc[userIndex].messages.push({...obj, User: undefined});
      } else if (obj.UserId === id) {
        userReceiverIndex = temp.findIndex(
          (item) => item.User.id === obj.UserIdReceiver
        );
        if (userReceiverIndex === -1) {
          temp.push({
            User: {
              username: obj.usernameReceiver,
              name: obj.nameReceiver,
              avatar: obj.avatarReceiver,
            },
            messages: [{...obj, User: undefined}],
          });
        } else {
          temp[userReceiverIndex].messages.push({...obj, User: undefined});
        }
      }
      return acc;
    }, []);

    ctx.status = 200;
    ctx.body = {data: [...result, ...temp], error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: []};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {fetchChat};
