const koaMulter = require("@koa/multer");

const multerImage = koaMulter({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  async fileFilter(ctx, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb({name: "Error File Type"});
    }
    cb(undefined, true);
  },
});

module.exports = multerImage;
