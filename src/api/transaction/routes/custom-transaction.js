module.exports = {
  routes: [
    {
      method: "GET",
      path: "/transaction/total-revenue",
      handler: "transaction.getTotalRevenue",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/transaction/total-debt",
      handler: "transaction.getTotalDebt",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/transaction/top-debt",
      handler: "transaction.getTopDebts",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/transaction/debt-distribution",
      handler: "transaction.getDebtDistribution",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/transaction/user-analytics",
      handler: "transaction.getUserAnalytics",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/transaction/user-debt",
      handler: "transaction.getUserDebt",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/transaction/monthly-revenue",
      handler: "transaction.getMonthlyRevenue",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/transaction/yearly-revenue",
      handler: "transaction.getYearlyRevenue",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/customer-analytics",
      handler: "transaction.getCustomerAnalytics",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/staff-analytics",
      handler: "transaction.getStaffAnalytics",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/product-analytics",
      handler: "transaction.getProductAnalytics",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/suggestion-services",
      handler: "transaction.getSuggestionServices",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
