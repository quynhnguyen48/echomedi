'use strict';

/**
 * drug controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::drug.drug', ({ strapi }) => ({
    async bulkCreate(ctx) {

        await strapi.query("api::drug.drug").deleteMany(
            {
                where: {
                    code: {
                      $startsWith: 'H',
                    },
                },
            }
        );

        let data = [];
        const lines = ctx.request.body.data;

        for (let i = 7; i < lines.length; ++i) {
            data.push({
                code: lines[i][0],
                label: lines[i][1],
                publishedAt: new Date(),
            })
        }

        await strapi.db.query('api::drug.drug').createMany({
            data,
        });
        return {ok: true}
        // return strapi.query("api::booking.booking").count({ where: query });
    },

    async deleteAll(ctx) {
        return strapi.query("api::drug.drug").deleteMany(
            {
                where: {
                    code: {
                      $startsWith: 'H',
                    },
                },
            }
        );
    }
}));
