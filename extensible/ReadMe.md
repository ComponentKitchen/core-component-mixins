Introduction
============

The module Extensible.js implements a class called Extensible that provides a
general-purpose means of composing class and object behavior with mixins by
leveraging the JavaScript prototype chain. This takes advantage of native
language features to reduce conceptual overhead and enable a substantial degree
of expressiveness and power.


Goals:

1. Provide a mixin solution that feels like a JavaScript solution. It should
work with the language, not fight against it. It should be designed with ES6 in
mind, particularly its introduction of `class` and `super` keywords.
2. Introduce as few new concepts as possible.
3. Define an unambigious means of resolving conflicts in function names. If
multiple mixins/classes define a method with the same name, there should be a
predictable way of invoking all of them in a well-known order.


Example
-------
A typical example using this Extensible system in ES6 might look like:

    class Mixin {
      foo() {
        return this.bar() + ", world.";
      }
    }
    class Base extends Extensible {
      bar() {
        return "Hello";
      }
    }
    Base = Base.extend(Mixin);

    let instance = new Base();
    instance.foo() // "Hello, world."

The remainder of this document walks through the motivation for this system
and explores typical usage.


Mixins
======

Many JavaScript frameworks have class factories that support mixins. Some rely
exclusively on mixins to define behavior, eschewing anything that looks like
traditional single-inheritance classes, while others use mixins to augment class
creation.

While implementations vary, mixins are generally defined in JavaScript as
objects supplied to a factory method, e.g., one that creates classes.
Let's consider the use of mixins in a hypothetical JavaScript framework called
FrameworkDuJour:

    let mixin = {
      foo: "mixin"
    };
    let Base = FrameworkDuJour.classFactory({
      mixins: [mixin]
    });

    let instance = new Base();
    instance.foo // "mixin"

Typically, the classFactory() method copies the members of the mixin to the
prototype of the class being created. This makes the mixin's members available
to all new instances of the resulting class. Multiple mixins can be applied to
the same class.

These attributes of mixins can make them a convenient and useful way to factor
behavior. You can compose behaviors to get the classes you want. Because mixin
properties and methods are generally flattened into the prototype of class
you're creating, they can be efficient in terms of memory and performance.

That said, there are some disadvantages to mixins like this:

1. The Base class above feels more "real" than the mixins, even though
JavaScript natively makes no such distinction. To JavaScript, these are all just
objects. But in most frameworks, mixins are a second-class construct. They often
can't be instantiated, for example. (One typically has create a trivial class
first, then add the desired mixin.)
2. The use of the custom classFactory() method is idiosyncratic to this
FrameworkDuJour framework. A developer looking at the above code can't know what
how the "mixins" key is going to affect the resulting class unless it knows more
about FrameworkDuJour.
3. Although we might assume that classFactory() is following common JavaScript
conventions for classes, we don't *know* that for sure. We might, for example,
assume that classFactory() is establishing a JavaScript prototype chain whose
behavior is governed by the language itself. We might assume that we can
instantiate Base with `new Base()`. But those assumptions might prove false. If
we're unfamiliar with FrameworkDuJour, we can't be sure how to work with Base,
or how Base objects will behave.


Mixin conflict resolution
-------------------------
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
situations, it's desirable to let mixins *augment* behavior, not override it.
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
* Some frameworks will invoke Base.foo() first, then the mixin foo()
implementations. Other frameworks will do the opposite: invoke mixins first,
then the Base implementation.
* Most frameworks will invoke mixin1.foo() before
mixin2.foo(), because they were specified in that order, but again that behavior
isn't guaranteed to be consistent across frameworks.
* The precise aggregation behavior may even vary within a single framework.
Component frameworks like React and Polymer both treat "lifecycle methods"
specially: if multiple mixins implement a given lifecycle method, the functions
are composed, and at those points in the component lifecycle, all the mixin
behaviors will apply. Other methods — those without the special lifecycle
names — may be treated as "last writer wins".

All this complexity makes it hard to learn the specifics of a given framework,
let alone work effectively with multiple frameworks in the same codebase.


JavaScript already has an extension mechanism: the prototype chain
==================================================================

It's worth noting that JavaScript already provides a native means of aggregating
behavior through the language's prototype chain. The chain is a linked list of
object prototypes. If multiple prototypes on the chain implement a method of the
same name, the order of the linked list provides a very specific means of
disambiguating name conflicts: the first prototype in the chain that implements
the method wins. (If you're unfamiliar with the prototype chain, many articles
on the web cover the topic in depth. A reasonable starting point is
[Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FInheritance_and_the_prototype_chain).)

This prototype chain is a language feature, and its behavior is definitively
unambiguous. All JavaScript implementations are required to treat the prototype
chain exactly the same. To many people, in fact, the prototypal nature of
JavaScript is the language's defining characteristic.

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
    ExtendedBase.prototype.constructor = ExtendedBase;
    let obj = new ExtendedBase();

    obj.foo(); // "mixin2"

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
    Base.prototype.constructor = Base;
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
    Base.prototype.constructor = Base;

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

Chaining together prototypes is admittedly less memory-efficient than
destructively copying the mixin methods to the prototype of the base class.
In exchange, this approach of adding mixins to the prototype chain enables
compelling scenarios for aggregating behavior.


The Extensible class
====================

The Extensible class embodies the prototype chain approach to mixins in a
class that can be used either as a helper, or as a base class for creating
extensible classes.


Extending any class with a mixin object
---------------------------------------
In its simplest form, we can use the Extensible class' `extend()` method to
extend a class in exactly the way described above:

    let mixin = {
      foo() { return "mixin"; }
    };
    class Base {
      foo() { return "Base"; }
    }
    Base = Extensible.extend.call(Base, mixin);

    let obj = new Base();
    obj.foo(); // "mixin"

The call `Extensible.extend()` does is add mixin to the head of the prototype
chain, then update Base to point to the new head of the chain. It's simply
codifying the pattern described above.

The use of `Extensible.extend()` here is, of course, only slightly less
idiosyncratic than the use of something like `FrameworkDuJour.classFactory()`.
That said, the Extensible class is actually doing very little — it's just
constructing a prototype chain. Once that's done, there's nothing else going on
here but native JavaScript.

That's more than can be said of many frameworks, where the class factory may not
only perform considerable magic, it may produce an object with proprietary
internal data structures and behavior.


Creating extensible, mixin-ready classes
----------------------------------------
If you anticipate people wanting to extend your classes with mixins, you can do
that in several ways. The simplest is to derive your class from Extensible:

    let mixin = {
      foo() { return "mixin"; }
    }
    class Base extends Extensible {}
    Base = Base.extend(mixin);

which produces the same result as above. Multiple mixins can be supplied to
`extend()`:

    let mixin1 = { foo: "mixin1" };
    let mixin2 = { foo: "mixin2" };
    let mixin3 = { foo: "mixin3" };
    class Base extends Extensible {}
    Base = Base.extend(mixin1, mixin2, mixin3);

    let obj = new Base();
    obj.foo; // "mixin3"

The `extend()` function applies mixins to the head of the prototype chain in
order, so mixin3 ends up at the head of the chain. Hence, it's mixin3's value
of `foo` that's returned.

Classes created by extending Extensible inherit the ability to be extended
themselves.


Extending with classes, not just objects
----------------------------------------
Mixins are typically plain JavaScript objects, but Extensible's `extend()`
method can take classes as arguments:

    class Mixin {
      foo() { return "foo"; }
      static bar() { return "bar"; }
    }
    class Base extends Extensible {}
    Base = Base.extend(Mixin);

    let obj = new Base();
    obj.foo(); // "foo"
    Base.bar(); // "bar"

It's a matter of taste whether to define mixins as plain objects or classes.
There are some advantages to using a class:

* ES6 supplies a `class` syntax. It's a matter of opinion, but use of
  `class` may send a stronger signal about the author's intention to readers of
  the code. Specifically, a class suggests that the code embodies a
  self-contained package of behavior.
* A class can provide both static and instance members. The `extend()` method
  will include *both* when creating the extended class. Static members are
  handled as "last writer wins": base static class members are copied first,
  then mixin static class members in the order they're supplied.

Being able to compose classes into the prototype chain can open up new
opportunities. For example, it's possible to create a non-trivial class
hierarchy for *mixins*. When Extensible applies a mixin/class as an extension,
the members are copied from the mixin's prototype chain all the way up to Object
(for plain objects) or Function (for classes).


Making existing classes extensible
----------------------------------
Intrestingly, it turns out that you use Extensible to apply *itself* as a mixin.
This is useful if you're working with a base class defined elsewhere and can't
(or don't want to) make that particular base class extensible. You can create
an extensible subclass of that base class by supplying Extensible itself as an
argument to `extend()`:

    import Thing from 'some/external/dependency.js';
    let ExtensibleThing = Extensible.extend.call(Thing, Extensible);

    // ExtensibleThing now embodies extensible Thing objects.
    class Mixin { ... }
    let SpecialThing = ExtensibleThing.extend(Mixin);

This could be used, for example, to create an extensible subclass of a native
DOM class like HTMLElement:

    let ExtensibleElement = Extensible.extend.call(HTMLElement, Extensible);
    let helloMixin = {
      createdCallback() {
        this.textContent = "Hello, world!";
      }
    };
    class HelloElement extends ExtensibleElement {}
    HelloElement = HelloElement.extend(helloMixin);
    document.registerElement('hello-element', HelloElement);
    let element = document.createElement('hello-element'); // "Hello, world!"


Invoking base method implementations
====================================

A critical feature noted earlier was the ability to have mixins augment base
class behavior, not just override it. If multiple mixins or a base classe define
a method with the same name, we may want to be able to invoke all of those
implementations, not just the method belonging to the "last writer".

Since here mixins as objects on the prototype chain, we can solve this problem
just like it's always done in JavaScript: have method implementations cooperate
by invoking methods of the same name further up the prototype chain.


The `super` keyword in ES6
--------------------------
ES6 provides a concise and elegant means of doing *exactly* what we want with
its `super` keyword:

    class Mixin {
      foo() {
        return "Mixin " + super.foo();
      }
    }
    class Base extends Extensible {
      foo() {
        return "Base";
      }
    }
    Base = Base.extend(Mixin);

    let obj = new Base();
    obj.foo() // "Mixin Base"

In another language, the Mixin class' use of `super.foo()` might seem
strange, since Mixin doesn't originally inherit from anything. But JavaScript
is a prototypal language in which classes aren't anything fixed at compile
time; they're just a means of talking about the prototype chain. All
`super.foo()` does is invoke the next `foo()` implementation further up the
prototype chain. By the time `obj.foo()` is encountered, that prototype chain
includes Base's prototype, so `super.foo()` invokes Base' `foo()`
implementation.


Checking for base implementation before invoking `super`
--------------------------------------------------------
If the Mixin in the above example is used to extend a class that doesn't already
have a `foo()` method, its call to `super.foo()` will fail. So, unlike typical
subclasses, classes intended to extend other classes should be designed with
resiliency in mind. Specifically, mixin methods should check to see whether a
base implementation exists before invoking `super`. They should also generally
pass along the result returned from the superclass' implementation, unless
they specifically want to manipulate that result:

    class Mixin {
      foo() {
        let result = "Mixin";
        if (super.foo) {
          result += " " + super.foo();
        }
        return result;
      }
    }

This Mixin can now be used to extend any class, whether or not it has a `foo()`
method.


Invoking base implementations in ES5 using the `super` helper
-------------------------------------------------------------
While native ES6 neatly meets our needs here with `super`, a significant
question is how to accomplish the same result in ES5. The `super` behavior
turns out to be ferociously hard to polyfill in ES5.

Worse, when using an ES6-to-ES5 transpiler like Babel, the simplest way to
compile a call like `super.foo()` is for the compiler to hard-code a reference
to the base class at compile time. That solution is unfortunately incompatible
with Extensible's dynamic run-time modifications of the prototype chain. This
means that the `super` keyword can't be used with Extensible mixins that will
be compiled to ES5.

To allow method invocations up the prototype chain in ES5 (including ES6
transpiled to ES5), Extensible provides a `super` instance method. This takes as
its single argument a reference to the current mixin:

    class Mixin {
      foo() {
        let result = "Mixin";
        let superFoo = this.super(Mixin).foo;
        if (superFoo) {
          result += " " + superFoo();
        }
        return result;
      }
    }

The result of calling `super` will be the prototype *on this particular
prototype chain* which follows the indicated mixin. A single mixin can be used
to extend multiple base classes, so the result of calling `this.super(Mixin)`
above will depend on which base class was extended with Mixin to create `this`.

Once `this.super()` returns a prototype, the desired method can be inspected to
see if it exists and, if so, to invoke it. The above ES6 code can be safely
transpiled to ES5. While this syntax is obviously more verbose than the native
ES6 version, it's nevertheless helpful to be able to use Extensible mixins in
ES5.


Composition vs inheritance
==========================

The presence of a `class` keyword or `class A extends B` in these examples might
be taken as an indication that classical object-oriented inheritance is being
used. That might be problem for some people, who claim that composition of
behavior (such as mixins) is superior to classical inheritance. Inheritance,
they say, leads to complex, brittle systems. Whether or not that claim is true,
it's important to note that what's going on in the examples above is not
classical inheritance.

People from backgrounds in traditional class-oriented languages think of
JavaScript's prototype chain as synonymous with inheritance, but that's just one
way to conceptualize JavaScript. The prototype chain is just a dynamic linked
list -- how you want to use it is up to you.

In this case, we're using the prototype chain, not to implement classical
inheritance, but to compose behaviors in arbitrary combinations and orders.
Among other things, this means we can apply the same mixin at different points
in the "class hierarchy" to create results that cannot be achieved with strict
inheritance.

Suppose we have two classes, Base1 and Base2, which share no common ancestor
(aside from Object). We can extend both of those classes with the same mixin:

    class Base1 {}
    class Base2 {}
    class Mixin {
      foo() { return "foo"; }
    }
    ExtendedBase1 = Extensible.extend.call(Base1, Mixin);
    ExtendedBase2 = Extensible.extend.call(Base2, Mixin);

    obj1 = new ExtendedBase1();
    obj2 = new ExtendedBase2();

We now have a *copy* of the Mixin behavior along two different prototype chains:

    obj1 --> ExtendedBase1 (copy of Mixin) --> Base1 --> Object
    obj2 --> ExtendedBase2 (copy of Mixin) --> Base2 --> Object

Such a structure is not possible in classical single inheritance. Even thought
obj1 and obj2 share no ancestor but Object, we can apply the same method to
both:

    obj1.foo(); // "foo"
    obj2.foo(); // "foo" also

This form of composition allows an enormous degree of flexibility in factoring
code. Each distinct behavior can be packaged as a mixin object or class, and
then combined in many ways to create a desired set of instantiable classes. This
can allow you to achieve a good separation of concerns. At the same time,
capitalizing on the native nature of the JavaScript prototype chain allows your
codebase to introduce few new concepts that would have to be mastered by
newcomers to your codebase.
