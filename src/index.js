import Root from './components/App';
import { render } from './vd/realDOM';
import { createElement } from './vd/virtualDOM';
import './style/style.scss';

render(document.getElementById('main'), createElement(Root));
