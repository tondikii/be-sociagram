const errorsHandler = (err, ctx) => {
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      ctx.status = 400;
      const filtered = [...err.errors].filter(
        (el) => el.message !== "User Id cannot be empty"
      );
      ctx.body = {
        data: ctx?.body?.data || null,
        error: [...filtered].map((el) => {
          if (el.message.includes("must be unique")) {
            return `${el.message.split(" ")[0]} already used`;
          }
          return el.message;
        }),
      };
      return ctx;
    case "Bad Request Sign In":
      ctx.status = 400;
      ctx.body = {
        data: ctx?.body?.data || null,
        error: "Email or password is required",
      };
      return ctx;
    case "Invalid Email":
      ctx.status = 400;
      ctx.body = {data: ctx?.body?.data || null, error: "Invalid email"};
      return ctx;
    case "Invalid Password":
      ctx.status = 400;
      ctx.body = {data: ctx?.body?.data || null, error: "Invalid password"};
      return ctx;
    case "Missing Authorization":
      ctx.status = 401;
      ctx.body = {data: ctx?.body?.data || null, error: "Missing access token"};
      return ctx;
    case "Unauthorized Middleware":
    case "JsonWebTokenError":
      ctx.status = 401;
      ctx.body = {data: ctx?.body?.data || null, error: "Invalid access token"};
      return ctx;
    case "Error File Type":
      ctx.status = 400;
      ctx.body = {
        data: ctx?.body?.data || null,
        error: "File type avatar must be image",
      };
      return ctx;
    case "Invalid Profile":
      ctx.status = 400;
      ctx.body = {
        data: ctx?.body?.data || null,
        error: "Username not found",
      };
      return ctx;
    case "MulterError":
      ctx.status = 400;
      ctx.body = {
        data: ctx?.body?.data || null,
        error: "Maximum file size is 1 mb",
      };
      return ctx;
    default:
      ctx.body = {
        data: ctx?.body?.data || null,
        error: "Internal server error",
      };
      ctx.status = 500;
      return ctx;
  }
};

module.exports = errorsHandler;
