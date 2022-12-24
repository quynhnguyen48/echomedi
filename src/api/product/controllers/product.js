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
            await page.setContent(html, {
                waitUntil: 'domcontentloaded'
            })


            // // or a .pdf file
            // await page.pdf({
            //     path: `/Users/quynhnguyen/Documents/my-fance-invoice.pdf`
            // });

            var a = await page.createPDFStream();

            // // close the browser
            // await browser.close();

            ctx.send(a)
        }
    }));
