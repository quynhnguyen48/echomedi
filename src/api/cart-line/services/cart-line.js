'use strict';

/**
 * cart-line service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cart-line.cart-line');
