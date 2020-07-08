# Boom DOM

A javascript library for creating reusable web UI and state management.
It uses a home-made virtual DOM implementation for creating and updating the real DOM.

# Features
1. Create reusable components that can be mounted at different places in the DOM.
2. Nest components
3. Share properties and methods from parent component to child components.
4. Set up two way data binding
5. Hooks
    1. created - when the virtual dom is created
    2. mounted - when the virtual dom is actually added to the real dom
    3. shouldComponentUpdate - to prevent virtualDOM re-computation and improving performance. Will only prevent virtualDOM re-computation when parent is changed. When current data is changed, re-computation is not prevented
    4. updated - When the real dom is updated

# Documentation 

Under construction ...

# Running the application

1. Install dependencies: 'yarn install'
2. Run dev server: 'yarn dev'
3. Create a build: 'yarn build': Creates a dist folder