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
      },
      {
        method: "POST",
        path: "/packages/inquiryMembership",
        handler: "package.inquiryMembership",
        config: {
          policies: [],
          prefix: false,
        }
      },
      {
        method: "POST",
        path: "/packages/inquiryService",
        handler: "package.inquiryService",
        config: {
          policies: [],
          prefix: false,
        }
      },
      {
        method: "POST",
        path: "/packages/emailGift",
        handler: "package.emailGift",
        config: {
          policies: [],
          prefix: false,
        }
      },
      {
        method: "POST",
        path: "/packages/emailPayment",
        handler: "package.emailPayment",
        config: {
          policies: [],
          prefix: false,
        }
      }
    ]
}  