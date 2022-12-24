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
      {
        method: "POST",
        path: "/product/addProductToCart",
        handler: "product.addProductToCart",
        config: {
          policies: [],
          prefix: false,
        },
      },
      {
        method: "GET",
        path: "/product/getCart",
        handler: "product.getCart",
        config: {
          policies: [],
          prefix: false,
        },
      },
      {
        method: "POST",
        path: "/product/generatePDF",
        handler: "product.generatePDF",
        config: {
          policies: [],
          prefix: false,
        },
      },
      {
        method: "POST",
        path: "/product/generatePhieuCLS",
        handler: "product.generatePhieuCLS",
        config: {
          policies: [],
          prefix: false,
        },
      }
    ]
}  