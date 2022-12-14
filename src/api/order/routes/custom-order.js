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
    {
      method: "GET",
      path: "/orders/getOrderDetail/:id",
      handler: "order.getOrderDetail",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/orders/getOrderHistory",
      handler: "order.getOrderHistory",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/orders/getOrderDetailByCode/:code",
      handler: "order.getOrderDetailByCode",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/orders/createPaymentUrl",
      handler: "order.createPaymentUrl",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/updateOrder",
      handler: "order.updateOrder",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
