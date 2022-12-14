module.exports = {
    routes: [
      {
        method: "GET",
        path: "/service/findOne/:slug",
        handler: "service.findOne",
        config: {
          policies: [],
          prefix: false,
        },
      },
    ]
}  