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

http://raganwald.com/2015/06/17/functional-mixins.html
http://raganwald.com/2015/06/20/purely-functional-composition.html


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
