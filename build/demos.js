(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _ElementBase2 = require('../src/ElementBase');

var _ElementBase3 = _interopRequireDefault(_ElementBase2);

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
   * A component with a style element.
   */

/* Define a custom element. */

var ElementWithStyle = (function (_ElementBase) {
  _inherits(ElementWithStyle, _ElementBase);

  function ElementWithStyle() {
    _classCallCheck(this, ElementWithStyle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithStyle).apply(this, arguments));
  }

  _createClass(ElementWithStyle, [{
    key: 'template',

    // This template is picked up by the TemplateStamping mixin.
    get: function get() {
      return '\n      <style>\n      :host {\n        color: red;\n      }\n      </style>\n      <slot></slot>\n    ';
    }
  }]);

  return ElementWithStyle;
})(_ElementBase3.default);

exports.default = ElementWithStyle;

document.registerElement('element-with-style', ElementWithStyle);

},{"../src/ElementBase":11}],2:[function(require,module,exports){
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

var _ElementBase2 = require('../src/ElementBase');

var _ElementBase3 = _interopRequireDefault(_ElementBase2);

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
   * A sample custom element that uses the ElementBase base class, which defines a
   * set of common custom element mixins.
   */

/* Define a custom element. */

var GreetElement = (function (_ElementBase) {
  _inherits(GreetElement, _ElementBase);

  function GreetElement() {
    _classCallCheck(this, GreetElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GreetElement).apply(this, arguments));
  }

  _createClass(GreetElement, [{
    key: 'punctuation',

    // Define a "punctuation" attribute.
    // This uses the this.$ references created by the AutomaticNodeFinding mixin.
    // If a user of this component sets the "punctuation" attribute in markup,
    // the AttributeMarshalling mixin will cause this property to be set.
    get: function get() {
      return this.$.punctuation.textContent;
    },
    set: function set(value) {
      this.$.punctuation.textContent = value;
    }

    // This template is picked up by the TemplateStamping mixin.

  }, {
    key: 'template',
    get: function get() {
      return '\n      Hello,\n      <slot></slot><span id="punctuation">.</span>\n    ';
    }
  }]);

  return GreetElement;
})(_ElementBase3.default);

exports.default = GreetElement;

document.registerElement('greet-element', GreetElement);

},{"../src/ElementBase":11}],3:[function(require,module,exports){
'use strict';

var _xtag = require('./xtag');

var xtag = _interopRequireWildcard(_xtag);

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

xtag.register('xtag-example', {

  content: '\n    <button>\n      <content></content>\n    </button>\n  ',

  events: {
    click: function click() {
      alert('Clicked');
    }
  }

}); /*
     * Demonstrate the use of a hypothetical XTag registration function.
     */

},{"./xtag":5}],4:[function(require,module,exports){
"use strict";

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
 * Demonstrate some hypothetical XTag-like sugar for component development.
 *
 */

var XTagExtensions = (function () {
  function XTagExtensions() {
    _classCallCheck(this, XTagExtensions);
  }

  _createClass(XTagExtensions, [{
    key: "createdCallback",

    /*
     * Demonstrate a very basic XTag-style system for defining event handlers in
     * a JavaScript dictionary called "events" that maps event names to handlers.
     */
    value: function createdCallback() {
      var events = this.events || [];
      for (var name in events) {
        this.addEventListener(name, events[name]);
      }
    }

    /*
     * Make "content" and "template" synonymous.
     */

  }, {
    key: "template",
    get: function get() {
      return this.content;
    },
    set: function set(value) {
      this.content = value;
    }
  }]);

  return XTagExtensions;
})();

exports.default = XTagExtensions;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Element = undefined;
exports.register = register;

var _Composable = require('Composable/src/Composable');

var _Composable2 = _interopRequireDefault(_Composable);

var _TemplateStamping = require('../../src/TemplateStamping');

var _TemplateStamping2 = _interopRequireDefault(_TemplateStamping);

var _AttributeMarshalling = require('../../src/AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

var _XTagExtensions = require('./XTagExtensions');

var _XTagExtensions2 = _interopRequireDefault(_XTagExtensions);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
} /*
   * Demonstration of creation of a base class for a hypothetical version of the
   * X-Tag framework.
   */

/*
 * A framework base class can start with HTMLElement, add in extensibility,
 * plus any other features it wants to bake in. (Alternatively, it could start
 * a common extensible HTML element class like src/ComposableElement.js.)
 *
  * Here, the hypothetical framework uses two standard extension classes
 * for template stamping and attribute marshalling, and adds a custom extension
 * for some XTag-style features. By design, this omits automatic node finding,
 * just to show that it's possible to leave out extensions if that's desired.
 */
var Element = exports.Element = // the base functionality
_Composable2.default.compose.call(HTMLElement, _Composable2.default, // add extensibility
_TemplateStamping2.default, // add shadow root creation and template support
_AttributeMarshalling2.default, // add marshaling of attributes to properties
_XTagExtensions2.default // add some X-Tag specific features like "events"
);

/*
 * The framework can simply let people extend its base class, or provide a
 * custom constructor that extends that base class.
 */
function register(tag, prototype) {
  var mixins = prototype.mixins || []; // Support a declarative "mixins" key.
  var Subclass = Element.compose.apply(Element, [prototype].concat(_toConsumableArray(mixins)));
  document.registerElement(tag, Subclass);
  return Subclass;
}

},{"../../src/AttributeMarshalling":8,"../../src/TemplateStamping":12,"./XTagExtensions":4,"Composable/src/Composable":6}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Extend classes/objects with other classes/objects.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CompositionRules = require('./CompositionRules');

var CompositionRules = _interopRequireWildcard(_CompositionRules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{"./CompositionRules":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
                                                                                               value: true
});

var _Composable = require('Composable/src/Composable');

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

},{"Composable/src/Composable":6}],11:[function(require,module,exports){
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

},{"./AttributeMarshalling":8,"./AutomaticNodeFinding":9,"./ComposableElement":10,"./TemplateStamping":12}],12:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vcy9FbGVtZW50V2l0aFN0eWxlLmpzIiwiZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiZGVtb3MveHRhZy9YVGFnRXhhbXBsZS5qcyIsImRlbW9zL3h0YWcvWFRhZ0V4dGVuc2lvbnMuanMiLCJkZW1vcy94dGFnL3h0YWcuanMiLCJub2RlX21vZHVsZXMvQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9Db21wb3NhYmxlL3NyYy9Db21wb3NpdGlvblJ1bGVzLmpzIiwic3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwic3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwic3JjL0NvbXBvc2FibGVFbGVtZW50LmpzIiwic3JjL0VsZW1lbnRCYXNlLmpzIiwic3JjL1RlbXBsYXRlU3RhbXBpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7OztBQUViLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtBQUFFLFdBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUFFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQUUsVUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxBQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEFBQUMsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEFBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxN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QVcsQ0FBQyxDQUFDO0dBQ2xFLENBQUMsQ0FBQztDQUNKOzs7QUFBQSxTQUdRLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7QUFDekMsZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztDQUM1RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogQSBjb21wb25lbnQgd2l0aCBhIHN0eWxlIGVsZW1lbnQuXG4gKi9cblxuaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cbi8qIERlZmluZSBhIGN1c3RvbSBlbGVtZW50LiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudFdpdGhTdHlsZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcblxuICAvLyBUaGlzIHRlbXBsYXRlIGlzIHBpY2tlZCB1cCBieSB0aGUgVGVtcGxhdGVTdGFtcGluZyBtaXhpbi5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIGA7XG4gIH1cblxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHlsZScsIEVsZW1lbnRXaXRoU3R5bGUpO1xuIiwiLypcbiAqIEEgc2FtcGxlIGN1c3RvbSBlbGVtZW50IHRoYXQgdXNlcyB0aGUgRWxlbWVudEJhc2UgYmFzZSBjbGFzcywgd2hpY2ggZGVmaW5lcyBhXG4gKiBzZXQgb2YgY29tbW9uIGN1c3RvbSBlbGVtZW50IG1peGlucy5cbiAqL1xuXG5pbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuLyogRGVmaW5lIGEgY3VzdG9tIGVsZW1lbnQuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmVldEVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG5cbiAgLy8gRGVmaW5lIGEgXCJwdW5jdHVhdGlvblwiIGF0dHJpYnV0ZS5cbiAgLy8gVGhpcyB1c2VzIHRoZSB0aGlzLiQgcmVmZXJlbmNlcyBjcmVhdGVkIGJ5IHRoZSBBdXRvbWF0aWNOb2RlRmluZGluZyBtaXhpbi5cbiAgLy8gSWYgYSB1c2VyIG9mIHRoaXMgY29tcG9uZW50IHNldHMgdGhlIFwicHVuY3R1YXRpb25cIiBhdHRyaWJ1dGUgaW4gbWFya3VwLFxuICAvLyB0aGUgQXR0cmlidXRlTWFyc2hhbGxpbmcgbWl4aW4gd2lsbCBjYXVzZSB0aGlzIHByb3BlcnR5IHRvIGJlIHNldC5cbiAgZ2V0IHB1bmN0dWF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiQucHVuY3R1YXRpb24udGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IHB1bmN0dWF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy4kLnB1bmN0dWF0aW9uLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICAvLyBUaGlzIHRlbXBsYXRlIGlzIHBpY2tlZCB1cCBieSB0aGUgVGVtcGxhdGVTdGFtcGluZyBtaXhpbi5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICBIZWxsbyxcbiAgICAgIDxzbG90Pjwvc2xvdD48c3BhbiBpZD1cInB1bmN0dWF0aW9uXCI+Ljwvc3Bhbj5cbiAgICBgO1xuICB9XG5cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdncmVldC1lbGVtZW50JywgR3JlZXRFbGVtZW50KTtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSB0aGUgdXNlIG9mIGEgaHlwb3RoZXRpY2FsIFhUYWcgcmVnaXN0cmF0aW9uIGZ1bmN0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIHh0YWcgZnJvbSAnLi94dGFnJztcblxueHRhZy5yZWdpc3RlcigneHRhZy1leGFtcGxlJywge1xuXG4gIGNvbnRlbnQ6IGBcbiAgICA8YnV0dG9uPlxuICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PlxuICAgIDwvYnV0dG9uPlxuICBgLFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIGFsZXJ0KCdDbGlja2VkJyk7XG4gICAgfVxuICB9XG5cbn0pO1xuIiwiLypcbiAqIERlbW9uc3RyYXRlIHNvbWUgaHlwb3RoZXRpY2FsIFhUYWctbGlrZSBzdWdhciBmb3IgY29tcG9uZW50IGRldmVsb3BtZW50LlxuICpcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYVGFnRXh0ZW5zaW9ucyB7XG5cbiAgLypcbiAgICogRGVtb25zdHJhdGUgYSB2ZXJ5IGJhc2ljIFhUYWctc3R5bGUgc3lzdGVtIGZvciBkZWZpbmluZyBldmVudCBoYW5kbGVycyBpblxuICAgKiBhIEphdmFTY3JpcHQgZGljdGlvbmFyeSBjYWxsZWQgXCJldmVudHNcIiB0aGF0IG1hcHMgZXZlbnQgbmFtZXMgdG8gaGFuZGxlcnMuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IFtdO1xuICAgIGZvciAobGV0IG5hbWUgaW4gZXZlbnRzKSB7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRzW25hbWVdKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBNYWtlIFwiY29udGVudFwiIGFuZCBcInRlbXBsYXRlXCIgc3lub255bW91cy5cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50O1xuICB9XG4gIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuY29udGVudCA9IHZhbHVlO1xuICB9XG5cbn1cbiIsIi8qXG4gKiBEZW1vbnN0cmF0aW9uIG9mIGNyZWF0aW9uIG9mIGEgYmFzZSBjbGFzcyBmb3IgYSBoeXBvdGhldGljYWwgdmVyc2lvbiBvZiB0aGVcbiAqIFgtVGFnIGZyYW1ld29yay5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICdDb21wb3NhYmxlL3NyYy9Db21wb3NhYmxlJztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4uLy4uL3NyYy9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuLi8uLi9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuaW1wb3J0IFhUYWdFeHRlbnNpb25zIGZyb20gJy4vWFRhZ0V4dGVuc2lvbnMnO1xuXG4vKlxuICogQSBmcmFtZXdvcmsgYmFzZSBjbGFzcyBjYW4gc3RhcnQgd2l0aCBIVE1MRWxlbWVudCwgYWRkIGluIGV4dGVuc2liaWxpdHksXG4gKiBwbHVzIGFueSBvdGhlciBmZWF0dXJlcyBpdCB3YW50cyB0byBiYWtlIGluLiAoQWx0ZXJuYXRpdmVseSwgaXQgY291bGQgc3RhcnRcbiAqIGEgY29tbW9uIGV4dGVuc2libGUgSFRNTCBlbGVtZW50IGNsYXNzIGxpa2Ugc3JjL0NvbXBvc2FibGVFbGVtZW50LmpzLilcbiAqXG4gICogSGVyZSwgdGhlIGh5cG90aGV0aWNhbCBmcmFtZXdvcmsgdXNlcyB0d28gc3RhbmRhcmQgZXh0ZW5zaW9uIGNsYXNzZXNcbiAqIGZvciB0ZW1wbGF0ZSBzdGFtcGluZyBhbmQgYXR0cmlidXRlIG1hcnNoYWxsaW5nLCBhbmQgYWRkcyBhIGN1c3RvbSBleHRlbnNpb25cbiAqIGZvciBzb21lIFhUYWctc3R5bGUgZmVhdHVyZXMuIEJ5IGRlc2lnbiwgdGhpcyBvbWl0cyBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLFxuICoganVzdCB0byBzaG93IHRoYXQgaXQncyBwb3NzaWJsZSB0byBsZWF2ZSBvdXQgZXh0ZW5zaW9ucyBpZiB0aGF0J3MgZGVzaXJlZC5cbiAqL1xuZXhwb3J0IGxldCBFbGVtZW50ID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoXG4gIEhUTUxFbGVtZW50LCAgICAgICAgICAgIC8vIHRoZSBiYXNlIGZ1bmN0aW9uYWxpdHlcbiAgQ29tcG9zYWJsZSwgICAgICAgICAgICAgLy8gYWRkIGV4dGVuc2liaWxpdHlcbiAgVGVtcGxhdGVTdGFtcGluZywgICAgICAgLy8gYWRkIHNoYWRvdyByb290IGNyZWF0aW9uIGFuZCB0ZW1wbGF0ZSBzdXBwb3J0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAgIC8vIGFkZCBtYXJzaGFsaW5nIG9mIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllc1xuICBYVGFnRXh0ZW5zaW9ucyAgICAgICAgICAvLyBhZGQgc29tZSBYLVRhZyBzcGVjaWZpYyBmZWF0dXJlcyBsaWtlIFwiZXZlbnRzXCJcbik7XG5cbi8qXG4gKiBUaGUgZnJhbWV3b3JrIGNhbiBzaW1wbHkgbGV0IHBlb3BsZSBleHRlbmQgaXRzIGJhc2UgY2xhc3MsIG9yIHByb3ZpZGUgYVxuICogY3VzdG9tIGNvbnN0cnVjdG9yIHRoYXQgZXh0ZW5kcyB0aGF0IGJhc2UgY2xhc3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcih0YWcsIHByb3RvdHlwZSkge1xuICBsZXQgbWl4aW5zID0gcHJvdG90eXBlLm1peGlucyB8fCBbXTsgLy8gU3VwcG9ydCBhIGRlY2xhcmF0aXZlIFwibWl4aW5zXCIga2V5LlxuICBsZXQgU3ViY2xhc3MgPSBFbGVtZW50LmNvbXBvc2UocHJvdG90eXBlLCAuLi5taXhpbnMpO1xuICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQodGFnLCBTdWJjbGFzcyk7XG4gIHJldHVybiBTdWJjbGFzcztcbn1cbiIsIi8qXG4gKiBFeHRlbmQgY2xhc3Nlcy9vYmplY3RzIHdpdGggb3RoZXIgY2xhc3Nlcy9vYmplY3RzLlxuICovXG5cbmltcG9ydCAqIGFzIENvbXBvc2l0aW9uUnVsZXMgZnJvbSAnLi9Db21wb3NpdGlvblJ1bGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9zYWJsZSB7XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuY29tcG9zZShNaXhpbjEsIE1peGluMiwgTWl4aW4zKVxuICAgKlxuICAgKiB3aWxsIHJldHVybiBhIG5ldyBjbGFzcyBvZiBNeUJhc2VDbGFzcyB0aGF0IGltcGxlbWVudHMgYWxsIHRoZSBtZXRob2RzIGluXG4gICAqIHRoZSB0aHJlZSBtaXhpbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuY29tcG9zZShNaXhpbjEpLmNvbXBvc2UoTWl4aW4yKS5jb21wb3NlKE1peGluMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBDb21wb3NhYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2UoLi4ubWl4aW5zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIG1peGluIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IG1peGlucy4gSXQgdHVybnMgb3V0IHRoYXRcbiAgICAvLyB3ZSBjYW4gdXNlIEFycmF5LnJlZHVjZSgpIHRvIGNvbmNpc2VseSBleHByZXNzIHRoaXMsIHVzaW5nIHRoZSBjdXJyZW50XG4gICAgLy8gKG9yaWdpbmFsKSBjbGFzcyBhcyB0aGUgc2VlZCBmb3IgcmVkdWNlKCkuXG4gICAgcmV0dXJuIG1peGlucy5yZWR1Y2UoY29tcG9zZSwgdGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZGVjb3JhdGUoZGVjb3JhdG9ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBkZWNvcmF0b3JzKSB7XG4gICAgICBsZXQgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1trZXldO1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIGtleSk7XG4gICAgICBkZWNvcmF0b3IodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBDb21wb3NhYmxlLmRlY29yYXRlLmNhbGwodGhpcywgZGVjb3JhdG9ycyk7XG4gIH1cblxuICAvLyBEZWNvcmF0ZSBmb3IgYW5ub3RhdGluZyBob3cgYSBjbGFzcyBtZW1iZXIgc2hvdWxkIGJlIGNvbXBvc2VkIGxhdGVyLlxuICAvLyBUaGlzIHRha2VzIGEgZGVjb3JhdG9yIHRoYXQgd2lsbCBiZSBydW4gYXQgKmNvbXBvc2l0aW9uKiB0aW1lLlxuICAvLyBGb3Igbm93LCB0aGlzIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gbWV0aG9kcy5cbiAgc3RhdGljIHJ1bGUoZGVjb3JhdG9yKSB7XG4gICAgLy8gV2UgcmV0dXJuIGEgZGVjb3JhdG9yIHRoYXQganVzdCBhZGRzIHRoZSBkZWNvcmF0b3IgZ2l2ZW4gYWJvdmUgdG8gdGhlXG4gICAgLy8gbWVtYmVyLlxuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgICAgLy8gVE9ETzogVXNlIGEgU3ltYm9sIGluc3RlYWQgb2YgYSBzdHJpbmcgcHJvcGVydHkgbmFtZSB0byBzYXZlIHRoaXMuXG4gICAgICBkZXNjcmlwdG9yLnZhbHVlLl9jb21wb3NpdGlvblJ1bGUgPSBkZWNvcmF0b3I7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogRXhwb3NlIHN0YW5kYXJkIGNvbXBvc2l0aW9uIHJ1bGVzIGFzIHByb3BlcnRpZXMgb2YgQ29tcG9zYWJsZS5cbiAqIFRoaXMgYXZvaWRzIHRoZSBuZWVkIGZvciBzb21lb25lIHRvIG1ha2UgYSBzZXBhcmF0ZSBpbXBvcnQgb2YgdGhlIHJ1bGVzLlxuICovXG5Db21wb3NhYmxlLnJ1bGVzID0gQ29tcG9zaXRpb25SdWxlcztcblxuXG4vKlxuICogQWxsIENvbXBvc2FibGUtY3JlYXRlZCBvYmplY3RzIGtlZXAgcmVmZXJlbmNlcyB0byB0aGUgbWl4aW5zIHRoYXQgd2VyZVxuICogYXBwbGllZCB0byBjcmVhdGUgdGhlbS4gV2hlbiBhICpuYW1lZCogbWl4aW4gaXMgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlXG4gKiBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlIGNsYXNzJyBwcm90b3R5cGUpIHdpbGxcbiAqIGhhdmUgYSBuZXcgbWVtYmVyIHdpdGggdGhhdCBuYW1lIHRoYXQgcG9pbnRzIGJhY2sgdG8gdGhlIHNhbWUgb2JqZWN0LlxuICogVGhhdCBmYWNpbGl0eSBpcyB1c2VmdWwgd2hlbiBkZWFsaW5nIHdpdGggY2hhaW5zIHRoYXQgaGF2ZSBiZWVuIGV4dGVuZGVkXG4gKiBtb3JlIHRoYW4gb25jZSwgYXMgYW4gbWl4aW4ncyBuYW1lIGlzIHN1ZmZpY2llbnQgdG8gcmV0cmlldmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoYXQgcG9pbnQgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBBIHNpbmdsZSBtaXhpbiBjYW4gYmUgYXBwbGllZCB0byBtdWx0aXBsZSBwcm90b3R5cGUgY2hhaW5zIC0tIHRoZSBuYW1lXG4gKiByZWZlcnMgdG8gdGhlIHByb3RvdHlwZSBvbiAqdGhpcyBwYXJ0aWN1bGFyIHByb3RvdHlwZSBjaGFpbiogdGhhdCB3YXMgYWRkZWRcbiAqIGZvciB0aGF0IG1peGluLiBUaGlzIGxldHMgbWl4aW4vbWl4aW4gY29kZSBnZXQgYmFjayB0byBpdHMgb3duXG4gKiBwcm90b3R5cGUsIG1vc3Qgb2Z0ZW4gaW4gY29tYmluYXRpb24gd2l0aCBcInN1cGVyXCIgKHNlZSBiZWxvdykgaW4gb3JkZXIgdG9cbiAqIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLlxuICovXG5Db21wb3NhYmxlLnByb3RvdHlwZS5Db21wb3NhYmxlID0gQ29tcG9zYWJsZS5wcm90b3R5cGU7XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMgaGF2ZSBhIFwic3VwZXJcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlXG4gKiBwcm90b3R5cGUgYWJvdmUgdGhlbSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIFRoaXMgXCJzdXBlclwiIHJlZmVyZW5jZSBpcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIEVTNidzIFwic3VwZXJcIiBrZXl3b3JkIGluXG4gKiBpbiBFUzUgKG9yIHRyYW5zcGlsZWQgRVM2KSBtaXhpbnMgdGhhdCB3YW50IHRvIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLFxuICogd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbCBkZXBlbmQgdXBvbiB3aGljaCBtaXhpbnMgaGF2ZSBiZWVuIGFwcGxpZWRcbiAqIHRvIGEgZ2l2ZW4gcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEUuZy46XG4gKiAgIGNsYXNzIE1peGluIHtcbiAqICAgICBmb28oKSB7XG4gKiAgICAgICBpZiAodGhpcy5NaXhpbi5zdXBlci5mb28pIHtcbiAqICAgICAgICAgdGhpcy5NaXhpbi5zdXBlci5mb28uY2FsbCh0aGlzKTsgLy8gSW52b2tlIHN1cGVyY2xhc3MnIGZvbygpXG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBEbyBNaXhpbi1zcGVjaWZpYyB3b3JrIGhlcmUuLi5cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBGb3IgY29uc2lzdGVuY3ksIENvbXBvc2FibGUgaXRzZWxmIHJlY29yZHMgaXRzIG93biBzdXBlcmNsYXNzIGFzIE9iamVjdC5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUuc3VwZXIgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cbi8vIENvbXBvc2l0aW9uIHJ1bGVzIGZvciBzdGFuZGFyZCBvYmplY3QgbWVtYmVycy5cbkNvbXBvc2FibGUucHJvdG90eXBlLmNvbXBvc2l0aW9uUnVsZXMgPSB7XG4gIGNvbnN0cnVjdG9yOiBDb21wb3NhYmxlLm92ZXJyaWRlLFxuICB0b1N0cmluZzogQ29tcG9zYWJsZS5vdmVycmlkZSxcbn07XG5cblxuZnVuY3Rpb24gYXBwbHlDb21wb3NpdGlvblJ1bGVzKG9iaikge1xuICBsZXQgYmFzZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKG5hbWUgaW4gYmFzZSkge1xuICAgICAgLy8gQmFzZSBhbHNvIGltcGxlbWVudHMgYSBtZW1iZXIgd2l0aCB0aGUgc2FtZSBuYW1lOyBuZWVkIHRvIGNvbWJpbmUuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcbiAgICAgIGxldCBydWxlID0gZGVzY3JpcHRvci52YWx1ZSAmJiBkZXNjcmlwdG9yLnZhbHVlLl9jb21wb3NpdGlvblJ1bGU7XG4gICAgICBpZiAoIXJ1bGUpIHtcbiAgICAgICAgLy8gU2VlIGlmIHByb3RvdHlwZSBjaGFpbiBoYXMgYSBydWxlIGZvciB0aGlzIG1lbWJlci5cbiAgICAgICAgcnVsZSA9IG9iai5jb21wb3NpdGlvblJ1bGVzW25hbWVdO1xuICAgICAgfVxuICAgICAgaWYgKCFydWxlKSB7XG4gICAgICAgIHJ1bGUgPSBnZXREZWZhdWx0Q29tcG9zaXRpb25SdWxlKGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgLy8gXCJvdmVycmlkZVwiIGlzIGEga25vd24gbm8tb3AsIHNvIHdlIGRvbid0IGJvdGhlciB0cnlpbmcgdG8gcmVkZWZpbmUgdGhlXG4gICAgICAvLyBwcm9wZXJ0eS5cbiAgICAgIGlmIChydWxlICYmIHJ1bGUgIT09IENvbXBvc2FibGUub3ZlcnJpZGUpIHtcbiAgICAgICAgcnVsZShvYmosIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBwcm9wZXJ0aWVzL21ldGhvZHMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIGlnbm9yZVByb3BlcnR5TmFtZXMgPSBbXSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKGlnbm9yZVByb3BlcnR5TmFtZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzL29iamVjdCB0aGF0IGV4dGVuZHMgdGhlIGdpdmVuIGJhc2UgY2xhc3Mvb2JqZWN0IHdpdGhcbiAqIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgbWl4aW4uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoYmFzZSwgbWl4aW4pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBtaXhpbiBhcmUgY2xhc3NlcyBvciBwbGFpbiBvYmplY3RzLlxuICBsZXQgYmFzZUlzQ2xhc3MgPSBpc0NsYXNzKGJhc2UpO1xuICBsZXQgbWl4aW5Jc0NsYXNzID0gaXNDbGFzcyhtaXhpbik7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqbWl4aW4qIGhhcyBhIGJhc2UgY2xhc3MvcHJvdG90eXBlIG9mIGl0cyBvd24uXG4gIGxldCBtaXhpbkJhc2UgPSBtaXhpbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yIDpcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YobWl4aW4pO1xuICBpZiAobWl4aW5CYXNlICYmXG4gICAgICBtaXhpbkJhc2UgIT09IEZ1bmN0aW9uICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdCAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgLy8gVGhlIG1peGluIGl0c2VsZiBkZXJpdmVzIGZyb20gYW5vdGhlciBjbGFzcy9vYmplY3QuXG4gICAgLy8gUmVjdXJzZSwgYW5kIGV4dGVuZCB3aXRoIHRoZSBtaXhpbidzIGJhc2UgZmlyc3QuXG4gICAgYmFzZSA9IGNvbXBvc2UoYmFzZSwgbWl4aW5CYXNlKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgZXh0ZW5kZWQgb2JqZWN0IHdlJ3JlIGdvaW5nIHRvIHJldHVybiBhcyBhIHJlc3VsdC5cbiAgbGV0IHJlc3VsdDtcbiAgaWYgKGJhc2VJc0NsYXNzKSB7XG4gICAgLy8gQ3JlYXRlIGEgc3ViY2xhc3Mgb2YgYmFzZS4gT25jZSBXZWJLaXQgc3VwcG9ydHMgSFRNTEVsZW1lbnQgYXMgYSByZWFsXG4gICAgLy8gY2xhc3MsIHdlIGNhbiBqdXN0IHNheTpcbiAgICAvL1xuICAgIC8vICAgY2xhc3Mgc3ViY2xhc3MgZXh0ZW5kcyBiYXNlIHt9XG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCB1bnRpbCB0aGF0J3MgcmVzb2x2ZWQsIHdlIGhhdmUgdG8gY29uc3RydWN0IHRoZSBjbGFzcyBvdXJzZWx2ZXMuXG4gICAgcmVzdWx0ID0gZnVuY3Rpb24gc3ViY2xhc3MoKSB7fTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LCBiYXNlKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LnByb3RvdHlwZSwgYmFzZS5wcm90b3R5cGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIENyZWF0ZSBhIHBsYWluIG9iamVjdCB0aGF0IHNpbXBseSB1c2VzIHRoZSBiYXNlIGFzIGEgcHJvdG90eXBlLlxuICAgIHJlc3VsdCA9IE9iamVjdC5jcmVhdGUoYmFzZSk7XG4gIH1cblxuICBsZXQgc291cmNlO1xuICBsZXQgdGFyZ2V0O1xuICBpZiAoYmFzZUlzQ2xhc3MgJiYgbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IEZ1bmN0aW9uLlxuICAgIC8vIFdlJ2QgcHJlZmVyIHRvIGdldCBieSBpbnRlcnJvZ2F0aW5nIEZ1bmN0aW9uIGl0c2VsZiwgYnV0IFdlYktpdCBmdW5jdGlvbnNcbiAgICAvLyBoYXZlIHNvbWUgcHJvcGVydGllcyAoYXJndW1lbnRzIGFuZCBjYWxsZXIpIHdoaWNoIGFyZSBub3QgcmV0dXJuZWQgYnlcbiAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikuXG4gICAgY29uc3QgRlVOQ1RJT05fUFJPUEVSVElFUyA9IFtcbiAgICAgICdhcmd1bWVudHMnLFxuICAgICAgJ2NhbGxlcicsXG4gICAgICAnbGVuZ3RoJyxcbiAgICAgICduYW1lJyxcbiAgICAgICdwcm90b3R5cGUnXG4gICAgXTtcbiAgICAvLyBFeHRlbmRpbmcgYSBjbGFzcyB3aXRoIGEgY2xhc3MuXG4gICAgLy8gV2UnbGwgY29weSBpbnN0YW5jZSBtZW1iZXJzIGluIGEgbW9tZW50LCBidXQgZmlyc3QgY29weSBzdGF0aWMgbWVtYmVycy5cbiAgICBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LCBGVU5DVElPTl9QUk9QRVJUSUVTKTtcbiAgICBzb3VyY2UgPSBtaXhpbi5wcm90b3R5cGU7XG4gICAgdGFyZ2V0ID0gcmVzdWx0LnByb3RvdHlwZTtcbiAgfSBlbHNlIGlmICghYmFzZUlzQ2xhc3MgJiYgbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IHByb3RvdHlwZSBtZXRob2RzIGRpcmVjdGx5IHRvIHJlc3VsdC5cbiAgICBzb3VyY2UgPSBtaXhpbi5wcm90b3R5cGU7XG4gICAgdGFyZ2V0ID0gcmVzdWx0O1xuICB9IGVsc2UgaWYgKGJhc2VJc0NsYXNzICYmICFtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3QuXG4gICAgLy8gQ29weSBtaXhpbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIHNvdXJjZSA9IG1peGluO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgc291cmNlID0gbWl4aW47XG4gICAgdGFyZ2V0ID0gcmVzdWx0O1xuICB9XG4gIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBbJ2NvbnN0cnVjdG9yJ10pO1xuXG4gIGFwcGx5Q29tcG9zaXRpb25SdWxlcyh0YXJnZXQpO1xuXG4gIGlmIChtaXhpbi5uYW1lKSB7XG4gICAgLy8gVXNlIHRoZSBtaXhpbidzIG5hbWUgKHVzdWFsbHkgdGhlIG5hbWUgb2YgYSBjbGFzcycgY29uc3RydWN0b3IpIHRvXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSBuZXdseS1jcmVhdGVkIG9iamVjdCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIHRhcmdldFttaXhpbi5uYW1lXSA9IHRhcmdldDtcblxuICAgIC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHN1cGVyY2xhc3Mvc3VwZXItb2JqZWN0LiBTZWUgdGhlIGNvbW1lbnRzIG9uXG4gICAgLy8gQ29tcG9zYWJsZSdzIFwic3VwZXJcIiBwcm9wZXJ0eS5cbiAgICB0YXJnZXQuc3VwZXIgPSBiYXNlSXNDbGFzcyA/IGJhc2UucHJvdG90eXBlIDogYmFzZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRDb21wb3NpdGlvblJ1bGUoZGVzY3JpcHRvcikge1xuICBpZiAodHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQ29tcG9zYWJsZS5ydWxlcy5wcm9wYWdhdGVGdW5jdGlvbjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gUHJvcGVydHkgd2l0aCBnZXR0ZXIgYW5kL29yIHNldHRlci5cbiAgICByZXR1cm4gQ29tcG9zYWJsZS5ydWxlcy5wcm9wYWdhdGVQcm9wZXJ0eTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gUmV0dXJuIHRydWUgaWYgYyBpcyBhIEphdmFTY3JpcHQgY2xhc3MuXG4vLyBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuLy8gYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbi8vIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4vLyBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuLy8gZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbmZ1bmN0aW9uIGlzQ2xhc3MoYykge1xuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgfHwgICAgICAgICAgICAgICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIChjLnByb3RvdHlwZSAmJiBjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gYyk7IC8vIEhUTUxFbGVtZW50IGluIFdlYktpdFxufVxuIiwiLyoqXG4gKiBTdGFuZGFyZCBjb21wb3NpdGlvbiBydWxlc1xuICovXG5cbi8vIFRha2UgdHdvIGZ1bmN0aW9ucyBhbmQgcmV0dXJuIGEgbmV3IGNvbXBvc2VkIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBib3RoLlxuLy8gVGhlIGNvbXBvc2VkIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIHNlY29uZCBmdW5jdGlvbi5cbi8vIFRoaXMgaXMgbm90IGEgcnVsZSwgYnV0IGEgaGVscGVyIHVzZWQgYnkgcnVsZXMuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZUZ1bmN0aW9uKGZ1bmN0aW9uMSwgZnVuY3Rpb24yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8vIExpa2UgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcigpLCBidXQgd2Fsa3MgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbi8vIFRoaXMgaXMgbmVlZGVkIGJ5IGNvbXBvc2l0aW9uIHJ1bGVzLCB3aGljaCB1c3VhbGx5IHN0YXJ0IG91dCBieSBnZXR0aW5nXG4vLyB0aGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1lbWJlciB0aGV5J3JlIGNvbXBvc2luZy5cbi8vIFRoaXMgaXMgbm90IGEgcnVsZSwgYnV0IGEgaGVscGVyIHVzZWQgYnkgcnVsZXMuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSkge1xuICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcbiAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgLy8gQ2hlY2tpbmcgZm9yIFwibmFtZSBpbiBwcm90b3R5cGVcIiBsZXRzIHVzIGtub3cgd2hldGhlciB3ZSBzaG91bGQgYm90aGVyXG4gICAgLy8gd2Fsa2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIGlmIChwcm90b3R5cGUgJiYgbmFtZSBpbiBwcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gTm90IGZvdW5kXG59XG5cbi8vIENvbWJpbmF0b3IgdGhhdCBjYXVzZXMgYSBtaXhpbiBtZXRob2QgdG8gb3ZlcnJpZGUgaXRzIGJhc2UgaW1wbGVtZW50YXRpb24uXG4vLyBTaW5jZSB0aGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBwcm90b3R5cGUgY2hhaW4sIHRoaXMgaXMgYSBuby1vcC5cbmV4cG9ydCBmdW5jdGlvbiBvdmVycmlkZSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge31cblxuLy8gQ29tcG9zZSBtZXRob2RzLCBpbnZva2luZyBiYXNlIGltcGxlbWVudGF0aW9uIGZpcnN0LiBJZiBpdCByZXR1cm5zIGFcbi8vIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSwgdGhlIG1peGluIGltcGxlbWVudGF0aW9uJ3Ncbi8vIHJlc3VsdCBpcyByZXR1cm5lZC5cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJCYXNlUmVzdWx0KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV07XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfHwgbWl4aW5JbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbi8vIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgbWl4aW4gaW1wbGVtZW50YXRpb24gZmlyc3QuIElmIGl0IHJldHVybnMgYVxuLy8gdHJ1dGh5IHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCB0aGUgYmFzZSBpbXBsZW1lbnRhdGlvbidzXG4vLyByZXN1bHQgaXMgcmV0dXJuZWQuXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVyTWl4aW5SZXN1bHQodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluSW1wbGVtZW50YXRpb24gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClba2V5XTtcbiAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtaXhpbkltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfHwgYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuLy8gRGVmYXVsdCBydWxlIGZvciBjb21wb3NpbmcgbWV0aG9kczogaW52b2tlIGJhc2UgZmlyc3QsIHRoZW4gbWl4aW4uXG5leHBvcnQgZnVuY3Rpb24gcHJvcGFnYXRlRnVuY3Rpb24odGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluSW1wbGVtZW50YXRpb24gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClba2V5XTtcbiAgZGVzY3JpcHRvci52YWx1ZSA9IGNvbXBvc2VGdW5jdGlvbihiYXNlSW1wbGVtZW50YXRpb24sIG1peGluSW1wbGVtZW50YXRpb24pO1xufVxuXG4vLyBEZWZhdWx0IHJ1bGUgZm9yIGNvbXBvc2luZyBwcm9wZXJ0aWVzLlxuLy8gV2Ugb25seSBjb21wb3NlIHNldHRlcnMsIHdoaWNoIGludm9rZSBiYXNlIGZpcnN0LCB0aGVuIG1peGluLlxuLy8gQSBkZWZpbmVkIG1peGluIGdldHRlciBvdmVycmlkZXMgYSBiYXNlIGdldHRlci5cbi8vIE5vdGUgdGhhdCwgYmVjYXVzZSBvZiB0aGUgd2F5IHByb3BlcnR5IGRlc2NyaXB0b3JzIHdvcmssIGlmIHRoZSBtaXhpbiBvbmx5XG4vLyBkZWZpbmVzIGEgc2V0dGVyLCBidXQgbm90IGEgZ2V0dGVyLCB3ZSBoYXZlIHRvIHN1cHBseSBhIGRlZmF1bHQgZ2V0dGVyIHRoYXRcbi8vIGludm9rZXMgdGhlIGJhc2UgZ2V0dGVyLiBTaW1pbGFybHksIGlmIHRoZSBtaXhpbiBqdXN0IGRlZmluZXMgYSBnZXR0ZXIsXG4vLyB3ZSBoYXZlIHRvIHN1cHBseSBhIGRlZmF1bHQgc2V0dGVyLlxuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBrZXkpO1xuICBpZiAoZGVzY3JpcHRvci5nZXQgJiYgIWRlc2NyaXB0b3Iuc2V0ICYmIGJhc2VEZXNjcmlwdG9yLnNldCkge1xuICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgc2V0dGVyLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGJhc2VEZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgaWYgKCFkZXNjcmlwdG9yLmdldCAmJiBiYXNlRGVzY3JpcHRvci5nZXQpIHtcbiAgICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgZ2V0dGVyLlxuICAgICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VEZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gQ29tcG9zZSBzZXR0ZXJzLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VEZXNjcmlwdG9yLnNldCwgZGVzY3JpcHRvci5zZXQpO1xuICB9XG59XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgY29tcG9zYWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gQ29tcG9zYWJsZS5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICdDb21wb3NhYmxlL3NyYy9Db21wb3NhYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IENvbXBvc2FibGVFbGVtZW50ID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoSFRNTEVsZW1lbnQsIENvbXBvc2FibGUpO1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb3NhYmxlRWxlbWVudDtcbiIsIi8qXG4gKiBBIHNhbXBsZSBnZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzIHRoYXQgbWl4ZXNcbiAqIGluIHNvbWUgY29tbW9uIGZlYXR1cmVzOiB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsIGF1dG9tYXRpYyBub2RlXG4gKiBmaW5kaW5nLCBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBDb21wb3NhYmxlRWxlbWVudCBmcm9tICcuL0NvbXBvc2FibGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgQ29tcG9zYWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuY29tcG9zZShcbiAgVGVtcGxhdGVTdGFtcGluZywgLy8gYmVmb3JlIG5vZGUgZmluZGluZywgc28gc2hhZG93IHJvb3QgaXMgcG9wdWxhdGVkXG4gIEF1dG9tYXRpY05vZGVGaW5kaW5nLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIG1hcnNoYWxsZWQgcHJvcGVydGllcyBjYW4gdXNlIGl0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nXG4pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqXG4gKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgZXh0ZW5zaW9uIHJldGFpbnMgc3VwcG9ydCBmb3IgU2hhZG93IERPTSB2MC5cbiAqIFRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlICYmIFVTSU5HX1NIQURPV19ET01fVjApIHtcbiAgICAgIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCkge1xuICAgICAgc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0aGlzLmxvY2FsTmFtZSk7XG4gICAgfVxuICAgIC8vIFRPRE86IFNhdmUgdGhlIHByb2Nlc3NlZCB0ZW1wbGF0ZSB3aXRoIHRoZSBjb21wb25lbnQncyBjbGFzcyBwcm90b3R5cGVcbiAgICAvLyBzbyBpdCBkb2Vzbid0IG5lZWQgdG8gYmUgcHJvY2Vzc2VkIHdpdGggZXZlcnkgaW5zdGFudGlhdGlvbi5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIHRoaXMubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICAgICAgbGV0IHJvb3QgPSBVU0lOR19TSEFET1dfRE9NX1YwID9cbiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCkgOiAgICAgICAgICAgICAvLyBTaGFkb3cgRE9NIHYwXG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pOyAgLy8gU2hhZG93IERPTSB2MVxuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLy8gRmVhdHVyZSBkZXRlY3Rpb24gZm9yIG9sZCBTaGFkb3cgRE9NIHYwLlxuY29uc3QgVVNJTkdfU0hBRE9XX0RPTV9WMCA9ICh0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNyZWF0ZVNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnKTtcblxuXG4vLyBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbi8vIFJlcGxhY2Ugb2NjdXJlbmNlcyBvZiB2MSBzbG90IGVsZW1lbnRzIHdpdGggdjAgY29udGVudCBlbGVtZW50cy5cbi8vIFRoaXMgZG9lcyBub3QgeWV0IG1hcCBuYW1lZCBzbG90cyB0byBjb250ZW50IHNlbGVjdCBjbGF1c2VzLlxuZnVuY3Rpb24gcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpIHtcbiAgW10uZm9yRWFjaC5jYWxsKHRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2xvdCcpLCBzbG90RWxlbWVudCA9PiB7XG4gICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpO1xuICAgIHNsb3RFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNvbnRlbnRFbGVtZW50LCBzbG90RWxlbWVudCk7XG4gIH0pO1xufVxuXG4vLyBJbnZva2UgYmFzaWMgc3R5bGUgc2hpbW1pbmcgd2l0aCBTaGFkb3dDU1MuXG5mdW5jdGlvbiBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRhZykge1xuICBXZWJDb21wb25lbnRzLlNoYWRvd0NTUy5zaGltU3R5bGluZyh0ZW1wbGF0ZS5jb250ZW50LCB0YWcpO1xufVxuIl19
