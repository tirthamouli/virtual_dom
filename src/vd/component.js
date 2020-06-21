import { Observable } from './observable';
import { isFunction, checkIfOwnProperty } from '../helpers/helpers';
import { update } from './realDOM';

export class Component {
  /**
   * Setting the props
   * @param {Object} props
   */
  constructor(props = {}) {
    // Step 1: Create the data field
    let data = {};
    if (this.data && isFunction(this.data)) {
      data = { ...this.data() };
    }

    // Step 2: Create computed
    const computed = {
      render: this.render,
    };

    // Step 3: Create watch
    let newDOMForUpdate = null;
    let updateQueued = false;
    const watch = {
      render(newDOM, oldDOM) {
        newDOMForUpdate = newDOM;
        if (!updateQueued) {
          updateQueued = true;
          setTimeout(() => {
            update(oldDOM, newDOMForUpdate);
            updateQueued = false;
          });
        }
        this.node = newDOM;
      },
    };

    // Step 4: Add the props
    this.props = props;

    // Step 5: Create the observable
    Observable.call(this, { data, computed, watch });

    // Step 6: Return the rendered object
    this._node = this.render;
    if (this.props && checkIfOwnProperty(this.props, 'key')) {
      this._node.key = this.props.key;
    }

    // Step 7: Return the node
    return this._node;
  }

  /**
   * Render method needs to be overridden
   */
  render() {
    throw new Error('Render method doesnt exists');
  }
}
