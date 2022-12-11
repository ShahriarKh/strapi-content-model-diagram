import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

export async function getEntitiesRelationData() {
  return await request(`/${pluginId}/er-data`);
}