"use strict";

/**
 *  booking controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::booking.booking", ({ strapi }) => ({
  // wrap a core action, leaving core logic in place
  async count(ctx) {
    var { query } = ctx.request.body;
    return strapi.query("api::booking.booking").count({ where: query });
  },
}));
