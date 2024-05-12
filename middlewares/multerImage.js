const koaMulter = require("@koa/multer");

const multerImage = koaMulter({
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size up to 2MB
  },
  fileFilter: (ctx, file, cb) => {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb({name: "Error File Type"});
    }
    cb(null, true);
  },
});

module.exports = multerImage;
