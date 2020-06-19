/**
 * Check if object has the prop
 * @param {Object} obj
 * @param {String} prop
 */
export function checkIfOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Checks if object is a function
 * @param {Object} obj
 */
export function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}
