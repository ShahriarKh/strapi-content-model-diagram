"use strict";

/**
 * content-model-diagram.js controller
 *
 * @description: A set of functions called "actions" of the `content-model-diagram` plugin.
 */

module.exports = {
  getEntitiesRelationData: async (ctx) => {
    const { models } = strapi.db.config;
    const exclude = strapi.config.get('plugin.content-model-diagram.exclude')

    return models.filter(model => !exclude.includes(model.uid)).map((m) => ({
      name: m.tableName,
      attributes: m.attributes,
      key: m.uid,
      modelType: m.modelType,
      kind: m.kind,
    }));
  },
};