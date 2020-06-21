import { Component } from '../vd/component';
import { createElement } from '../vd/virtualDOM';

export default class InputElement extends Component {
  render() {
    // Step 1: Get the current fruit
    const { fruit, removeFruit } = this.props;

    // Step 2: Return the node
    return createElement('li', { className: 'fruit-name' }, { click: removeFruit }, fruit);
  }
}
