const jwt = require("jsonwebtoken");

const sign = (payload) => jwt.sign(payload, process.env.JWT_SIGNATURE);

const verify = (access_token) => jwt.verify(access_token, process.env.JWT_SIGNATURE);

module.exports = { sign, verify };