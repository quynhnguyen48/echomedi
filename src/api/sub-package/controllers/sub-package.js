'use strict';

/**
 * sub-package controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sub-package.sub-package');
