This prototype explores some ideas for a
common web component runtime along the lines discussed in this [document](https://docs.google.com/document/d/1DPClTHykvT-AiGxA5XnUSYJFc2uwBHcJh_Rk55IR_5s/edit#heading=h.oc8n7a9071o3).

This prototype has these design goals:

1. The ability to compose component behavior with mixins is foundation on top of
   which everything else can be built.
2. Web component mixins should each focus on solving one specific, common task.
   They should be well-factored. They should be able to be used on their own, or
   in combination.
3. Introduce as few new concepts as possible. Any developer who understands the
   DOM API should find this architecture appealing, without having to learn many
   proprietary concepts (beyond mixins, above).
4. Focus on native browser support for ES6 and web components. The architecture
   should be useful in a production application today, but should also feel
   correct in a future world in which native ES6 and web components are
   everywhere.


# Extensible classes with mixins

A foundation of this codebase is that web components can be expressed as
compositions of base classes and mixins. A possible strategy for that is
expressed in the [Extensible](extensible) class.

If a common extension/mixin solution can be agreed upon, frameworks sharing that
solution gain a certain degree of code sharing, interoperability, and can share
conceptual materials. This reduces the learning curve for dealing with any one
framework.

Frameworks can still make their own decisions about which features they want to
offer by virtue of which mixins they incorporate into their base classes.


# Web component mixins

Currently, the /src folder includes an initial set of very common web component
mixins:

1. Shadow DOM root creation.
2. Template stamping.
3. Marshalling attributes to properties.

A sample base class, [ElementBase](src/ElementBase.js), shows one way these
mixins might be combined to create a custom element base class. Another example,
[xtag](demos/xtag), shows a hypothetical application of this strategy to the
X-Tag framework. The sample base class in that example uses a different set of
mixins to demonstrate that that is possible.

A [demo](demos/index.html) shows this sample ElementBase class being used to
create a simple [greet-element](demos/GreetElement.js) component. This can be
viewed as a [live demo](http://janmiksovsky.github.io/element-base/demos/index.html).


# Separating class construction from custom element registration

This codebase generally assumes that class creation (e.g., with ES6 `class`) is
handled separately from custom element registration (with
`document.registerElement()`). That said, a framework can still decide to offer
a single entry point that both defines a class and registers it. This is shown
in the `xtag.register()` function of the [xtag](demos/xtag) example.


# Installing

Ideally, only `npm install` should be required to install everything required
to develop for this repo. However, this currently uses web-component-tester
for unit testing, and that doesn't seem to install correctly via npm. For the
time being, you must install web-component-tester via `bower install`.
