/**
 * Add the classes to the class list
 * @param {Object} classObj
 */
function setClass(classObj) {
  // Step 1.1: Loop through all the classes
  for (const key in classObj) {
    // Step 1.1.1: Check if we need to set the class
    if (classObj.hasOwnProperty(key) && classObj[key] === true) {
      this.$el.classList.add(key);
    }
  }
}

/**
 * Setting attributes
 * @param {Object} attributes
 */
function setAttributes(attributes) {
  // Step 1: Set the class
  if (attributes.hasOwnProperty('class')) {
    setClass.call(this, attributes.class);
  }

  // Step 2: Set the remaining attributes
  for (const key in attributes) {
    // Step 2.1 Check if key is not class
    if (attributes.hasOwnProperty(key) && key !== 'class') {
      this.$el[key] = attributes[key];
    }
  }
}

/**
 * Compare old property to new property
 * @param {Object} oldProps
 * @param {Object} newProps
 * @param {Boolean} falseKey
 * @param {Boolean} classList
 */
function compareProps(oldProps, newProps, falseKey, classList = false) {
  // Step 2.1: Loop through all the keys
  for (const key in newProps) {
    // Step 2.1.1: Check if both had the key
    if (newProps.hasOwnProperty(key) && oldProps.hasOwnProperty(key) && key !== falseKey) {
      // Step 2.1.1.1: Check if keys are different
      if (newProps[key] !== oldProps[key]) {
        // Step 2.1.1.1.1: Update if different
        if (newProps[key] === true) {
          if (classList) {
            this.$el.classList.add(key);
          } else {
            this.$el[key] = key;
          }
        } else if (classList) {
          this.$el.classList.remove(key);
        } else {
          this.$el[key] = '';
        }
      }

      // Step 2.1.1.2: Remove key from old class as it has been updated
      delete oldProps[key];
    } else if (newProps.hasOwnProperty(key) && !oldProps.hasOwnProperty(key) && key !== falseKey) {
      // Step 2.1.2: Set the new class if only persent in the newAttributes
      if (newProps[key] === true) {
        if (classList) {
          this.$el.classList.add(key);
        } else {
          this.$el[key] = key;
        }
      }
    }
  }

  // Step 2.2: Loop through the remaining keys in the old class list and remove them from classList if required
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && oldProps[key] === true) {
      if (classList) {
        this.$el.classList.remove(key);
      } else {
        this.$el[key] = '';
      }
    }
  }
}

/**
 * Compare new attributes with the old attributes and update
 * @param {Object} newAttributes
 */
function compareAndUpdateAttributes(oldAttributes, newAttributes) {
  // Step 0: Exit condition no need to check
  if (oldAttributes === undefined && newAttributes === undefined) {
    return false;
  }

  // Step 1: Set the new attributes
  this.refs.attributes = newAttributes;

  // Step 2: Update class
  if (oldAttributes.hasOwnProperty('class') && (newAttributes === undefined || !newAttributes.hasOwnProperty('class'))) {
    this.$el.className = '';
  } else if (newAttributes.hasOwnProperty('class') && (oldAttributes === undefined || !oldAttributes.hasOwnProperty('class'))) {
    setClass.call(this, newAttributes.class);
  } else if (oldAttributes.hasOwnProperty('class') && newAttributes.hasOwnProperty('class')) {
    compareProps.call(this, oldAttributes.class, newAttributes.class, false, true);
  }

  // Step 3: Update the remaining attributes
  compareProps.call(this, oldAttributes, newAttributes, 'class');
}

/**
 * Getting the keyed and non-keyed children
 * @param {Array} children
 */
function getKeyedAndNonKeyChildren(children) {
  // Step 0: Make default values for keyed and non keyed children
  const keyedChildren = {};
  const nonKeyedChildren = [];
  const childOrder = [];

  // Step 1: Loop through all the children
  for (const child of children) {
    // Step 1.1: Set the keyed and non keyed children
    if (child.refs.hasOwnProperty('key') && child.refs.key !== undefined) {
      // Step 1.1.1 Check for key duplication
      if (keyedChildren.hasOwnProperty(child.refs.key)) {
        // Step 1.1.1.1: Push into non keyed child
        nonKeyedChildren.push(child);

        // Step 1.1.1.2: Log the error in case of duplication
        console.error('Duplicate key');

        // Step 1.1.1.3: Adding to the child order
        childOrder.push(false);
      } else {
        // Step 1.1.1.1: Set the keyed children
        keyedChildren[child.refs.key] = child;

        // Step 1.1.1.2: Adding to the child order
        childOrder.push(child.refs.key);
      }
    } else {
      // Step 1.1: Pused the non keyed children
      nonKeyedChildren.push(child);

      // Step 1.2: Adding to the child order
      childOrder.push(false);
    }
  }

  // Return the keyed, nonkeyed and order
  return {
    keyedChildren,
    nonKeyedChildren,
    childOrder,
  };
}

/**
 * Set the children and create keyed children
 * @param {Array} children
 */
function setChildren(children) {
  // Step 1: Get the keyed, non-keyed and child order
  const { keyedChildren, nonKeyedChildren, childOrder } = getKeyedAndNonKeyChildren(children);

  // Step 2: Loop through all the children one by one set keyed and non-keyed children
  for (const child of children) {
    // Append the child in the parent
    this.$el.appendChild(child.$el);

    // Set the child
    child.refs.parent = this;
  }

  // Step 3: Set the properties
  this.refs.keyedChildren = keyedChildren;
  this.refs.nonKeyedChildren = nonKeyedChildren;
  this.refs.childOrder = childOrder;
}

/**
 * A virtual node
 */
class Vn {
  /**
     * Constructor of a virtual node
     * @param {String} type
     * @param {Object} attributes
     * @param {Array} children
     */
  constructor({
    type, attributes, children, key,
  }) {
    // Step 1: Error if type is not defined
    if (type === undefined) {
      throw new Error('Type not defined');
    }

    // Step 1: Set the defaults
    this.refs = {
      attributes,
    };
    Object.defineProperty(this.refs, 'type', {
      value: type,
      writable: false,
      configurable: false,
    });
    Object.defineProperty(this.refs, 'key', {
      value: key,
      writable: false,
      configurable: false,
    });

    // Step 2: Create the element
    this.$el = document.createElement(type);

    // Step 3: Set attributes
    if (attributes !== undefined) {
      setAttributes.call(this, attributes);
    }

    // Step 4: Setting the children
    if (children !== undefined) {
      setChildren.call(this, children);
    }
  }

  /**
     * Update the node
     * @param {String} type
     * @param {Object} attributes
     * @param {Array} children
     */
  update({ attributes, children }) {
    // Step 1: Compare and update attributes
    compareAndUpdateAttributes.call(this, this.refs.attributes, attributes);
  }
}

/**
 * Create a new virtual dom element and return it
 * @param {String} el
 * @param {Object} param1
 */
export default function createElement({
  type, attributes, children, key,
}) {
  return new Vn({
    type, attributes, children, key,
  });
}
