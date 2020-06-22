import ListItem from './ListItem';
import Input from './Input';
import { createElement } from '../vd/virtualDOM';
import { Component } from '../vd/component';

export default class Root extends Component {
  data() {
    return {
      fruits: [
        { id: 1, name: 'apple' },
        { id: 2, name: 'mango' },
        { id: 3, name: 'banana' },
        { id: 4, name: 'grapes' },
        { id: 5, name: 'pear' },
      ],
      addInput: '',
    };
  }

  clickHandler(fruit) {
    this.fruits = this.fruits.filter((curFruit) => curFruit !== fruit);
  }

  changeAddInputHandler(value) {
    this.addInput = value;
  }

  addInputToListHander() {
    const nextID = this.fruits.length === 0 ? 1 : this.fruits[this.fruits.length - 1].id + 1;
    this.fruits = [...this.fruits, { id: nextID, name: this.addInput }];
    this.addInput = '';
  }

  render() {
    // Step 1: Fruits
    let fruitNode = createElement(
      'ul',
      {
        id: 'fruit-container',
      },
      null, // listeners
      ...this.fruits.map(
        (fruit) => createElement(ListItem,
          {
            key: fruit.id,
            fruit: fruit.name,
            removeFruit: () => {
              this.clickHandler(fruit);
            },
          }),
      ),
    );

    // Step 2: Check if empty
    if (this.fruits.length === 0) {
      fruitNode = createElement('p', { id: 'no-fruit' }, {}, 'No fruits left to eat. Buy more fruits...');
    }

    // Step 3: Render
    return createElement('div', { className: 'container' }, null,
      createElement('h1', null, null, 'Fruits'),
      createElement('p', null, null, 'Fruits that you will eat...'),
      createElement(Input, {
        addInput: this.addInput,
        changeAddInputHandler: this.changeAddInputHandler.bind(this),
        addInputToListHander: this.addInputToListHander.bind(this),
      }),
      fruitNode);
  }
}
