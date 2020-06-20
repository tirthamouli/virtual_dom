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

  clickHandler(fruit) {
    this.fruits = this.fruits.filter((curFruit) => curFruit !== fruit);
  }

  render() {
    return createElement(
      'ul',
      {
        className: 'container chain',
      },
      null, // listeners
      ...this.fruits.map((fruit) => createElement('li', { key: fruit }, {
        click: () => { this.clickHandler(fruit); },
      }, fruit)),
    );
  }
}

render(document.getElementById('main'), Root);
