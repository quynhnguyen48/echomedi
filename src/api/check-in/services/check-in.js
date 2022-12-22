'use strict';

/**
 * check-in service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::check-in.check-in');
