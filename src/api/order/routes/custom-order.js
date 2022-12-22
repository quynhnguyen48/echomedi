module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/count",
      handler: "order.count",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
