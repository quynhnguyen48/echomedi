"use strict";
const { ApplicationError, ValidationError } = require("@strapi/utils").errors;

/**
 *  membership-card controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::membership-card.membership-card");

module.exports = createCoreController(
  "api::membership-card.membership-card",
  ({ strapi }) => ({
    async getServiceCardAnalytics(ctx) {
      const knex = strapi.db.connection;

      const totalCards = await knex("membership_cards as cards")
        .where("cards.type", "service-card")
        .count({
          totalCards: "*",
        });

      const totalRemain = await knex
        .select(
          knex.raw("sum(?? * ??) as totalRemain", [
            "cards.remain_value",
            "treatments.price",
          ])
        )
        .from("membership_cards as cards")
        .join(
          "membership_cards_service_links",
          "membership_cards_service_links.membership_card_id",
          "cards.id"
        )
        .join(
          "treatments",
          "treatments.id",
          "membership_cards_service_links.treatment_id"
        )
        .where("cards.type", "service-card");

      return {
        totalCards: totalCards?.[0]?.totalCards,
        totalRemain: totalRemain?.[0]?.totalRemain,
      };
    },
    async addMemberToCard(ctx) {
      const currentUser = ctx.state.user;
      const { cardID } = ctx.params;
      const { userID, usageLimit } = ctx.request.body;

      const card = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      if (!card) {
        throw new ValidationError("Invalid card");
      }
      if (card.user.id !== currentUser.id) {
        throw new ValidationError("Only card owner can invite other members");
      }

      const inviteUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userID
      );
      if (!inviteUser) {
        throw new ValidationError("User not found");
      }
      const existedMembers = [card.user.id];
      Array.isArray(card.extraMembers) &&
        card.extraMembers?.map((cardMember) => {
          existedMembers.push(cardMember.member.id);
        });

      if (existedMembers?.includes(inviteUser?.id)) {
        throw new ApplicationError("This user is already existed in card");
      }
      if (card.type === "service-card" && usageLimit > card.usageLimit) {
        throw new ApplicationError("Maximum value is over usage limit of card");
      }

      const newExtraMembers = card.extraMembers || [];
      newExtraMembers.push({
        member: {
          id: userID,
        },
        usageLimit,
        remainValue: usageLimit,
      });

      await strapi.entityService.update(
        "api::membership-card.membership-card",
        cardID,
        {
          data: {
            extraMembers: newExtraMembers,
          },
        }
      );
      const updatedCard = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      ctx.body = updatedCard.extraMembers;
    },
    async getExtraMembers(ctx) {
      const currentUser = ctx.state.user;
      const { cardID } = ctx.params;
      const card = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      if (!card) {
        throw new ValidationError("Invalid card");
      }
      if (
        currentUser?.role?.type === "authenticated" &&
        currentUser.id !== card.user.id
      ) {
        throw new ValidationError("You are not card owner");
      }
      ctx.body = card.extraMembers;
    },
    async removeMemberFromCard(ctx) {
      const currentUser = ctx.state.user;
      const { cardID, userID } = ctx.params;

      const card = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      if (!card) {
        throw new ValidationError("Invalid card");
      }
      if (card.user.id !== currentUser.id) {
        throw new ValidationError("Only card owner can remove");
      }
      const removedUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userID
      );
      if (!removedUser) {
        throw new ValidationError("User not found");
      }

      const existedMembers = Array.isArray(card.extraMembers)
        ? card.extraMembers?.map((cardMember) => cardMember.member.id)
        : [];

      if (!existedMembers?.includes(removedUser?.id)) {
        throw new ApplicationError("This user is not existed in card");
      }

      const newExtraMembers =
        Array.isArray(card.extraMembers) &&
        card.extraMembers?.filter(
          (cardMember) => `${cardMember.member.id}` !== `${userID}`
        );

      await strapi.entityService.update(
        "api::membership-card.membership-card",
        cardID,
        {
          data: {
            extraMembers: newExtraMembers,
          },
        },
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      const updatedCard = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      ctx.body = updatedCard.extraMembers;
    },
    async leaveCard(ctx) {
      const currentUser = ctx.state.user;
      const { cardID } = ctx.params;

      const card = await strapi.entityService.findOne(
        "api::membership-card.membership-card",
        cardID,
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      if (!card) {
        throw new ValidationError("Invalid card");
      }

      const existedMembers = Array.isArray(card.extraMembers)
        ? card.extraMembers?.map((cardMember) => cardMember.member.id)
        : [];
      if (!existedMembers?.includes(currentUser?.id)) {
        throw new ApplicationError("You are not a member in card");
      }
      const newExtraMembers =
        Array.isArray(card.extraMembers) &&
        card.extraMembers?.filter(
          (cardMember) => `${cardMember.member.id}` !== `${currentUser?.id}`
        );
      await strapi.entityService.update(
        "api::membership-card.membership-card",
        cardID,
        {
          data: {
            extraMembers: newExtraMembers,
          },
        },
        {
          populate: ["user", "extraMembers.member"],
        }
      );
      ctx.body = { ok: true };
    },
  })
);
