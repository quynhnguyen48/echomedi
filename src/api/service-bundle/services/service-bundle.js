'use strict';

/**
 * service-bundle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service-bundle.service-bundle');
