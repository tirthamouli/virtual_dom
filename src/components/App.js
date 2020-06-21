import ListItem from './ListItem';
import Input from './Input';
import { createElement } from '../vd/virtualDOM';
import { Component } from '../vd/component';

export default class Root extends Component {
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
    return createElement('div', { className: 'container' }, null,
      createElement(Input, {
        addInput: this.addInput,
        changeAddInputHandler: this.changeAddInputHandler.bind(this),
        addInputToListHander: this.addInputToListHander.bind(this),
      }),
      createElement(
        'ul',
        {
          id: 'fruit-container',
        },
        null, // listeners
        ...this.fruits.map(
          (fruit) => createElement(ListItem,
            {
              key: fruit,
              fruit,
              removeFruit: () => {
                this.clickHandler(fruit);
              },
            }),
        ),
      ));
  }
}
