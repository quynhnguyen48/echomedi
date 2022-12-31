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
  async createBooking(ctx) {

    let patient;
    if (ctx.request.body.createNewPatient) {
      patient = strapi.query("api::patient.patient").create({
        data: {
          ...ctx.request.body
        }
      });
    } else {
      patient = strapi.query("api::patient.patient").findOne({
        where: {
          phone: ctx.request.body.phone,
        }
      });
    }

    let booking = strapi.query("api::booking.booking").create({
      data: {
        ...ctx.request.body,
        patient: patient.id,
      }
    });

    return { booking };
  }
}));
