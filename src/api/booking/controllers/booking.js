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
    console.log('body', ctx.request.body)
    let patient;
    if (ctx.request.body.data.createNewPatient) {
      patient = await strapi.query("api::patient.patient").create({
        data: {
          ...ctx.request.body.data
        }
      });
    } else {
      patient = await strapi.query("api::patient.patient").findOne({
        where: {
          phone: ctx.request.body.phone,
        }
      });
    }

    console.log('patient', patient)

    let booking = strapi.query("api::booking.booking").create({
      data: {
        ...ctx.request.body,
        patient: patient.id,
      }
    });

    return { booking };
  }
}));
