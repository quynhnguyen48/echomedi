"use strict";
const utils = require('@strapi/utils');
const { ApplicationError, ValidationError } = utils.errors;

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // wrap a core action, leaving core logic in place
  async count(ctx) {
    var { query } = ctx.request.body;
    return strapi.query("api::order.order").count({ where: query });
  },
  async getOrderDetail(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError('You must be authenticated to reset your password');
    }

    const { id } = ctx.params;
    var product = await strapi.db.query('api::order.order').findOne({
      populate: {
          cart: {
            populate: {
              cart_lines: {
                populate: {
                  product: true
                }
              },
            }
          },
          medicines: {
              populate: {
                  image: true,
              }
          },
      },
      where: {
          id
      }
  });

  return {
      product,
  };
  },
  async createOrder(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError('You must be authenticated to reset your password');
    }

    const { id } = ctx.state.user;
    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { id }, populate: { cart: true }});
    
    let cart = user.cart;
    if (!user.cart) {
      throw new ApplicationError("You don't have any item in cart.");
    }

    let result = await strapi.query('api::cart.cart').findOne({ where: { id: cart.id }, 
      populate: 
      { cart_lines: 
        {
          populate: {
            product: true,
          }
        },
      }
    });

    let totalPrice = 0;
    result.cart_lines.forEach(element => {
      totalPrice = totalPrice + element.product.price;
    });

    let order = await strapi
      .query('api::order.order')
      .create({ data: { 
        cart: cart.id, 
        users_permissions_user: id, 
        publishedAt: new Date().toISOString(),
        total: totalPrice,
        num_of_prod: result.cart_lines ? result.cart_lines.length : 0,
       } });
      

    await strapi.plugins['users-permissions'].services.user.edit(id , {cart: null});

    return order;
  }
}));
