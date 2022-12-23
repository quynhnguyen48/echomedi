"use strict";

const axios = require("axios");
const dayjs = require("dayjs");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

/**
 * check-in controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::check-in.check-in",
  ({ strapi }) => ({
    // wrap a core action, leaving core logic in place
    async hanetAIWebhook(ctx) {
      const cameraData = ctx.request.body;
      console.log(cameraData);

      if (
        cameraData?.personID &&
        cameraData.personType === "1" &&
        dayjs(cameraData.date).isToday()
      ) {
        const data = await strapi.entityService.findMany(
          "api::check-in.check-in",
          {
            filters: {
              personID: {
                $eq: cameraData?.personID,
              },
            },
          }
        );
        const checkedinToday = data?.find(
          (checkin) =>
            dayjs(checkin.updatedAt).isToday() && !checkin.checkedoutAt
        );

        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { id: cameraData.aliasID } });
        if (checkedinToday) {
          await strapi.entityService.update(
            "api::check-in.check-in",
            checkedinToday.id,
            {
              data: {
                user: user
                  ? {
                      id: user?.id,
                    }
                  : null,
                personID: cameraData?.personID,
                metadata: cameraData,
              },
            }
          );
        } else {
          await strapi.entityService.create("api::check-in.check-in", {
            data: {
              user: user
                ? {
                    id: user?.id,
                  }
                : null,
              personID: cameraData?.personID,
              metadata: cameraData,
              publishedAt: new Date().toISOString(),
            },
          });
        }
      }

      ctx.send(
        {
          ok: true,
        },
        200
      );
    },
    async updatePersonAliasID(ctx) {
      const payload = ctx.request.body;

      let cameraConfig = await strapi.entityService.findMany(
        "api::camera.camera"
      );

      const profileRes = await axios({
        method: "post",
        url: "https://partner.hanet.ai/profile/getProfile",
        data: {
          token: cameraConfig.access_token,
        },
      });

      if (profileRes.data.returnCode !== 1) {
        try {
          const newConfigRes = await axios({
            method: "post",
            url: "https://oauth.hanet.com/token",
            data: {
              refresh_token: cameraConfig.refresh_token,
              grant_type: "refresh_token",
              client_id: cameraConfig.client_id,
              client_secret: cameraConfig.client_secret,
            },
          });

          if (newConfigRes?.data) {
            cameraConfig = await strapi.entityService.update(
              "api::camera.camera",
              cameraConfig.id,
              {
                data: {
                  access_token: newConfigRes?.data?.access_token,
                  refresh_token: newConfigRes?.data?.refresh_token,
                },
              }
            );
          }
        } catch (error) {
          throw error;
        }
      }

      if (cameraConfig && payload) {
        try {
          await axios({
            method: "post",
            url: "https://partner.hanet.ai/person/updateAliasID",
            data: {
              token: cameraConfig.access_token,
              personID: payload.personID,
              aliasID: payload.aliasID,
            },
          });
          const res = await axios({
            method: "post",
            url: "https://partner.hanet.ai/person/getUserInfoByPersonID",
            data: {
              token: cameraConfig.access_token,
              personID: payload.personID,
            },
          });

          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({ where: { id: payload.aliasID } });

          const checkInData = await strapi.entityService.findOne(
            "api::check-in.check-in",
            payload.id
          );
          const metadata = {
            ...checkInData.metadata,
            aliasID: payload.aliasID,
          };

          const updatedData = await strapi.entityService.update(
            "api::check-in.check-in",
            payload.id,
            {
              data: {
                user: user
                  ? {
                      id: user?.id,
                    }
                  : null,
                metadata,
              },
              populate: "*",
            }
          );

          if (res.data.data) {
            ctx.send(updatedData, 200);
          }
        } catch (error) {
          throw error;
        }
      }
    },
  })
);
