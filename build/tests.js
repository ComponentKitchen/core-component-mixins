(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Extend classes/objects with other classes/objects.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Extensible = (function () {
  function Extensible() {
    _classCallCheck(this, Extensible);
  }

  /*
   * All Extensible-created objects keep references to the extensions that were
   * applied to create them. When a *named* extension is applied to the prototype
   * chain, the resulting object (or, for a class, the class' prototype) will
   * have a new member with that name that points back to the same object.
   * That facility is useful when dealing with chains that have been extended
   * more than once, as an extension's name is sufficient to retrieve a reference
   * to that point in the prototype chain.
   *
   * A single extension can be applied to multiple prototype chains -- the name
   * refers to the prototype on *this particular prototype chain* that was added
   * for that extension. This lets extension/mixin code get back to its own
   * prototype, most often in combination with "super" (see below) in order to
   * invoke superclass behavior.
   */

  _createClass(Extensible, null, [{
    key: 'extend',

    /*
     * Return a subclass of the current class that includes the members indicated
     * in the argument. The argument can be a plain JavaScript object, or a class
     * whose prototype contains the members that will be copied.
     *
     * This can be used for a couple of purposes:
     * 1. Extend a class with mixins/behaviors.
     * 2. Create a component class in ES5.
     *
     * The call
     *
     *   MyBaseClass.extend(Extension1, Extension2, Extension3)
     *
     * will return a new class of MyBaseClass that implements all the methods in
     * the three extensions given. The above is equivalent to
     *
     *   MyBaseClass.extend(Extension1).extend(Extension2).extend(Extension3)
     *
     * This method can be statically invoked to extend plain objects:
     *
     *   let extended = Extensible.extend.call(obj1, obj2);
     *
     */
    value: (function (_extend) {
      function extend() {
        return _extend.apply(this, arguments);
      }

      extend.toString = function () {
        return _extend.toString();
      };

      return extend;
    })(function () {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      // We create a new subclass for each extension in turn. The result becomes
      // the base class extended by any subsequent extensions. It turns out that
      // we can use Array.reduce() to concisely express this, using the current
      // (original) class as the seed for reduce().
      return extensions.reduce(extend, this);
    })
  }]);

  return Extensible;
})();

Extensible.prototype.Extensible = Extensible.prototype;

/*
 * All Extensible-created objects have a "super" property that references the
 * prototype above them in the prototype chain.
 *
 * This "super" reference is used as a replacement for ES6's "super" keyword in
 * in ES5 (or transpiled ES6) extensions/mixins
 * that want to invoke superclass behavior, where the specific superclass will
 * depend upon which extensions have been applied to a given prototype chain.
 *
 * E.g.:
 *   class Mixin {
 *     foo() {
 *       if (this.Mixin._super.foo) {
 *         this.Mixin._super.foo.call(this); // Invoke superclass' foo()
 *       }
 *       // Do Mixin-specific work here...
 *     }
 *   }
 *
 * For consistency, Extensible itself records its own superclass as Object.
 */
Extensible.prototype._super = Object.prototype;

/*
 * Copy the given properties/methods to the target.
 */
function copyOwnProperties(source, target) {
  var ignorePropertyNames = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (ignorePropertyNames.indexOf(name) < 0) {
      var descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

/*
 * Return a new subclass/object that extends the given base class/object with
 * the members of the indicated extension.
 */
function extend(base, extension) {

  // Check whether the base and extension are classes or plain objects.
  var baseIsClass = isClass(base);
  var extensionIsClass = isClass(extension);

  // Check to see if the *extension* has a base class/prototype of its own.
  var extensionBase = extensionIsClass ? Object.getPrototypeOf(extension.prototype).constructor : Object.getPrototypeOf(extension);
  if (extensionBase && extensionBase !== Function && extensionBase !== Object) {
    // The extension itself derives from another class/object.
    // Recurse, and extend with the extension's base first.
    base = extend(base, extensionBase);
  }

  // Create the extended object we're going to return as a result.
  var result = undefined;
  if (baseIsClass) {
    // Create a subclass of base. Once WebKit supports HTMLElement as a real
    // class, we can just say:
    //
    //   class subclass extends base {}
    //
    // However, until that's resolved, we have to construct the class ourselves.
    result = function subclass() {};
    Object.setPrototypeOf(result, base);
    Object.setPrototypeOf(result.prototype, base.prototype);
  } else {
    // Create a plain object that simply uses the base as a prototype.
    result = Object.create(base);
  }

  var source = undefined;
  var target = undefined;
  if (baseIsClass && extensionIsClass) {
    // Extending a class with a class.
    // We'll copy instance members in a moment, but first copy static members.
    copyOwnProperties(extension, result, Object.getOwnPropertyNames(Function));
    source = extension.prototype;
    target = result.prototype;
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    source = extension.prototype;
    target = result;
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    source = extension;
    target = result.prototype;
  } else {
    // Extending a plain object with a plain object.
    source = extension;
    target = result;
  }
  copyOwnProperties(source, target, ['constructor']);

  if (extension.name) {
    // Use the extension's name (usually the name of a class' constructor) to
    // save a reference back to the newly-created object in the prototype chain.
    target[extension.name] = target;

    // Save a reference to the superclass/super-object. See the comments on
    // Extensible's "super" property.
    target._super = baseIsClass ? base.prototype : base;
  }

  return result;
}

// Return true if c is a JavaScript class.
// We use this test because, on WebKit, classes like HTMLElement are special,
// and are not instances of Function. To handle that case, we use a looser
// definition: an object is a class if it has a prototype, and that prototype
// has a constructor that is the original object. This condition holds true even
// for HTMLElement on WebKit.
function isClass(c) {
  return typeof c === 'function' || // Standard
  c.prototype && c.prototype.constructor === c; // HTMLElement in WebKit
}

exports['default'] = Extensible;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _extensibleExtensible = require("../extensible/Extensible");

var _extensibleExtensible2 = _interopRequireDefault(_extensibleExtensible);

/* Sample classes used by the test suite */

/* A simple base class */

var ExampleBase = (function (_Extensible) {
  _inherits(ExampleBase, _Extensible);

  function ExampleBase() {
    _classCallCheck(this, ExampleBase);

    _get(Object.getPrototypeOf(ExampleBase.prototype), 'constructor', this).apply(this, arguments);
  }

  /* Extension that defines a property */

  _createClass(ExampleBase, [{
    key: 'foo',
    value: function foo() {
      return 'ExampleBase';
    }
  }]);

  return ExampleBase;
})(_extensibleExtensible2['default']);

var PropertyExtension = (function () {
  function PropertyExtension() {
    _classCallCheck(this, PropertyExtension);
  }

  /* Extension that defines a method */

  _createClass(PropertyExtension, [{
    key: 'property',
    get: function get() {
      return 'value';
    }
  }]);

  return PropertyExtension;
})();

var MethodExtension = (function () {
  function MethodExtension() {
    _classCallCheck(this, MethodExtension);
  }

  _createClass(MethodExtension, [{
    key: 'method',
    value: function method() {
      var superMethod = this.MethodExtension._super.method;
      var result = superMethod ? superMethod.call(this) : 'extension result';
      this.extensionMethodInvoked = true;
      return result;
    }
  }]);

  return MethodExtension;
})();

suite("Extensible", function () {

  test("can extend class with ES6 class syntax", function () {
    var Subclass = (function (_ExampleBase) {
      _inherits(Subclass, _ExampleBase);

      function Subclass() {
        _classCallCheck(this, Subclass);

        _get(Object.getPrototypeOf(Subclass.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(Subclass, [{
        key: 'bar',
        get: function get() {
          return true;
        }
      }]);

      return Subclass;
    })(ExampleBase);

    var instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("can extend class with ES5-compatible .extend() syntax", function () {
    var Subclass = ExampleBase.extend({
      bar: true
    });
    var instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("class extension can define a property", function () {
    var Subclass = ExampleBase.extend(PropertyExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
  });

  test("class extension can define a method", function () {
    var Subclass = ExampleBase.extend(MethodExtension);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

  test("extension method can use super() to invoke base class implementation", function () {
    var Subclass = (function (_ExampleBase2) {
      _inherits(Subclass, _ExampleBase2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        _get(Object.getPrototypeOf(Subclass.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(Subclass, [{
        key: 'method',
        value: function method() {
          this.baseMethodInvoked = true;
          return 'base result';
        }
      }]);

      return Subclass;
    })(ExampleBase);

    Subclass = Subclass.extend(MethodExtension);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'base result');
    assert(instance.extensionMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple extensions can be applied in one call", function () {
    var Subclass = ExampleBase.extend(PropertyExtension, MethodExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
    var result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

  test("can extend a plain object", function () {
    var obj = {
      method: function method() {
        return 'result';
      }
    };
    var extension = {
      property: 'value'
    };
    var extended = _extensibleExtensible2['default'].extend.call(obj, extension);
    assert.equal(extended.method(), 'result');
    assert.equal(extended.property, 'value');
  });

  test("extension can has multiple levels of inheritance", function () {
    var ExtensionSubclass = (function (_MethodExtension) {
      _inherits(ExtensionSubclass, _MethodExtension);

      function ExtensionSubclass() {
        _classCallCheck(this, ExtensionSubclass);

        _get(Object.getPrototypeOf(ExtensionSubclass.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(ExtensionSubclass, [{
        key: 'method',
        value: function method() {
          var superMethod = this.ExtensionSubclass._super.method;
          if (superMethod) {
            superMethod.call(this);
          }
          this.extensionSubclassMethodInvoked = true;
        }
      }]);

      return ExtensionSubclass;
    })(MethodExtension);

    var Subclass = _extensibleExtensible2['default'].extend(ExtensionSubclass);
    var instance = new Subclass();
    instance.method();
    assert(instance.extensionMethodInvoked);
    assert(instance.extensionSubclassMethodInvoked);
  });

  test("extension property can reference superclass' property", function () {
    var PropertyExtension = (function () {
      function PropertyExtension() {
        _classCallCheck(this, PropertyExtension);
      }

      _createClass(PropertyExtension, [{
        key: 'property',
        get: function get() {
          var superPrototype = this.PropertyExtension._super;
          var descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
          return descriptor ? descriptor.get.call(this) : 'extension value';
        }
      }]);

      return PropertyExtension;
    })();

    var Subclass = (function (_Extensible2) {
      _inherits(Subclass, _Extensible2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        _get(Object.getPrototypeOf(Subclass.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(Subclass, [{
        key: 'property',
        get: function get() {
          return 'base value';
        }
      }]);

      return Subclass;
    })(_extensibleExtensible2['default']);

    Subclass = Subclass.extend(PropertyExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'base value');
  });
});

},{"../extensible/Extensible":1}]},{},[2]);
