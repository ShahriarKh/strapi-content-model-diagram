'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('content-model-diagram')
      .service('myService')
      .getWelcomeMessage();
  },
});
