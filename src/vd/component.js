import { Observable } from './observable';
import { isFunction } from '../helpers/helpers';

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
        console.log('new dom', newDOM);
        console.log('old dom', oldDOM);
      },
    };

    // Step 2: Create the observable
    const observable = new Observable({ data, computed, watch });

    // Step 3: Return the rendered object
    this.node = observable.render;
    return this.node;
  }

  /**
   * Render method needs to be overridden
   */
  render() {
    throw new Error('Render method doesnt exists');
  }
}
