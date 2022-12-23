'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { slug } = ctx.params;
            var product = await strapi.db.query('api::product.product').findOne({
                populate: {
                    image: true,
                    medicines: {
                        populate: {
                            image: true,
                        }
                    },
                },
                where: {
                    slug
                }
            });

            return {
                product,
            };
        },
        async addProductToCart(ctx) {
            const { user } = ctx.state;
            let cart = await strapi
            .query('api::cart.cart')
            .findOne({
                where: { users_permissions_user: user.id }, populate: {
                    cart_lines: {
                        populate: {
                            product: true,
                        }
                    }
                }
            });

            if (!cart) {
                cart = await strapi
                    .query('api::cart.cart')
                    .create({ data: { users_permissions_user: user.id, publishedAt: new Date().toISOString() } });
            }

            await strapi
                .query('api::cart-line.cart-line')
                .create({ data: { product: ctx.request.body.product_id, cart: cart.id, publishedAt: new Date().toISOString() } });

            ctx.send({ cart_id: cart.id });
        },
        async getCart(ctx) {
            const { user } = ctx.state;
            const us = await strapi
                .query('api::cart.cart')
                .findOne({
                    where: { users_permissions_user: user.id }, populate: {
                        cart_lines: {
                            populate: {
                                product: {
                                    populate: {
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                });
            return ({ user: us });
        }
    }));
