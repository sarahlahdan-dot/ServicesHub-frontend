/**
 * Safely extracts a string ID from either a populated Mongoose document
 * (an object with `_id`) or a raw string reference.
 */
export function getEntityId(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
}

export function getUserDisplayName(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || value.username || value.email || '';
}
