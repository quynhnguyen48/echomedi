module.exports = ({ env }) => ({
  redis: {
    config: {
      connections: {
        default: { connection: "redis://default:2f7f5236d7134cf29e06e26380f51324@apn1-infinite-raccoon-33666.upstash.io:33666" },
      },
    },
  },
  "rest-cache": {
    config: {
      provider: { name: "redis" },
      strategy: {
        contentTypes: [
          { contentType: "api::service-bundle.service-bundle", hitpass: false },
        ],
        //debug: true,
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp.hostinger.com",
        port: 465,
        auth: {
          user: "noreply@echomedi.me",
          pass: "Llaugusty48@",
        },
      },
      settings: {
        defaultFrom: `<quynh@echomedi.me>`,
        defaultReplyTo: "quynh@echomedi.me",
      },
    },
  },
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  // ...
});