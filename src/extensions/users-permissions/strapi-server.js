const { sanitize } = require("@strapi/utils");
const { ApplicationError, ValidationError } = require("@strapi/utils").errors;
const dayjs = require("dayjs");
const qs = require("qs");

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  plugin.controllers.user.getMe = async (ctx) => {
    const { id } = ctx.state.user;
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { id } });

    return {user};
  };

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/user/getMe",
    handler: "user.getMe",
    config: {
      policies: [],
      prefix: "",
    },
  });

  return plugin;
};
