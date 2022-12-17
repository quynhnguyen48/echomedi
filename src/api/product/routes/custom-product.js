module.exports = {
    routes: [
      {
        method: "GET",
        path: "/product/findOne/:slug",
        handler: "product.findOne",
        config: {
          policies: [],
          prefix: false,
        },
      },
    ]
}  