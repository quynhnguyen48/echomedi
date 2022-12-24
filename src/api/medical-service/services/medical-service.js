'use strict';

/**
 * medical-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::medical-service.medical-service');
