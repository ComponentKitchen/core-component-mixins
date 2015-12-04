This demo shows the use of a mixin that allows *template composition* between
a subclass and a base class. An open question in web component development is:
what's the best way for a component to fill slots defined by a base class?
For a longer discussion of this question, see this
[blog post](http://blog.quickui.org/2013/06/11/puzzle-define-html-custom-element-subclasses-that-can-fill-in-base-class-insertion-points/).

This demo defines a custom composition rule that's used to compose `template`
properties in a subclass and a base class. In this example, a `SimpleButton`
base class puts its content inside a standard button. A subclass called
`IconButton` defines a template that includes an icon. The latter template is
composed into the base class template, with the result that an `IconButton`
shows an icon inside of a standard button.

[Live demo](http://componentkitchen.github.io/core-component-mixins/demos/Template%20Composition/)
