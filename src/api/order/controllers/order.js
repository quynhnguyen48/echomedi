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
        totalPrice = totalPrice + (element.product ? element.product.price : parseInt(element.service.price)) * element.quantity;
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
    var secretKey = "KM349Y43X9G7VHI6NWZU9MCENQ0Q5IPK";
    var vnpUrl = "https://pay.vnpay.vn/vpcpay.html";
    var returnUrl = "http://echomedi.me/order_detail/?code=" + orderCode;

    var createDate = moment().format('YYYYMMDDhhmmss').toString();
    var amount = totalPrice;
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
        subject: "ECHO MEDI - X??c Nh???n Thanh To??n - [M?? thanh to??n]", // Subject line
        text: "Xin ch??o", // plain text body
        html: `
          <p>Xin ch??o [T??n kh??ch h??ng],</p>
          
          <p>?????u ti??n, ECHO MEDI c???m ??n b???n v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i. </p>
          <p>D?????i ????y l?? th??ng tin ????n h??ng b???n v???a thanh to??n qua website ECHO MEDI, b???n vui l??ng ki???m tra l???i c??c th??ng tin v?? li??n h??? ngay v???i ch??ng t??i n???u c?? b???t k??? ch???nh s???a n??o</p>
          <p>[Th??ng tin ????n h??ng]</p>
          
          <p>N???u kh??ng c?? b???t k??? v???n ????? g??, ????n h??ng s??? ???????c ghi nh???n v?? chuy???n t???i c??c b?????c k??? ti???p</p>
          <p>[B?????c k??? ti???p: li??n h??? kh??m, d???n d?? tr?????c kh??m, etc.]</p>
          <p>Trong v??i ng??y t???i, ECHO MEDI s??? li??n h??? v???i b???n ????? l??n l???ch h???n kh??m/giao h??ng. B???n vui l??ng ????? ?? ??i???n tho???i/email/tin nh???n v?? ph???n h???i v???i ch??ng t??i n???u c?? th???c m???c ho???c v???n ????? ph??t sinh nh??</p>

          <p>C???m ??n b???n v?? ???? quan t??m ?????n s???c kh???e c???a m??nh,</p>
          <p>ECHO MEDI</p>
      `, // html body
      });
    } catch (e) {
      console.log('ERror', e);
    }

    ctx.send({url: vnpUrl, code: orderCode});
  },
  async updateOrder(ctx) {
    // const filter = utils.convertQueryParams(ctx.request.query);
    const params = ctx.request.query;

    var vnp_Params = ctx.request.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var tmnCode = "ECHOMEDI";
    var secretKey = "KM349Y43X9G7VHI6NWZU9MCENQ0Q5IPK";

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");   

    const req = ctx.request;
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;

    params["ipAddr"] = ipAddr;

    const order = await strapi.query('api::order.order').findOne({
      where: {
        code: params.vnp_OrderInfo
      }});

    let result = null;
    
    if (!order) {
      result = {"Message":"Order not found","RspCode":"01"}	
    }
    else if (secureHash !== signed) {
      result = {"Message":"Invalid Signature","RspCode":"97"}	
    }
    else if (params.vnp_TxnRef != order.vnp_payment_url_params.vnp_TxnRef) {
      result = {"Message":"Order not found","RspCode":"01"}	
    }
    else if (params.vnp_Amount != order.vnp_payment_url_params.vnp_Amount) {
      result = {"Message":"Invalid amount","RspCode":"04"}	
    }
    else if (order.status == "ordered") {
      result = {"Message":"Order already confirmed","RspCode":"02"}	
    }

    params["response"] = result;

    await strapi.query('api::log.log').create({
      data: {
        message: "updateOrder",
        data: params,
      }
    });

    if (result != null) return result;

    let status = "";
    if (params.vnp_ResponseCode == "00" && params.vnp_TransactionStatus == "00") {
      status = "ordered";
    }

    await strapi.query('api::order.order').update({
      where: {
        code: params.vnp_OrderInfo
      },
      data: {
          status,
          vnp_payload: params
      }
    });

    return {"Message":"Confirm Success","RspCode":"00"}; 
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