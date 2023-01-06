"use strict";
const utils = require('@strapi/utils');
const moment = require("moment");
const { ApplicationError, ValidationError } = utils.errors;
const nodemailer = require("nodemailer");


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

    

    await strapi.plugins['users-permissions'].services.user.edit(id, { cart: null });

    
    var orderCode = generateCode("ORD");
    const req = ctx.request;

    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;

    var tmnCode = "ECHOMEDI";
    var secretKey = "KXFENCKEXAUHNZCZXDBURGCJTHHTKHYY";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var returnUrl = "http://echomedi.me/order_detail/?code=" + orderCode;

    var createDate = moment().format('YYYYMMDDhhmmss').toString();
    var amount = "1000000";
    var bankCode = "";
    
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
    vnp_Params['vnp_TxnRef'] = orderCode;
    vnp_Params['vnp_OrderInfo'] = orderCode;
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

    let order = await strapi
      .query('api::order.order')
      .create({
        data: {
          paymentMethod: "vnpay",
          status: "draft",
          code: orderCode,
          cart: cart.id,
          users_permissions_user: id,
          publishedAt: new Date().toISOString(),
          total: totalPrice,
          num_of_prod: result.cart_lines ? result.cart_lines.length : 0,
          vnp_payment_url_params: vnp_Params,
        }
      });

    try {

      let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "orders@echomedi.com", // generated ethereal user
          pass: "1026Echomedi@123", // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: '<orders@echomedi.com>', // sender address
        to: ctx.state.user.email, // list of receivers
        subject: "ECHO MEDI - Xác Nhận Thanh Toán - [Mã thanh toán]", // Subject line
        text: "Xin chào", // plain text body
        html: `
          <p>Xin chào [Tên khách hàng],</p>
          
          <p>Đầu tiên, ECHO MEDI cảm ơn bạn vì đã tin gửi sức khỏe toàn diện cho chúng tôi. </p>
          <p>Dưới đây là thông tin đơn hàng bạn vừa thanh toán qua website ECHO MEDI, bạn vui lòng kiểm tra lại các thông tin và liên hệ ngay với chúng tôi nếu có bất kỳ chỉnh sửa nào</p>
          <p>[Thông tin đơn hàng]</p>
          
          <p>Nếu không có bất kỳ vấn đề gì, đơn hàng sẽ được ghi nhận và chuyển tới các bước kế tiếp</p>
          <p>[Bước kế tiếp: liên hệ khám, dặn dò trước khám, etc.]</p>
          <p>Trong vài ngày tới, ECHO MEDI sẽ liên hệ với bạn để lên lịch hẹn khám/giao hàng. Bạn vui lòng để ý điện thoại/email/tin nhắn và phản hồi với chúng tôi nếu có thắc mắc hoặc vấn đề phát sinh nhé</p>

          <p>Cảm ơn bạn vì đã quan tâm đến sức khỏe của mình,</p>
          <p>ECHO MEDI</p>
      `, // html body
      });
    } catch (e) {
      console.log('ERror', e);
    }

    ctx.send({url: vnpUrl});
  },
  async updateOrder(ctx) {
    // const filter = utils.convertQueryParams(ctx.request.query);
    const params = ctx.request.query;

    const order = await strapi.query('api::order.order').findOne({
      where: {
        code: params.vnp_OrderInfo
      }});

    var vnp_Params = ctx.request.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var tmnCode = "ECHOMEDI";
    var secretKey = "KXFENCKEXAUHNZCZXDBURGCJTHHTKHYY";

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");   

    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;

    params["ipAddr"] = ipAddr;

    await strapi.query('api::log.log').create({
      data: {
        message: "updateOrder",
        data: JSON.stringify(params)
      }
    });

    if (secureHash !== signed) {
      return {"Message":"Invalid Signature","RspCode":"97"}	
    }
    if (params.vnp_TxnRef != order.vnp_payment_url_params.vnp_TxnRef) {
      return {"Message":"Order not found","RspCode":"01"}	
    }
    if (params.vnp_Amount != order.vnp_payment_url_params.vnp_Amount) {
      return {"Message":"Invalid amount","RspCode":"04"}	
    }
    if (order.status == "ordered") {
      return {"Message":"Order already confirmed","RspCode":"02"}	
    }

    const req = ctx.request;
    
    

    await strapi.query('api::order.order').update({
      where: {
        code: params.vnp_OrderInfo
      },
      data: {
          status: "ordered",
          vnp_payload: params
      }
    });
    
    return {"Message":"Confirm Success","RspCode":"00"}	
  },
  async getOrderHistory(ctx) {
    const { id } = ctx.state.user;
    let orders = await strapi.query('api::order.order').findMany({
      where: { users_permissions_user: id },
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

    return {orders};
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