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
      order: [["createdAt", "ASC"]],
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
    let result = userChatObjects.reduce((acc, obj) => {
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
              id: obj.UserIdReceiver,
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

    if (temp.length > 0) {
      let isNeedSort = false;
      temp.forEach((e) => {
        const foundIndex = result.findIndex((e2) => e?.User.id === e2?.User.id);
        if (foundIndex !== -1) {
          result[foundIndex].messages = [
            ...result[foundIndex].messages,
            ...e.messages,
          ].sort((a, b) => a.id - b.id);
        } else {
          result = [...result, e];
          isNeedSort = true;
        }
      });
      if (isNeedSort) {
        result = result.sort(
          (a, b) => b?.messages?.[0]?.id - a?.messages?.[0]?.id
        );
      }
      result = [...result];
    }

    ctx.status = 200;
    ctx.body = {data: result, error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: []};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {fetchChat};
