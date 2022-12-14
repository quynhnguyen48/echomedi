module.exports = ({ env }) => ({
    // ...
    email: {
      config: {
        provider: "sendgrid",
        providerOptions: {
          apiKey: "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",
        },
        settings: {
          defaultFrom: "contact@echomedi.com",
          defaultReplyTo: "contact@echomedi.com",
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