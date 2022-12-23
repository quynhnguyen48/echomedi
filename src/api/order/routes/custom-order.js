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
    {
      method: "POST",
      path: "/orders/createOrder",
      handler: "order.createOrder",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
