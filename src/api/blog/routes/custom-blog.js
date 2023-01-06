module.exports = {
    routes: [
      {
        method: "GET",
        path: "/blog/findOne/:slug",
        handler: "blog.findOne",
        config: {
          policies: [],
          prefix: false,
        },
      },
    ]
}  