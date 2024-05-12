// multerMiddleware.js

const multer = require("multer");

const maxSize = 1 * 1024 * 1024; // 1 MB
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb({name: "Error File Type"});
    }
  },
  limits: {fileSize: maxSize},
}).single("file");

const multerMiddleware = async (ctx, next) => {
  await new Promise((resolve, reject) => {
    upload(ctx.req, ctx.res, (err) => {
      if (err instanceof multer.MulterError) {
        err.name = "Error File Size";
        reject(err);
      } else if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
    .then(() => {
      ctx.file = ctx.req.file; // Pass the uploaded file to ctx for use in controllers
      return next();
    })
    .catch((err) => {
      console.error(err);
      ctx.status = 400; // Bad request status
      ctx.body = {error: err.message || "File upload failed"};
    });
};

module.exports = multerMiddleware;
