/**
 * REAL DOM - RealDOM functions and class
 * Author - Tirthamouli Baidya
 */
import { isFunction, checkIfOwnProperty } from '../helpers/helpers';

/**
 * Check if the element itself has changed
 * @param {*} oldDOM
 * @param {*} newDOM
 */
function checkElementHasChanged(oldDOM, newDOM) {
  // Step 1: Check if either changed from or to string
  if (typeof oldDOM === 'string' || typeof newDOM === 'string') {
    return true;
  }

  // Step 2: Check if the element has changed
  if (oldDOM.type !== newDOM.type) {
    return true;
  }

  // Step 3: Default return
  return false;
}

/**
 * Remove attribute from elements
 * @param {*} attributes
 * @param {*} $el
 */
function removeAttributes(attributes, $el) {
  Object.key(attributes).forEach((key) => {
    if (key === 'className') {
      $el.removeAttribute('class');
    } else if (key !== 'key') {
      $el.removeAttribute(key);
    }
  });
}

/**
 * Add attributes
 * @param {*} attributes
 * @param {*} $el
 */
function addAttributes(attributes, $el) {
  Object.keys(attributes).forEach((key) => {
    if (key === 'className') {
      $el.setAttribute('class', attributes[key]);
    } else if (key !== 'key') {
      $el.setAttribute(key, attributes[key]);
    }
  });
}

/**
 * Update the attributes of the new root element
 * @param {*} oldDOM
 * @param {*} newDOM
 */
function updateAttributes({ attributes: oldAttr, $el }, { attributes: newAttr }) {
  // Step 1: Check if both all attributes needs to be removed
  if (oldAttr && !newAttr) {
    return removeAttributes(oldAttr, $el);
  }

  // Step 2: Check if all attributes needs to be added
  if (newAttr && !oldAttr) {
    return addAttributes(newAttr, $el);
  }

  // Step 3: Remove and update
  const newAttrCopy = { ...newAttr };
  Object.keys(oldAttr).forEach((key) => {
    // Step 3.1: Key not present in the new one
    if (!checkIfOwnProperty(newAttrCopy, key)) {
      if (key === 'className') {
        $el.removeAttribute('class');
      } else if (key !== 'key') {
        $el.removeAttribute(key);
      }
    } else if (newAttrCopy[key] !== oldAttr[key]) { // Step 3.2 Key present but requires updating
      if (key === 'className') {
        $el.setAttribute('class', newAttrCopy[key]);
      } else if (key !== 'key') {
        $el.removeAttribute(key, newAttrCopy[key]);
      }
      delete newAttrCopy[key];
    } else if (newAttrCopy[key] === oldAttr[key]) {
      delete newAttrCopy[key];
    }
  });

  // Step 4: Add the remaining attributes
  return addAttributes(newAttrCopy, $el);
}

/**
 * Update the children
 * @param {*} oldDOM
 * @param {*} newDOM
 */
function updateChildren(oldDOM, newDOM) {}

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
  const {
    type, attributes, listeners, children,
  } = node;

  // Step 3: Check if type exists and create the element
  if (!type) {
    return $el;
  }

  // Step 4: Create the element
  $el = document.createElement(type);

  // Step 5: Apply all the attributes
  if (attributes && typeof attributes === 'object') {
    addAttributes(attributes, $el);
  }

  // Step 6: Apply all the listeners
  if (listeners && typeof listeners === 'object') {
    Object.keys(listeners).forEach((key) => {
      // Check if the listener is a function
      if (!isFunction(listeners[key])) {
        return;
      }
      // Add the listener
      $el.addEventListener(key, listeners[key]);
    });
  }

  // Step 7: Create the children
  children.forEach((child) => {
    // Add the parent
    if (typeof child === 'object') {
      child.$parent = $el;
    }

    // Create the child
    $el.appendChild(createElement(child));
  });

  // Step 8: Attach the el to the object
  node.$el = $el;

  // Step 9: Return the dom
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

/**
 * Update the old dom with the new dom
 * @param {Object} oldDOM
 * @param {Object} newDOM
 */
export function update(oldDOM, newDOM) {
  // Step 1: Check if the element itself has changed
  if (checkElementHasChanged(oldDOM, newDOM)) {
    return oldDOM.$el.parentNode.replaceChild(createElement(newDOM), oldDOM.$el);
  }

  // Step 2: Update the el
  newDOM.$el = oldDOM.$el;

  // Step 3: Check if attributes need update
  updateAttributes(oldDOM, newDOM);

  // Step 4: Update children
  updateChildren(oldDOM, newDOM);
}
