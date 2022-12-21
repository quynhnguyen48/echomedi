module.exports = {
  routes: [
    {
      method: "GET",
      path: "/service-card/analytics",
      handler: "membership-card.getServiceCardAnalytics",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/card/:cardID/extra-members",
      handler: "membership-card.addMemberToCard",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/card/:cardID/extra-members",
      handler: "membership-card.getExtraMembers",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/card/:cardID/extra-members/leave",
      handler: "membership-card.leaveCard",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "DELETE",
      path: "/card/:cardID/extra-members/:userID",
      handler: "membership-card.removeMemberFromCard",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
