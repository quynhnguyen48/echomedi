module.exports = {
  routes: [
    {
      method: "POST",
      path: "/bookings/count",
      handler: "booking.count",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/bookings/createBooking",
      handler: "booking.createBooking",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/bookings/updateBooking",
      handler: "booking.updateBooking",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/bookings/getBookingWithRange",
      handler: "booking.getBookingWithRange",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/bookings/updateStatusBooking",
      handler: "booking.updateStatusBooking",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
