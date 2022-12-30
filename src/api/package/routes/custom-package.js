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
      {
        method: "POST",
        path: "/packages/send_email",
        handler: "package.sendEmail",
        config: {
          policies: [],
          prefix: false,
        }
      },
      {
        method: "POST",
        path: "/packages/contact",
        handler: "package.contact",
        config: {
          policies: [],
          prefix: false,
        }
      },
      {
        method: "POST",
        path: "/packages/subscribeInfo",
        handler: "package.subscribeInfo",
        config: {
          policies: [],
          prefix: false,
        }
      }
    ]
}  