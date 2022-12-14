'use strict';

/**
 * service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { slug } = ctx.params;
            var svc = await strapi.db.query('api::service.service').findOne({
                where: {
                    slug
                }
            });

            return {
                service: svc
            };
        }
    }));
