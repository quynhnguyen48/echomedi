'use strict';

/**
 * medical-record service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::medical-record.medical-record');
