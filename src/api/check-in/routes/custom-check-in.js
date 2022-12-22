module.exports = {
  routes: [
    {
      method: "POST",
      path: "/check-in/hanet-ai",
      handler: "check-in.hanetAIWebhook",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/check-in/person/updateAliasID",
      handler: "check-in.updatePersonAliasID",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
