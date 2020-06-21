import { Component } from '../vd/component';
import { createElement } from '../vd/virtualDOM';

export default class InputDeviceInfo extends Component {
  render() {
    // Step 1: Get data from props
    const { addInput, changeAddInputHandler, addInputToListHander } = this.props;

    // Step 2: Render
    return createElement('div',
      { className: 'input-container' },
      null,
      createElement('input', { type: 'text', value: addInput, placeholder: 'Buy a fruit' }, {
        input: (event) => changeAddInputHandler(event.target.value),
        keydown: (e) => {
          const code = (e.keyCode ? e.keyCode : e.which);
          if (code === 13) {
            addInputToListHander();
          }
        },
      }),
      createElement('button', { type: 'button' }, { click: addInputToListHander }, 'Add to list'));
  }
}
