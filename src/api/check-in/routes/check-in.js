'use strict';

/**
 * check-in router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::check-in.check-in');
