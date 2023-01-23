const {User} = require("../models");
const {Op} = require("sequelize");
const {comparePassword} = require("../helpers/bcrypt");
const {sign} = require("../helpers/jwt");
const {uuidGenerator} = require("../helpers/uuid");
const ImageKit = require("imagekit");
const public_key = process.env.PUBLICKEY;
const private_key = process.env.PRIVATEKEY;

const signUp = async (ctx) => {
  try {
    const {request} = ctx;
    const {username, email, password} = request.body;
    let userId = "";
    if (username && email && password) {
      userId = uuidGenerator();
    }
    const user = await User.create({
      username,
      email,
      password,
      userId,
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
    const user = await User.findOne({where: {email}});
    if (!user) throw {name: "Invalid Email"};
    if (!comparePassword(password, user.password))
      throw {name: "Invalid Password"};
    const payload = {
      id: user.id,
      userId: user.userId,
    };
    const token = sign(payload);
    ctx.status = 200;
    ctx.body = {
      data: {
        accessToken: token,
        ...user?.dataValues,
      },
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
    const {username} = request.params;
    const foundUser = await User.findOne({where: {username}});
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
    const {request, req, files} = ctx;
    const {
      user: {userId},
    } = request;
    const file = files?.file;
    let avatar = request.body?.avatar;
    const {name, username, bio, gender} = request.body;
    console.log({
      userId,
      avatar,
      name,
      username,
      bio,
      gender,
      file,
    });
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
      {where: {userId}, returning: true, plain: true}
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
      user: {userId, following},
    } = request;
    const {userId: targetUserId} = request.body;
    const isFollowing = following.find((id) => id === targetUserId);
    let payload = [];
    if (isFollowing) {
      payload = [...following].filter((id) => id !== targetUserId);
    } else {
      payload = [...following, targetUserId];
    }
    const updatedUser = await User.update(
      {
        following: payload,
      },
      {where: {userId}, returning: true, plain: true}
    );
    ctx.body = {data: updatedUser[1], error: ""};
    return ctx;
  } catch (err) {
    ctx.body = {data: {}};
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = {signUp, signIn, find, editProfile, followUnFollow, detail};
