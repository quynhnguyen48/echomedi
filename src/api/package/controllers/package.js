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
                          <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">POLICY</p><p><a href="/en/services/chinh-sach-bao-mat">Privacy Policy</a></p><p class="font-bold"><a href="/en/contact">CONTACT</a></p><p>Hotline: 1900 638 408</p><p>Email: contact@echomedi.com</p><p class="font-bold mt-4">CLINIC HOURS</p><p>Monday - Saturday: 7:00 – 21:00</p><p>Sunday: 7:00 – 15:00</p></div>
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
            to: 'contact@echomedi.com', // list of receivers
            subject: "ECHO MEDI", // Subject line
            text: "Xin chào", // plain text body
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

        let info = await transporter.sendMail({
          from: '<noreply@echomedi.com>', // sender address
          to: 'inquiry@echomedi.com', // list of receivers
          subject: "ECHO MEDI - Thông Tin Gói Thành Viên", // Subject line
          text: "Xin chào", // plain text body
          html: `
            <p>Xin chào [Tên khách hàng]</p>
            
            <p>Chào mừng [Tên khách hàng] đến với ECHO MEDI. Cảm ơn bạn vì đã luôn quan tâm chăm sóc sức khỏe bản thân, và hơn hết vì đã tin gửi sức khỏe toàn diện cho chúng tôi. </p>
            <p>ECHO MEDI vừa nhận được lời nhắn của bạn qua trang web về gói thành viên [xxx]. Bộ phận chuyên môn của chúng tôi sẽ nhanh chóng liên lạc và giải quyết thắc mắc của bạn trong thời gian ngắn nhất.</p>
            <p>Trong lúc đó, bạn có thể xem thêm một số sản phẩm khác của ECHO MEDI qua trang web [xxx], hoặc gọi số hotline [xxx] nếu cần hỗ trợ gấp</p>
            
            <p>Cảm ơn bạn vì đã luôn chăm sóc cho sức khỏe bản thân,</p>
            <p>ECHO MEDI </p>
        `, // html body
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
          subject: "ECHO MEDI - Xác Nhận Thanh Toán - [Mã thanh toán]", // Subject line
          text: "Xin chào", // plain text body
          html: `
            <p>Xin chào [Tên khách hàng]</p>
            
            <p>Lời đầu tiên, ECHO MEDI cảm ơn bạn vì đã cùng chúng tôi quan tâm chăm sóc sức khỏe toàn diện cho những người thương yêu.</p>
            <p>[Thông tin quà tặng]            </p>
            <p>Nếu bạn có nhu cầu tặng thêm các gói khám khác hoặc sử dụng các dịch vụ của ECHO MEDI, bạn có thể liên hệ qua hotline hoặc email cho ECHO MEDI. Chúng tôi mong rằng không chỉ bạn mà cả những người thân yêu sẽ luôn có một cuộc sống trọn vẹn
            </p>
            <p>Thương gửi,            </p>
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
          subject: "ECHO MEDI - Xác Nhận Thanh Toán - [Mã thanh toán]", // Subject line
          text: "Xin chào", // plain text body
          html: `
            <p>Xin chào [Tên khách hàng]</p>
            
            <p>Đầu tiên, ECHO MEDI cảm ơn bạn vì đã tin gửi sức khỏe toàn diện cho chúng tôi.  </p>
            <p>Dưới đây là thông tin đơn hàng bạn vừa thanh toán qua website ECHO MEDI, bạn vui lòng kiểm tra lại các thông tin và liên hệ ngay với chúng tôi nếu có bất kỳ chỉnh sửa nào.</p>
            <p>[Thông tin đơn hàng]</p>
            <p>Nếu không có bất kỳ vấn đề gì, đơn hàng sẽ được ghi nhận và chuyển tới các bước kế tiếp</p>
            [Bước kế tiếp: liên hệ khám, dặn dò trước khám, etc.]
            <p>Trong vài ngày tới, ECHO MEDI sẽ liên hệ với bạn để lên lịch hẹn khám/giao hàng. Bạn vui lòng để ý điện thoại/email/tin nhắn và phản hồi với chúng tôi nếu có thắc mắc hoặc vấn đề phát sinh nhé            </p>
            <p>Cảm ơn bạn vì đã quan tâm đến sức khỏe của mình,</p>
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

        let info = await transporter.sendMail({
          from: '<noreply@echomedi.com>', // sender address
          to: ctx.request.body.email, // list of receivers
          subject: "ECHO MEDI- Đăng Ký Nhận Thông Tin ", // Subject line
          text: "Xin chào", // plain text body
          html: `
            <p>Xin chào [Tên khách hàng]</p>
            
            <p>Chào mừng [Tên khách hàng] đến với ECHO MEDI. Cảm ơn bạn vì đã luôn quan tâm chăm sóc sức khỏe bản thân, và hơn hết vì đã tin gửi sức khỏe toàn diện cho chúng tôi. </p>
            <p>Bây giờ, bạn có thể xem thêm về các gói sản phẩm, dịch vụ, của ECHO MEDI qua website [link], và chọn sản phẩm phù hợp nhất với nhu cầu hiện tại của bạn. Chúng tôi sẽ luôn giữ bạn cập nhật với những thông tin chăm sóc sức khỏe hay chương trình và ưu đãi mới, giúp bạn luôn chủ động trong việc bảo vệ sức khỏe toàn diện.</p>
            <p>Nếu có bất kỳ câu hỏi hoặc ý kiến nào muốn chia sẻ với ECHO MEDI, đừng ngần ngại liên hệ với chúng tôi qua hotline 1900 638 408 hoặc echomedi.com nhé</p>
            
            <p>Rất mong được đồng hành cùng bạn trong chặng đường sắp tới,</p>
            <p>ECHO MEDI </p>
        `, // html body
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
                            <p style="margin: 0;">We are delighted to tell you that you have now been our customer for a whole year! We would just like to say thank you for being a part of ECHO MEDI family. We are very grateful for your continued patronage because we wouldn’t be here without loyal customers like you. 
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
                            <div class="w-full h-full col-span-2 md:col-span-1 row-span-2"><p class="font-bold">POLICY</p><p><a href="/en/services/chinh-sach-bao-mat">Privacy Policy</a></p><p class="font-bold"><a href="/en/contact">CONTACT</a></p><p>Hotline: 1900 638 408</p><p>Email: contact@echomedi.com</p><p class="font-bold mt-4">CLINIC HOURS</p><p>Monday - Saturday: 7:00 – 21:00</p><p>Sunday: 7:00 – 15:00</p></div>
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
                subject: "ECHO MEDI- Đăng Ký Nhận Thông Tin ", // Subject line
                text: "Xin chào", // plain text body
                html: `
                  <p>Xin chào [Tên khách hàng]</p>
                  
                  <p>Chào mừng [Tên khách hàng] đến với ECHO MEDI. Cảm ơn bạn vì đã luôn quan tâm chăm sóc sức khỏe bản thân, và hơn hết vì đã tin gửi sức khỏe toàn diện cho chúng tôi. </p>
                  <p>Bây giờ, bạn có thể xem thêm về các gói sản phẩm, dịch vụ, của ECHO MEDI qua website [link], và chọn sản phẩm phù hợp nhất với nhu cầu hiện tại của bạn. Chúng tôi sẽ luôn giữ bạn cập nhật với những thông tin chăm sóc sức khỏe hay chương trình và ưu đãi mới, giúp bạn luôn chủ động trong việc bảo vệ sức khỏe toàn diện.</p>
                  <p>Nếu có bất kỳ câu hỏi hoặc ý kiến nào muốn chia sẻ với ECHO MEDI, đừng ngần ngại liên hệ với chúng tôi qua hotline 1900 638 408 hoặc echomedi.com nhé</p>
                  
                  <p>Rất mong được đồng hành cùng bạn trong chặng đường sắp tới,</p>
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
