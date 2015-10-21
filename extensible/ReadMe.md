ExtensibleClass
===============

mixins
Polymer behaviors

http://raganwald.com/2015/06/17/functional-mixins.html
http://raganwald.com/2015/06/20/purely-functional-composition.html

requirements:
* Look and feel like an ES6 solution.
* Introduce as few concepts as possible. Take advantage of the language instead
  of creating an interpreted solution.
* Allow multiple mixins/behaviors to define the same methods. Calling a method
  on an object instance should invoke all of the method implementations in the
  object's set of mixins.

