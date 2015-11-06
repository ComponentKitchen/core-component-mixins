(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})(); /*
       * Extend classes/objects with other classes/objects.
       */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CompositionRules = require('./CompositionRules');

var CompositionRules = _interopRequireWildcard(_CompositionRules);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Composable = (function () {
  function Composable() {
    _classCallCheck(this, Composable);
  }

  _createClass(Composable, [{
    key: 'decorate',
    value: function decorate(decorators) {
      Composable.decorate.call(this, decorators);
    }

    // Decorate for annotating how a class member should be composed later.
    // This takes a decorator that will be run at *composition* time.
    // For now, this can only be applied to methods.

  }], [{
    key: 'compose',

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
     *   MyBaseClass.compose(Mixin1, Mixin2, Mixin3)
     *
     * will return a new class of MyBaseClass that implements all the methods in
     * the three mixins given. The above is equivalent to
     *
     *   MyBaseClass.compose(Mixin1).compose(Mixin2).compose(Mixin3)
     *
     * This method can be statically invoked to extend plain objects:
     *
     *   let extended = Composable.extend.call(obj1, obj2);
     *
     */
    value: function compose() {
      for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
        mixins[_key] = arguments[_key];
      }

      // We create a new subclass for each mixin in turn. The result becomes
      // the base class extended by any subsequent mixins. It turns out that
      // we can use Array.reduce() to concisely express this, using the current
      // (original) class as the seed for reduce().
      return mixins.reduce(_compose, this);
    }
  }, {
    key: 'decorate',
    value: function decorate(decorators) {
      for (var key in decorators) {
        var decorator = decorators[key];
        var descriptor = Object.getOwnPropertyDescriptor(this, key);
        decorator(this, key, descriptor);
        Object.defineProperty(this, key, descriptor);
      }
    }
  }, {
    key: 'rule',
    value: function rule(decorator) {
      // We return a decorator that just adds the decorator given above to the
      // member.
      return function (target, key, descriptor) {
        // TODO: Use a Symbol instead of a string property name to save this.
        descriptor.value._compositionRule = decorator;
      };
    }
  }]);

  return Composable;
})();

/*
 * Expose standard composition rules as properties of Composable.
 * This avoids the need for someone to make a separate import of the rules.
 */

exports.default = Composable;
Composable.rules = CompositionRules;

/*
 * All Composable-created objects keep references to the mixins that were
 * applied to create them. When a *named* mixin is applied to the prototype
 * chain, the resulting object (or, for a class, the class' prototype) will
 * have a new member with that name that points back to the same object.
 * That facility is useful when dealing with chains that have been extended
 * more than once, as an mixin's name is sufficient to retrieve a reference
 * to that point in the prototype chain.
 *
 * A single mixin can be applied to multiple prototype chains -- the name
 * refers to the prototype on *this particular prototype chain* that was added
 * for that mixin. This lets mixin/mixin code get back to its own
 * prototype, most often in combination with "super" (see below) in order to
 * invoke superclass behavior.
 */
Composable.prototype.Composable = Composable.prototype;

/*
 * All Composable-created objects have a "super" property that references the
 * prototype above them in the prototype chain.
 *
 * This "super" reference is used as a replacement for ES6's "super" keyword in
 * in ES5 (or transpiled ES6) mixins that want to invoke superclass behavior,
 * where the specific superclass will depend upon which mixins have been applied
 * to a given prototype chain.
 *
 * E.g.:
 *   class Mixin {
 *     foo() {
 *       if (this.Mixin.super.foo) {
 *         this.Mixin.super.foo.call(this); // Invoke superclass' foo()
 *       }
 *       // Do Mixin-specific work here...
 *     }
 *   }
 *
 * For consistency, Composable itself records its own superclass as Object.
 */
Composable.prototype.super = Object.prototype;

// Composition rules for standard object members.
Composable.prototype.compositionRules = {
  constructor: Composable.override,
  toString: Composable.override
};

function applyCompositionRules(obj) {
  var base = Object.getPrototypeOf(obj);
  Object.getOwnPropertyNames(obj).forEach(function (name) {
    if (name in base) {
      // Base also implements a member with the same name; need to combine.
      var descriptor = Object.getOwnPropertyDescriptor(obj, name);
      var rule = descriptor.value && descriptor.value._compositionRule;
      if (!rule) {
        // See if prototype chain has a rule for this member.
        rule = obj.compositionRules[name];
      }
      if (!rule) {
        rule = getDefaultCompositionRule(descriptor);
      }
      // "override" is a known no-op, so we don't bother trying to redefine the
      // property.
      if (rule && rule !== Composable.override) {
        rule(obj, name, descriptor);
        Object.defineProperty(obj, name, descriptor);
      }
    }
  });
}

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
 * the members of the indicated mixin.
 */
function _compose(base, mixin) {

  // Check whether the base and mixin are classes or plain objects.
  var baseIsClass = isClass(base);
  var mixinIsClass = isClass(mixin);

  // Check to see if the *mixin* has a base class/prototype of its own.
  var mixinBase = mixinIsClass ? Object.getPrototypeOf(mixin.prototype).constructor : Object.getPrototypeOf(mixin);
  if (mixinBase && mixinBase !== Function && mixinBase !== Object && mixinBase !== Object.prototype) {
    // The mixin itself derives from another class/object.
    // Recurse, and extend with the mixin's base first.
    base = _compose(base, mixinBase);
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
  if (baseIsClass && mixinIsClass) {
    // Properties defined by Function.
    // We'd prefer to get by interrogating Function itself, but WebKit functions
    // have some properties (arguments and caller) which are not returned by
    // Object.getOwnPropertyNames(Function).
    var FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];
    // Extending a class with a class.
    // We'll copy instance members in a moment, but first copy static members.
    copyOwnProperties(mixin, result, FUNCTION_PROPERTIES);
    source = mixin.prototype;
    target = result.prototype;
  } else if (!baseIsClass && mixinIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    source = mixin.prototype;
    target = result;
  } else if (baseIsClass && !mixinIsClass) {
    // Extending class with plain object.
    // Copy mixin to result prototype.
    source = mixin;
    target = result.prototype;
  } else {
    // Extending a plain object with a plain object.
    source = mixin;
    target = result;
  }
  copyOwnProperties(source, target, ['constructor']);

  applyCompositionRules(target);

  if (mixin.name) {
    // Use the mixin's name (usually the name of a class' constructor) to
    // save a reference back to the newly-created object in the prototype chain.
    target[mixin.name] = target;

    // Save a reference to the superclass/super-object. See the comments on
    // Composable's "super" property.
    target.super = baseIsClass ? base.prototype : base;
  }

  return result;
}

function getDefaultCompositionRule(descriptor) {
  if (typeof descriptor.value === 'function') {
    return Composable.rules.propagateFunction;
  } else if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
    // Property with getter and/or setter.
    return Composable.rules.propagateProperty;
  }
  return null;
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

},{"./CompositionRules":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeFunction = composeFunction;
exports.getPropertyDescriptor = getPropertyDescriptor;
exports.override = override;
exports.preferBaseResult = preferBaseResult;
exports.preferMixinResult = preferMixinResult;
exports.propagateFunction = propagateFunction;
exports.propagateProperty = propagateProperty;
/**
 * Standard composition rules
 */

// Take two functions and return a new composed function that invokes both.
// The composed function will return the result of the second function.
// This is not a rule, but a helper used by rules.
function composeFunction(function1, function2) {
  return function () {
    function1.apply(this, arguments);
    return function2.apply(this, arguments);
  };
}

// Like Object.getOwnPropertyDescriptor(), but walks up the prototype chain.
// This is needed by composition rules, which usually start out by getting
// the base implementation of a member they're composing.
// This is not a rule, but a helper used by rules.
function getPropertyDescriptor(obj, name) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, name);
  if (descriptor) {
    return descriptor;
  } else {
    var prototype = Object.getPrototypeOf(obj);
    // Checking for "name in prototype" lets us know whether we should bother
    // walking up the prototype chain.
    if (prototype && name in prototype) {
      return getPropertyDescriptor(prototype, name);
    }
  }
  return undefined; // Not found
}

// Combinator that causes a mixin method to override its base implementation.
// Since this the default behavior of the prototype chain, this is a no-op.
function override(target, key, descriptor) {}

// Compose methods, invoking base implementation first. If it returns a
// truthy result, that is returned. Otherwise, the mixin implementation's
// result is returned.
function preferBaseResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = function () {
    return baseImplementation.apply(this, arguments) || mixinImplementation.apply(this, arguments);
  };
}

// Compose methods, invoking mixin implementation first. If it returns a
// truthy result, that is returned. Otherwise, the base implementation's
// result is returned.
function preferMixinResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = function () {
    return mixinImplementation.apply(this, arguments) || baseImplementation.apply(this, arguments);
  };
}

// Default rule for composing methods: invoke base first, then mixin.
function propagateFunction(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = composeFunction(baseImplementation, mixinImplementation);
}

// Default rule for composing properties.
// We only compose setters, which invoke base first, then mixin.
// A defined mixin getter overrides a base getter.
// Note that, because of the way property descriptors work, if the mixin only
// defines a setter, but not a getter, we have to supply a default getter that
// invokes the base getter. Similarly, if the mixin just defines a getter,
// we have to supply a default setter.
function propagateProperty(target, key, descriptor) {
  var base = Object.getPrototypeOf(target);
  var baseDescriptor = getPropertyDescriptor(base, key);
  if (descriptor.get && !descriptor.set && baseDescriptor.set) {
    // Need to supply default setter.
    descriptor.set = function (value) {
      baseDescriptor.set.call(this, value);
    };
  } else if (descriptor.set) {
    if (!descriptor.get && baseDescriptor.get) {
      // Need to supply default getter.
      descriptor.get = function () {
        return baseDescriptor.get.call(this);
      };
    }
    // Compose setters.
    descriptor.set = composeFunction(baseDescriptor.set, descriptor.set);
  }
}

},{}],3:[function(require,module,exports){
'use strict';

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/*
 * Extend classes/objects with other classes/objects.
 */

var Extensible = (function () {
  function Extensible() {
    _classCallCheck(this, Extensible);
  }

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
    value: function extend() {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      // We create a new subclass for each extension in turn. The result becomes
      // the base class extended by any subsequent extensions. It turns out that
      // we can use Array.reduce() to concisely express this, using the current
      // (original) class as the seed for reduce().
      return extensions.reduce(_extend, this);
    }
  }]);

  return Extensible;
})();

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
 *       if (this.Mixin.super.foo) {
 *         this.Mixin.super.foo.call(this); // Invoke superclass' foo()
 *       }
 *       // Do Mixin-specific work here...
 *     }
 *   }
 *
 * For consistency, Extensible itself records its own superclass as Object.
 */
Extensible.prototype.super = Object.prototype;

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
function _extend(base, extension) {

  // Check whether the base and extension are classes or plain objects.
  var baseIsClass = isClass(base);
  var extensionIsClass = isClass(extension);

  // Check to see if the *extension* has a base class/prototype of its own.
  var extensionBase = extensionIsClass ? Object.getPrototypeOf(extension.prototype).constructor : Object.getPrototypeOf(extension);
  if (extensionBase && extensionBase !== Function && extensionBase !== Object) {
    // The extension itself derives from another class/object.
    // Recurse, and extend with the extension's base first.
    base = _extend(base, extensionBase);
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
    // Properties defined by Function.
    // We'd prefer to get by interrogating Function itself, but WebKit functions
    // have some properties (arguments and caller) which are not returned by
    // Object.getOwnPropertyNames(Function).
    var FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];
    // Extending a class with a class.
    // We'll copy instance members in a moment, but first copy static members.
    copyOwnProperties(extension, result, FUNCTION_PROPERTIES);
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
    target.super = baseIsClass ? base.prototype : base;
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

exports.default = Extensible;

},{}],4:[function(require,module,exports){
'use strict';

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/*
 * Marshall attributes to properties (and eventually vice versa).
 */

var AttributeMarshalling = (function () {
  function AttributeMarshalling() {
    _classCallCheck(this, AttributeMarshalling);
  }

  _createClass(AttributeMarshalling, [{
    key: 'attributeChangedCallback',

    /*
     * Handle a change to the attribute with the given name.
     */
    value: function attributeChangedCallback(name, oldValue, newValue) {
      // If the attribute name corresponds to a property name, then set that
      // property. Ignore changes in standard HTMLElement properties.
      var propertyName = attributeToPropertyName(name);
      if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
        this[propertyName] = newValue;
      }
    }
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      [].forEach.call(this.attributes, function (attribute) {
        _this.attributeChangedCallback(attribute.name, undefined, attribute.value);
      });
    }
  }]);

  return AttributeMarshalling;
})();

// Convert camel case fooBar name to hyphenated foo-bar.

exports.default = AttributeMarshalling;
function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

},{}],5:[function(require,module,exports){
'use strict';

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/*
 * Polymer-style automatic node finding.
 * See https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding.
 */

var AutomaticNodeFinding = (function () {
  function AutomaticNodeFinding() {
    _classCallCheck(this, AutomaticNodeFinding);
  }

  _createClass(AutomaticNodeFinding, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      if (this.shadowRoot) {
        this.$ = {};
        var nodesWithIds = this.shadowRoot.querySelectorAll('[id]');
        [].forEach.call(nodesWithIds, function (node) {
          var id = node.getAttribute('id');
          _this.$[id] = node;
        });
      }
    }
  }]);

  return AutomaticNodeFinding;
})();

exports.default = AutomaticNodeFinding;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
                                                                                               value: true
});

var _Composable = require('../extensible/Composable');

var _Composable2 = _interopRequireDefault(_Composable);

function _interopRequireDefault(obj) {
                                                                                               return obj && obj.__esModule ? obj : { default: obj };
}

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
var ComposableElement = _Composable2.default.compose.call(HTMLElement, _Composable2.default); /*
                                                                                               * A composable HTML element.
                                                                                               *
                                                                                               * This class is provided just as a convenience. One could also start with
                                                                                               * HTMLElement at the top level, and add extensibility by mixing in Composable.
                                                                                               */

exports.default = ComposableElement;

},{"../extensible/Composable":1}],7:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComposableElement2 = require('./ComposableElement');

var _ComposableElement3 = _interopRequireDefault(_ComposableElement2);

var _TemplateStamping = require('./TemplateStamping');

var _TemplateStamping2 = _interopRequireDefault(_TemplateStamping);

var _AutomaticNodeFinding = require('./AutomaticNodeFinding');

var _AutomaticNodeFinding2 = _interopRequireDefault(_AutomaticNodeFinding);

var _AttributeMarshalling = require('./AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
} /*
   * A sample general-purpose base class for defining custom elements that mixes
   * in some common features: template stamping into a shadow root, automatic node
   * finding, and marshalling between attributes and properties.
   */

var ElementBase = (function (_ComposableElement) {
  _inherits(ElementBase, _ComposableElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementBase).apply(this, arguments));
  }

  _createClass(ElementBase, [{
    key: 'log',

    /* For debugging */
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
})(_ComposableElement3.default);

exports.default = ElementBase = ElementBase.compose(_TemplateStamping2.default, // before node finding, so shadow root is populated
_AutomaticNodeFinding2.default, // before marshalling, so marshalled properties can use it
_AttributeMarshalling2.default);

document.registerElement('element-base', ElementBase);

},{"./AttributeMarshalling":4,"./AutomaticNodeFinding":5,"./ComposableElement":6,"./TemplateStamping":8}],8:[function(require,module,exports){
'use strict';

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/*
 * Element extension for template stamping. If a component defines a template
 * property (as a string or referencing a HTML template), when the component
 * class is instantiated, a shadow root will be created on the instance, and
 * the contents of the template will be cloned into the shadow root.
 *
 * For the time being, this extension retains support for Shadow DOM v0.
 * That will eventually be deprecated as browsers implement Shadow DOM v1.
 */

var TemplateStamping = (function () {
  function TemplateStamping() {
    _classCallCheck(this, TemplateStamping);
  }

  _createClass(TemplateStamping, [{
    key: 'createdCallback',

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    value: function createdCallback() {
      var template = this.template;
      if (typeof template === 'string') {
        // Upgrade plain string to real template.
        template = createTemplateWithInnerHTML(template);
      }
      if (template && USING_SHADOW_DOM_V0) {
        polyfillSlotWithContent(template);
      }
      if (window.ShadowDOMPolyfill) {
        shimTemplateStyles(template, this.localName);
      }
      // TODO: Save the processed template with the component's class prototype
      // so it doesn't need to be processed with every instantiation.
      if (template) {
        // this.log("cloning template into shadow root");
        var root = USING_SHADOW_DOM_V0 ? this.createShadowRoot() : // Shadow DOM v0
        this.attachShadow({ mode: 'open' }); // Shadow DOM v1
        var clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
    }
  }]);

  return TemplateStamping;
})();

// Feature detection for old Shadow DOM v0.

exports.default = TemplateStamping;
var USING_SHADOW_DOM_V0 = typeof HTMLElement.prototype.createShadowRoot !== 'undefined';

// Convert a plain string of HTML into a real template element.
function createTemplateWithInnerHTML(innerHTML) {
  var template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  var div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}

// Replace occurences of v1 slot elements with v0 content elements.
// This does not yet map named slots to content select clauses.
function polyfillSlotWithContent(template) {
  [].forEach.call(template.content.querySelectorAll('slot'), function (slotElement) {
    var contentElement = document.createElement('content');
    slotElement.parentNode.replaceChild(contentElement, slotElement);
  });
}

// Invoke basic style shimming with ShadowCSS.
function shimTemplateStyles(template, tag) {
  WebComponents.ShadowCSS.shimStyling(template.content, tag);
}

},{}],9:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _Composable5 = require('../extensible/Composable');

var _Composable6 = _interopRequireDefault(_Composable5);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/* Sample classes used by the test suite */

/* A simple base class */

var ExampleBase = (function (_Composable) {
  _inherits(ExampleBase, _Composable);

  function ExampleBase() {
    _classCallCheck(this, ExampleBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExampleBase).apply(this, arguments));
  }

  _createClass(ExampleBase, [{
    key: 'method',
    value: function method() {
      this.baseMethodInvoked = true;
      return 'ExampleBase';
    }
  }, {
    key: 'property',
    get: function get() {
      this.baseGetterInvoked = true;
      return this._property;
    },
    set: function set(value) {
      this._property = value;
      this.baseSetterInvoked = true;
    }
  }]);

  return ExampleBase;
})(_Composable6.default);

/* Mixin that augments a property setter. */

var PropertyMixin = (function () {
  function PropertyMixin() {
    _classCallCheck(this, PropertyMixin);
  }

  _createClass(PropertyMixin, [{
    key: 'property',
    set: function set(value) {
      this.mixinSetterInvoked = true;
    }
  }]);

  return PropertyMixin;
})();

/* Mixin that defines a method */

var MethodMixin = (function () {
  function MethodMixin() {
    _classCallCheck(this, MethodMixin);
  }

  _createClass(MethodMixin, [{
    key: 'method',
    value: function method() {
      this.mixinMethodInvoked = true;
      return 'MethodMixin';
    }
  }]);

  return MethodMixin;
})();

/* Mixin that overrides a base method */

var MethodMixinOverride = (function () {
  function MethodMixinOverride() {
    _classCallCheck(this, MethodMixinOverride);
  }

  _createClass(MethodMixinOverride, [{
    key: 'method',
    value: function method() {
      this.mixinMethodInvoked = true;
      return 'MethodMixin';
    }
  }]);

  return MethodMixinOverride;
})();

_Composable6.default.decorate.call(MethodMixinOverride.prototype, {
  method: _Composable6.default.rule(_Composable6.default.rules.override)
});

/* Mixin with method that invokes and uses base implementation if present */

var MethodMixinCallsSuper = (function () {
  function MethodMixinCallsSuper() {
    _classCallCheck(this, MethodMixinCallsSuper);
  }

  _createClass(MethodMixinCallsSuper, [{
    key: 'method',
    value: function method() {
      var base = this.MethodMixinCallsSuper.super.method;
      var result = base ? base.call(this) + ' ' : '';
      result += 'MethodMixinCallsSuper';
      this.mixinMethodInvoked = true;
      return result;
    }
  }]);

  return MethodMixinCallsSuper;
})();

_Composable6.default.decorate.call(MethodMixinCallsSuper.prototype, {
  method: _Composable6.default.rule(_Composable6.default.rules.override)
});

suite("Composable", function () {

  test("can extend class with ES6 class syntax", function () {
    var Subclass = (function (_ExampleBase) {
      _inherits(Subclass, _ExampleBase);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
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
    assert.equal(instance.method(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("can extend class with ES5-compatible .compose() syntax", function () {
    var Subclass = ExampleBase.compose({
      bar: true
    });
    var instance = new Subclass();
    assert.equal(instance.method(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("class decorators applied to indicated members", function () {
    var Base = (function (_Composable2) {
      _inherits(Base, _Composable2);

      function Base() {
        _classCallCheck(this, Base);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Base).apply(this, arguments));
      }

      _createClass(Base, [{
        key: 'method',
        value: function method() {}
      }]);

      return Base;
    })(_Composable6.default);

    function decorator(target, key, descriptor) {
      descriptor.value.decorated = true;
    }
    Base.prototype.decorate({
      method: decorator
    });
    assert(Base.prototype.method.decorated);
  });

  test("class mixin can define a property", function () {
    // Make sure base class works as expected first.
    var baseInstance = new ExampleBase();
    assert(!baseInstance.baseGetterInvoked);
    var baseValue = baseInstance.property;
    assert.isUndefined(baseValue);
    assert(baseInstance.baseGetterInvoked);

    var Subclass = ExampleBase.compose(PropertyMixin);
    var instance = new Subclass();
    assert(!instance.baseGetterInvoked);
    assert(!instance.baseSetterInvoked);
    assert(!instance.mixinSetterInvoked);
    instance.property = 'value';
    assert(instance.baseSetterInvoked);
    assert(instance.mixinSetterInvoked);
    var result = instance.property;
    assert.equal(instance.property, 'value');
    assert(instance.baseGetterInvoked);
  });

  test("class mixin can define a method; base method is invoked too", function () {
    var Subclass = ExampleBase.compose(MethodMixin);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'MethodMixin');
    assert(instance.mixinMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("rule() decorator just records a decorator for later use", function () {
    var Subclass = (function (_Composable3) {
      _inherits(Subclass, _Composable3);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'method',
        value: function method() {}
      }]);

      return Subclass;
    })(_Composable6.default);

    function decorator(target, key, descriptor) {}
    Subclass.prototype.decorate({
      method: _Composable6.default.rule(decorator)
    });
    assert.equal(Subclass.prototype.method._compositionRule, decorator);
  });

  test("mixin method can use super() to invoke base class implementation", function () {
    var Subclass = ExampleBase.compose(MethodMixinCallsSuper);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'ExampleBase MethodMixinCallsSuper');
    assert(instance.mixinMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple mixins can be applied in one call", function () {
    var Subclass = ExampleBase.compose(PropertyMixin, MethodMixin);
    var instance = new Subclass();
    instance.property = 'value';
    assert(instance.mixinSetterInvoked);
    assert(instance.baseSetterInvoked);
    assert.equal(instance.property, 'value');
    assert(instance.baseGetterInvoked);
    var result = instance.method();
    assert.equal(result, 'MethodMixin');
    assert(instance.mixinMethodInvoked);
  });

  test("can extend a plain object", function () {
    var obj = {
      method: function method() {
        return 'result';
      }
    };
    var mixin = {
      property: 'value'
    };
    var composed = _Composable6.default.compose.call(obj, mixin);
    assert.equal(composed.method(), 'result');
    assert.equal(composed.property, 'value');
  });

  test("mixin can has multiple levels of inheritance", function () {
    var MixinSubclass = (function (_MethodMixin) {
      _inherits(MixinSubclass, _MethodMixin);

      function MixinSubclass() {
        _classCallCheck(this, MixinSubclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinSubclass).apply(this, arguments));
      }

      _createClass(MixinSubclass, [{
        key: 'method',
        value: function method() {
          var superMethod = this.MixinSubclass.super.method;
          if (superMethod) {
            superMethod.call(this);
          }
          this.mixinSubclassMethodInvoked = true;
        }
      }]);

      return MixinSubclass;
    })(MethodMixin);

    var Subclass = _Composable6.default.compose(MixinSubclass);
    var instance = new Subclass();
    instance.method();
    assert(instance.mixinMethodInvoked);
    assert(instance.mixinSubclassMethodInvoked);
  });

  test("mixin property can reference superclass' property", function () {
    var PropertyMixin = (function () {
      function PropertyMixin() {
        _classCallCheck(this, PropertyMixin);
      }

      _createClass(PropertyMixin, [{
        key: 'property',
        get: function get() {
          var superPrototype = this.PropertyMixin.super;
          var descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
          return descriptor ? descriptor.get.call(this) : 'PropertyMixin';
        }
      }]);

      return PropertyMixin;
    })();

    var Subclass = (function (_Composable4) {
      _inherits(Subclass, _Composable4);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'property',
        get: function get() {
          return 'Subclass';
        }
      }]);

      return Subclass;
    })(_Composable6.default);

    Subclass = Subclass.compose(PropertyMixin);
    var instance = new Subclass();
    assert.equal(instance.property, 'Subclass');
  });
});

},{"../extensible/Composable":1}],10:[function(require,module,exports){
"use strict";

var _testElements = require("./testElements");

var testElements = _interopRequireWildcard(_testElements);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

suite("ElementBase", function () {

  test("component stamps string template into root", function () {
    var element = document.createElement('element-with-string-template');
    assert(element.shadowRoot);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });

  test("component stamps real template into root", function () {
    var element = document.createElement('element-with-real-template');
    assert(element.shadowRoot);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });

  test("can create component class with ES5-compatible .extend()", function () {
    var element = document.createElement('es5-class-via-extend');
    assert.equal(element.customProperty, 'property');
    assert.equal(element.method(), 'method');
    assert.equal(element.value, 'value');
  });

  test("hyphenated attribute marshalled to corresponding camelCase property", function () {
    var element = document.createElement('element-with-camel-case-property');
    assert.isUndefined(element.customProperty);
    element.setAttribute('custom-property', "Hello");
    assert.equal(element.customProperty, "Hello");
  });

  test("extension can define createdCallback", function () {
    var element = document.createElement('element-with-created-mixin');
    assert(element.mixinCallbackInvoked);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });
});

},{"./testElements":12}],11:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _Extensible3 = require('../extensible/Extensible');

var _Extensible4 = _interopRequireDefault(_Extensible3);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/* Sample classes used by the test suite */

/* A simple base class */

var ExampleBase = (function (_Extensible) {
  _inherits(ExampleBase, _Extensible);

  function ExampleBase() {
    _classCallCheck(this, ExampleBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExampleBase).apply(this, arguments));
  }

  _createClass(ExampleBase, [{
    key: 'foo',
    value: function foo() {
      return 'ExampleBase';
    }
  }]);

  return ExampleBase;
})(_Extensible4.default);

/* Extension that defines a property */

var PropertyExtension = (function () {
  function PropertyExtension() {
    _classCallCheck(this, PropertyExtension);
  }

  _createClass(PropertyExtension, [{
    key: 'property',
    get: function get() {
      return 'value';
    }
  }]);

  return PropertyExtension;
})();

/* Extension that defines a method */

var MethodExtension = (function () {
  function MethodExtension() {
    _classCallCheck(this, MethodExtension);
  }

  _createClass(MethodExtension, [{
    key: 'method',
    value: function method() {
      var superMethod = this.MethodExtension.super.method;
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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
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
    var extended = _Extensible4.default.extend.call(obj, extension);
    assert.equal(extended.method(), 'result');
    assert.equal(extended.property, 'value');
  });

  test("extension can has multiple levels of inheritance", function () {
    var ExtensionSubclass = (function (_MethodExtension) {
      _inherits(ExtensionSubclass, _MethodExtension);

      function ExtensionSubclass() {
        _classCallCheck(this, ExtensionSubclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ExtensionSubclass).apply(this, arguments));
      }

      _createClass(ExtensionSubclass, [{
        key: 'method',
        value: function method() {
          var superMethod = this.ExtensionSubclass.super.method;
          if (superMethod) {
            superMethod.call(this);
          }
          this.extensionSubclassMethodInvoked = true;
        }
      }]);

      return ExtensionSubclass;
    })(MethodExtension);

    var Subclass = _Extensible4.default.extend(ExtensionSubclass);
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
          var superPrototype = this.PropertyExtension.super;
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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'property',
        get: function get() {
          return 'base value';
        }
      }]);

      return Subclass;
    })(_Extensible4.default);

    Subclass = Subclass.extend(PropertyExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'base value');
  });
});

},{"../extensible/Extensible":3}],12:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _ElementBase5 = require('../src/ElementBase');

var _ElementBase6 = _interopRequireDefault(_ElementBase5);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/* Element with a simple template */

var ElementWithStringTemplate = (function (_ElementBase) {
  _inherits(ElementWithStringTemplate, _ElementBase);

  function ElementWithStringTemplate() {
    _classCallCheck(this, ElementWithStringTemplate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithStringTemplate).apply(this, arguments));
  }

  _createClass(ElementWithStringTemplate, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithStringTemplate;
})(_ElementBase6.default);

document.registerElement('element-with-string-template', ElementWithStringTemplate);

/* Element with a real template */
var template = document.createElement('template');
template.content.textContent = "Hello";

var ElementWithRealTemplate = (function (_ElementBase2) {
  _inherits(ElementWithRealTemplate, _ElementBase2);

  function ElementWithRealTemplate() {
    _classCallCheck(this, ElementWithRealTemplate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithRealTemplate).apply(this, arguments));
  }

  _createClass(ElementWithRealTemplate, [{
    key: 'template',
    get: function get() {
      return template;
    }
  }]);

  return ElementWithRealTemplate;
})(_ElementBase6.default);

document.registerElement('element-with-real-template', ElementWithRealTemplate);

/* Element created via ES5-compatible .compose() */
var Es5ClassViaExtend = _ElementBase6.default.compose({
  get customProperty() {
    return 'property';
  },
  method: function method() {
    return 'method';
  },
  value: 'value'
});
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);

/* Element with camelCase property name */

var ElementWithCamelCaseProperty = (function (_ElementBase3) {
  _inherits(ElementWithCamelCaseProperty, _ElementBase3);

  function ElementWithCamelCaseProperty() {
    _classCallCheck(this, ElementWithCamelCaseProperty);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithCamelCaseProperty).apply(this, arguments));
  }

  _createClass(ElementWithCamelCaseProperty, [{
    key: 'customProperty',
    get: function get() {
      return this._customProperty;
    },
    set: function set(value) {
      this._customProperty = value;
    }
  }]);

  return ElementWithCamelCaseProperty;
})(_ElementBase6.default);

document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);

/* Mixin that defines a createdCallback method. */

var CreatedMixin = (function () {
  function CreatedMixin() {
    _classCallCheck(this, CreatedMixin);
  }

  _createClass(CreatedMixin, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.mixinCallbackInvoked = true;
    }
  }]);

  return CreatedMixin;
})();

var ElementWithCreatedMixin = (function (_ElementBase4) {
  _inherits(ElementWithCreatedMixin, _ElementBase4);

  function ElementWithCreatedMixin() {
    _classCallCheck(this, ElementWithCreatedMixin);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithCreatedMixin).apply(this, arguments));
  }

  _createClass(ElementWithCreatedMixin, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithCreatedMixin;
})(_ElementBase6.default);

ElementWithCreatedMixin = ElementWithCreatedMixin.compose(CreatedMixin);
document.registerElement('element-with-created-mixin', ElementWithCreatedMixin);

},{"../src/ElementBase":7}]},{},[9,10,11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0NvbXBvc2FibGUuanMiLCJleHRlbnNpYmxlL0NvbXBvc2l0aW9uUnVsZXMuanMiLCJleHRlbnNpYmxlL0V4dGVuc2libGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvQ29tcG9zYWJsZUVsZW1lbnQuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsInRlc3QvQ29tcG9zYWJsZS50ZXN0cy5qcyIsInRlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCJ0ZXN0L0V4dGVuc2libGUudGVzdHMuanMiLCJ0ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztBQUViLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtBQUFFLFdBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUFFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQUUsVUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxBQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEFBQUMsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEFBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxVQUFVLENB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LElBakVNLHVCQUF1QixHQUFBLENBQUEsVUFBQSxhQUFBLEVBQUE7QUFrRTNCLFdBQVMsQ0FsRUwsdUJBQXVCLEVBQUEsYUFBQSxDQUFBLENBQUE7O0FBb0UzQixXQXBFSSx1QkFBdUIsR0FBQTtBQXFFekIsbUJBQWUsQ0FBQyxJQUFJLEVBckVsQix1QkFBdUIsQ0FBQSxDQUFBOztBQXVFekIsV0FBTywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0F2RTNELHVCQUF1QixDQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBO0dBd0UxQjs7QUFFRCxjQUFZLENBMUVSLHVCQUF1QixFQUFBLENBQUE7QUEyRXpCLE9BQUcsRUFBRSxVQUFVO0FBQ2YsT0FBRyxFQUFFLFNBQVMsR0FBRyxHQTNFSjtBQUNiLGFBQU8sT0FBTyxDQUFDO0tBQ2hCO0dBNEVBLENBQUMsQ0FBQyxDQUFDOztBQUVKLFNBakZJLHVCQUF1QixDQUFBO0NBa0Y1QixDQUFBLENBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQTdFMUIsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hFLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBDb21wb3NpdGlvblJ1bGVzIGZyb20gJy4vQ29tcG9zaXRpb25SdWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2FibGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xLCBNaXhpbjIsIE1peGluMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgbWl4aW5zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xKS5jb21wb3NlKE1peGluMikuY29tcG9zZShNaXhpbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHM6XG4gICAqXG4gICAqICAgbGV0IGV4dGVuZGVkID0gQ29tcG9zYWJsZS5leHRlbmQuY2FsbChvYmoxLCBvYmoyKTtcbiAgICpcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKC4uLm1peGlucykge1xuICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcyBmb3IgZWFjaCBtaXhpbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAvLyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBtaXhpbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBtaXhpbnMucmVkdWNlKGNvbXBvc2UsIHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVjb3JhdG9ycykge1xuICAgICAgbGV0IGRlY29yYXRvciA9IGRlY29yYXRvcnNba2V5XTtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLCBrZXkpO1xuICAgICAgZGVjb3JhdG9yKHRoaXMsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICBkZWNvcmF0ZShkZWNvcmF0b3JzKSB7XG4gICAgQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKHRoaXMsIGRlY29yYXRvcnMpO1xuICB9XG5cbiAgLy8gRGVjb3JhdGUgZm9yIGFubm90YXRpbmcgaG93IGEgY2xhc3MgbWVtYmVyIHNob3VsZCBiZSBjb21wb3NlZCBsYXRlci5cbiAgLy8gVGhpcyB0YWtlcyBhIGRlY29yYXRvciB0aGF0IHdpbGwgYmUgcnVuIGF0ICpjb21wb3NpdGlvbiogdGltZS5cbiAgLy8gRm9yIG5vdywgdGhpcyBjYW4gb25seSBiZSBhcHBsaWVkIHRvIG1ldGhvZHMuXG4gIHN0YXRpYyBydWxlKGRlY29yYXRvcikge1xuICAgIC8vIFdlIHJldHVybiBhIGRlY29yYXRvciB0aGF0IGp1c3QgYWRkcyB0aGUgZGVjb3JhdG9yIGdpdmVuIGFib3ZlIHRvIHRoZVxuICAgIC8vIG1lbWJlci5cbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgIC8vIFRPRE86IFVzZSBhIFN5bWJvbCBpbnN0ZWFkIG9mIGEgc3RyaW5nIHByb3BlcnR5IG5hbWUgdG8gc2F2ZSB0aGlzLlxuICAgICAgZGVzY3JpcHRvci52YWx1ZS5fY29tcG9zaXRpb25SdWxlID0gZGVjb3JhdG9yO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLypcbiAqIEV4cG9zZSBzdGFuZGFyZCBjb21wb3NpdGlvbiBydWxlcyBhcyBwcm9wZXJ0aWVzIG9mIENvbXBvc2FibGUuXG4gKiBUaGlzIGF2b2lkcyB0aGUgbmVlZCBmb3Igc29tZW9uZSB0byBtYWtlIGEgc2VwYXJhdGUgaW1wb3J0IG9mIHRoZSBydWxlcy5cbiAqL1xuQ29tcG9zYWJsZS5ydWxlcyA9IENvbXBvc2l0aW9uUnVsZXM7XG5cblxuLypcbiAqIEFsbCBDb21wb3NhYmxlLWNyZWF0ZWQgb2JqZWN0cyBrZWVwIHJlZmVyZW5jZXMgdG8gdGhlIG1peGlucyB0aGF0IHdlcmVcbiAqIGFwcGxpZWQgdG8gY3JlYXRlIHRoZW0uIFdoZW4gYSAqbmFtZWQqIG1peGluIGlzIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZVxuICogY2hhaW4sIHRoZSByZXN1bHRpbmcgb2JqZWN0IChvciwgZm9yIGEgY2xhc3MsIHRoZSBjbGFzcycgcHJvdG90eXBlKSB3aWxsXG4gKiBoYXZlIGEgbmV3IG1lbWJlciB3aXRoIHRoYXQgbmFtZSB0aGF0IHBvaW50cyBiYWNrIHRvIHRoZSBzYW1lIG9iamVjdC5cbiAqIFRoYXQgZmFjaWxpdHkgaXMgdXNlZnVsIHdoZW4gZGVhbGluZyB3aXRoIGNoYWlucyB0aGF0IGhhdmUgYmVlbiBleHRlbmRlZFxuICogbW9yZSB0aGFuIG9uY2UsIGFzIGFuIG1peGluJ3MgbmFtZSBpcyBzdWZmaWNpZW50IHRvIHJldHJpZXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGF0IHBvaW50IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQSBzaW5nbGUgbWl4aW4gY2FuIGJlIGFwcGxpZWQgdG8gbXVsdGlwbGUgcHJvdG90eXBlIGNoYWlucyAtLSB0aGUgbmFtZVxuICogcmVmZXJzIHRvIHRoZSBwcm90b3R5cGUgb24gKnRoaXMgcGFydGljdWxhciBwcm90b3R5cGUgY2hhaW4qIHRoYXQgd2FzIGFkZGVkXG4gKiBmb3IgdGhhdCBtaXhpbi4gVGhpcyBsZXRzIG1peGluL21peGluIGNvZGUgZ2V0IGJhY2sgdG8gaXRzIG93blxuICogcHJvdG90eXBlLCBtb3N0IG9mdGVuIGluIGNvbWJpbmF0aW9uIHdpdGggXCJzdXBlclwiIChzZWUgYmVsb3cpIGluIG9yZGVyIHRvXG4gKiBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvci5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUuQ29tcG9zYWJsZSA9IENvbXBvc2FibGUucHJvdG90eXBlO1xuXG4vKlxuICogQWxsIENvbXBvc2FibGUtY3JlYXRlZCBvYmplY3RzIGhhdmUgYSBcInN1cGVyXCIgcHJvcGVydHkgdGhhdCByZWZlcmVuY2VzIHRoZVxuICogcHJvdG90eXBlIGFib3ZlIHRoZW0gaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBUaGlzIFwic3VwZXJcIiByZWZlcmVuY2UgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50IGZvciBFUzYncyBcInN1cGVyXCIga2V5d29yZCBpblxuICogaW4gRVM1IChvciB0cmFuc3BpbGVkIEVTNikgbWl4aW5zIHRoYXQgd2FudCB0byBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvcixcbiAqIHdoZXJlIHRoZSBzcGVjaWZpYyBzdXBlcmNsYXNzIHdpbGwgZGVwZW5kIHVwb24gd2hpY2ggbWl4aW5zIGhhdmUgYmVlbiBhcHBsaWVkXG4gKiB0byBhIGdpdmVuIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBFLmcuOlxuICogICBjbGFzcyBNaXhpbiB7XG4gKiAgICAgZm9vKCkge1xuICogICAgICAgaWYgKHRoaXMuTWl4aW4uc3VwZXIuZm9vKSB7XG4gKiAgICAgICAgIHRoaXMuTWl4aW4uc3VwZXIuZm9vLmNhbGwodGhpcyk7IC8vIEludm9rZSBzdXBlcmNsYXNzJyBmb28oKVxuICogICAgICAgfVxuICogICAgICAgLy8gRG8gTWl4aW4tc3BlY2lmaWMgd29yayBoZXJlLi4uXG4gKiAgICAgfVxuICogICB9XG4gKlxuICogRm9yIGNvbnNpc3RlbmN5LCBDb21wb3NhYmxlIGl0c2VsZiByZWNvcmRzIGl0cyBvd24gc3VwZXJjbGFzcyBhcyBPYmplY3QuXG4gKi9cbkNvbXBvc2FibGUucHJvdG90eXBlLnN1cGVyID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXG4vLyBDb21wb3NpdGlvbiBydWxlcyBmb3Igc3RhbmRhcmQgb2JqZWN0IG1lbWJlcnMuXG5Db21wb3NhYmxlLnByb3RvdHlwZS5jb21wb3NpdGlvblJ1bGVzID0ge1xuICBjb25zdHJ1Y3RvcjogQ29tcG9zYWJsZS5vdmVycmlkZSxcbiAgdG9TdHJpbmc6IENvbXBvc2FibGUub3ZlcnJpZGUsXG59O1xuXG5cbmZ1bmN0aW9uIGFwcGx5Q29tcG9zaXRpb25SdWxlcyhvYmopIHtcbiAgbGV0IGJhc2UgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChuYW1lIGluIGJhc2UpIHtcbiAgICAgIC8vIEJhc2UgYWxzbyBpbXBsZW1lbnRzIGEgbWVtYmVyIHdpdGggdGhlIHNhbWUgbmFtZTsgbmVlZCB0byBjb21iaW5lLlxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gICAgICBsZXQgcnVsZSA9IGRlc2NyaXB0b3IudmFsdWUgJiYgZGVzY3JpcHRvci52YWx1ZS5fY29tcG9zaXRpb25SdWxlO1xuICAgICAgaWYgKCFydWxlKSB7XG4gICAgICAgIC8vIFNlZSBpZiBwcm90b3R5cGUgY2hhaW4gaGFzIGEgcnVsZSBmb3IgdGhpcyBtZW1iZXIuXG4gICAgICAgIHJ1bGUgPSBvYmouY29tcG9zaXRpb25SdWxlc1tuYW1lXTtcbiAgICAgIH1cbiAgICAgIGlmICghcnVsZSkge1xuICAgICAgICBydWxlID0gZ2V0RGVmYXVsdENvbXBvc2l0aW9uUnVsZShkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIC8vIFwib3ZlcnJpZGVcIiBpcyBhIGtub3duIG5vLW9wLCBzbyB3ZSBkb24ndCBib3RoZXIgdHJ5aW5nIHRvIHJlZGVmaW5lIHRoZVxuICAgICAgLy8gcHJvcGVydHkuXG4gICAgICBpZiAocnVsZSAmJiBydWxlICE9PSBDb21wb3NhYmxlLm92ZXJyaWRlKSB7XG4gICAgICAgIHJ1bGUob2JqLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gcHJvcGVydGllcy9tZXRob2RzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcy9vYmplY3QgdGhhdCBleHRlbmRzIHRoZSBnaXZlbiBiYXNlIGNsYXNzL29iamVjdCB3aXRoXG4gKiB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIG1peGluLlxuICovXG5mdW5jdGlvbiBjb21wb3NlKGJhc2UsIG1peGluKSB7XG5cbiAgLy8gQ2hlY2sgd2hldGhlciB0aGUgYmFzZSBhbmQgbWl4aW4gYXJlIGNsYXNzZXMgb3IgcGxhaW4gb2JqZWN0cy5cbiAgbGV0IGJhc2VJc0NsYXNzID0gaXNDbGFzcyhiYXNlKTtcbiAgbGV0IG1peGluSXNDbGFzcyA9IGlzQ2xhc3MobWl4aW4pO1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgKm1peGluKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZSBvZiBpdHMgb3duLlxuICBsZXQgbWl4aW5CYXNlID0gbWl4aW5Jc0NsYXNzID9cbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YobWl4aW4ucHJvdG90eXBlKS5jb25zdHJ1Y3RvciA6XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKG1peGluKTtcbiAgaWYgKG1peGluQmFzZSAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBGdW5jdGlvbiAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBPYmplY3QgJiZcbiAgICAgIG1peGluQmFzZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgIC8vIFRoZSBtaXhpbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgbWl4aW4ncyBiYXNlIGZpcnN0LlxuICAgIGJhc2UgPSBjb21wb3NlKGJhc2UsIG1peGluQmFzZSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGV4dGVuZGVkIG9iamVjdCB3ZSdyZSBnb2luZyB0byByZXR1cm4gYXMgYSByZXN1bHQuXG4gIGxldCByZXN1bHQ7XG4gIGlmIChiYXNlSXNDbGFzcykge1xuICAgIC8vIENyZWF0ZSBhIHN1YmNsYXNzIG9mIGJhc2UuIE9uY2UgV2ViS2l0IHN1cHBvcnRzIEhUTUxFbGVtZW50IGFzIGEgcmVhbFxuICAgIC8vIGNsYXNzLCB3ZSBjYW4ganVzdCBzYXk6XG4gICAgLy9cbiAgICAvLyAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdW50aWwgdGhhdCdzIHJlc29sdmVkLCB3ZSBoYXZlIHRvIGNvbnN0cnVjdCB0aGUgY2xhc3Mgb3Vyc2VsdmVzLlxuICAgIHJlc3VsdCA9IGZ1bmN0aW9uIHN1YmNsYXNzKCkge307XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdCwgYmFzZSk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdC5wcm90b3R5cGUsIGJhc2UucHJvdG90eXBlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDcmVhdGUgYSBwbGFpbiBvYmplY3QgdGhhdCBzaW1wbHkgdXNlcyB0aGUgYmFzZSBhcyBhIHByb3RvdHlwZS5cbiAgICByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICB9XG5cbiAgbGV0IHNvdXJjZTtcbiAgbGV0IHRhcmdldDtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIFByb3BlcnRpZXMgZGVmaW5lZCBieSBGdW5jdGlvbi5cbiAgICAvLyBXZSdkIHByZWZlciB0byBnZXQgYnkgaW50ZXJyb2dhdGluZyBGdW5jdGlvbiBpdHNlbGYsIGJ1dCBXZWJLaXQgZnVuY3Rpb25zXG4gICAgLy8gaGF2ZSBzb21lIHByb3BlcnRpZXMgKGFyZ3VtZW50cyBhbmQgY2FsbGVyKSB3aGljaCBhcmUgbm90IHJldHVybmVkIGJ5XG4gICAgLy8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pLlxuICAgIGNvbnN0IEZVTkNUSU9OX1BST1BFUlRJRVMgPSBbXG4gICAgICAnYXJndW1lbnRzJyxcbiAgICAgICdjYWxsZXInLFxuICAgICAgJ2xlbmd0aCcsXG4gICAgICAnbmFtZScsXG4gICAgICAncHJvdG90eXBlJ1xuICAgIF07XG4gICAgLy8gRXh0ZW5kaW5nIGEgY2xhc3Mgd2l0aCBhIGNsYXNzLlxuICAgIC8vIFdlJ2xsIGNvcHkgaW5zdGFuY2UgbWVtYmVycyBpbiBhIG1vbWVudCwgYnV0IGZpcnN0IGNvcHkgc3RhdGljIG1lbWJlcnMuXG4gICAgY29weU93blByb3BlcnRpZXMobWl4aW4sIHJlc3VsdCwgRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgc291cmNlID0gbWl4aW4ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgY2xhc3MuXG4gICAgLy8gQ29weSBwcm90b3R5cGUgbWV0aG9kcyBkaXJlY3RseSB0byByZXN1bHQuXG4gICAgc291cmNlID0gbWl4aW4ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggcGxhaW4gb2JqZWN0LlxuICAgIC8vIENvcHkgbWl4aW4gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICBzb3VyY2UgPSBtaXhpbjtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIHNvdXJjZSA9IG1peGluO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfVxuICBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgWydjb25zdHJ1Y3RvciddKTtcblxuICBhcHBseUNvbXBvc2l0aW9uUnVsZXModGFyZ2V0KTtcblxuICBpZiAobWl4aW4ubmFtZSkge1xuICAgIC8vIFVzZSB0aGUgbWl4aW4ncyBuYW1lICh1c3VhbGx5IHRoZSBuYW1lIG9mIGEgY2xhc3MnIGNvbnN0cnVjdG9yKSB0b1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgYmFjayB0byB0aGUgbmV3bHktY3JlYXRlZCBvYmplY3QgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICB0YXJnZXRbbWl4aW4ubmFtZV0gPSB0YXJnZXQ7XG5cbiAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlcmNsYXNzL3N1cGVyLW9iamVjdC4gU2VlIHRoZSBjb21tZW50cyBvblxuICAgIC8vIENvbXBvc2FibGUncyBcInN1cGVyXCIgcHJvcGVydHkuXG4gICAgdGFyZ2V0LnN1cGVyID0gYmFzZUlzQ2xhc3MgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2U7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0Q29tcG9zaXRpb25SdWxlKGRlc2NyaXB0b3IpIHtcbiAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIENvbXBvc2FibGUucnVsZXMucHJvcGFnYXRlRnVuY3Rpb247XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFByb3BlcnR5IHdpdGggZ2V0dGVyIGFuZC9vciBzZXR0ZXIuXG4gICAgcmV0dXJuIENvbXBvc2FibGUucnVsZXMucHJvcGFnYXRlUHJvcGVydHk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFJldHVybiB0cnVlIGlmIGMgaXMgYSBKYXZhU2NyaXB0IGNsYXNzLlxuLy8gV2UgdXNlIHRoaXMgdGVzdCBiZWNhdXNlLCBvbiBXZWJLaXQsIGNsYXNzZXMgbGlrZSBIVE1MRWxlbWVudCBhcmUgc3BlY2lhbCxcbi8vIGFuZCBhcmUgbm90IGluc3RhbmNlcyBvZiBGdW5jdGlvbi4gVG8gaGFuZGxlIHRoYXQgY2FzZSwgd2UgdXNlIGEgbG9vc2VyXG4vLyBkZWZpbml0aW9uOiBhbiBvYmplY3QgaXMgYSBjbGFzcyBpZiBpdCBoYXMgYSBwcm90b3R5cGUsIGFuZCB0aGF0IHByb3RvdHlwZVxuLy8gaGFzIGEgY29uc3RydWN0b3IgdGhhdCBpcyB0aGUgb3JpZ2luYWwgb2JqZWN0LiBUaGlzIGNvbmRpdGlvbiBob2xkcyB0cnVlIGV2ZW5cbi8vIGZvciBIVE1MRWxlbWVudCBvbiBXZWJLaXQuXG5mdW5jdGlvbiBpc0NsYXNzKGMpIHtcbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nIHx8ICAgICAgICAgICAgICAgICAgIC8vIFN0YW5kYXJkXG4gICAgICAoYy5wcm90b3R5cGUgJiYgYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09IGMpOyAvLyBIVE1MRWxlbWVudCBpbiBXZWJLaXRcbn1cbiIsIi8qKlxuICogU3RhbmRhcmQgY29tcG9zaXRpb24gcnVsZXNcbiAqL1xuXG4vLyBUYWtlIHR3byBmdW5jdGlvbnMgYW5kIHJldHVybiBhIG5ldyBjb21wb3NlZCBmdW5jdGlvbiB0aGF0IGludm9rZXMgYm90aC5cbi8vIFRoZSBjb21wb3NlZCBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBzZWNvbmQgZnVuY3Rpb24uXG4vLyBUaGlzIGlzIG5vdCBhIHJ1bGUsIGJ1dCBhIGhlbHBlciB1c2VkIGJ5IHJ1bGVzLlxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VGdW5jdGlvbihmdW5jdGlvbjEsIGZ1bmN0aW9uMikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24xLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vLyBMaWtlIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoKSwgYnV0IHdhbGtzIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4vLyBUaGlzIGlzIG5lZWRlZCBieSBjb21wb3NpdGlvbiBydWxlcywgd2hpY2ggdXN1YWxseSBzdGFydCBvdXQgYnkgZ2V0dGluZ1xuLy8gdGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYSBtZW1iZXIgdGhleSdyZSBjb21wb3NpbmcuXG4vLyBUaGlzIGlzIG5vdCBhIHJ1bGUsIGJ1dCBhIGhlbHBlciB1c2VkIGJ5IHJ1bGVzLlxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpIHtcbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIC8vIENoZWNraW5nIGZvciBcIm5hbWUgaW4gcHJvdG90eXBlXCIgbGV0cyB1cyBrbm93IHdoZXRoZXIgd2Ugc2hvdWxkIGJvdGhlclxuICAgIC8vIHdhbGtpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICBpZiAocHJvdG90eXBlICYmIG5hbWUgaW4gcHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7IC8vIE5vdCBmb3VuZFxufVxuXG4vLyBDb21iaW5hdG9yIHRoYXQgY2F1c2VzIGEgbWl4aW4gbWV0aG9kIHRvIG92ZXJyaWRlIGl0cyBiYXNlIGltcGxlbWVudGF0aW9uLlxuLy8gU2luY2UgdGhpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgcHJvdG90eXBlIGNoYWluLCB0aGlzIGlzIGEgbm8tb3AuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcnJpZGUodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHt9XG5cbi8vIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgYmFzZSBpbXBsZW1lbnRhdGlvbiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhXG4vLyB0cnV0aHkgcmVzdWx0LCB0aGF0IGlzIHJldHVybmVkLiBPdGhlcndpc2UsIHRoZSBtaXhpbiBpbXBsZW1lbnRhdGlvbidzXG4vLyByZXN1bHQgaXMgcmV0dXJuZWQuXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVyQmFzZVJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5JbXBsZW1lbnRhdGlvbiA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlSW1wbGVtZW50YXRpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVtrZXldO1xuICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJhc2VJbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHx8IG1peGluSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG4vLyBDb21wb3NlIG1ldGhvZHMsIGludm9raW5nIG1peGluIGltcGxlbWVudGF0aW9uIGZpcnN0LiBJZiBpdCByZXR1cm5zIGFcbi8vIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSwgdGhlIGJhc2UgaW1wbGVtZW50YXRpb24nc1xuLy8gcmVzdWx0IGlzIHJldHVybmVkLlxuZXhwb3J0IGZ1bmN0aW9uIHByZWZlck1peGluUmVzdWx0KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV07XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWl4aW5JbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHx8IGJhc2VJbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbi8vIERlZmF1bHQgcnVsZSBmb3IgY29tcG9zaW5nIG1ldGhvZHM6IGludm9rZSBiYXNlIGZpcnN0LCB0aGVuIG1peGluLlxuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZUZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV07XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBjb21wb3NlRnVuY3Rpb24oYmFzZUltcGxlbWVudGF0aW9uLCBtaXhpbkltcGxlbWVudGF0aW9uKTtcbn1cblxuLy8gRGVmYXVsdCBydWxlIGZvciBjb21wb3NpbmcgcHJvcGVydGllcy5cbi8vIFdlIG9ubHkgY29tcG9zZSBzZXR0ZXJzLCB3aGljaCBpbnZva2UgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbi8vIEEgZGVmaW5lZCBtaXhpbiBnZXR0ZXIgb3ZlcnJpZGVzIGEgYmFzZSBnZXR0ZXIuXG4vLyBOb3RlIHRoYXQsIGJlY2F1c2Ugb2YgdGhlIHdheSBwcm9wZXJ0eSBkZXNjcmlwdG9ycyB3b3JrLCBpZiB0aGUgbWl4aW4gb25seVxuLy8gZGVmaW5lcyBhIHNldHRlciwgYnV0IG5vdCBhIGdldHRlciwgd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IGdldHRlciB0aGF0XG4vLyBpbnZva2VzIHRoZSBiYXNlIGdldHRlci4gU2ltaWxhcmx5LCBpZiB0aGUgbWl4aW4ganVzdCBkZWZpbmVzIGEgZ2V0dGVyLFxuLy8gd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IHNldHRlci5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgYmFzZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICBsZXQgYmFzZURlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwga2V5KTtcbiAgaWYgKGRlc2NyaXB0b3IuZ2V0ICYmICFkZXNjcmlwdG9yLnNldCAmJiBiYXNlRGVzY3JpcHRvci5zZXQpIHtcbiAgICAvLyBOZWVkIHRvIHN1cHBseSBkZWZhdWx0IHNldHRlci5cbiAgICBkZXNjcmlwdG9yLnNldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBiYXNlRGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgfTtcbiAgfSBlbHNlIGlmIChkZXNjcmlwdG9yLnNldCkge1xuICAgIGlmICghZGVzY3JpcHRvci5nZXQgJiYgYmFzZURlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAvLyBOZWVkIHRvIHN1cHBseSBkZWZhdWx0IGdldHRlci5cbiAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBiYXNlRGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKTtcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIENvbXBvc2Ugc2V0dGVycy5cbiAgICBkZXNjcmlwdG9yLnNldCA9IGNvbXBvc2VGdW5jdGlvbihiYXNlRGVzY3JpcHRvci5zZXQsIGRlc2NyaXB0b3Iuc2V0KTtcbiAgfVxufVxuIiwiLypcbiAqIEV4dGVuZCBjbGFzc2VzL29iamVjdHMgd2l0aCBvdGhlciBjbGFzc2VzL29iamVjdHMuXG4gKi9cblxuXG5jbGFzcyBFeHRlbnNpYmxlIHtcblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSwgRXh0ZW5zaW9uMiwgRXh0ZW5zaW9uMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgZXh0ZW5zaW9ucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSkuZXh0ZW5kKEV4dGVuc2lvbjIpLmV4dGVuZChFeHRlbnNpb24zKVxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc3RhdGljYWxseSBpbnZva2VkIHRvIGV4dGVuZCBwbGFpbiBvYmplY3RzOlxuICAgKlxuICAgKiAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqMSwgb2JqMik7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggZXh0ZW5zaW9uIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IGV4dGVuc2lvbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBleHRlbnNpb25zLnJlZHVjZShleHRlbmQsIHRoaXMpO1xuICB9XG5cbn1cblxuLypcbiAqIEFsbCBFeHRlbnNpYmxlLWNyZWF0ZWQgb2JqZWN0cyBrZWVwIHJlZmVyZW5jZXMgdG8gdGhlIGV4dGVuc2lvbnMgdGhhdCB3ZXJlXG4gKiBhcHBsaWVkIHRvIGNyZWF0ZSB0aGVtLiBXaGVuIGEgKm5hbWVkKiBleHRlbnNpb24gaXMgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlXG4gKiBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlIGNsYXNzJyBwcm90b3R5cGUpIHdpbGxcbiAqIGhhdmUgYSBuZXcgbWVtYmVyIHdpdGggdGhhdCBuYW1lIHRoYXQgcG9pbnRzIGJhY2sgdG8gdGhlIHNhbWUgb2JqZWN0LlxuICogVGhhdCBmYWNpbGl0eSBpcyB1c2VmdWwgd2hlbiBkZWFsaW5nIHdpdGggY2hhaW5zIHRoYXQgaGF2ZSBiZWVuIGV4dGVuZGVkXG4gKiBtb3JlIHRoYW4gb25jZSwgYXMgYW4gZXh0ZW5zaW9uJ3MgbmFtZSBpcyBzdWZmaWNpZW50IHRvIHJldHJpZXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGF0IHBvaW50IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQSBzaW5nbGUgZXh0ZW5zaW9uIGNhbiBiZSBhcHBsaWVkIHRvIG11bHRpcGxlIHByb3RvdHlwZSBjaGFpbnMgLS0gdGhlIG5hbWVcbiAqIHJlZmVycyB0byB0aGUgcHJvdG90eXBlIG9uICp0aGlzIHBhcnRpY3VsYXIgcHJvdG90eXBlIGNoYWluKiB0aGF0IHdhcyBhZGRlZFxuICogZm9yIHRoYXQgZXh0ZW5zaW9uLiBUaGlzIGxldHMgZXh0ZW5zaW9uL21peGluIGNvZGUgZ2V0IGJhY2sgdG8gaXRzIG93blxuICogcHJvdG90eXBlLCBtb3N0IG9mdGVuIGluIGNvbWJpbmF0aW9uIHdpdGggXCJzdXBlclwiIChzZWUgYmVsb3cpIGluIG9yZGVyIHRvXG4gKiBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvci5cbiAqL1xuRXh0ZW5zaWJsZS5wcm90b3R5cGUuRXh0ZW5zaWJsZSA9IEV4dGVuc2libGUucHJvdG90eXBlO1xuXG4vKlxuICogQWxsIEV4dGVuc2libGUtY3JlYXRlZCBvYmplY3RzIGhhdmUgYSBcInN1cGVyXCIgcHJvcGVydHkgdGhhdCByZWZlcmVuY2VzIHRoZVxuICogcHJvdG90eXBlIGFib3ZlIHRoZW0gaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBUaGlzIFwic3VwZXJcIiByZWZlcmVuY2UgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50IGZvciBFUzYncyBcInN1cGVyXCIga2V5d29yZCBpblxuICogaW4gRVM1IChvciB0cmFuc3BpbGVkIEVTNikgZXh0ZW5zaW9ucy9taXhpbnNcbiAqIHRoYXQgd2FudCB0byBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvciwgd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbFxuICogZGVwZW5kIHVwb24gd2hpY2ggZXh0ZW5zaW9ucyBoYXZlIGJlZW4gYXBwbGllZCB0byBhIGdpdmVuIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBFLmcuOlxuICogICBjbGFzcyBNaXhpbiB7XG4gKiAgICAgZm9vKCkge1xuICogICAgICAgaWYgKHRoaXMuTWl4aW4uc3VwZXIuZm9vKSB7XG4gKiAgICAgICAgIHRoaXMuTWl4aW4uc3VwZXIuZm9vLmNhbGwodGhpcyk7IC8vIEludm9rZSBzdXBlcmNsYXNzJyBmb28oKVxuICogICAgICAgfVxuICogICAgICAgLy8gRG8gTWl4aW4tc3BlY2lmaWMgd29yayBoZXJlLi4uXG4gKiAgICAgfVxuICogICB9XG4gKlxuICogRm9yIGNvbnNpc3RlbmN5LCBFeHRlbnNpYmxlIGl0c2VsZiByZWNvcmRzIGl0cyBvd24gc3VwZXJjbGFzcyBhcyBPYmplY3QuXG4gKi9cbkV4dGVuc2libGUucHJvdG90eXBlLnN1cGVyID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gcHJvcGVydGllcy9tZXRob2RzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcy9vYmplY3QgdGhhdCBleHRlbmRzIHRoZSBnaXZlbiBiYXNlIGNsYXNzL29iamVjdCB3aXRoXG4gKiB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbi5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIGV4dGVuc2lvbikge1xuXG4gIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJhc2UgYW5kIGV4dGVuc2lvbiBhcmUgY2xhc3NlcyBvciBwbGFpbiBvYmplY3RzLlxuICBsZXQgYmFzZUlzQ2xhc3MgPSBpc0NsYXNzKGJhc2UpO1xuICBsZXQgZXh0ZW5zaW9uSXNDbGFzcyA9IGlzQ2xhc3MoZXh0ZW5zaW9uKTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlICpleHRlbnNpb24qIGhhcyBhIGJhc2UgY2xhc3MvcHJvdG90eXBlIG9mIGl0cyBvd24uXG4gIGxldCBleHRlbnNpb25CYXNlID0gZXh0ZW5zaW9uSXNDbGFzcyA/XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVuc2lvbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yIDpcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZW5zaW9uKTtcbiAgaWYgKGV4dGVuc2lvbkJhc2UgJiZcbiAgICAgIGV4dGVuc2lvbkJhc2UgIT09IEZ1bmN0aW9uICYmXG4gICAgICBleHRlbnNpb25CYXNlICE9PSBPYmplY3QpIHtcbiAgICAvLyBUaGUgZXh0ZW5zaW9uIGl0c2VsZiBkZXJpdmVzIGZyb20gYW5vdGhlciBjbGFzcy9vYmplY3QuXG4gICAgLy8gUmVjdXJzZSwgYW5kIGV4dGVuZCB3aXRoIHRoZSBleHRlbnNpb24ncyBiYXNlIGZpcnN0LlxuICAgIGJhc2UgPSBleHRlbmQoYmFzZSwgZXh0ZW5zaW9uQmFzZSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGV4dGVuZGVkIG9iamVjdCB3ZSdyZSBnb2luZyB0byByZXR1cm4gYXMgYSByZXN1bHQuXG4gIGxldCByZXN1bHQ7XG4gIGlmIChiYXNlSXNDbGFzcykge1xuICAgIC8vIENyZWF0ZSBhIHN1YmNsYXNzIG9mIGJhc2UuIE9uY2UgV2ViS2l0IHN1cHBvcnRzIEhUTUxFbGVtZW50IGFzIGEgcmVhbFxuICAgIC8vIGNsYXNzLCB3ZSBjYW4ganVzdCBzYXk6XG4gICAgLy9cbiAgICAvLyAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdW50aWwgdGhhdCdzIHJlc29sdmVkLCB3ZSBoYXZlIHRvIGNvbnN0cnVjdCB0aGUgY2xhc3Mgb3Vyc2VsdmVzLlxuICAgIHJlc3VsdCA9IGZ1bmN0aW9uIHN1YmNsYXNzKCkge307XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdCwgYmFzZSk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdC5wcm90b3R5cGUsIGJhc2UucHJvdG90eXBlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDcmVhdGUgYSBwbGFpbiBvYmplY3QgdGhhdCBzaW1wbHkgdXNlcyB0aGUgYmFzZSBhcyBhIHByb3RvdHlwZS5cbiAgICByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICB9XG5cbiAgbGV0IHNvdXJjZTtcbiAgbGV0IHRhcmdldDtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24uXG4gICAgLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0IGZ1bmN0aW9uc1xuICAgIC8vIGhhdmUgc29tZSBwcm9wZXJ0aWVzIChhcmd1bWVudHMgYW5kIGNhbGxlcikgd2hpY2ggYXJlIG5vdCByZXR1cm5lZCBieVxuICAgIC8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZ1bmN0aW9uKS5cbiAgICBjb25zdCBGVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAgICAgJ2FyZ3VtZW50cycsXG4gICAgICAnY2FsbGVyJyxcbiAgICAgICdsZW5ndGgnLFxuICAgICAgJ25hbWUnLFxuICAgICAgJ3Byb3RvdHlwZSdcbiAgICBdO1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBXZSdsbCBjb3B5IGluc3RhbmNlIG1lbWJlcnMgaW4gYSBtb21lbnQsIGJ1dCBmaXJzdCBjb3B5IHN0YXRpYyBtZW1iZXJzLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbiwgcmVzdWx0LCBGVU5DVElPTl9QUk9QRVJUSUVTKTtcbiAgICBzb3VyY2UgPSBleHRlbnNpb24ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbi5wcm90b3R5cGU7XG4gICAgdGFyZ2V0ID0gcmVzdWx0O1xuICB9IGVsc2UgaWYgKGJhc2VJc0NsYXNzICYmICFleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggcGxhaW4gb2JqZWN0LlxuICAgIC8vIENvcHkgZXh0ZW5zaW9uIHRvIHJlc3VsdCBwcm90b3R5cGUuXG4gICAgc291cmNlID0gZXh0ZW5zaW9uO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgc291cmNlID0gZXh0ZW5zaW9uO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfVxuICBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgWydjb25zdHJ1Y3RvciddKTtcblxuICBpZiAoZXh0ZW5zaW9uLm5hbWUpIHtcbiAgICAvLyBVc2UgdGhlIGV4dGVuc2lvbidzIG5hbWUgKHVzdWFsbHkgdGhlIG5hbWUgb2YgYSBjbGFzcycgY29uc3RydWN0b3IpIHRvXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSBuZXdseS1jcmVhdGVkIG9iamVjdCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIHRhcmdldFtleHRlbnNpb24ubmFtZV0gPSB0YXJnZXQ7XG5cbiAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlcmNsYXNzL3N1cGVyLW9iamVjdC4gU2VlIHRoZSBjb21tZW50cyBvblxuICAgIC8vIEV4dGVuc2libGUncyBcInN1cGVyXCIgcHJvcGVydHkuXG4gICAgdGFyZ2V0LnN1cGVyID0gYmFzZUlzQ2xhc3MgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2U7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbi8vIFdlIHVzZSB0aGlzIHRlc3QgYmVjYXVzZSwgb24gV2ViS2l0LCBjbGFzc2VzIGxpa2UgSFRNTEVsZW1lbnQgYXJlIHNwZWNpYWwsXG4vLyBhbmQgYXJlIG5vdCBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRvIGhhbmRsZSB0aGF0IGNhc2UsIHdlIHVzZSBhIGxvb3NlclxuLy8gZGVmaW5pdGlvbjogYW4gb2JqZWN0IGlzIGEgY2xhc3MgaWYgaXQgaGFzIGEgcHJvdG90eXBlLCBhbmQgdGhhdCBwcm90b3R5cGVcbi8vIGhhcyBhIGNvbnN0cnVjdG9yIHRoYXQgaXMgdGhlIG9yaWdpbmFsIG9iamVjdC4gVGhpcyBjb25kaXRpb24gaG9sZHMgdHJ1ZSBldmVuXG4vLyBmb3IgSFRNTEVsZW1lbnQgb24gV2ViS2l0LlxuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZTtcbiIsIi8qXG4gKiBNYXJzaGFsbCBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXMgKGFuZCBldmVudHVhbGx5IHZpY2UgdmVyc2EpLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIHtcblxuICAvKlxuICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS4gSWdub3JlIGNoYW5nZXMgaW4gc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcy5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKHByb3BlcnR5TmFtZSBpbiB0aGlzICYmICEocHJvcGVydHlOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGUgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgbSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCBnID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG4iLCIvKlxuICogQSBjb21wb3NhYmxlIEhUTUwgZWxlbWVudC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHByb3ZpZGVkIGp1c3QgYXMgYSBjb252ZW5pZW5jZS4gT25lIGNvdWxkIGFsc28gc3RhcnQgd2l0aFxuICogSFRNTEVsZW1lbnQgYXQgdGhlIHRvcCBsZXZlbCwgYW5kIGFkZCBleHRlbnNpYmlsaXR5IGJ5IG1peGluZyBpbiBDb21wb3NhYmxlLlxuICovXG5cbmltcG9ydCBDb21wb3NhYmxlIGZyb20gJy4uL2V4dGVuc2libGUvQ29tcG9zYWJsZSc7XG5cbi8vIFdlIHVzZSBFeHRlbnNpYmxlIHRvIGFkZCBpdHMgb3duIG1lbWJlcnMgdG8gYSBIVE1MRWxlbWVudCBzdWJjbGFzcy5cbi8vIFRoZSByZXN1bHQgaXMgYW4gSFRNTEVsZW1lbnQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBDb21wb3NhYmxlRWxlbWVudCA9IENvbXBvc2FibGUuY29tcG9zZS5jYWxsKEhUTUxFbGVtZW50LCBDb21wb3NhYmxlKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogQSBzYW1wbGUgZ2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cyB0aGF0IG1peGVzXG4gKiBpbiBzb21lIGNvbW1vbiBmZWF0dXJlczogdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LCBhdXRvbWF0aWMgbm9kZVxuICogZmluZGluZywgYW5kIG1hcnNoYWxsaW5nIGJldHdlZW4gYXR0cmlidXRlcyBhbmQgcHJvcGVydGllcy5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZUVsZW1lbnQgZnJvbSAnLi9Db21wb3NhYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIENvbXBvc2FibGVFbGVtZW50IHtcblxuICAvKiBGb3IgZGVidWdnaW5nICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZSA9IEVsZW1lbnRCYXNlLmNvbXBvc2UoXG4gIFRlbXBsYXRlU3RhbXBpbmcsIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG4iLCIvKlxuICogRWxlbWVudCBleHRlbnNpb24gZm9yIHRlbXBsYXRlIHN0YW1waW5nLiBJZiBhIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGVcbiAqIHByb3BlcnR5IChhcyBhIHN0cmluZyBvciByZWZlcmVuY2luZyBhIEhUTUwgdGVtcGxhdGUpLCB3aGVuIHRoZSBjb21wb25lbnRcbiAqIGNsYXNzIGlzIGluc3RhbnRpYXRlZCwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlIGluc3RhbmNlLCBhbmRcbiAqIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGUgc2hhZG93IHJvb3QuXG4gKlxuICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIGV4dGVuc2lvbiByZXRhaW5zIHN1cHBvcnQgZm9yIFNoYWRvdyBET00gdjAuXG4gKiBUaGF0IHdpbGwgZXZlbnR1YWxseSBiZSBkZXByZWNhdGVkIGFzIGJyb3dzZXJzIGltcGxlbWVudCBTaGFkb3cgRE9NIHYxLlxuICovXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSAmJiBVU0lOR19TSEFET1dfRE9NX1YwKSB7XG4gICAgICBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwpIHtcbiAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgIH1cbiAgICAvLyBUT0RPOiBTYXZlIHRoZSBwcm9jZXNzZWQgdGVtcGxhdGUgd2l0aCB0aGUgY29tcG9uZW50J3MgY2xhc3MgcHJvdG90eXBlXG4gICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gVVNJTkdfU0hBRE9XX0RPTV9WMCA/XG4gICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpIDogICAgICAgICAgICAgLy8gU2hhZG93IERPTSB2MFxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTsgIC8vIFNoYWRvdyBET00gdjFcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBvbGQgU2hhZG93IERPTSB2MC5cbmNvbnN0IFVTSU5HX1NIQURPV19ET01fVjAgPSAodHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jcmVhdGVTaGFkb3dSb290ICE9PSAndW5kZWZpbmVkJyk7XG5cblxuLy8gQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXBsYWNlIG9jY3VyZW5jZXMgb2YgdjEgc2xvdCBlbGVtZW50cyB3aXRoIHYwIGNvbnRlbnQgZWxlbWVudHMuXG4vLyBUaGlzIGRvZXMgbm90IHlldCBtYXAgbmFtZWQgc2xvdHMgdG8gY29udGVudCBzZWxlY3QgY2xhdXNlcy5cbmZ1bmN0aW9uIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKSB7XG4gIFtdLmZvckVhY2guY2FsbCh0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Nsb3QnKSwgc2xvdEVsZW1lbnQgPT4ge1xuICAgIGxldCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKTtcbiAgICBzbG90RWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250ZW50RWxlbWVudCwgc2xvdEVsZW1lbnQpO1xuICB9KTtcbn1cblxuLy8gSW52b2tlIGJhc2ljIHN0eWxlIHNoaW1taW5nIHdpdGggU2hhZG93Q1NTLlxuZnVuY3Rpb24gc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0YWcpIHtcbiAgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiIsImltcG9ydCBDb21wb3NhYmxlIGZyb20gXCIuLi9leHRlbnNpYmxlL0NvbXBvc2FibGVcIjtcblxuXG4vKiBTYW1wbGUgY2xhc3NlcyB1c2VkIGJ5IHRoZSB0ZXN0IHN1aXRlICovXG5cbi8qIEEgc2ltcGxlIGJhc2UgY2xhc3MgKi9cbmNsYXNzIEV4YW1wbGVCYXNlIGV4dGVuZHMgQ29tcG9zYWJsZSB7XG5cbiAgZ2V0IHByb3BlcnR5KCkge1xuICAgIHRoaXMuYmFzZUdldHRlckludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eTtcbiAgfVxuICBzZXQgcHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLl9wcm9wZXJ0eSA9IHZhbHVlO1xuICAgIHRoaXMuYmFzZVNldHRlckludm9rZWQgPSB0cnVlO1xuICB9XG5cbiAgbWV0aG9kKCkge1xuICAgIHRoaXMuYmFzZU1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiAnRXhhbXBsZUJhc2UnO1xuICB9XG5cbn1cblxuLyogTWl4aW4gdGhhdCBhdWdtZW50cyBhIHByb3BlcnR5IHNldHRlci4gKi9cbmNsYXNzIFByb3BlcnR5TWl4aW4ge1xuICBzZXQgcHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLm1peGluU2V0dGVySW52b2tlZCA9IHRydWU7XG4gIH1cbn1cblxuLyogTWl4aW4gdGhhdCBkZWZpbmVzIGEgbWV0aG9kICovXG5jbGFzcyBNZXRob2RNaXhpbiB7XG4gIG1ldGhvZCgpIHtcbiAgICB0aGlzLm1peGluTWV0aG9kSW52b2tlZCA9IHRydWU7XG4gICAgcmV0dXJuICdNZXRob2RNaXhpbic7XG4gIH1cbn1cblxuLyogTWl4aW4gdGhhdCBvdmVycmlkZXMgYSBiYXNlIG1ldGhvZCAqL1xuY2xhc3MgTWV0aG9kTWl4aW5PdmVycmlkZSB7XG4gIG1ldGhvZCgpIHtcbiAgICB0aGlzLm1peGluTWV0aG9kSW52b2tlZCA9IHRydWU7XG4gICAgcmV0dXJuICdNZXRob2RNaXhpbic7XG4gIH1cbn1cbkNvbXBvc2FibGUuZGVjb3JhdGUuY2FsbChNZXRob2RNaXhpbk92ZXJyaWRlLnByb3RvdHlwZSwge1xuICBtZXRob2Q6IENvbXBvc2FibGUucnVsZShDb21wb3NhYmxlLnJ1bGVzLm92ZXJyaWRlKVxufSk7XG5cblxuLyogTWl4aW4gd2l0aCBtZXRob2QgdGhhdCBpbnZva2VzIGFuZCB1c2VzIGJhc2UgaW1wbGVtZW50YXRpb24gaWYgcHJlc2VudCAqL1xuY2xhc3MgTWV0aG9kTWl4aW5DYWxsc1N1cGVyIHtcbiAgbWV0aG9kKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5NZXRob2RNaXhpbkNhbGxzU3VwZXIuc3VwZXIubWV0aG9kO1xuICAgIGxldCByZXN1bHQgPSBiYXNlID8gYmFzZS5jYWxsKHRoaXMpICsgJyAnIDogJyc7XG4gICAgcmVzdWx0ICs9ICdNZXRob2RNaXhpbkNhbGxzU3VwZXInO1xuICAgIHRoaXMubWl4aW5NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5Db21wb3NhYmxlLmRlY29yYXRlLmNhbGwoTWV0aG9kTWl4aW5DYWxsc1N1cGVyLnByb3RvdHlwZSwge1xuICBtZXRob2Q6IENvbXBvc2FibGUucnVsZShDb21wb3NhYmxlLnJ1bGVzLm92ZXJyaWRlKVxufSk7XG5cblxuc3VpdGUoXCJDb21wb3NhYmxlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBjbGFzcyB3aXRoIEVTNiBjbGFzcyBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgZ2V0IGJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5tZXRob2QoKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmNvbXBvc2UoKSBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2Uoe1xuICAgICAgYmFyOiB0cnVlXG4gICAgfSk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLm1ldGhvZCgpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGRlY29yYXRvcnMgYXBwbGllZCB0byBpbmRpY2F0ZWQgbWVtYmVyc1wiLCAoKSA9PiB7XG4gICAgY2xhc3MgQmFzZSBleHRlbmRzIENvbXBvc2FibGUge1xuICAgICAgbWV0aG9kKCkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRlZCA9IHRydWU7XG4gICAgfVxuICAgIEJhc2UucHJvdG90eXBlLmRlY29yYXRlKHtcbiAgICAgIG1ldGhvZDogZGVjb3JhdG9yXG4gICAgfSk7XG4gICAgYXNzZXJ0KEJhc2UucHJvdG90eXBlLm1ldGhvZC5kZWNvcmF0ZWQpO1xuICB9KVxuXG4gIHRlc3QoXCJjbGFzcyBtaXhpbiBjYW4gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSBiYXNlIGNsYXNzIHdvcmtzIGFzIGV4cGVjdGVkIGZpcnN0LlxuICAgIGxldCBiYXNlSW5zdGFuY2UgPSBuZXcgRXhhbXBsZUJhc2UoKTtcbiAgICBhc3NlcnQoIWJhc2VJbnN0YW5jZS5iYXNlR2V0dGVySW52b2tlZCk7XG4gICAgbGV0IGJhc2VWYWx1ZSA9IGJhc2VJbnN0YW5jZS5wcm9wZXJ0eTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoYmFzZVZhbHVlKTtcbiAgICBhc3NlcnQoYmFzZUluc3RhbmNlLmJhc2VHZXR0ZXJJbnZva2VkKTtcblxuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoUHJvcGVydHlNaXhpbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0KCFpbnN0YW5jZS5iYXNlR2V0dGVySW52b2tlZCk7XG4gICAgYXNzZXJ0KCFpbnN0YW5jZS5iYXNlU2V0dGVySW52b2tlZCk7XG4gICAgYXNzZXJ0KCFpbnN0YW5jZS5taXhpblNldHRlckludm9rZWQpO1xuICAgIGluc3RhbmNlLnByb3BlcnR5ID0gJ3ZhbHVlJztcbiAgICBhc3NlcnQoaW5zdGFuY2UuYmFzZVNldHRlckludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5taXhpblNldHRlckludm9rZWQpO1xuICAgIGxldCByZXN1bHQgPSBpbnN0YW5jZS5wcm9wZXJ0eTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UucHJvcGVydHksICd2YWx1ZScpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlR2V0dGVySW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBtaXhpbiBjYW4gZGVmaW5lIGEgbWV0aG9kOyBiYXNlIG1ldGhvZCBpcyBpbnZva2VkIHRvb1wiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuY29tcG9zZShNZXRob2RNaXhpbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNZXRob2RNaXhpbicpO1xuICAgIGFzc2VydChpbnN0YW5jZS5taXhpbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJydWxlKCkgZGVjb3JhdG9yIGp1c3QgcmVjb3JkcyBhIGRlY29yYXRvciBmb3IgbGF0ZXIgdXNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBTdWJjbGFzcyBleHRlbmRzIENvbXBvc2FibGUge1xuICAgICAgbWV0aG9kKCkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7fVxuICAgIFN1YmNsYXNzLnByb3RvdHlwZS5kZWNvcmF0ZSh7XG4gICAgICBtZXRob2Q6IENvbXBvc2FibGUucnVsZShkZWNvcmF0b3IpXG4gICAgfSk7XG4gICAgYXNzZXJ0LmVxdWFsKFN1YmNsYXNzLnByb3RvdHlwZS5tZXRob2QuX2NvbXBvc2l0aW9uUnVsZSwgZGVjb3JhdG9yKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIG1ldGhvZCBjYW4gdXNlIHN1cGVyKCkgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoTWV0aG9kTWl4aW5DYWxsc1N1cGVyKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ0V4YW1wbGVCYXNlIE1ldGhvZE1peGluQ2FsbHNTdXBlcicpO1xuICAgIGFzc2VydChpbnN0YW5jZS5taXhpbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJtdWx0aXBsZSBtaXhpbnMgY2FuIGJlIGFwcGxpZWQgaW4gb25lIGNhbGxcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoXG4gICAgICBQcm9wZXJ0eU1peGluLFxuICAgICAgTWV0aG9kTWl4aW5cbiAgICApO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGluc3RhbmNlLnByb3BlcnR5ID0gJ3ZhbHVlJztcbiAgICBhc3NlcnQoaW5zdGFuY2UubWl4aW5TZXR0ZXJJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuYmFzZVNldHRlckludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmJhc2VHZXR0ZXJJbnZva2VkKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01ldGhvZE1peGluJyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGEgcGxhaW4gb2JqZWN0XCIsICgpID0+IHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICByZXR1cm4gJ3Jlc3VsdCc7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgbWl4aW4gPSB7XG4gICAgICBwcm9wZXJ0eTogJ3ZhbHVlJ1xuICAgIH07XG4gICAgbGV0IGNvbXBvc2VkID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwob2JqLCBtaXhpbik7XG4gICAgYXNzZXJ0LmVxdWFsKGNvbXBvc2VkLm1ldGhvZCgpLCAncmVzdWx0Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGNvbXBvc2VkLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIGNhbiBoYXMgbXVsdGlwbGUgbGV2ZWxzIG9mIGluaGVyaXRhbmNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBNaXhpblN1YmNsYXNzIGV4dGVuZHMgTWV0aG9kTWl4aW4ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICBsZXQgc3VwZXJNZXRob2QgPSB0aGlzLk1peGluU3ViY2xhc3Muc3VwZXIubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWl4aW5TdWJjbGFzc01ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgU3ViY2xhc3MgPSBDb21wb3NhYmxlLmNvbXBvc2UoTWl4aW5TdWJjbGFzcyk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIHByb3BlcnR5IGNhbiByZWZlcmVuY2Ugc3VwZXJjbGFzcycgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFByb3BlcnR5TWl4aW4ge1xuICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICBsZXQgc3VwZXJQcm90b3R5cGUgPSB0aGlzLlByb3BlcnR5TWl4aW4uc3VwZXI7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gc3VwZXJQcm90b3R5cGUgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvdHlwZSwgJ3Byb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZGVzY3JpcHRvcikgP1xuICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOlxuICAgICAgICAgICdQcm9wZXJ0eU1peGluJztcbiAgICAgIH1cbiAgICB9XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBDb21wb3NhYmxlIHtcbiAgICAgIGdldCBwcm9wZXJ0eSgpIHtcbiAgICAgICAgcmV0dXJuICdTdWJjbGFzcyc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuY29tcG9zZShQcm9wZXJ0eU1peGluKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UucHJvcGVydHksICdTdWJjbGFzcycpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLW1peGluJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQubWl4aW5DYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRXh0ZW5zaWJsZSBmcm9tIFwiLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlXCI7XG5cblxuLyogU2FtcGxlIGNsYXNzZXMgdXNlZCBieSB0aGUgdGVzdCBzdWl0ZSAqL1xuXG4vKiBBIHNpbXBsZSBiYXNlIGNsYXNzICovXG5jbGFzcyBFeGFtcGxlQmFzZSBleHRlbmRzIEV4dGVuc2libGUge1xuICBmb28oKSB7XG4gICAgcmV0dXJuICdFeGFtcGxlQmFzZSc7XG4gIH1cbn1cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5ICovXG5jbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gIGdldCBwcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxufVxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgbWV0aG9kICovXG5jbGFzcyBNZXRob2RFeHRlbnNpb24ge1xuICBtZXRob2QoKSB7XG4gICAgbGV0IHN1cGVyTWV0aG9kID0gdGhpcy5NZXRob2RFeHRlbnNpb24uc3VwZXIubWV0aG9kO1xuICAgIGxldCByZXN1bHQgPSBzdXBlck1ldGhvZCA/IHN1cGVyTWV0aG9kLmNhbGwodGhpcykgOiAnZXh0ZW5zaW9uIHJlc3VsdCc7XG4gICAgdGhpcy5leHRlbnNpb25NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cblxuc3VpdGUoXCJFeHRlbnNpYmxlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBjbGFzcyB3aXRoIEVTNiBjbGFzcyBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgZ2V0IGJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKHtcbiAgICAgIGJhcjogdHJ1ZVxuICAgIH0pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIG1ldGhvZFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIG1ldGhvZCBjYW4gdXNlIHN1cGVyKCkgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICB0aGlzLmJhc2VNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICdiYXNlIHJlc3VsdCc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXNlIHJlc3VsdCcpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuYmFzZU1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwibXVsdGlwbGUgZXh0ZW5zaW9ucyBjYW4gYmUgYXBwbGllZCBpbiBvbmUgY2FsbFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKFxuICAgICAgUHJvcGVydHlFeHRlbnNpb24sXG4gICAgICBNZXRob2RFeHRlbnNpb25cbiAgICApO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBhIHBsYWluIG9iamVjdFwiLCAoKSA9PiB7XG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgcmV0dXJuICdyZXN1bHQnO1xuICAgICAgfVxuICAgIH07XG4gICAgbGV0IGV4dGVuc2lvbiA9IHtcbiAgICAgIHByb3BlcnR5OiAndmFsdWUnXG4gICAgfTtcbiAgICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iaiwgZXh0ZW5zaW9uKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQubWV0aG9kKCksICdyZXN1bHQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQucHJvcGVydHksICd2YWx1ZScpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBoYXMgbXVsdGlwbGUgbGV2ZWxzIG9mIGluaGVyaXRhbmNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBFeHRlbnNpb25TdWJjbGFzcyBleHRlbmRzIE1ldGhvZEV4dGVuc2lvbiB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIGxldCBzdXBlck1ldGhvZCA9IHRoaXMuRXh0ZW5zaW9uU3ViY2xhc3Muc3VwZXIubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IFN1YmNsYXNzID0gRXh0ZW5zaWJsZS5leHRlbmQoRXh0ZW5zaW9uU3ViY2xhc3MpO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBwcm9wZXJ0eSBjYW4gcmVmZXJlbmNlIHN1cGVyY2xhc3MnIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBjbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIGxldCBzdXBlclByb3RvdHlwZSA9IHRoaXMuUHJvcGVydHlFeHRlbnNpb24uc3VwZXI7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gc3VwZXJQcm90b3R5cGUgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvdHlwZSwgJ3Byb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZGVzY3JpcHRvcikgP1xuICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOlxuICAgICAgICAgICdleHRlbnNpb24gdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBTdWJjbGFzcyBleHRlbmRzIEV4dGVuc2libGUge1xuICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICByZXR1cm4gJ2Jhc2UgdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBTdWJjbGFzcyA9IFN1YmNsYXNzLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAnYmFzZSB2YWx1ZScpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuXG4vKiBFbGVtZW50IHdpdGggYSBzaW1wbGUgdGVtcGxhdGUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnLCBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IHdpdGggYSByZWFsIHRlbXBsYXRlICovXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudGVtcGxhdGUuY29udGVudC50ZXh0Q29udGVudCA9IFwiSGVsbG9cIjtcbmNsYXNzIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJywgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgY3JlYXRlZCB2aWEgRVM1LWNvbXBhdGlibGUgLmNvbXBvc2UoKSAqL1xubGV0IEVzNUNsYXNzVmlhRXh0ZW5kID0gRWxlbWVudEJhc2UuY29tcG9zZSh7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3Byb3BlcnR5JztcbiAgfSxcbiAgbWV0aG9kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ21ldGhvZCc7XG4gIH0sXG4gIHZhbHVlOiAndmFsdWUnXG59KTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnLCBFczVDbGFzc1ZpYUV4dGVuZCk7XG5cblxuLyogRWxlbWVudCB3aXRoIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lICovXG5jbGFzcyBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1c3RvbVByb3BlcnR5O1xuICB9XG4gIHNldCBjdXN0b21Qcm9wZXJ0eSh2YWx1ZSkge1xuICAgIHRoaXMuX2N1c3RvbVByb3BlcnR5ID0gdmFsdWU7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknLCBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5KTtcblxuXG4vKiBNaXhpbiB0aGF0IGRlZmluZXMgYSBjcmVhdGVkQ2FsbGJhY2sgbWV0aG9kLiAqL1xuY2xhc3MgQ3JlYXRlZE1peGluIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMubWl4aW5DYWxsYmFja0ludm9rZWQgPSB0cnVlO1xuICB9XG59XG5jbGFzcyBFbGVtZW50V2l0aENyZWF0ZWRNaXhpbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbkVsZW1lbnRXaXRoQ3JlYXRlZE1peGluID0gRWxlbWVudFdpdGhDcmVhdGVkTWl4aW4uY29tcG9zZShDcmVhdGVkTWl4aW4pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY3JlYXRlZC1taXhpbicsIEVsZW1lbnRXaXRoQ3JlYXRlZE1peGluKTtcbiJdfQ==
