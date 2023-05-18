const {User, Post, PostComment, PostLike} = require("../models");
const {Op} = require("sequelize");
const {comparePassword} = require("../helpers/bcrypt");
const {sign} = require("../helpers/jwt");
const ImageKit = require("imagekit");
const public_key = process.env.PUBLICKEY;
const private_key = process.env.PRIVATEKEY;

const signUp = async (ctx) => {
  try {
    const {request} = ctx;
    const {username, email, password} = request.body;
    const user = await User.create({
      username,
      email,
      password,
    });
    ctx.body = {data: user, error: []};
    ctx.status = 201;
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const signIn = async (ctx) => {
  try {
    const {request} = ctx;
    const {email, password} = request.body;
    if (!email || !password) throw {name: "Bad Request Sign In"};
    const user = await User.findOne({
      where: {email},
      attributes: {exclude: ["followers", "following"]},
    });
    if (!user) throw {name: "Invalid Email"};
    if (!comparePassword(password, user.password))
      throw {name: "Invalid Password"};
    const payload = {
      id: user.id,
    };
    const token = sign(payload);
    const data = {accessToken: token, ...user?.dataValues};
    delete data.password;
    delete data.password;
    delete data.password;
    ctx.status = 200;
    ctx.body = {
      data,
      error: "",
    };
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const find = async (ctx) => {
  try {
    const {request} = ctx;
    const {search = ""} = request?.query;
    const users = await User.findAndCountAll({
      where: {username: {[Op.iLike]: `%${search}%`}},
      attributes: {exclude: ["password", "followers", "following"]},
    });
    ctx.status = 200;
    ctx.body = {data: users, error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: []};
    ctx.app.emit("error", err, ctx);
  }
};

const detail = async (ctx) => {
  try {
    const {request} = ctx;
    const {
      user: {id},
    } = request;
    const {username} = request.params;
    let foundUser;
    const excludeIds = ["UserId", "PostId"];
    const excludeDate = ["createdAt", "updatedAt"];
    const excludePostCommentUser = [
      "password",
      "followers",
      "following",
      "gender",
      "bio",
      "email",
      "name",
      ...excludeDate,
    ];
    if (!username) {
      foundUser = await User.findOne({
        where: {id},
        attributes: {exclude: ["password"]},
        include: [
          {
            model: Post,
            include: [
              {
                model: PostComment,
                attributes: {exclude: [...excludeIds, ...excludeDate]},
                include: [
                  {model: User, attributes: {exclude: excludePostCommentUser}},
                ],
              },
              {
                model: PostLike,
                attributes: {exclude: excludeDate},
              },
            ],
          },
        ],
      });
    } else {
      foundUser = await User.findOne({
        where: {username},
        attributes: {exclude: ["password"]},
        include: [
          {
            model: Post,
            include: [
              {
                model: PostComment,
                attributes: {exclude: [...excludeIds, ...excludeDate]},
                include: [
                  {model: User, attributes: {exclude: excludePostCommentUser}},
                ],
              },
              {
                model: PostLike,
                attributes: {exclude: excludeDate},
              },
            ],
          },
        ],
      });
      foundUser?.Posts.sort((a, b) => b.id - a.id);
    }
    if (!foundUser) {
      throw {name: "Invalid Profile"};
    }
    ctx.status = 200;
    ctx.body = {data: foundUser, error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const editProfile = async (ctx) => {
  try {
    const {request, files} = ctx;
    const {
      user: {id},
    } = request;
    const file = files?.file;
    let avatar = request.body?.avatar;
    const {name, username, bio, gender} = request.body;
    if (file) {
      const imagekit = new ImageKit({
        publicKey: public_key,
        privateKey: private_key,
        urlEndpoint: "https://ik.imagekit.io/fnzl2pmmqv2d",
      });
      const uploadImage = await imagekit.upload({
        file: file[0].buffer, //required
        fileName: file[0].originalname, //required
      });
      avatar = uploadImage?.url;
    }
    const updatedUser = await User.update(
      {
        avatar,
        name,
        username,
        bio,
        gender,
      },
      {where: {id}, returning: true, plain: true}
    );
    ctx.status = 200;
    ctx.body = {data: updatedUser[1], error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const followUnFollow = async (ctx) => {
  try {
    const {request} = ctx;
    const {
      user: {id, following},
    } = request;
    const {id: targetUserId} = request.body;
    if (targetUserId === id) {
      throw {
        name: "Invalid User",
      };
    }
    const foundTargetUser = await User.findByPk(targetUserId);
    if (!foundTargetUser) {
      throw {
        name: "User Not Found",
      };
    }
    const isFollowing = following.find((id) => id === targetUserId);
    let payloadFollowing = [];
    let payloadFollowers = foundTargetUser?.followers || [];
    if (isFollowing) {
      payloadFollowing = [...payloadFollowing].filter(
        (eId) => eId !== targetUserId
      );
      payloadFollowers = [...payloadFollowers].filter((eId) => eId !== id);
    } else {
      payloadFollowing = [...payloadFollowing, targetUserId];
      payloadFollowers = [...payloadFollowers, id];
    }
    const updatedUser = await User.update(
      {
        following: payloadFollowing,
      },
      {where: {id}, returning: true, plain: true}
    );
    if (updatedUser) {
      const updatedOtherUser = await User.update(
        {
          followers: payloadFollowers,
        },
        {where: {id: targetUserId}, returning: true, plain: true}
      );
      ctx.body = {data: updatedOtherUser[1], error: ""};
      return ctx;
    }
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const followers = async (ctx) => {
  try {
    const {request} = ctx;
    const {id} = request.params;
    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      throw {
        name: "User Not Found",
      };
    }
    let followers = targetUser?.followers;
    const users = await User.findAll();
    const filteredUsers = users.filter(({dataValues}) =>
      followers.find((eId) => eId === dataValues?.id)
    );
    ctx.status = 200;
    ctx.body = {data: filteredUsers, error: ""};
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

const following = async (ctx) => {
  try {
    const {request} = ctx;
    const {id} = request.params;
    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      throw {
        name: "User Not Found",
      };
    }
    let following = targetUser?.following;
    const users = await User.findAll();
    const filteredUsers = users.filter(({dataValues}) =>
      following.find((id) => id === dataValues?.id)
    );
    ctx.status = 200;
    ctx.body = {data: filteredUsers, error: ""};
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {
  signUp,
  signIn,
  find,
  editProfile,
  followUnFollow,
  detail,
  followers,
  following,
};
