'use strict';

/**
 * sub-package router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sub-package.sub-package');
