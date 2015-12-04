This demo is the same as the [Hello World](../Hello World/) demo, only it uses
ES5 instead of ES6.

The ES5 result is achieved by: 1) using a distribution build of the core
component mixins that has already been transpiled to ES5, and 2) using the
Composable class's `compose` facility to create a class instead of using ES6
`class` syntax.

Since this demo is just done in plain ES5, the demo script can just sit inside
of the index.html page. That opens up the possibility of using a real HTML
`<template>` element instead of embedding HTML inside an ES6 string.

[Live demo](http://componentkitchen.github.io/core-component-mixins/demos/Hello%20World%20%28ES5%29/)
