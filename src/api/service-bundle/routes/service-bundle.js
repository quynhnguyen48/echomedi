'use strict';

/**
 * service-bundle router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::service-bundle.service-bundle');
