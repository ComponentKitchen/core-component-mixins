Extensible
==========

The module Extensible.js implements a class called Extensible that provides a
general-purpose means of extending class and object behavior along the lines of
mixins, but leveraging the JavaScript prototype chain for method disambiguation.

Goals:

1. Provide a mixin solution that feels like a JavaScript solution. It should
work with the language, not fight against it. Be designed with ES6 in mind,
particularly its introduction of `class`.
2. Introduce as few concepts as possible.
3. Define an unambigious means of resolving conflicts in function names. If
multiple mixins/classes define a method with the same name, there should be a
predictable way of invoking all of them in a well-known order.


Mixins
======

Many, many JavaScript frameworks have class factories that support mixins.
Some rely exclusively on mixins to define behavior, eschewing anything that
looks like classes, while others use mixins to augment class creation.

While implementations vary, mixins are generally defined in JavaScript as
objects supplied to a factory method, e.g., one that creates classes.
Let's consider the use of mixins in a hypothetical JavaScript framework called
FrameworkDuJour:

    let mixin = {
      foo() { return "mixin"; }
    };
    let Base = FrameworkDuJour.classFactory({
      mixins: [mixin]
    });

    let instance = new Base();
    instance.foo() // "Mixin"

Typically, the classFactory() method copies the members of the mixin to the
prototype of the class being created. This makes the mixin's members available
to all new instances of the resulting class.

*** more on why mixins are attractive ***

There are some disadvantages to mixins like this:

1. The Base class above feels more "real" than the mixins, even though
JavaScript natively makes no such distinction. They're all just objects.
2. The use of the custom classFactory() method is idiosyncratic to this
FrameworkDuJour framework. A developer looking at the above code can't know what
how the "mixins" key is going to affect the resulting class unless it knows more
about FrameworkDuJour.
3. Although we might assume that classFactory() is following common JavaScript
conventions for classes, we don't *know* that for sure. We might, for example,
assume that classFactory() is establishing a JavaScript prototype chain whose
behavior is governed by the language itself. We might assume that we can
instantiate Base with `new Base()`. But those assumptions aren't guaranteed to
be true. If we're unfamiliar with FrameworkDuJour, we can't be sure how to work
with Base, or how Base objects will behave.


Mixin conflict resolution
=========================

A critical question is how to resolve conflicts in the names of mixin members.
E.g., a mixin may declare a method of the same name as the target class whose
prototype is being modified, or multiple mixins applied to a target may share
methods of the same name.

    let mixin1 = {
      foo() { return "mixin1"; }
    };
    let mixin2 = {
      foo() { return "mixin2"; }
    }
    let Base = FrameworkDuJour.classFactory({
      foo() { return "Base"; }
      mixins: [mixin1, mixin2]
    });

    let instance = new Base();
    instance.foo() // What does this return?

A common and simple solution to resolving name conflicts is "last writer wins".
Generally this is interpreted to mean that mixin methods overwrite methods on
the target, and that mixins are applied in the order they are specified.
Following this "last writer wins" approach, in the above case we *probably*
get this result:

    instance.foo() // "mixin2"

because mixin2 was specified last, and hence wins the conflict. However,
the exact behavior may vary from framework to framework.

Moreover, there are cases where "last writer wins" is not desirable. In many
situations, it's desirable to let mixins *augment* behavior, not overrule it.
Frameworks that want to address these situations resolve name conflicts by
invoking *all* method implementations on the base class and any mixins applied
to it:

    let mixin1 = {
      foo() { console.log("mixin1"); }
    };
    let mixin2 = {
      foo() { console.log("mixin2"); }
    }
    let Base = FrameworkDuJour.classFactory({
      foo() { console.log("Base"); }
      mixins: [mixin1, mixin2]
    });

    let instance = new Base();
    instance.foo() // Writes "Base", "mixin1", "mixin2"... but in what order?

Again, the idiosyncratic nature of mixin implementations means we can't
reason about aggregate behavior without knowing more about FrameworkDuJour.
Some frameworks will invoke Base.foo() first, then the mixin foo()
implementations. Other frameworks will do the opposite: invoke mixins first,
then the Base implementation. Most frameworks will invoke mixin1.foo() before
mixin2.foo(), because they were specified in that order, but again that behavior
isn't guaranteed to be consistent across frameworks.

*** Links to these? ***
http://raganwald.com/2015/06/17/functional-mixins.html
http://raganwald.com/2015/06/20/purely-functional-composition.html


JavaScript already has an extension mechanism: the prototype chain
==================================================================

It's worth noting that JavaScript already provides a native means of aggregating
behavior through the language's prototype chain. The chain is a linked list of
object prototypes. If multiple prototypes on the chain implement a method of the
same name, the order of the linked list provides a very specific means of
disambiguating name conflicts: the first prototype in the chain that implements
the method wins.

This is a language feature, and its behavior is definitively unambiguous. All
JavaScript implementations treat the prototype chain exactly the same. To many
people, in fact, the prototypal nature of JavaScript is the language's
defining characteristic.

We can use the prototype chain as the basis for a mixin solution whose
conflict resolution strategy is both clearly defined and flexible. Instead of
copying mixin members into a target base class prototype, we can just extend
the prototype chain to include those mixins.

A very brute-force approach, which destructively modifies the mixins:

    let mixin1 = {
      foo() { return "mixin1"; }
    };
    let mixin2 = {
      foo() { return "mixin2"; }
    }
    class Base {
      foo() { return "Base"; }
    }

    Object.setPrototypeOf(mixin1, Base.prototype);
    Object.setPrototypeOf(mixin2, mixin1);
    let ExtendedBase = mixin2;
    let obj = new ExtendedBase();

    obj.foo() // returns "mixin2"

We've created a prototype chain:

    obj --> ExtendedBase (mixin2) --> mixin1 --> Base --> Object

We know definitively that it's mixin2's implementation of foo() which will be
invoked, because that's exactly what the prototype chain specifies. That's what
the prototype chain is *there for*: to compartmentalize functionality while
providing a definitive means of disambiguating function calls.

If we want, we can even redefine the Base class to reference our new, extended
version of the class that includes the behavior supplied by the mixins. (This
assumes we haven't created any class instances yet.)

    Object.setPrototypeOf(mixin1, Base.prototype);
    Object.setPrototypeOf(mixin2, mixin1);
    Base = mixin2; // redefine Base
    let obj = new Base();

The prototype chain is the same, it's just that name "Base" points to a
different point in the chain:

    obj --> Base (mixin2) --> mixin1 --> (unnamed) --> Object

The brute-force destructive modification of the mixins here prevents their
incorporation into other prototype chains. To avoid this problem, we can copy
them before changing their prototypes:

    let copy1 = Object.assign(mixin1, {});
    let copy2 = Object.assign(mixin2, {});
    Object.setPrototypeOf(copy1, Base.prototype);
    Object.setPrototypeOf(copy2, copy1);
    Base = copy1;

Now we have:

    obj --> Base (mixin2 copy) --> (mixin1 copy) --> (unnamed) --> Object

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

Chaining together prototypes is naturally less memory-efficient than
destructively copying the mixin methods to the prototype of the base class.


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

    let mixin1 = {};
    let mixin2 = {};
    let Mixin3 = {};
    class Base {}

We can compose combinations of those:

    /// fix
    let copy1 = Object.assign(mixin1, {});
    let copyA = Object.assign(MixinA, {});
    let Class1A = Object.setPrototypeOf(copy1, copyA);

    let copy2 = Object.assign(mixin1, {});
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
