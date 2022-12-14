'use strict';

/**
 * package controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const nodemailer = require("nodemailer");

module.exports = createCoreController('api::package.package',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { slug } = ctx.params;
            var pkg = await strapi.db.query('api::package.package').findOne({
                populate: {
                    hero_img: true,
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
        },
        async contact(ctx) {
            const { name, email, phone_number, message } = ctx.request.body;

            const emailTemplate = `<!DOCTYPE html>
            <html>
            <head>
            
              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Email Confirmation</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
              /**
               * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
               */
              @media screen {
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                }
            
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                }
              }
            
              /**
               * Avoid browser level font resizing.
               * 1. Windows Mobile
               * 2. iOS / OSX
               */
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }
            
              /**
               * Remove extra space added to tables and cells in Outlook.
               */
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
            
              /**
               * Better fluid images in Internet Explorer.
               */
              img {
                -ms-interpolation-mode: bicubic;
              }
            
              /**
               * Remove blue links for iOS devices.
               */
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
            
              /**
               * Fix centering issues in Android 4.4.
               */
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
            
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
            
              /**
               * Collapse table borders to avoid space between cells.
               */
              table {
                border-collapse: collapse !important;
              }
            
              a {
                color: #1a82e2;
              }
            
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
              </style>
            
            </head>
            <body style="background-color: #e9ecef;">
            
              <!-- start preheader -->
              <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
              </div>
              <!-- end preheader -->
            
              <!-- start body -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
                <!-- start logo -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                          <a href="http://echomedi.me" target="_blank" style="display: inline-block;">
                            <img src="https://echomedi.com/wp-content/uploads/2022/08/cropped-LOGO-ECHOMEDI-01.png" alt="Logo" border="0" width="48" style="display: block; width: 200px;">
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end logo -->
            
                <!-- start hero -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">New contact</h1>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end hero -->
            
                <!-- start copy block -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          </p>
                          <p>Name: ${name}</p>
                          <p>Email: ${email}</p>
                          <p>Phone number: ${phone_number}</p>
                          <p>Message: ${message}</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          Thank you again and have a great day!
                          
                          Yours truly,
                          
                          Your friends at ECHO MEDI</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                        </td>
                      </tr>
                      <!-- end copy -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end copy block -->
            
                <!-- start footer -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start permission -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">
                          </p>
                          <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">ECHO MEDI'S LOCATIONS</p><p class="font-bold mt-4">Ho Chi Minh City</p><p> - District 7</p><p> + 1026 Nguyen Van Linh, Tan Phong Ward, District 7.</p><p> - District 2</p><p> + 46 Nguyen Thi Dinh, An Phu Ward, District 2.</p><p class="font-bold mt-4">Binh Duong</p><p> + Canary Plaza, 5 Binh Duong Highway, Thuan Giao, Thuan An City.</p></div>
                          <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">POLICY</p><p><a href="/en/services/chinh-sach-bao-mat">Privacy Policy</a></p><p class="font-bold"><a href="/en/contact">CONTACT</a></p><p>Hotline: 1900 638 408</p><p>Email: contact@echomedi.com</p><p class="font-bold mt-4">CLINIC HOURS</p><p>Monday - Saturday: 7:00 ??? 21:00</p><p>Sunday: 7:00 ??? 15:00</p></div>
                        </td>
                      </tr>
                      <!-- end permission -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end footer -->
            
              </table>
              <!-- end body -->
            
            </body>
            </html>`;

            // const emailTemplate = {
            //   subject: 'New contact',
            //   text: `Welcome to mywebsite.fr!
            //     Your account is now linked with: <%= user.email %>.`,
            //   html: t,
            // };
            
            // await strapi.plugins['email'].services.email.sendTemplatedEmail(
            //   {
            //     to: 'llaugusty@gmail.com',
            //     from: 'noreply@echomedi.me',
            //   },
            //     emailTemplate,
            //   {
            //     user: {},
            //   }
            // );
          // return {ok: true}

          let transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: "noreply@echomedi.com", // generated ethereal user
              pass: "1026Echomedi@123", // generated ethereal password
            },
          });
  
          let info = await transporter.sendMail({
            from: '<noreply@echomedi.com>', // sender address
            to: [email, 'contact@echomedi.com'], // list of receivers
            subject: "ECHO MEDI", // Subject line
            text: "Xin ch??o", // plain text body
            html: emailTemplate, // html body
          });
  
          ctx.send({ok: true});
      },

      async inquiryMembership(ctx) {
        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "noreply@echomedi.com", // generated ethereal user
            pass: "1026Echomedi@123", // generated ethereal password
          },
        });

        let template = `
              <p>Xin ch??o [NAME]</p>
              
              <p>Ch??o m???ng [NAME] ?????n v???i ECHO MEDI. C???m ??n b???n v?? ???? lu??n quan t??m ch??m s??c s???c kh???e b???n th??n, v?? h??n h???t v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i. </p>
              <p>ECHO MEDI v???a nh???n ???????c l???i nh???n c???a b???n qua trang web v??? g??i th??nh vi??n [OPTION]. B??? ph???n chuy??n m??n c???a ch??ng t??i s??? nhanh ch??ng li??n l???c v?? gi???i quy???t th???c m???c c???a b???n trong th???i gian ng???n nh???t.</p>
              <p>Trong l??c ????, b???n c?? th??? xem th??m m???t s??? s???n ph???m kh??c c???a ECHO MEDI qua trang web https://echomedi.com, ho???c g???i s??? hotline 1900 638 408 n???u c???n h??? tr??? g???p</p>
              
              <p>C???m ??n b???n v?? ???? lu??n ch??m s??c cho s???c kh???e b???n th??n,</p>
              <p>ECHO MEDI </p>
          `;

          template = template.replaceAll("[NAME]", ctx.request.body.name);
          template = template.replaceAll("[OPTION]", ctx.request.body.option);

        let info = await transporter.sendMail({
          from: '<noreply@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI - Th??ng Tin G??i Th??nh Vi??n", // Subject line
          text: "Xin ch??o", // plain text body
          html: template, // html body
        });

        ctx.send({ok: true});
      },

      async inquiryService(ctx) {
        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "noreply@echomedi.com", // generated ethereal user
            pass: "1026Echomedi@123", // generated ethereal password
          },
        });

        let template = `
              <p>Xin ch??o [NAME]</p>
              
              <p>Ch??o m???ng [NAME] ?????n v???i ECHO MEDI. C???m ??n b???n v?? ???? lu??n quan t??m ch??m s??c s???c kh???e b???n th??n, v?? h??n h???t v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i. </p>
              <p>ECHO MEDI v???a nh???n ???????c l???i nh???n c???a b???n qua trang web v??? g??i [EMAIL_TITLE]. B??? ph???n chuy??n m??n c???a ch??ng t??i s??? nhanh ch??ng li??n l???c v?? gi???i quy???t th???c m???c c???a b???n trong th???i gian ng???n nh???t.</p>
              <p>Trong l??c ????, b???n c?? th??? xem th??m m???t s??? s???n ph???m kh??c c???a ECHO MEDI qua trang web https://echomedi.com, ho???c g???i s??? hotline 1900 638 408 n???u c???n h??? tr??? g???p</p>
              
              <p>C???m ??n b???n v?? ???? lu??n ch??m s??c cho s???c kh???e b???n th??n,</p>
              <p>ECHO MEDI </p>
          `;

          template = template.replaceAll("[NAME]", ctx.request.body.name);
          template = template.replaceAll("[OPTION]", ctx.request.body.option);
          template = template.replaceAll("[EMAIL_TITLE]", ctx.request.body.email_title);

        let info = await transporter.sendMail({
          from: '<noreply@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI - " + ctx.request.body.email_title, // Subject line
          text: "Xin ch??o", // plain text body
          html: template, // html body
        });

        ctx.send({ok: true});
      },

      async emailGift(ctx) {
        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "noreply@echomedi.com", // generated ethereal user
            pass: "1026Echomedi@123", // generated ethereal password
          },
        });

        let info = await transporter.sendMail({
          from: '<orders@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI - X??c Nh???n Thanh To??n - [M?? thanh to??n]", // Subject line
          text: "Xin ch??o", // plain text body
          html: `
            <p>Xin ch??o [T??n kh??ch h??ng]</p>
            
            <p>L???i ?????u ti??n, ECHO MEDI c???m ??n b???n v?? ???? c??ng ch??ng t??i quan t??m ch??m s??c s???c kh???e to??n di???n cho nh???ng ng?????i th????ng y??u.</p>
            <p>[Th??ng tin qu?? t???ng]            </p>
            <p>N???u b???n c?? nhu c???u t???ng th??m c??c g??i kh??m kh??c ho???c s??? d???ng c??c d???ch v??? c???a ECHO MEDI, b???n c?? th??? li??n h??? qua hotline ho???c email cho ECHO MEDI. Ch??ng t??i mong r???ng kh??ng ch??? b???n m?? c??? nh???ng ng?????i th??n y??u s??? lu??n c?? m???t cu???c s???ng tr???n v???n
            </p>
            <p>Th????ng g???i,            </p>
            <p>ECHO MEDI </p>
        `, // html body
        });

        ctx.send({ok: true});
      },

      async emailPayment(ctx) {
        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "inquiry@echomedi.com", // generated ethereal user
            pass: "1026Echomedi@123", // generated ethereal password
          },
        });

        let info = await transporter.sendMail({
          from: '<orders@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI - X??c Nh???n Thanh To??n - [M?? thanh to??n]", // Subject line
          text: "Xin ch??o", // plain text body
          html: `
            <p>Xin ch??o [T??n kh??ch h??ng]</p>
            
            <p>?????u ti??n, ECHO MEDI c???m ??n b???n v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i.  </p>
            <p>D?????i ????y l?? th??ng tin ????n h??ng b???n v???a thanh to??n qua website ECHO MEDI, b???n vui l??ng ki???m tra l???i c??c th??ng tin v?? li??n h??? ngay v???i ch??ng t??i n???u c?? b???t k??? ch???nh s???a n??o.</p>
            <p>[Th??ng tin ????n h??ng]</p>
            <p>N???u kh??ng c?? b???t k??? v???n ????? g??, ????n h??ng s??? ???????c ghi nh???n v?? chuy???n t???i c??c b?????c k??? ti???p</p>
            [B?????c k??? ti???p: li??n h??? kh??m, d???n d?? tr?????c kh??m, etc.]
            <p>Trong v??i ng??y t???i, ECHO MEDI s??? li??n h??? v???i b???n ????? l??n l???ch h???n kh??m/giao h??ng. B???n vui l??ng ????? ?? ??i???n tho???i/email/tin nh???n v?? ph???n h???i v???i ch??ng t??i n???u c?? th???c m???c ho???c v???n ????? ph??t sinh nh??            </p>
            <p>C???m ??n b???n v?? ???? quan t??m ?????n s???c kh???e c???a m??nh,</p>
            <p>ECHO MEDI </p>
        `, // html body
        });

        ctx.send({ok: true});
      },

      async subscribeInfo(ctx) { 

        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "noreply@echomedi.com", // generated ethereal user
            pass: "1026Echomedi@123", // generated ethereal password
          },
        });

        let template = `
        <p>Xin ch??o</p>
        
        <p>Ch??o m???ng ?????n v???i ECHO MEDI. C???m ??n b???n v?? ???? lu??n quan t??m ch??m s??c s???c kh???e b???n th??n, v?? h??n h???t v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i. </p>
        <p>B??y gi???, b???n c?? th??? xem th??m v??? c??c g??i s???n ph???m, d???ch v???, c???a ECHO MEDI qua website https://echomedi.com, v?? ch???n s???n ph???m ph?? h???p nh???t v???i nhu c???u hi???n t???i c???a b???n. Ch??ng t??i s??? lu??n gi??? b???n c???p nh???t v???i nh???ng th??ng tin ch??m s??c s???c kh???e hay ch????ng tr??nh v?? ??u ????i m???i, gi??p b???n lu??n ch??? ?????ng trong vi???c b???o v??? s???c kh???e to??n di???n.</p>
        <p>N???u c?? b???t k??? c??u h???i ho???c ?? ki???n n??o mu???n chia s??? v???i ECHO MEDI, ?????ng ng???n ng???i li??n h??? v???i ch??ng t??i qua hotline 1900 638 408 ho???c echomedi.com nh??</p>
        
        <p>R???t mong ???????c ?????ng h??nh c??ng b???n trong ch???ng ???????ng s???p t???i,</p>
        <p>ECHO MEDI </p>
    `;

        let info = await transporter.sendMail({
          from: '<noreply@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI- ????ng K?? Nh???n Th??ng Tin ", // Subject line
          text: "Xin ch??o", // plain text body
          html: template, // html body
        });

        ctx.send({ok: true});
      },
        async sendEmail(ctx) {
              const t = `<!DOCTYPE html>
              <html>
              <head>
              
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Email Confirmation</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css">
                /**
                 * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                 */
                @media screen {
                  @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                  }
              
                  @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                  }
                }
              
                /**
                 * Avoid browser level font resizing.
                 * 1. Windows Mobile
                 * 2. iOS / OSX
                 */
                body,
                table,
                td,
                a {
                  -ms-text-size-adjust: 100%; /* 1 */
                  -webkit-text-size-adjust: 100%; /* 2 */
                }
              
                /**
                 * Remove extra space added to tables and cells in Outlook.
                 */
                table,
                td {
                  mso-table-rspace: 0pt;
                  mso-table-lspace: 0pt;
                }
              
                /**
                 * Better fluid images in Internet Explorer.
                 */
                img {
                  -ms-interpolation-mode: bicubic;
                }
              
                /**
                 * Remove blue links for iOS devices.
                 */
                a[x-apple-data-detectors] {
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  color: inherit !important;
                  text-decoration: none !important;
                }
              
                /**
                 * Fix centering issues in Android 4.4.
                 */
                div[style*="margin: 16px 0;"] {
                  margin: 0 !important;
                }
              
                body {
                  width: 100% !important;
                  height: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
              
                /**
                 * Collapse table borders to avoid space between cells.
                 */
                table {
                  border-collapse: collapse !important;
                }
              
                a {
                  color: #1a82e2;
                }
              
                img {
                  height: auto;
                  line-height: 100%;
                  text-decoration: none;
                  border: 0;
                  outline: none;
                }
                </style>
              
              </head>
              <body style="background-color: #e9ecef;">
              
                <!-- start preheader -->
                <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                  A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
                </div>
                <!-- end preheader -->
              
                <!-- start body -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
              
                  <!-- start logo -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="center" valign="top" width="600">
                      <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                          <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="http://echomedi.me" target="_blank" style="display: inline-block;">
                              <img src="https://echomedi.com/wp-content/uploads/2022/08/cropped-LOGO-ECHOMEDI-01.png" alt="Logo" border="0" width="48" style="display: block; width: 200px;">
                            </a>
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                    </td>
                  </tr>
                  <!-- end logo -->
              
                  <!-- start hero -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="center" valign="top" width="600">
                      <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                          <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you</h1>
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                    </td>
                  </tr>
                  <!-- end hero -->
              
                  <!-- start copy block -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="center" valign="top" width="600">
                      <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              
                        <!-- start copy -->
                        <tr>
                          <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <p style="margin: 0;">We are delighted to tell you that you have now been our customer for a whole year! We would just like to say thank you for being a part of ECHO MEDI family. We are very grateful for your continued patronage because we wouldn???t be here without loyal customers like you. 
                            </p>
                          </td>
                        </tr>
                        <!-- end copy -->
              
                        <!-- start copy -->
                        <tr>
                          <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <p style="margin: 0;">Even better, we got to see your company grow and take home (insert the milestone/award, etc). We hope you progress even more in the years to come and we keep giving your support in achieving new heights.

                            Thank you again and have a great day!
                            
                            Yours truly,
                            
                            Your friends at ECHO MEDI</p>
                          </td>
                        </tr>
                        <!-- end copy -->
              
                        <!-- start copy -->
                        <tr>
                          <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                          </td>
                        </tr>
                        <!-- end copy -->
              
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                    </td>
                  </tr>
                  <!-- end copy block -->
              
                  <!-- start footer -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                      <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="center" valign="top" width="600">
                      <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              
                        <!-- start permission -->
                        <tr>
                          <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">
                            </p>
                            <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">ECHO MEDI'S LOCATIONS</p><p class="font-bold mt-4">Ho Chi Minh City</p><p> - District 7</p><p> + 1026 Nguyen Van Linh, Tan Phong Ward, District 7.</p><p> - District 2</p><p> + 46 Nguyen Thi Dinh, An Phu Ward, District 2.</p><p class="font-bold mt-4">Binh Duong</p><p> + Canary Plaza, 5 Binh Duong Highway, Thuan Giao, Thuan An City.</p></div>
                            <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">POLICY</p><p><a href="/en/services/chinh-sach-bao-mat">Privacy Policy</a></p><p class="font-bold"><a href="/en/contact">CONTACT</a></p><p>Hotline: 1900 638 408</p><p>Email: contact@echomedi.com</p><p class="font-bold mt-4">CLINIC HOURS</p><p>Monday - Saturday: 7:00 ??? 21:00</p><p>Sunday: 7:00 ??? 15:00</p></div>
                          </td>
                        </tr>
                        <!-- end permission -->
              
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                    </td>
                  </tr>
                  <!-- end footer -->
              
                </table>
                <!-- end body -->
              
              </body>
              </html>`;

              let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: "noreply@echomedi.com", // generated ethereal user
                  pass: "1026Echomedi@123", // generated ethereal password
                },
              });

              let info = await transporter.sendMail({
                from: '<noreply@echomedi.com>', // sender address
                to: "theodd1ou1@gmail.com", // list of receivers
                subject: "ECHO MEDI- ????ng K?? Nh???n Th??ng Tin ", // Subject line
                text: "Xin ch??o", // plain text body
                html: `
                  <p>Xin ch??o [T??n kh??ch h??ng]</p>
                  
                  <p>Ch??o m???ng [T??n kh??ch h??ng] ?????n v???i ECHO MEDI. C???m ??n b???n v?? ???? lu??n quan t??m ch??m s??c s???c kh???e b???n th??n, v?? h??n h???t v?? ???? tin g???i s???c kh???e to??n di???n cho ch??ng t??i. </p>
                  <p>B??y gi???, b???n c?? th??? xem th??m v??? c??c g??i s???n ph???m, d???ch v???, c???a ECHO MEDI qua website [link], v?? ch???n s???n ph???m ph?? h???p nh???t v???i nhu c???u hi???n t???i c???a b???n. Ch??ng t??i s??? lu??n gi??? b???n c???p nh???t v???i nh???ng th??ng tin ch??m s??c s???c kh???e hay ch????ng tr??nh v?? ??u ????i m???i, gi??p b???n lu??n ch??? ?????ng trong vi???c b???o v??? s???c kh???e to??n di???n.</p>
                  <p>N???u c?? b???t k??? c??u h???i ho???c ?? ki???n n??o mu???n chia s??? v???i ECHO MEDI, ?????ng ng???n ng???i li??n h??? v???i ch??ng t??i qua hotline 1900 638 408 ho???c echomedi.com nh??</p>
                  
                  <p>R???t mong ???????c ?????ng h??nh c??ng b???n trong ch???ng ???????ng s???p t???i,</p>
                  <p>ECHO MEDI </p>
              `, // html body
              });
            

              const emailTemplate = {
                subject: 'Welcome <%= user.firstname %>',
                text: `Welcome to mywebsite.fr!
                  Your account is now linked with: <%= user.email %>.`,
                html: t,
              };
              
              await strapi.plugins['email'].services.email.sendTemplatedEmail(
                {
                  to: 'llaugusty@gmail.com',
                  from: 'noreply@echomedi.me',
                },
                  emailTemplate,
                {
                  user: {},
                }
              );
        }
    }));
