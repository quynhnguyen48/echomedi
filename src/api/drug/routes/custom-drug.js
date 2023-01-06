module.exports = {
  routes: [
    {
      method: "POST",
      path: "/drugs/bulkCreate",
      handler: "drug.bulkCreate",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/drugs/deleteAll",
      handler: "drug.deleteAll",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
