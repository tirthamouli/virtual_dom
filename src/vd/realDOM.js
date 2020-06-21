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
  if (oldDOM.type === 'text' || newDOM.text === 'text') {
    // Check if text value is the same
    if (oldDOM.type === 'text' && newDOM.type === 'text' && oldDOM.value === newDOM.value) {
      return false;
    }
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
      $el.class = attributes[key];
    } else if (key !== 'key') {
      $el[key] = attributes[key];
    }
  });
}

/**
 * Update the attributes of the new root element
 * @param {*} oldDOM
 * @param {*} newDOM
 */
function updateAttributes({ attributes: oldAttr, $el }, { attributes: newAttr }) {
  // Step 1: Check if all attributes needs to be removed
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
    } else if (newAttrCopy[key] !== oldAttr[key]
      || $el.getAttribute(key === 'className' ? 'class' : key) !== newAttrCopy[key]) { // Step 3.2 Key present but requires updating
      if (key === 'className') {
        $el.setAttribute('class', newAttrCopy[key]);
      } else if (key !== 'key') {
        $el[key] = newAttrCopy[key];
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
 * Add all the children
 * @param {*} children
 * @param {*} $el
 */
function addAllChildren(children, $el) {
  // Step 1: Add children
  children.forEach((child) => {
    // Add the parent
    if (typeof child === 'object') {
      child.$parent = $el;
    }

    // Create the child
    $el.appendChild(createElement(child));
  });
}

/**
 * Remove the un-necessary keyed elements
 * @param {*} oldChildren
 * @param {*} newChildren
 * @param {*} $el
 */
function removeKeyedChildren(oldChildrenKey, oldChildren, newChildrenKey, $el) {
  // Step 1: Calculate
  let deleted = 0;
  Object.keys(oldChildrenKey).forEach((key) => {
    if (!checkIfOwnProperty(newChildrenKey, key)) {
      const $child = oldChildrenKey[key].element.$el;
      $el.removeChild($child);
    }
    oldChildren.splice(oldChildrenKey[key].index - deleted);
    deleted += 1;
  });
}

/**
 * Insert at certain index
 * @param {*} $el
 * @param {*} $parent
 * @param {*} index
 */
function insertAtIndex($el, $parent, index) {
  if (index >= $parent.children.length) {
    $parent.appendChild($el);
  } else if ($parent.children[index] !== $el) {
    $parent.insertBefore($el, $parent.children[index]);
  }
}

/**
 * Update the remaining children
 * @param {*} oldChildren
 * @param {*} oldChildrenKey
 * @param {*} newChildren
 * @param {*} newChildrenKey
 * @param {*} $el
 */
function updateRemainingChildren(oldChildren, oldChildrenKey, newChildren, $el) {
  let i = 0;
  let j = 0;

  // Update elements
  while (i < newChildren.length) {
    // Step 1: Get the cur new child
    const curNewChild = newChildren[i];
    const curOldChild = j >= oldChildren.length ? null : oldChildren[j];

    // Step 2: Update the child
    if (curNewChild.type === 'text' && curOldChild.type === 'text') {
      update(curOldChild, curNewChild);
      j += 1;
    } else if (checkIfOwnProperty(curNewChild, 'key') && checkIfOwnProperty(oldChildrenKey, curNewChild.key)) { // Step 3: Check if keyed
      const $curChild = oldChildrenKey[curNewChild.key].element.$el;
      update(oldChildrenKey[curNewChild.key].element, curNewChild);
      insertAtIndex($curChild, $el, i);
    } else if (checkIfOwnProperty(curNewChild, 'key') && !checkIfOwnProperty(oldChildrenKey, curNewChild.key)) {
      const $newChild = createElement(curNewChild);
      insertAtIndex($newChild, $el, i);
    } else if (curNewChild && curOldChild) { // Step 4: Comparing remaining elements
      update(curOldChild, curNewChild);
      insertAtIndex(curNewChild.$el, $el, i);
      j += 1;
    } else if (!curOldChild) {
      const $newChild = createElement(curNewChild);
      insertAtIndex($newChild, $el, i);
    }

    // Step 3: Update i
    i += 1;
  }

  // Remove remaining elements
  while (j < oldChildren.length) {
    $el.removeChild(oldChildren[i].$el);
  }
}

/**
 * Update the children
 * @param {*} oldDOM
 * @param {*} newDOM
 */
function updateChildren({ children: oldChildren, childrenKey: oldChildrenKey, $el },
  { children: newChildren, childrenKey: newChildrenKey }) {
  // Step 1: Check if all children needs to be removed
  if (oldChildren.length > 0 && newChildren.length === 0) {
    // Step 1.1: Empty the inner html
    $el.innerHTML = '';
    return null;
  }

  // Step 2: Check if all the children needs to be added
  if (oldChildren.length === 0 && newChildren.length > 0) {
    return addAllChildren(newChildren, $el);
  }

  // Step 3: Remove the keyed elements which are not required
  removeKeyedChildren(oldChildrenKey, oldChildren, newChildrenKey, $el);

  // Step 4: Update the remaining DOM elements
  return updateRemainingChildren(oldChildren, oldChildrenKey, newChildren, $el);
}

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
  if (node.type === 'text') {
    const $curChild = document.createTextNode(node.value);
    node.$el = $curChild;
    return $curChild;
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
  addAllChildren(children, $el);

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
  // Step 1: Update the el
  newDOM.$el = oldDOM.$el;

  // Step 2: Check if the element itself has changed
  if (checkElementHasChanged(oldDOM, newDOM)) {
    return oldDOM.$el.parentNode.replaceChild(createElement(newDOM), oldDOM.$el);
  }

  // Step 3: Check if both are text
  if (oldDOM.type === 'text' && newDOM.type === 'text') {
    return null;
  }

  // Step 4: Check if attributes need update
  updateAttributes(oldDOM, newDOM);

  // Step 5: Update children
  return updateChildren(oldDOM, newDOM);
}
