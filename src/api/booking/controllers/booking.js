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
  async getBookingWithRange(ctx) {
    let bookings = strapi.query("api::booking.booking").find({
      where: {
        bookingDate_gte: new Date(ctx.request.body.data.startDate),
        bookingDate_lte: new Date(ctx.request.body.data.endDate),
      }
    });

    return {bookings};
  },
  async createBooking(ctx) {
    let patient;
    if (ctx.request.body.data.createNewPatient) {
      patient = await strapi.query("api::patient.patient").create({
        data: {
          ...ctx.request.body.data,
          publishedAt: new Date(),
        }
      });
    } else {
      patient = await strapi.query("api::patient.patient").findOne({
        where: {
          phone: ctx.request.body.phone,
        }
      });
    }

    let booking = strapi.query("api::booking.booking").create({
      data: {
        ...ctx.request.body.data,
        patient: patient.id,
        publishedAt: new Date(),
      }
    });

    return { booking };
  }
}));
