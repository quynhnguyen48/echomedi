module.exports = ({ env }) => ({
  wysiwyg: {
    enabled: true,
    resolve: "./src/plugins/wysiwyg", // path to plugin folder
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