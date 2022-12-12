'use strict';

/**
 * sub-package service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sub-package.sub-package');
