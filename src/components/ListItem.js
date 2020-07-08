import { Component } from '../vd/component';
import { createElement } from '../vd/virtualDOM';

export default class ListItem extends Component {
  /**
   * Created hook
   */
  created() {
    console.log('LIST ITEM | CREATED');
  }

  /**
   * Mounted hook
   */
  mounted($el) {
    console.log('LIST ITEM | MOUNTED', $el);
  }

  /**
   * Updated hook
   */
  updated() {
    console.log('LIST ITEM | UPDATED');
  }

  /**
   * Should component be updated hook
   * True should be returned for calculating virtualDOM
   * False should be passed for skipping calculation and increasing efficiency
   */
  shouldComponentUpdate(oldProps, newProps) {
    console.log('LIST ITEM | SHOULD COMPONENT UPDATE');
    if (oldProps.fruit === newProps.fruit) {
      return false;
    }
    return true;
  }

  render() {
    console.log('LIST ITEM | RENDER');

    // Step 1: Get the current fruit
    const { fruit, removeFruit } = this.props;

    // Step 2: Return the node
    return createElement('li', { className: 'fruit-name' }, { click: removeFruit }, fruit);
  }
}
