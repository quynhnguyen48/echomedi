'use strict';

/**
 * blog controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { slug } = ctx.params;
            var svc = await strapi.db.query('api::blog.blog').findOne({
                populate: {
                    image: true,
                },
                where: {
                    slug
                }
            });

            return {
                blog: svc
            };
        }
}));
