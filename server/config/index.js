"use strict";

module.exports = {
  default: {
    exclude: [
      "strapi::core-store",
      "webhook",
      "admin::permission",
      "admin::user",
      "admin::role",
      "admin::api-token",
      "admin::api-token-permission",
      "plugin::upload.file",
      "plugin::upload.folder",
      "plugin::users-permissions.user",
      "plugin::users-permissions.permission",
      "plugin::users-permissions.role",
      "plugin::i18n.locale"
    ],
  },
  validator() {},
};
