import { Observable } from './observable';
import { isFunction } from '../helpers/helpers';
import { update } from './realDOM';

export class Component {
  /**
   * Setting the props
   * @param {Object} props
   */
  constructor(props) {
    // Step 1: Create the data field
    let data = null;
    if (this.data && isFunction(this.data)) {
      data = { ...this.data(), ...props };
    } else {
      data = { ...props };
    }

    // Step 2: Create computed
    const computed = {
      render: this.render,
    };

    // Step 3: Create watch
    const watch = {
      render(newDOM, oldDOM) {
        update(oldDOM, newDOM);
        this.node = newDOM;
      },
    };

    // Step 4: Create the observable
    Observable.call(this, { data, computed, watch });

    // Step 5: Return the rendered object
    this._node = this.render;

    // Step 6: Add keyed attributes
    console.log(this);

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
