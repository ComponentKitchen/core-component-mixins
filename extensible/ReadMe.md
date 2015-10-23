ExtensibleClass
===============

requirements:
1. Look and feel like an ES6 solution.
2. Introduce as few concepts as possible. Take advantage of the language itself.
3. Allow multiple mixins/behaviors to define the same methods. Calling a method
   on an object instance should invoke all of the method implementations in the
   object's set of mixins.


Mixins
======

mixins
Polymer behaviors

  let Mixin1 = {
    foo() { return "Mixin1"; }
  };
  let Mixin2 = {
    foo() { return "Mixin2"; }
  }
  let Base = CustomClassFactory({
    foo() { return "Base"; }
    mixins: [Mixin1, Mixin2]
  });

  let instance = new Base();
  instance.foo() // produces... what?


http://raganwald.com/2015/06/17/functional-mixins.html
http://raganwald.com/2015/06/20/purely-functional-composition.html

Some disadvantages here:
1. The Base class feels more "real" than the mixins, even though JavaScript
   natively makes no such distinction. They're all just objects.
2. The use of CustomClassFactory is idiosyncratic. It may not interoperate
   with mixin models or class subclassing techniques in other libraries.
3. The order in which CustomClassFactory resolves conflicts among mixin and
   base class members is unclear, so we can't tell what will happen when we
   invoke foo(). Some mixin systems may give priority to the base class, some to
   the last mixin applied, and still others may invoke all the foo()
   implementations.


JavaScript already has an extension mechanism: the prototype chain
==================================================================

  let Mixin1 = {
    foo() { return "Mixin1"; }
  };
  let Mixin2 = {
    foo() { return "Mixin2"; }
  }
  class Base {
    foo() { return "Base"; }
  }

Instead of mixing Mixin1 and Mixin2 into the Base class, we can just edit the
prototype chain and redefine Base to point to the start of the chain:

  Object.setPrototypeOf(Mixin1, Mixin2);
  Object.setPrototypeOf(Mixin2, Base.prototype);
  let ExtendedBase = Mixin1;


This will destructively

Using the prototype chain is not necessarily less efficient than some
proprietary mixin strategy. In fact, there's every reason to believe that
JavaScript engine implementors have gone to great lengths to ensure that use
of the prototype chain is highly efficient.


Extending classes with classes
==============================

  class Todo {
    constructor (description) {
      this.description = description || 'Untitled';
      this.done = false;
    }
    do() {
      this.done = true;
    }
    undo() {
      this.done = false;
    }
  }

  class Numbered {
    get number() {
      return this._number;
    }
    set number(value) {
      this._number = value;
    }
  }

  let Bug = ExtensibleClass.extend.call(Todo, Numbered);
  let bug = new Bug("Nothing works");
  bug.number = 1; // From Numbered
  bug.do();       // From ToDo


The prototype chain here is

  Bug -> ToDo -> Object

Where Bug has all the members of Numbered.

We could also define Numbered as a plain object:

  let Numbered = {
    get number() {
      return this._number;
    }
    set number(value) {
      this._number = value;
    }
  }

  let Bug = ExtensibleClass.extend.call(Todo, Numbered);

There are some advantages of using a class, however:

* ES6 supplies special `class` syntax. It's a matter of opinion, but use of
  `class` may send a stronger signal about the author's intention to readers of
  the code. Specifically, a class suggests that it will be instantiated to
  provide behavior to objects.
* A class can provide both static and instance members. The .extend() facility
  will include both when creating the extended class.


Classes meant to be extended
============================

Can invoke ExtensibleClass.extend(), as shown above:

  let Bug = ExtensibleClass.extend.call(ToDo, Numbered);

If you expect your class to be extended, you can endow it with self-extending
abilities by inheriting from ExtensibleClass:

  class ToDo extends ExtensibleClass {}
  class Numbered {}
  let Bug = ToDo.extend(Numbered);

ExtensibleClass is itself an extension that can be applied to other classes
to make them extensible:

  class ToDo {}
  let ExtensibleToDo = ExtensibleClass.extend.call(ToDo, ExtensibleClass);
  let Bug = ExtensibleToDo.extend(Numbered);

All classes created by ExtensibleClass.extend() already inherit the ability
to be extended themselves.


Class redefinition
==================

If your intention is to permanently alter a class, you can redefine it to
reference the extended class. E.g., if we wanted to make all ToDo instances
have a number, we could do:

  class ToDo extends ExtensibleClass {...}
  class Numbered {...}
  let ToDo = ToDo.extend(Numbered);

This will only affect new ToDo instances. It will not retroactively change
the behavior of existing ToDo instances. Typically, you'd only want to redefine
a class like this early, before creating any instances.


Invoking base method implementations
====================================

  class Todo {
    constructor (description) {
      this.description = description || 'Untitled';
      this.done = false;
    }
    do() {
      this.done = true;
    }
    undo() {
      this.done = false;
    }
  }

  class Encouraging {
    do() {
      this.super(Encouraging, 'do');
      console.log("Good job!");
    }
  }

  let Bug = ExtensibleClass.extend.call(Todo, Encouraging);
  let bug = new Bug("Nothing works");
  bug.do();       // Sets done to true, then writes "Good job!" to console.


The `super` method takes as its first argument a reference to the class
implementing the method being overridden. The second argument is the name of the
method being overridden. Any additional arguments to `super` will be passed to
the superclass method implementation. The result of `super` will be the result
of calling the superclass method.

Significantly, `super` will only invoke a superclass method *if one exists*.
This optional invocation ensures the extension can be applied to any class,
whether or not it already defines the method in question.


Extending HTMLElements
======================

A subclass of HTMLElement called ExtensibleElement includes the .extend()
facility:

  class MyElement extends ExtensibleElement {
    createdCallback {
      this.textContent = "I'm a custom element.";
    }
  }
  document.registerElement('my-element', MyElement);
