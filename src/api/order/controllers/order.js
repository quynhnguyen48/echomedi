"use strict";
const utils = require('@strapi/utils');
const moment = require("moment");
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
  async getOrderDetailByCode(ctx) {
    const { code } = ctx.params;
    var order = await strapi.db.query('api::order.order').findOne({
      populate: {
        cart: {
          populate: {
            cart_lines: {
              populate: {
                product: true,
                service: true,
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
        code
      }
    });

    return {
      order,
    };
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
  async createPaymentUrl(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError('You must be authenticated to reset your password');
    }

    const { id } = ctx.state.user;
    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { id }, populate: { cart: true } });

    let cart = user.cart;
    if (!user.cart) {
      throw new ApplicationError("You don't have any item in cart.");
    }

    let result = await strapi.query('api::cart.cart').findOne({
      where: { id: cart.id },
      populate:
      {
        cart_lines:
        {
          populate: {
            product: true,
            service: true,
          }
        },
      }
    });

    let totalPrice = 0;
    result.cart_lines.forEach(element => {
      try {
        totalPrice = totalPrice + element.product ? element.product.price : parseInt(element.service.price);
      } catch (e) {

      }
    });

    let order = await strapi
      .query('api::order.order')
      .create({
        data: {
          status: "draft",
          code: generateCode("ORD"),
          cart: cart.id,
          users_permissions_user: id,
          publishedAt: new Date().toISOString(),
          total: totalPrice,
          num_of_prod: result.cart_lines ? result.cart_lines.length : 0,
        }
      });
      
    const req = ctx.request;

    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;

    var tmnCode = "ECHOMEDI";
    var secretKey = "KXFENCKEXAUHNZCZXDBURGCJTHHTKHYY";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var returnUrl = "http://echomedi.me/order_detail/?code=" + order.code;

    var createDate = moment().format('YYYYMMDDhhmmss').toString();
    var orderId = moment().format('hhmmss') + "1";
    var amount = "1000000";
    var bankCode = "";
    
    var orderInfo = order.code;
    var orderType = "billpayment";
    var locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = "ECHOMEDI";
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = "vn";
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log('vnpUrl', vnpUrl);

    ctx.send({url: vnpUrl});
  },
  async updateOrder(ctx) {
    console.log('ctx', ctx);
  },
  async createOrder(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError('You must be authenticated to reset your password');
    }

    const { id } = ctx.state.user;
    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { id }, populate: { cart: true } });

    let cart = user.cart;
    if (!user.cart) {
      throw new ApplicationError("You don't have any item in cart.");
    }

    let result = await strapi.query('api::cart.cart').findOne({
      where: { id: cart.id },
      populate:
      {
        cart_lines:
        {
          populate: {
            product: true,
            service: true,
          }
        },
      }
    });

    let totalPrice = 0;
    result.cart_lines.forEach(element => {
      try {
        totalPrice = totalPrice + element.product ? element.product.price : parseInt(element.service.price);
      } catch (e) {

      }
    });

    let order = await strapi
      .query('api::order.order')
      .create({
        data: {
          cart: cart.id,
          users_permissions_user: id,
          publishedAt: new Date().toISOString(),
          total: totalPrice,
          num_of_prod: result.cart_lines ? result.cart_lines.length : 0,
        }
      });


    await strapi.plugins['users-permissions'].services.user.edit(id, { cart: null });

    return order;
  }
}));


function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

function generateCode(prefix) {
  const CODE_LENGTH = 6;
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < CODE_LENGTH; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return (prefix + result).toLocaleUpperCase();
}