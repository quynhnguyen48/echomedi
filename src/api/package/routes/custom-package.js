module.exports = {
    routes: [
      {
        method: "GET",
        path: "/package/findOne/:slug",
        handler: "package.findOne",
        config: {
          policies: [],
          prefix: false,
        },
      },
    ]
}  