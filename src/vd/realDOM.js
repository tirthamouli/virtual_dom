/**
 * REAL DOM - RealDOM functions and class
 * Author - Tirthamouli Baidya
 */
import { isFunction } from '../helpers/helpers';

/**
 * Create a real DOM node from the virtual node
 * @param {Object} node
 */
export function createElement(node) {
  // Check if we are rendering a component
  if (isFunction(node)) {
    node = new node();
  }

  // Step 1: Check if we are supposed to create a
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  // Step 2: Default return
  let $el = null;

  // Step 2: Create the element
  const { type, attributes, children } = node;

  // Step 3: Check if type exists and create the element
  if (!type) {
    return $el;
  }
  $el = document.createElement(type);

  // Step 4: Apply all the attributes
  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach((key) => {
      if (key === 'className') {
        $el.class = attributes[key];
      } else {
        $el[key] = attributes[key];
      }
    });
  }

  // Step 5: Create the children
  children.forEach((child) => {
    // Add the parent
    if (typeof child === 'object') {
      child.$parent = $el;
    }

    // Create the child
    $el.appendChild(createElement(child));
  });

  // Step 6: Attach the el to the object
  node.$el = $el;

  // Step 7: Return the dom
  return $el;
}

/**
 * Render the element in the root
 * @param {Object} root
 * @param {Object} node
 */
export function render(root, node) {
  // Step 1: Create the element
  const $child = createElement(node);

  // Step 2: Render to the dom
  root.appendChild($child);
}
