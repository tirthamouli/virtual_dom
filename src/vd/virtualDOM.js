/**
 * VIRTUAL DOM - Functions and classes related to virtual dom
 */
import { checkIfOwnProperty } from '../helpers/helpers';

class VirtualNode {
  /**
   * Contructor for the virtual node
   * @param {String} type
   * @param {Object} properties
   * @param {Array} children
   */
  constructor(type, attributes, listeners, children) {
    // Step 1: Add the type
    this.type = type;

    // Step 2: Add the attributes
    this.attributes = attributes;

    // Step 3: Add key
    if (attributes && typeof attributes === 'object' && checkIfOwnProperty(attributes, 'key')) {
      this.key = attributes.key;
    }

    // Step 3: Add the listeners
    this.listeners = listeners;

    // Step 4: Add the children
    this.children = children.map((child) => {
      if (typeof child === 'string') {
        return {
          type: 'text',
          value: child,
          attributes: {},
          children: [],
        };
      }
      return child;
    });

    // Step 5: Add the children key order
    this.childrenKey = {};
    if (this.children && this.children.length > 0) {
      this.children.forEach((child, index) => {
        if (checkIfOwnProperty(child, 'key')) {
          this.childrenKey[child.key] = { element: child, index };
        }
      });
    }
  }
}

/**
 * Create a node
 * @param {String | Function} type
 * @param {Object} properties
 * @param {Array} children
 */
export function createElement(type, attributes, listeners, ...children) {
  if (typeof type === 'string') {
    return new VirtualNode(type,
      attributes === null ? {} : attributes, listeners, children);
  }
  return new type(attributes);
}
