This folder defines some common custom element mixins. These can be used as is,
or a framework can use a combination of these to create its own base class for
custom elements.

It also defines two base classes: `ComposableElement`, which adds mixin support
to a standard `HTMLElement`, and `ElementBase`, which extends
`ComposableElement` with some standard mixins. Either base class could be used
to define new custom elements, but these classes are simple enough that one
could easily create a new base class if one desired.
