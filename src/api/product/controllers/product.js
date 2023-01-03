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
        async addServiceToCart(ctx) {
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
                .create({ data: { service: ctx.request.body.service_id, cart: cart.id, publishedAt: new Date().toISOString() } });

            ctx.send({ cart_id: cart.id });
        },
        async getCart(ctx) {
            const { user } = ctx.state;
            let cart = await strapi
                .query('api::cart.cart')
                .findOne({
                    where: { users_permissions_user: user.id }});

            if (!cart) {
                cart = await strapi
                    .query('api::cart.cart')
                    .create({ data: { users_permissions_user: user.id, publishedAt: new Date().toISOString() } });
            }

            const us = await strapi
                .query('api::cart.cart')
                .findOne({
                    where: { users_permissions_user: user.id }, 
                    populate: {
                        users_permissions_user: true,
                        cart_lines: {
                            populate: {
                                product: {
                                    populate: {
                                        image: true,
                                    }
                                },
                                service: {
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
                headless: true,
            })

            // create a new page
            const page = await browser.newPage()

            // set your html as the pages content
            let html = fs.readFileSync(`${__dirname}/test3.html`, 'utf8');

            html = html.replace("[DAN_TOC]", ctx.request.body.dan_toc);
            html = html.replace("[GIOI_TINH]", ctx.request.body.gender == "male" ? "Nam" : "Nữ");
            html = html.replace("[FULL_NAME]", ctx.request.body.full_name);
            html = html.replace("[MACH]", ctx.request.body.circuit);
            html = html.replace("[NHIET_DO]", ctx.request.body.temperature);
            html = html.replace("[HUYET_AP]", ctx.request.body.blood_pressure);
            html = html.replace("[HUYET_AP2]", ctx.request.body.blood_pressure);
            html = html.replace("[NHIP_THO]", ctx.request.body.respiratory_rate);
            html = html.replace("[CHIEU_CAO]", ctx.request.body.height);
            html = html.replace("[CAN_NANG]", ctx.request.body.weight);
            html = html.replace("[BMI]", ctx.request.body.bmi);
            html = html.replace("[SPO2]", ctx.request.body.spo2);
            html = html.replace("[TINH_THANH]", ctx.request.body.province);
            html = html.replace("[QUAN_HUYEN]", ctx.request.body.district);
            html = html.replace("[XA_PHUONG]", ctx.request.body.ward);
            html = html.replace("[SDT]", ctx.request.body.phone);
            html = html.replace("[ADDRESS]", ctx.request.body.address);
            html = html.replace("[QUOC_GIA]", ctx.request.body.quoc_gia);
            html = html.replace("[NGAY_SINH]", ctx.request.body.ngay_sinh);
            html = html.replace("[QUOC_TICH]", ctx.request.body.quoc_tich);
            html = html.replace("[NGHE_NGHIEP]", ctx.request.body.nghe_nghiep);
            html = html.replace("[DIA_CHI]", ctx.request.body.address);
            html = html.replace("[EMAIL]", ctx.request.body.email);
            html = html.replace("[LY_DO_VAO_VIEN]", ctx.request.body.ly_do_vao_vien);
            html = html.replace("[HOI_BENH]", ctx.request.body.hoi_benh);
            html = html.replace("[KHAM_BENH]", ctx.request.body.kham_benh);
            html = html.replace("[CHAN_DOAN]", ctx.request.body.chan_doan);
            html = html.replace("[HUONG_DIEU_TRI]", ctx.request.body.huong_dieu_tri);


            await page.setContent(html, {
                waitUntil: 'networkidle0'
            })

            var a = await page.createPDFStream({ printBackground: true, width: "1118px", height: "1685px" });

            ctx.send(a);
            a.on('close', async () => {
                try {
                    console.log('end')
                    await page.close();
                    console.log('end1')
                    await browser.close();
                    console.log('end2')
                } catch (e) {

                }
            });
        },
        async generatePhieuCLS(ctx) {
            const browser = await puppeteer.launch({
                headless: true
            });

            let order = await strapi
                .query('api::medical-record.medical-record')
                .findOne({ where: { id: ctx.request.body.id } });

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
                waitUntil: 'domcontentloaded'
            });

            // console.log('bundle_services', order.bundle_services)

            page.on('console', async (msg) => {
                const msgArgs = msg.args();
                for (let i = 0; i < msgArgs.length; ++i) {
                    console.log(await msgArgs[i].jsonValue());
                }
            });


            await page.evaluate((services, bs) => {
                function numberWithCommas(x) {
                    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
  
                
                let total = 0;
                let cnt = 0;
                let tableContainer = document.getElementById('table-container');
                let bundle_services = JSON.parse(bs);
                var a = document.getElementById('table');
                services.forEach(s => {
                    cnt++;
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    if (cnt % 50 == 0) {
                        td1.className = "p-150";
                    }
                    td1.innerHTML = s.attributes.label;
                    var td2 = document.createElement("td");
                    td2.innerHTML = s.attributes.group_service;
                    var td3 = document.createElement("td");
                    td3.classList.add("price");
                    td3.innerHTML = numberWithCommas(s.attributes.price);
                    total += s.attributes.price;
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    if (cnt % 50 == 0) {
                        tr.className = "page-break-after-el";
                    }
                    a.append(tr);
                });
                bundle_services.forEach(b => {
                    cnt++;
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.innerHTML = b.attributes.label;
                    td1.className = "bold";
                    if (cnt % 50 == 0) {
                        td1.classList.add("p-150");
                    }
                    tr.append(td1);
                    var td2 = document.createElement("td");
                    td2.innerHTML = "";
                    tr.append(td2);
                    var td3 = document.createElement("td");
                    td3.innerHTML = numberWithCommas(b.attributes.price);
                    td3.classList.add('price');
                    total += b.attributes.price;
                    tr.append(td3);
                    if (cnt % 50 == 0) tr.className = "page-break-after-el";
                    a.append(tr);

                    var medical_services = b.attributes.medical_services;

                    medical_services.data.forEach(ms => {
                        cnt++;
                        var tr = document.createElement("tr");
                        var td1 = document.createElement("td");
                        td1.innerHTML = ms.attributes.label;
                        if (cnt % 50 == 0) {
                            td1.classList.add("p-150");
                        }
                        var td2 = document.createElement("td");
                        td2.innerHTML = ms.attributes.group_service;
                        var td3 = document.createElement("td");
                        td3.innerHTML = "";
                        tr.append(td1);
                        tr.append(td2);
                        tr.append(td3);
                        if (cnt % 50 == 0) tr.className = "page-break-after-el";
                        a.append(tr);
                    })
                })
                var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.innerHTML = "";
                    tr.append(td1);
                    var td2 = document.createElement("td");
                    td2.innerHTML = "";
                    tr.append(td2);
                    var td3 = document.createElement("td");
                    td3.innerHTML = numberWithCommas(total);
                    td3.className = "bold price";
                    tr.append(td3);
                    cnt ++;
                    if (cnt % 50 == 0) tr.className = "page-break-after-el";
                    a.append(tr);
            }, services, order.bundle_services.toString());

            var a = await page.createPDFStream({ printBackground: true, width: "1118px", height: "1685px" });

            ctx.send(a);
            a.on('close', async () => {
                try {
                    console.log('end')
                    await page.close();
                    console.log('end1')
                    await browser.close();
                    console.log('end2')
                } catch (e) {

                }
            });
        },
        async generatePhieuChiDinh(ctx) {
            const browser = await puppeteer.launch({
                headless: true
            });

            const data = [{ "id": 385, "attributes": { "label": "Gonorrhea PCR (Xét nghiệm PCR chẩn đoán bệnh Lậu)", "createdAt": "2022-12-24T09:18:42.169Z", "updatedAt": "2022-12-24T09:18:42.169Z", "publishedAt": "2022-12-24T09:18:42.167Z", "code": "XNMD014", "host": "Nam SG", "price": 280000, "group_service": "Xét nghiệm dịch tiết" } }];

            let order = await strapi
                .query('api::medical-record.medical-record')
                .findOne({ where: { id: ctx.request.body.id } });

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

            let bundle_services = JSON.parse(order.bundle_services);
            bundle_services.forEach(b => {
                b.attributes.medical_services.data.forEach(ms => {
                    ms.attributes.combo = b.attributes.label;
                    services.push(ms);
                })
            })
            console.log('bundle_services', services);

            const groupByCategory = services.reduce((group, product) => {
                const { host } = product.attributes;
                group[host] = group[host] ?? [];
                group[host].push(product);
                return group;
            }, {});

            console.log('groupByCategory', groupByCategory)


            page.on('console', async (msg) => {
                const msgArgs = msg.args();
                for (let i = 0; i < msgArgs.length; ++i) {
                    console.log(await msgArgs[i].jsonValue());
                }
            });


            await page.evaluate((groupByCategory, bs) => {
                let tableContainer = document.getElementById('table-container');
                var a = document.getElementById('table');
                Object.entries(groupByCategory).forEach(entry => {
                    const [key, value] = entry;
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.className = "bold";
                    td1.innerHTML = key;
                    tr.append(td1);
                    a.prepend(tr);

                    value.forEach(s => {
                        var tr = document.createElement("tr");
                        var td1 = document.createElement("td");
                        td1.innerHTML = s.attributes.label;
                        var td2 = document.createElement("td");
                        td2.innerHTML = s.attributes.group_service;
                        var td3 = document.createElement("td");
                        td3.innerHTML = "";
                        tr.append(td1);
                        tr.append(td2);
                        tr.append(td3);
                        a.append(tr);
                    });

                    var b = a.cloneNode();
                    tableContainer.append(b);
                    a = b;
                });
            }, groupByCategory);

            var a = await page.createPDFStream({ printBackground: true, width: "1118px", height: "1685px" });
            ctx.send(a);
            a.on('close', async () => {
                try {
                    console.log('end')
                    await page.close();
                    console.log('end1')
                    await browser.close();
                    console.log('end2')
                } catch (e) {

                }
            });
        }
    }));