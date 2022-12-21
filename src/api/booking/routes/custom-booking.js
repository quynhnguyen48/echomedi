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
  ],
};
