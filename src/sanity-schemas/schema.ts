import client from './client';
import tag from './tag';
import project from './project';
import testimonial from './testimonial';

export const schemaTypes = [
  client,
  tag,
  project,
  testimonial
];

export default {
  types: schemaTypes
};
