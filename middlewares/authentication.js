const {User} = require("../models/index");
const jwt = require("../helpers/jwt");

const authentication = async (ctx, next) => {
  try {
    const {
      request,
      headers: {authorization},
    } = ctx;
    if (!authorization) throw {name: "Missing Authorization"};
    const accessToken = authorization.split(" ").slice(1).join("");
    if (!accessToken) throw {name: "Unauthorized Middleware"};
    const payload = jwt.verify(accessToken);
    if (!payload) throw {name: "Unauthorized Middleware"};
    const user = await User.findByPk(payload.id);
    if (!user) throw {name: "Unauthorized Middleware"};
    request.user = {
      userId: user.userId,
      followers: user.followers,
      following: user.following,
    };
    await next();
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
};

module.exports = authentication;
