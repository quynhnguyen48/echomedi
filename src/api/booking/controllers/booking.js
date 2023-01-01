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
    let bookings = await strapi.query("api::booking.booking").findMany({
      where: {
        bookingDate: {
          $gte: new Date(ctx.request.body.data.startDate),
          $lte: new Date(ctx.request.body.data.endDate),
        }
      },
      populate: {
        patient: true,
        medical_record: true,
      }
    });

    return {bookings};
  },
  async updateBooking(ctx) {
    await strapi.query("api::booking.booking").delete({
      where: {
        id: ctx.request.body.data.id,
      }
    });

    return await this.createBooking(ctx);
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
          phone: ctx.request.body.data.phone,
        }
      });
    }

    let booking = await strapi.query("api::booking.booking").create({
      data: {
        ...ctx.request.body.data,
        patient: patient.id,
        publishedAt: new Date(),
      }
    });

    return { booking };
  },

  async updateStatusBooking(ctx) {
    let booking = await strapi.query("api::booking.booking").update({
      where: {
        id: ctx.request.body.id,
      },
      data: {
          status: ctx.request.body.status,
      }
    });

    return {booking}
  }
}));
