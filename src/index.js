// import createElement from './vd/createElement';

// const fruits = [
//   'apple',
//   'mango',
//   'banana',
//   'grapes',
//   'pear',
// ];

// const root = createElement(
//   {
//     type: 'ul',
//     attributes: {
//       class: {
//         container: true,
//         chain: false,
//       },
//     },
//     children: fruits.map((fruit) => createElement({
//       type: 'li',
//       key: fruit,
//       attributes: {
//         class: {
//           'fruit-li': true,
//         },
//         innerText: fruit,
//       },
//     })),
//   },
// );

// window.root = root;
import { Observable } from './vd/observable';

const observable = new Observable({
  /**
   * Data properties are observalble properties
   */
  data: {
    hello: 'world',
    foo: 'bar',
    a: 34,
    b: 3221,
  },
  /**
   * Computed are functions which depend on the data property.
   * Data properties can be directly accessed with "this"."property_name"
   * It should always return a value.
   *
   * The result is cached and is only updated if the dependency is updated
   *
   * Computed should not depend on external dependencies.
   * That might cause the reactivity to not function properly.
   * Making it this way is more efficient
   */
  computed: {
    sum() {
      console.log('Sum dependency updated or called for the first time for initial cache');
      return this.a + this.b;
    },
    sayHello() {
      console.log('Hello dependency updated or called for the first time for initial cache');
      return this.hello;
    },
  },
  /**
   * Watch is watching the data properties.
   * Name of the watch function has to match the data property which it wants to observe.
   * Value being sent is the updated value
   */
  watch: {
    hello(value) {
      console.log('HELLO:', value);
    },
    foo(value) {
      console.log('FOO:', value);
    },
  },
});

// Current value of a, b and sum
console.log('BEFORE UPDATE');
console.log('A:', observable.a);
console.log('B:', observable.b);
console.log('SUM:', observable.sum);

// Update a and b and print sum
console.log('DURING UPDATE');
observable.a = 15;
observable.b = 12;
console.log('AFTER UPDATE');
console.log('A:', observable.a);
console.log('B:', observable.b);
console.log('SUM:', observable.sum);

// Update hello
observable.hello = 'Gas';
observable.foo = 'OK';
console.log(observable);
