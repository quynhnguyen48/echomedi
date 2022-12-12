'use strict';

/**
 * package controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::package.package',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { slug } = ctx.params;
            var pkg = await strapi.db.query('api::package.package').findOne({
                populate: {
                    sub_packages: {
                        populate: {
                            image: true,
                            services: {
                                populate: {
                                    label: true,
                                    slug: true,
                                    desc: true,
                                    price: true
                                }
                            }
                        }
                    }
                },
                where: {
                    slug
                }
            });

            return {
                package: pkg
            };
        }
    }));
