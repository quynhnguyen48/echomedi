'use strict';

/**
 * medical-service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::medical-service.medical-service');
