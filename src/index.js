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
      addInput: 'some value',
    };
  }

  clickHandler(fruit) {
    this.fruits = this.fruits.filter((curFruit) => curFruit !== fruit);
  }

  changeAddInputHandler(value) {
    this.addInput = value;
  }

  addInputToListHander() {
    this.fruits = [...this.fruits, this.addInput];
    this.addInput = '';
  }

  render() {
    return createElement(
      'ul',
      {
        className: 'container chain',
      },
      null, // listeners
      createElement('input', { type: 'text', value: this.addInput }, { input: (event) => { this.changeAddInputHandler(event.target.value); } }),
      createElement('button', { type: 'button' }, { click: this.addInputToListHander.bind(this) }, 'Add to list'),
      ...this.fruits.map((fruit) => createElement('li', { key: fruit }, {
        click: () => { this.clickHandler(fruit); },
      }, fruit)),
    );
  }
}

render(document.getElementById('main'), Root);
