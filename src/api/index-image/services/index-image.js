'use strict';

/**
 * index-image service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::index-image.index-image');
