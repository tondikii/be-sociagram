const bcryptjs = require("bcryptjs")
const salt  = bcryptjs.genSaltSync(10)

const hashPassword = (password) => bcryptjs.hashSync(password, salt)
const comparePassword = (password, hashedPassword) => bcryptjs.compareSync(password, hashedPassword)

module.exports = {hashPassword, comparePassword}