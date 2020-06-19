/**
 * VIRTUAL DOM - Functions and classes related to virtual dom
 */

class VirtualNode {
  /**
   * Contructor for the virtual node
   * @param {String} type
   * @param {Object} properties
   * @param {Array} children
   */
  constructor(type, attributes, children) {
    this.type = type;
    this.attributes = attributes;
    this.children = children;
  }
}

/**
 *
 * @param {String} type
 * @param {Object} properties
 * @param {Array} children
 */
export function createElement(type, attributes, ...children) {
  return new VirtualNode(type, attributes, children);
}
