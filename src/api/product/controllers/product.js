'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const puppeteer = require('puppeteer');
const fs = require('fs');
const { Blob } = require("buffer");

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
        },
        async generatePDF(ctx) {
            const browser = await puppeteer.launch({
                headless: true
            })

            // create a new page
            const page = await browser.newPage()

            // set your html as the pages content
            let html = fs.readFileSync(`${__dirname}/test.html`, 'utf8');

            html = html.replace("[DAN_TOC]", ctx.request.body.dan_toc);
            html = html.replace("[FULL_NAME]", ctx.request.body.full_name);
            html = html.replace("[MACH]", ctx.request.body.mach);
            html = html.replace("[NHIET_DO]", ctx.request.body.nhiet_do);
            html = html.replace("[HUYET_AP]", ctx.request.body.huyet_ap);
            html = html.replace("[NHIP_THO]", ctx.request.body.nhip_tho);
            html = html.replace("[CHIEU_CAO]", ctx.request.body.chieu_cao);
            html = html.replace("[CAN_NANG]", ctx.request.body.can_nang);
            html = html.replace("[BMI]", ctx.request.body.bmi);
            html = html.replace("[SPO2]", ctx.request.body.spo2);
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            })

            var a = await page.createPDFStream();

            ctx.send(a)
        },
        async generatePhieuCLS(ctx) {
            const browser = await puppeteer.launch({
                headless: true
            });

            const data = [{"id":385,"attributes":{"label":"Gonorrhea PCR (Xét nghiệm PCR chẩn đoán bệnh Lậu)","createdAt":"2022-12-24T09:18:42.169Z","updatedAt":"2022-12-24T09:18:42.169Z","publishedAt":"2022-12-24T09:18:42.167Z","code":"XNMD014","host":"Nam SG","price":280000,"group_service":"Xét nghiệm dịch tiết"}}];

            let order = await strapi
                .query('api::medical-record.medical-record')
                .findOne({where: {id: ctx.request.body.id}});

            let services = JSON.parse(order.services);
            // let bundle_services = JSON.parse(order.bundle_services);

            // create a new page
            const page = await browser.newPage();
            // set your html as the pages content
            let html = fs.readFileSync(`${__dirname}/test2.html`, 'utf8');

            // html = html.replace("[DAN_TOC]", ctx.request.body.dan_toc);
            // html = html.replace("[FULL_NAME]", ctx.request.body.full_name);
            // html = html.replace("[MACH]", ctx.request.body.mach);
            // html = html.replace("[NHIET_DO]", ctx.request.body.nhiet_do);
            // html = html.replace("[HUYET_AP]", ctx.request.body.huyet_ap);
            // html = html.replace("[NHIP_THO]", ctx.request.body.nhip_tho);
            // html = html.replace("[CHIEU_CAO]", ctx.request.body.chieu_cao);
            // html = html.replace("[CAN_NANG]", ctx.request.body.can_nang);
            // html = html.replace("[BMI]", ctx.request.body.bmi);
            // html = html.replace("[SPO2]", ctx.request.body.spo2);
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            });

            console.log('bundle_services', order.bundle_services)

            page.on('console', async (msg) => {
                const msgArgs = msg.args();
                for (let i = 0; i < msgArgs.length; ++i) {
                  console.log(await msgArgs[i].jsonValue());
                }
              });
              

            await page.evaluate((services, bs) => {
                let bundle_services = JSON.parse(bs);
                var a = document.getElementById('table');
                services.forEach(s => {
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.innerHTML = s.attributes.label;
                    var td2 = document.createElement("td");
                    td2.innerHTML = s.attributes.group_service;
                    var td3 = document.createElement("td");
                    td3.innerHTML = s.attributes.price;
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    a.append(tr);
                });
                bundle_services.forEach(b => {
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.innerHTML = b.attributes.label;
                    tr.append(td1);
                    a.append(tr);

                    var medical_services = b.attributes.medical_services;

                    medical_services.data.forEach(ms => {
                        var tr = document.createElement("tr");
                        var td1 = document.createElement("td");
                        td1.innerHTML = ms.attributes.label;
                        var td2 = document.createElement("td");
                        td2.innerHTML = ms.attributes.group_service;
                        var td3 = document.createElement("td");
                        td3.innerHTML = ms.attributes.price;
                        tr.append(td1);
                        tr.append(td2);
                        tr.append(td3);
                        a.append(tr);
                    })
                })
            }, services, order.bundle_services.toString());

            var a = await page.createPDFStream();

            ctx.send(a)
        }
    }));
