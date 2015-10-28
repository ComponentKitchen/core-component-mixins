Introduction
============

The module Extensible.js implements a class called Extensible that provides a
general-purpose means of composing class and object behavior with mixins using
the JavaScript prototype chain. This takes advantage of native language features
to reduce conceptual overhead and enable a substantial degree of expressiveness
and power.


Goals:

1. Provide a mixin solution that feels like a JavaScript solution. It should
work with the language, not fight against it. Design with ES6 in mind,
particularly its `class` and `super` keywords.
2. Introduce as few new concepts as possible.
3. Define an unambigious means of resolving conflicts in function names. If
multiple mixins/classes define a method with the same name, there should be a
predictable way of invoking all of them in a well-known order.


Example
-------
A typical example using the Extensible class in ES6 might look like:

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

Here, the Base class has been extended with a `foo()` method, so that method is
available to all instances of Base.

The remainder of this document walks through the motivation for this system and
explores typical usage.


Mixins
======

Many JavaScript frameworks have class factories that support mixins. Some
frameworks define behavior exclusively with mixins, eschewing anything that
looks like traditional single-inheritance classes. Other frameworks use mixins
to augment class creation.

While implementations vary, mixins are generally defined in JavaScript as
objects supplied to a factory method that creates classes. Let's consider the
use of mixins in a hypothetical JavaScript framework called FrameworkDuJour:

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

These features can make mixins a convenient way for you to factor behavior,
letting you compose behaviors to create the final classes you want. Because
mixin properties and methods are generally flattened into the prototype of the
class you're creating, they can be memory-efficient and performant.

That said, there are some disadvantages to mixins like this:

1. The Base class above feels like a first-class construct, while the mixin
feels second class. It can't be instantitated on its own, for example.
2. The use of the custom classFactory() method is idiosyncratic to this
particular framework. A developer looking at the above code can't know what how
the "mixins" key is going to affect the resulting class unless it knows more
about FrameworkDuJour.
3. Although we might assume that classFactory() is following common JavaScript
conventions for classes, we don't know that for sure. We might, for example,
assume that classFactory() is establishing a JavaScript prototype chain whose
behavior is governed by the language itself. We might assume that we can
instantiate Base with `new Base()`. But if we're unfamiliar with
FrameworkDuJour, we can't be sure how to work with Base, or how Base objects
will behave.


Mixin conflict resolution
-------------------------
A critical question is how to resolve conflicts in the names of mixin members.
For example, a mixin may declare a method of the same name as the target class
whose prototype is being modified, or multiple mixins applied to a target may
share methods of the same name.

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
see mixin2's implementation win, because it was specified last:

    instance.foo() // "mixin2"

However, the exact behavior may vary from framework to framework.

Moreover, there are many cases where it is desirable to let mixins *augment*
behavior, not override it. Here, "last writer wins" is insufficient. Frameworks
that want to support these situations may resolve name conflicts by invoking
all method implementations on the base class and any mixins applied to it:

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
Component frameworks like React and Polymer both treat certain "lifecycle
methods" specially: if multiple mixins implement a given lifecycle method, the
functions are composed. At those points in the component lifecycle, all the
mixin behaviors will apply. But other methods — those without the special
lifecycle names — are treated as "last writer wins".

All this complexity makes it hard to learn the specifics of a given framework,
let alone work effectively with multiple frameworks in the same codebase.


JavaScript already has an extension mechanism: the prototype chain
==================================================================

JavaScript already provides a native means of aggregating
behavior through the language's prototype chain, a simple linked list of
object prototypes. If multiple prototypes on the chain implement a method of the
same name, the order of the linked list resolves the name conflict: the first
prototype in the chain that implements the method wins. (If you're unfamiliar
with the prototype chain, many articles on the web cover the topic in depth. A
reasonable starting point is MDN's article on
[Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FInheritance_and_the_prototype_chain).)

This prototype chain is a language feature, and its behavior is definitively
unambiguous. All JavaScript implementations are required to treat the prototype
chain exactly the same. To many people, in fact, the prototypal nature of
JavaScript is the language's defining characteristic.

We can use the prototype chain as the basis for a mixin solution whose
conflict resolution strategy is both clearly defined and flexible. Instead of
copying mixin members into a target base class prototype, we can just extend
the prototype chain to include those mixins.

Let's first consider a brute-force approach that destructively modifies the
mixins to include them in the prototype chain:

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

The prototype chain is the same, it's just that name "Base" now points to a
different point in the chain:

    obj --> Base (mixin2) --> mixin1 --> (unnamed) --> Object

The brute-force destructive modification of the mixins here prevents their
incorporation into other prototype chains. To avoid this problem, we can copy
the mixins before changing their prototypes:

    let copy1 = Object.assign({}, mixin1);
    let copy2 = Object.assign({}, mixin2);
    Object.setPrototypeOf(copy1, Base.prototype);
    Object.setPrototypeOf(copy2, copy1);
    Base = copy1;
    Base.prototype.constructor = Base;

Now we have:

    obj --> Base (mixin2 copy) --> (mixin1 copy) --> (unnamed) --> Object

Using the prototype chain this way does create more objects than simply
flattening mixins into a single class' prototype. But any mixin approach that
wants to go beyond "last writer wins" and allow a single method call to invoke
implementations defined by mulitple methods/classes will also need to create
more objects (composed functions, array lists of which mixins implement which
methods, etc., depending on the framework). Such proprietary solutions are not
necessarily more efficient than using the prototype chain. In fact, there's
every reason to trust that JavaScript engine implementors have gone to great
lengths to ensure that use of the prototype chain is highly efficient.

Leveraging a prototype chain which is part of the JavaScript language provides
additional advantages:

* The behavior of the prototype chain is well-documented in an endless number
  of JavaScript books, tutorials, blog posts, etc.
* A constructed prototype chain allows us to reason about object behaviors
  (e.g., in the debugger), even if don't know anything about the code that
  assembled that prototype chain.
* The prototype chain will be directly supported in JavaScript forever, even as
  the language evolves. E.g., ES6 classes codify a convention for manipulating
  the prototype chain.


The Extensible class
====================

The Extensible class embodies the prototype chain approach to mixins which is
sketched out above in a class that can be used either as a helper, or as a base
class for creating extensible classes.


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

The call to `Extensible.extend()` just adds mixin to the head of the prototype
chain. The reference Base is then updated to point to the new head of the chain.
This is simply codifying the pattern described above.

The use of `Extensible.extend()` here is, of course, only slightly less
idiosyncratic than the use of something like `FrameworkDuJour.classFactory()`.
That said, the Extensible class is actually doing very little — it's just
extending a prototype chain. No other framework magic is going on. That's more
than can be said of many frameworks, where the class factory may not only
perform considerable magic, it may produce an object with proprietary internal
data structures and behavior.


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
order, so mixin3 ends up at the head of the chain. This is equivalent to:

    Base = Base.extend(mixin1).extend(mixin2).extend(mixin3);

Hence, it's mixin3's value of `foo` that's returned.

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
Being able to compose classes into the prototype chain can open up new
opportunities:

* A mixin defined as a class is a first-class construct, and can be instantiated
  directly with `new()`.
* ES6 supplies a `class` syntax. It's a matter of opinion, but use of
  `class` may send a stronger signal about the author's intention to readers of
  the code. Specifically, a class suggests that the code embodies a
  self-contained package of behavior.
* A class can provide both static and instance members. The `extend()` method
  will include *both* when creating the extended class. Static members are
  handled as "last writer wins": base static class members are copied first,
  then mixin static class members in the order they're supplied.
* It's possible to create a non-trivial class hierarchy for *mixins*. When
  Extensible applies a mixin class as an extension, the members are copied from
  the mixin's overall prototype chain (not including Function or Object).


Making existing classes extensible
----------------------------------
Interestingly, you can use the Extensible class to apply *itself* as a mixin.
This is useful if you're working with a base class defined elsewhere and can't
(or don't want to) make that particular base class extensible. You can create
an extensible subclass of that base class by supplying Extensible itself as an
argument to its own `extend()` method:

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

Since here mixins are just objects on the prototype chain, we can solve this
problem just like it's always done in JavaScript: have method implementations
cooperate by invoking methods of the same name further up the prototype chain.


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

For the Extensible system of mixins to work, mixins need to cooperate. Each
mixin method implementation should generally take care to give the
superclass(es) a chance to perform their work as well. This obviously requires
mixin authors to do a little more work, and opens up the possibility of a mixin
author forgetting to do so. In exchange, however, mixins end up with a system
for resolving method name conflicts which is entirely standard to JavaScript,
and not a proprietary system unique to any single framework.



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

Worse, when using an ES6-to-ES5 transpiler like Babel, the simplest way for the
compiler to handle a call like `super.foo()` is to emit a hard-coded reference
to the base class. That solution is unfortunately incompatible with Extensible's
dynamic run-time modifications of the prototype chain. This means the `super`
keyword can't be used with Extensible mixins transpiled to ES5.

To allow method invocations up the prototype chain in ES5 (including ES6
transpiled to ES5), Extensible provides an alternate syntax. Instead of writing
`super.<method>` in ES6, in ES5, the longer `this.<mixin>.super.<method>` can
be used:

    class Mixin {
      foo() {
        let result = "Mixin";
        let superFoo = this.Mixin.super.foo;
        if (superFoo) {
          result += " " + superFoo();
        }
        return result;
      }
    }

This takes advantage of two features of Extensible-created classes/objects.
First, when the mixin named `Mixin` is applied to create a new class, objects
of that class will have a new corresponding property `this.Mixin` which refers
to the specific point on this particular prototype chain at which Mixin was
applied. Furthermore, objects of that class will also have a property called
`this.super` that reference the prototype one step up on the prototype chain.

These two references can be combined as shown above: `this.Mixin.super.foo`.
That means: "Get the prototype that was created when Mixin was applied, go one
step up to the superclass, and get its foo method". That is, get the superclass'
implementation of `foo`.

Importantly, these mixin-named properties and the `super` property are
specific to an object's particular prototype chain. A single mixin can be used
to extend multiple base classes, so the result of calling `this.Mixin.super`
will always give the correct result relative to the object in question.

Once `super` returns a prototype, the desired method can be inspected to see if
it exists and, if so, to invoke it. The above ES6 code can be safely transpiled
to ES5. While this syntax is more verbose than the native ES6 version, it's
nevertheless helpful to be able to use Extensible mixins in ES5.


Composition vs inheritance
==========================

The presence of a `class` keyword or `class A extends B` syntax in these
examples might be taken as an indication of classical single inheritance. That
might be problem for people who believe that composition of behavior (such as
mixins) is superior to classical inheritance. Such people may feel that
inheritance leads to complex, brittle systems. Whether or not that claim is
true, it's important to note that what's going on in the examples above is not
classical single inheritance.

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
permits a good separation of concerns. At the same time, capitalizing on the
native nature of the JavaScript prototype chain allows your codebase to
minimize the number of new concepts that must mastered by future maintainers.


Framework independence
======================

Because this approach just uses the JavaScript prototype chain in a standard
way, mixins designed this way are *independent of any framework*. As long as
they cooperate with other mixins — by invoking `super` when appropriate — they
can be composed into classes by other systems using the same pattern. The
Extensible class documented here, and its `extend()` method, represent just one
possible implementation.
