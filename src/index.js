import { createElement } from './vd/virtualDOM';
import { Component } from './vd/component';
import { render } from './vd/realDOM';

class Root extends Component {
  data() {
    return {
      fruits: [
        'apple',
        'mango',
        'banana',
        'grapes',
        'pear',
      ],
    };
  }

  render() {
    return createElement(
      'ul',
      {
        className: 'container chain',
      },
      ...this.fruits.map((fruit) => createElement('li', { key: fruit }, fruit)),
    );
  }
}

render(document.getElementById('main'), Root);
