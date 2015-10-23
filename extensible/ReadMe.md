Extensible
==========

The module Extensible.js implements a class called Extensible that provides a
general-purpose means of extending class and object behavior along the lines of
mixins, but leveraging the JavaScript prototype chain for method disambiguation.

Trying to implement a mixin solution that:

1. Looks and feels like a JavaScript solution. It should work with the language,
   not fight against it. It should be designed with ES6 in mind.
2. Introduce as few concepts as possible.
3. Provide an unambigious means of resolving conflicts in function names.
   If multiple mixins/classes define a method with the same name, there should
   be a predictable way of invoking all of them in a well-known order.


Mixins
======

mixins generally modify a prototype in place
have to resolve question about method name conflicts: often last writer wins (in
which case functionality is lost), or a wrapper method is generated which
invokes all method implementations. If the latter, the order in which those
methods are invoked varies from framework to framework.

mixins
Polymer behaviors

Let's consider the use of mixins in a hypothetical JavaScript framework called
FrameworkDuJour:

    let Mixin1 = {
      foo() { return "Mixin1"; }
    };
    let Mixin2 = {
      foo() { return "Mixin2"; }
    }
    let Base = FrameworkDuJour.classFactory({
      foo() { return "Base"; }
      mixins: [Mixin1, Mixin2]
    });

    let instance = new Base();
    instance.foo() // What does this return?

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
   implementations. If multiple implementations are invoked, the order may vary
   from framework to framework.


JavaScript already has an extension mechanism: the prototype chain
==================================================================

Instead of mixing Mixin1 and Mixin2 into the Base class, we can just edit the
prototype chain and redefine Base to point to the start of the chain. A
brute-force approach:

    let Mixin1 = {
      foo() { return "Mixin1"; }
    };
    let Mixin2 = {
      foo() { return "Mixin2"; }
    }
    class Base {
      foo() { return "Base"; }
    }

    Object.setPrototypeOf(Mixin1, Mixin2);
    Object.setPrototypeOf(Mixin2, Base.prototype);
    let ExtendedBase = Mixin1;
    let obj = new ExtendedBase();

This creates a prototype chain:

    obj --> ExtendedBase (Mixin1) --> Mixin2 --> Base --> Object

We can interrogate our new instance:

    obj instanceof ExtendedBase // true
    obj instanceof Base // true

Now when we can definitively answer the question of which method will get
invoked:

    obj.foo() // returns "Mixin1"

We know this will invoke Mixin1's foo() implementation, because that's exactly
what the prototype chain specifies. That's what the prototype chain is *there
for*: to allow the compartmentalization of functionality while providing a
definitive means of disambiguating function calls.

If we want, we can even redefine the Base class to reference our new, extended
version of the class that includes the behavior supplied by the mixins. (This
assumes we haven't created any class instances yet.)

    Object.setPrototypeOf(Mixin1, Mixin2);
    Object.setPrototypeOf(Mixin2, Base.prototype);
    Base = Mixin1; // redefine Base
    let obj = new Base();

The prototype chain is the same, it's just that name "Base" points to a
different point in the chain:

    obj --> Base (Mixin1) --> Mixin2 --> (unnamed) --> Object

If we want to avoid destructively modifying Mixin1 and Mixin2, so we can use
them in other prototype chains, we can copy them before changing their
prototypes:

    let copy1 = Object.assign(Mixin1, {});
    let copy2 = Object.assign(Mixin2, {});
    Object.setPrototypeOf(copy1, copy2);
    Object.setPrototypeOf(copy2, Base.prototype);
    Base = copy1;

Using the prototype chain is not necessarily less efficient than some
proprietary mixin strategy. In fact, there's every reason to trust that
JavaScript engine implementors have gone to great lengths to ensure that use of
the prototype chain is highly efficient.

Another clear advantage of using the prototype chain is that it's *part of the
language*. That means:

* The behavior of the prototype chain is well-documented in an endless number
  of books, tutorials, blog posts, etc. No mixin architecture can come close to
  that.
* Use of the prototype chain allows us to reason about object behaviors, even if
  don't know anything about the code that assembled that prototype chain.
* The prototype chain will be directly supported in JavaScript forever, even as
  the language evolves. E.g., ES6 classes codify a convention for manipulating
  the prototype chain.


Composition vs inheritance
==========================

*** vogue these days is to use composition instead of inheritance. Inheritance,
it is said, leads to complex, brittle systems.
People from OO backgrounds think of the prototype chain as synonymous with
inheritance, but that's just one way to conceptualize JavaScript. The prototype
chain is just a linked list -- how you want to use it is up to you. In this
case, we're using the prototype chain, but not to implement classical
inheritance. Because we work with *copies* of classes/prototypes, we're
*composing* behavior.

Consider three mixins and a base class:

    let Mixin1 = {};
    let Mixin2 = {};
    let Mixin3 = {};
    class Base {}

We can compose combinations of those:

    /// fix
    let copy1 = Object.assign(Mixin1, {});
    let copyA = Object.assign(MixinA, {});
    let Class1A = Object.setPrototypeOf(copy1, copyA);

    let copy2 = Object.assign(Mixin1, {});
    let copyB = Object.assign(MixinA, {});
    let Class1A = Object.setPrototypeOf(copy1, copyA);

Here we end up with two classes that each of three of the mixins.


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

Classes created by extending ExtensibleClass inherit the ability to be extended
themselves.


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
