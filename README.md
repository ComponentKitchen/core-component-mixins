This prototype implements common web component features as mixins. It
explores the idea that mixins can achieve the same results as a monolithic
framework, while permitting more flexibility and a pay-as-you-go approach to
complexity and performance.

Design goals:

1. Demonstrate that it's possible to create web components entirely from mixins.
2. Have each web component mixins focus on solving a single, common task. They
   should be well-factored. They should be able to be used on their own, or in
   combination.
3. Introduce as few new concepts as possible. Any developer who understands the
   DOM API should find this architecture appealing, without having to learn many
   proprietary concepts (beyond mixins, see below).
4. Focus on native browser support for ES6 and web components. The architecture
   should be useful in a production application today, but should also feel
   correct in a future world in which native ES6 and web components are
   everywhere.

# Installation

    > npm install
    > grunt build

# Composing classes with mixins

A foundation of this prototype is that web components can be expressed as
compositions of base classes and mixins. One possible architecture is
expressed in the [Composable](https://github.com/ComponentKitchen/Composable)
class, which is used by this project.

If a common extension/mixin solution can be agreed upon, frameworks sharing that
solution gain a certain degree of code sharing, interoperability, and can share
conceptual materials. This reduces the learning curve for dealing with any one
framework.

Frameworks can still make their own decisions about which features they want to
offer by virtue of which mixins they incorporate into their base classes.


# Web component mixins

The /src folder includes an initial set of mixins for very common web component
features:

1. Template stamping into a Shadow DOM tree.
2. Marshalling attributes to properties. This includes mapping hyphenated
   `foo-bar` attribute references to camelCase `fooBar` property names.
3. Polymer-style [automatic node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding)
for convenient access to elements within the shadow tree.

A sample base class, [ElementBase](src/ElementBase.js), shows one way these
mixins might be combined to create a custom element base class. Another example,
[X-Tag](demos/X-Tag), shows a hypothetical application of this strategy to the
X-Tag framework. The sample base class in that example uses a different set of
mixins to demonstrate that that is possible.

A [Hello, world](demos/Hello%20World) demo shows this sample ElementBase class being used to
create a simple [greet-element](demos/Hello%20World/GreetElement.js) component. This can be
viewed as a [live demo](http://componentkitchen.github.io/core-component-mixins/demos/Hello%20World).

More demos are available in the /demos folder.


# Separating class construction from custom element registration

This codebase generally assumes that class creation (e.g., with ES6 `class`) is
handled separately from custom element registration with
`document.registerElement()`. That said, a framework can still decide to offer
a single entry point that both defines a class and registers it. This is shown
in the `xtag.register()` function of the [X-Tag](demos/X-Tag) example.
