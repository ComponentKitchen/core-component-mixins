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

},{"../src/ElementBase":10}],2:[function(require,module,exports){
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

},{"../src/ElementBase":10}],3:[function(require,module,exports){
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

var _Composable = require('../../extensible/Composable');

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

},{"../../extensible/Composable":6,"../../src/AttributeMarshalling":7,"../../src/TemplateStamping":11,"./XTagExtensions":4}],6:[function(require,module,exports){
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

    // Like Object.getOwnPropertyDescriptor(), but walks up the prototype chain.
    // This is needed by composition rules, which usually start out by getting
    // the base implementation of a member they're composing.

  }, {
    key: 'getPropertyDescriptor',
    value: function getPropertyDescriptor(obj, name) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, name);
      if (descriptor) {
        return descriptor;
      } else {
        var prototype = Object.getPrototypeOf(obj);
        // Checking for "name in prototype" lets us know whether we should bother
        // walking up the prototype chain.
        if (prototype && name in prototype) {
          return this.getPropertyDescriptor(prototype, name);
        }
      }
      return undefined; // Not found
    }

    // Compose methods, invoking base implementation first. If it returns a
    // truthy result, that is returned. Otherwise, the mixin implementation's
    // result is returned.

  }, {
    key: 'preferBaseResult',
    value: function preferBaseResult(target, key, descriptor) {
      var mixinImplementation = descriptor.value;
      var baseImplementation = Object.getPrototypeOf(target)[key];
      descriptor.value = function () {
        return baseImplementation.apply(this, arguments) || mixinImplementation.apply(this, arguments);
      };
    }

    // Compose methods, invoking mixin implementation first. If it returns a
    // truthy result, that is returned. Otherwise, the base implementation's
    // result is returned.

  }, {
    key: 'preferMixinResult',
    value: function preferMixinResult(target, key, descriptor) {
      var mixinImplementation = descriptor.value;
      var baseImplementation = Object.getPrototypeOf(target)[key];
      descriptor.value = function () {
        return mixinImplementation.apply(this, arguments) || baseImplementation.apply(this, arguments);
      };
    }

    // Default rule for composing methods: invoke base first, then mixin.

  }, {
    key: 'propagateFunction',
    value: function propagateFunction(target, key, descriptor) {
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

  }, {
    key: 'propagateProperty',
    value: function propagateProperty(target, key, descriptor) {
      var base = Object.getPrototypeOf(target);
      var baseDescriptor = Composable.getPropertyDescriptor(base, key);
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

    // Combinator that causes a mixin method to override its base implementation.
    // Since this the default behavior of the prototype chain, this is a no-op.

  }, {
    key: 'override',
    value: function override(target, key, descriptor) {}
  }]);

  return Composable;
})();

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

// Take two functions and return a new composed function that invokes both.
// The composed function will return the result of the second function.
function composeFunction(function1, function2) {
  return function () {
    function1.apply(this, arguments);
    return function2.apply(this, arguments);
  };
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
    return Composable.propagateFunction;
  } else if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
    // Property with getter and/or setter.
    return Composable.propagateProperty;
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

exports.default = Composable;

},{}],7:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../extensible/Composable":6}],10:[function(require,module,exports){
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

},{"./AttributeMarshalling":7,"./AutomaticNodeFinding":8,"./ComposableElement":9,"./TemplateStamping":11}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vcy9FbGVtZW50V2l0aFN0eWxlLmpzIiwiZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiZGVtb3MveHRhZy9YVGFnRXhhbXBsZS5qcyIsImRlbW9zL3h0YWcvWFRhZ0V4dGVuc2lvbnMuanMiLCJkZW1vcy94dGFnL3h0YWcuanMiLCJleHRlbnNpYmxlL0NvbXBvc2FibGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvQ29tcG9zYWJsZUVsZW1lbnQuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7Ozs7O0FBRWIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxZQUFZO0FBQUUsV0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFBRSxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLEFBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQUU7R0FBRSxBQUFDLE9BQU8sVUFB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QUssV0FBVzs7O0FBQUEsQUFBRSxTQUluRiwyQkFBMkIsQ0FBQyxTQUFTLEVBQUU7QUFDOUMsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7Ozs7QUFBQSxBQUFDLE1BSTlDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLEtBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFlBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNqRDtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCOzs7O0FBQUEsU0FJUSx1QkFBdUIsQ0FBQyxRQUFRLEVBQUU7QUFDekMsSUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFBLFdBQVcsRUFBSTtBQUN4RSxRQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZELGVBQVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztHQUNsRSxDQUFDLENBQUM7Q0FDSjs7O0FBQUEsU0FHUSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0FBQ3pDLGVBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDNUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIEEgY29tcG9uZW50IHdpdGggYSBzdHlsZSBlbGVtZW50LlxuICovXG5cbmltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi9zcmMvRWxlbWVudEJhc2UnO1xuXG4vKiBEZWZpbmUgYSBjdXN0b20gZWxlbWVudC4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRXaXRoU3R5bGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG5cbiAgLy8gVGhpcyB0ZW1wbGF0ZSBpcyBwaWNrZWQgdXAgYnkgdGhlIFRlbXBsYXRlU3RhbXBpbmcgbWl4aW4uXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge1xuICAgICAgICBjb2xvcjogcmVkO1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICBgO1xuICB9XG5cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtc3R5bGUnLCBFbGVtZW50V2l0aFN0eWxlKTtcbiIsIi8qXG4gKiBBIHNhbXBsZSBjdXN0b20gZWxlbWVudCB0aGF0IHVzZXMgdGhlIEVsZW1lbnRCYXNlIGJhc2UgY2xhc3MsIHdoaWNoIGRlZmluZXMgYVxuICogc2V0IG9mIGNvbW1vbiBjdXN0b20gZWxlbWVudCBtaXhpbnMuXG4gKi9cblxuaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cbi8qIERlZmluZSBhIGN1c3RvbSBlbGVtZW50LiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JlZXRFbGVtZW50IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuXG4gIC8vIERlZmluZSBhIFwicHVuY3R1YXRpb25cIiBhdHRyaWJ1dGUuXG4gIC8vIFRoaXMgdXNlcyB0aGUgdGhpcy4kIHJlZmVyZW5jZXMgY3JlYXRlZCBieSB0aGUgQXV0b21hdGljTm9kZUZpbmRpbmcgbWl4aW4uXG4gIC8vIElmIGEgdXNlciBvZiB0aGlzIGNvbXBvbmVudCBzZXRzIHRoZSBcInB1bmN0dWF0aW9uXCIgYXR0cmlidXRlIGluIG1hcmt1cCxcbiAgLy8gdGhlIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIG1peGluIHdpbGwgY2F1c2UgdGhpcyBwcm9wZXJ0eSB0byBiZSBzZXQuXG4gIGdldCBwdW5jdHVhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kLnB1bmN0dWF0aW9uLnRleHRDb250ZW50O1xuICB9XG4gIHNldCBwdW5jdHVhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuJC5wdW5jdHVhdGlvbi50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgLy8gVGhpcyB0ZW1wbGF0ZSBpcyBwaWNrZWQgdXAgYnkgdGhlIFRlbXBsYXRlU3RhbXBpbmcgbWl4aW4uXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgSGVsbG8sXG4gICAgICA8c2xvdD48L3Nsb3Q+PHNwYW4gaWQ9XCJwdW5jdHVhdGlvblwiPi48L3NwYW4+XG4gICAgYDtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZ3JlZXQtZWxlbWVudCcsIEdyZWV0RWxlbWVudCk7XG4iLCIvKlxuICogRGVtb25zdHJhdGUgdGhlIHVzZSBvZiBhIGh5cG90aGV0aWNhbCBYVGFnIHJlZ2lzdHJhdGlvbiBmdW5jdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyB4dGFnIGZyb20gJy4veHRhZyc7XG5cbnh0YWcucmVnaXN0ZXIoJ3h0YWctZXhhbXBsZScsIHtcblxuICBjb250ZW50OiBgXG4gICAgPGJ1dHRvbj5cbiAgICAgIDxjb250ZW50PjwvY29udGVudD5cbiAgICA8L2J1dHRvbj5cbiAgYCxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICBhbGVydCgnQ2xpY2tlZCcpO1xuICAgIH1cbiAgfVxuXG59KTtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSBzb21lIGh5cG90aGV0aWNhbCBYVGFnLWxpa2Ugc3VnYXIgZm9yIGNvbXBvbmVudCBkZXZlbG9wbWVudC5cbiAqXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWFRhZ0V4dGVuc2lvbnMge1xuXG4gIC8qXG4gICAqIERlbW9uc3RyYXRlIGEgdmVyeSBiYXNpYyBYVGFnLXN0eWxlIHN5c3RlbSBmb3IgZGVmaW5pbmcgZXZlbnQgaGFuZGxlcnMgaW5cbiAgICogYSBKYXZhU2NyaXB0IGRpY3Rpb25hcnkgY2FsbGVkIFwiZXZlbnRzXCIgdGhhdCBtYXBzIGV2ZW50IG5hbWVzIHRvIGhhbmRsZXJzLlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICBmb3IgKGxldCBuYW1lIGluIGV2ZW50cykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50c1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogTWFrZSBcImNvbnRlbnRcIiBhbmQgXCJ0ZW1wbGF0ZVwiIHN5bm9ueW1vdXMuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG59XG4iLCIvKlxuICogRGVtb25zdHJhdGlvbiBvZiBjcmVhdGlvbiBvZiBhIGJhc2UgY2xhc3MgZm9yIGEgaHlwb3RoZXRpY2FsIHZlcnNpb24gb2YgdGhlXG4gKiBYLVRhZyBmcmFtZXdvcmsuXG4gKi9cblxuaW1wb3J0IENvbXBvc2FibGUgZnJvbSAnLi4vLi4vZXh0ZW5zaWJsZS9Db21wb3NhYmxlJztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4uLy4uL3NyYy9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuLi8uLi9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuaW1wb3J0IFhUYWdFeHRlbnNpb25zIGZyb20gJy4vWFRhZ0V4dGVuc2lvbnMnO1xuXG4vKlxuICogQSBmcmFtZXdvcmsgYmFzZSBjbGFzcyBjYW4gc3RhcnQgd2l0aCBIVE1MRWxlbWVudCwgYWRkIGluIGV4dGVuc2liaWxpdHksXG4gKiBwbHVzIGFueSBvdGhlciBmZWF0dXJlcyBpdCB3YW50cyB0byBiYWtlIGluLiAoQWx0ZXJuYXRpdmVseSwgaXQgY291bGQgc3RhcnRcbiAqIGEgY29tbW9uIGV4dGVuc2libGUgSFRNTCBlbGVtZW50IGNsYXNzIGxpa2Ugc3JjL0NvbXBvc2FibGVFbGVtZW50LmpzLilcbiAqXG4gICogSGVyZSwgdGhlIGh5cG90aGV0aWNhbCBmcmFtZXdvcmsgdXNlcyB0d28gc3RhbmRhcmQgZXh0ZW5zaW9uIGNsYXNzZXNcbiAqIGZvciB0ZW1wbGF0ZSBzdGFtcGluZyBhbmQgYXR0cmlidXRlIG1hcnNoYWxsaW5nLCBhbmQgYWRkcyBhIGN1c3RvbSBleHRlbnNpb25cbiAqIGZvciBzb21lIFhUYWctc3R5bGUgZmVhdHVyZXMuIEJ5IGRlc2lnbiwgdGhpcyBvbWl0cyBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLFxuICoganVzdCB0byBzaG93IHRoYXQgaXQncyBwb3NzaWJsZSB0byBsZWF2ZSBvdXQgZXh0ZW5zaW9ucyBpZiB0aGF0J3MgZGVzaXJlZC5cbiAqL1xuZXhwb3J0IGxldCBFbGVtZW50ID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoXG4gIEhUTUxFbGVtZW50LCAgICAgICAgICAgIC8vIHRoZSBiYXNlIGZ1bmN0aW9uYWxpdHlcbiAgQ29tcG9zYWJsZSwgICAgICAgICAgICAgLy8gYWRkIGV4dGVuc2liaWxpdHlcbiAgVGVtcGxhdGVTdGFtcGluZywgICAgICAgLy8gYWRkIHNoYWRvdyByb290IGNyZWF0aW9uIGFuZCB0ZW1wbGF0ZSBzdXBwb3J0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAgIC8vIGFkZCBtYXJzaGFsaW5nIG9mIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllc1xuICBYVGFnRXh0ZW5zaW9ucyAgICAgICAgICAvLyBhZGQgc29tZSBYLVRhZyBzcGVjaWZpYyBmZWF0dXJlcyBsaWtlIFwiZXZlbnRzXCJcbik7XG5cbi8qXG4gKiBUaGUgZnJhbWV3b3JrIGNhbiBzaW1wbHkgbGV0IHBlb3BsZSBleHRlbmQgaXRzIGJhc2UgY2xhc3MsIG9yIHByb3ZpZGUgYVxuICogY3VzdG9tIGNvbnN0cnVjdG9yIHRoYXQgZXh0ZW5kcyB0aGF0IGJhc2UgY2xhc3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcih0YWcsIHByb3RvdHlwZSkge1xuICBsZXQgbWl4aW5zID0gcHJvdG90eXBlLm1peGlucyB8fCBbXTsgLy8gU3VwcG9ydCBhIGRlY2xhcmF0aXZlIFwibWl4aW5zXCIga2V5LlxuICBsZXQgU3ViY2xhc3MgPSBFbGVtZW50LmNvbXBvc2UocHJvdG90eXBlLCAuLi5taXhpbnMpO1xuICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQodGFnLCBTdWJjbGFzcyk7XG4gIHJldHVybiBTdWJjbGFzcztcbn1cbiIsIi8qXG4gKiBFeHRlbmQgY2xhc3Nlcy9vYmplY3RzIHdpdGggb3RoZXIgY2xhc3Nlcy9vYmplY3RzLlxuICovXG5cblxuY2xhc3MgQ29tcG9zYWJsZSB7XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuY29tcG9zZShNaXhpbjEsIE1peGluMiwgTWl4aW4zKVxuICAgKlxuICAgKiB3aWxsIHJldHVybiBhIG5ldyBjbGFzcyBvZiBNeUJhc2VDbGFzcyB0aGF0IGltcGxlbWVudHMgYWxsIHRoZSBtZXRob2RzIGluXG4gICAqIHRoZSB0aHJlZSBtaXhpbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuY29tcG9zZShNaXhpbjEpLmNvbXBvc2UoTWl4aW4yKS5jb21wb3NlKE1peGluMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBDb21wb3NhYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2UoLi4ubWl4aW5zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIG1peGluIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IG1peGlucy4gSXQgdHVybnMgb3V0IHRoYXRcbiAgICAvLyB3ZSBjYW4gdXNlIEFycmF5LnJlZHVjZSgpIHRvIGNvbmNpc2VseSBleHByZXNzIHRoaXMsIHVzaW5nIHRoZSBjdXJyZW50XG4gICAgLy8gKG9yaWdpbmFsKSBjbGFzcyBhcyB0aGUgc2VlZCBmb3IgcmVkdWNlKCkuXG4gICAgcmV0dXJuIG1peGlucy5yZWR1Y2UoY29tcG9zZSwgdGhpcyk7XG4gIH1cblxuICAvLyBMaWtlIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoKSwgYnV0IHdhbGtzIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gIC8vIFRoaXMgaXMgbmVlZGVkIGJ5IGNvbXBvc2l0aW9uIHJ1bGVzLCB3aGljaCB1c3VhbGx5IHN0YXJ0IG91dCBieSBnZXR0aW5nXG4gIC8vIHRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGEgbWVtYmVyIHRoZXkncmUgY29tcG9zaW5nLlxuICBzdGF0aWMgZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSkge1xuICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgICAgLy8gQ2hlY2tpbmcgZm9yIFwibmFtZSBpbiBwcm90b3R5cGVcIiBsZXRzIHVzIGtub3cgd2hldGhlciB3ZSBzaG91bGQgYm90aGVyXG4gICAgICAvLyB3YWxraW5nIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgICBpZiAocHJvdG90eXBlICYmIG5hbWUgaW4gcHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBOb3QgZm91bmRcbiAgfVxuXG4gIC8vIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgYmFzZSBpbXBsZW1lbnRhdGlvbiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhXG4gIC8vIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSwgdGhlIG1peGluIGltcGxlbWVudGF0aW9uJ3NcbiAgLy8gcmVzdWx0IGlzIHJldHVybmVkLlxuICBzdGF0aWMgcHJlZmVyQmFzZVJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClba2V5XTtcbiAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICB8fCBtaXhpbkltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcG9zZSBtZXRob2RzLCBpbnZva2luZyBtaXhpbiBpbXBsZW1lbnRhdGlvbiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhXG4gIC8vIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSwgdGhlIGJhc2UgaW1wbGVtZW50YXRpb24nc1xuICAvLyByZXN1bHQgaXMgcmV0dXJuZWQuXG4gIHN0YXRpYyBwcmVmZXJNaXhpblJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClba2V5XTtcbiAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbWl4aW5JbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgfHwgYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVmYXVsdCBydWxlIGZvciBjb21wb3NpbmcgbWV0aG9kczogaW52b2tlIGJhc2UgZmlyc3QsIHRoZW4gbWl4aW4uXG4gIHN0YXRpYyBwcm9wYWdhdGVGdW5jdGlvbih0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClba2V5XTtcbiAgICBkZXNjcmlwdG9yLnZhbHVlID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VJbXBsZW1lbnRhdGlvbiwgbWl4aW5JbXBsZW1lbnRhdGlvbik7XG4gIH1cblxuICAvLyBEZWZhdWx0IHJ1bGUgZm9yIGNvbXBvc2luZyBwcm9wZXJ0aWVzLlxuICAvLyBXZSBvbmx5IGNvbXBvc2Ugc2V0dGVycywgd2hpY2ggaW52b2tlIGJhc2UgZmlyc3QsIHRoZW4gbWl4aW4uXG4gIC8vIEEgZGVmaW5lZCBtaXhpbiBnZXR0ZXIgb3ZlcnJpZGVzIGEgYmFzZSBnZXR0ZXIuXG4gIC8vIE5vdGUgdGhhdCwgYmVjYXVzZSBvZiB0aGUgd2F5IHByb3BlcnR5IGRlc2NyaXB0b3JzIHdvcmssIGlmIHRoZSBtaXhpbiBvbmx5XG4gIC8vIGRlZmluZXMgYSBzZXR0ZXIsIGJ1dCBub3QgYSBnZXR0ZXIsIHdlIGhhdmUgdG8gc3VwcGx5IGEgZGVmYXVsdCBnZXR0ZXIgdGhhdFxuICAvLyBpbnZva2VzIHRoZSBiYXNlIGdldHRlci4gU2ltaWxhcmx5LCBpZiB0aGUgbWl4aW4ganVzdCBkZWZpbmVzIGEgZ2V0dGVyLFxuICAvLyB3ZSBoYXZlIHRvIHN1cHBseSBhIGRlZmF1bHQgc2V0dGVyLlxuICBzdGF0aWMgcHJvcGFnYXRlUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBsZXQgYmFzZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICAgIGxldCBiYXNlRGVzY3JpcHRvciA9IENvbXBvc2FibGUuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIGtleSk7XG4gICAgaWYgKGRlc2NyaXB0b3IuZ2V0ICYmICFkZXNjcmlwdG9yLnNldCAmJiBiYXNlRGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgc2V0dGVyLlxuICAgICAgZGVzY3JpcHRvci5zZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBiYXNlRGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGlmICghZGVzY3JpcHRvci5nZXQgJiYgYmFzZURlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgZ2V0dGVyLlxuICAgICAgICBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBiYXNlRGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8vIENvbXBvc2Ugc2V0dGVycy5cbiAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VEZXNjcmlwdG9yLnNldCwgZGVzY3JpcHRvci5zZXQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBkZWNvcmF0ZShkZWNvcmF0b3JzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGRlY29yYXRvcnMpIHtcbiAgICAgIGxldCBkZWNvcmF0b3IgPSBkZWNvcmF0b3JzW2tleV07XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywga2V5KTtcbiAgICAgIGRlY29yYXRvcih0aGlzLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgZGVjb3JhdGUoZGVjb3JhdG9ycykge1xuICAgIENvbXBvc2FibGUuZGVjb3JhdGUuY2FsbCh0aGlzLCBkZWNvcmF0b3JzKTtcbiAgfVxuXG4gIC8vIERlY29yYXRlIGZvciBhbm5vdGF0aW5nIGhvdyBhIGNsYXNzIG1lbWJlciBzaG91bGQgYmUgY29tcG9zZWQgbGF0ZXIuXG4gIC8vIFRoaXMgdGFrZXMgYSBkZWNvcmF0b3IgdGhhdCB3aWxsIGJlIHJ1biBhdCAqY29tcG9zaXRpb24qIHRpbWUuXG4gIC8vIEZvciBub3csIHRoaXMgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBtZXRob2RzLlxuICBzdGF0aWMgcnVsZShkZWNvcmF0b3IpIHtcbiAgICAvLyBXZSByZXR1cm4gYSBkZWNvcmF0b3IgdGhhdCBqdXN0IGFkZHMgdGhlIGRlY29yYXRvciBnaXZlbiBhYm92ZSB0byB0aGVcbiAgICAvLyBtZW1iZXIuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAvLyBUT0RPOiBVc2UgYSBTeW1ib2wgaW5zdGVhZCBvZiBhIHN0cmluZyBwcm9wZXJ0eSBuYW1lIHRvIHNhdmUgdGhpcy5cbiAgICAgIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZSA9IGRlY29yYXRvcjtcbiAgICB9XG4gIH1cblxuICAvLyBDb21iaW5hdG9yIHRoYXQgY2F1c2VzIGEgbWl4aW4gbWV0aG9kIHRvIG92ZXJyaWRlIGl0cyBiYXNlIGltcGxlbWVudGF0aW9uLlxuICAvLyBTaW5jZSB0aGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBwcm90b3R5cGUgY2hhaW4sIHRoaXMgaXMgYSBuby1vcC5cbiAgc3RhdGljIG92ZXJyaWRlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7fVxuXG59XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMga2VlcCByZWZlcmVuY2VzIHRvIHRoZSBtaXhpbnMgdGhhdCB3ZXJlXG4gKiBhcHBsaWVkIHRvIGNyZWF0ZSB0aGVtLiBXaGVuIGEgKm5hbWVkKiBtaXhpbiBpcyBhcHBsaWVkIHRvIHRoZSBwcm90b3R5cGVcbiAqIGNoYWluLCB0aGUgcmVzdWx0aW5nIG9iamVjdCAob3IsIGZvciBhIGNsYXNzLCB0aGUgY2xhc3MnIHByb3RvdHlwZSkgd2lsbFxuICogaGF2ZSBhIG5ldyBtZW1iZXIgd2l0aCB0aGF0IG5hbWUgdGhhdCBwb2ludHMgYmFjayB0byB0aGUgc2FtZSBvYmplY3QuXG4gKiBUaGF0IGZhY2lsaXR5IGlzIHVzZWZ1bCB3aGVuIGRlYWxpbmcgd2l0aCBjaGFpbnMgdGhhdCBoYXZlIGJlZW4gZXh0ZW5kZWRcbiAqIG1vcmUgdGhhbiBvbmNlLCBhcyBhbiBtaXhpbidzIG5hbWUgaXMgc3VmZmljaWVudCB0byByZXRyaWV2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhhdCBwb2ludCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEEgc2luZ2xlIG1peGluIGNhbiBiZSBhcHBsaWVkIHRvIG11bHRpcGxlIHByb3RvdHlwZSBjaGFpbnMgLS0gdGhlIG5hbWVcbiAqIHJlZmVycyB0byB0aGUgcHJvdG90eXBlIG9uICp0aGlzIHBhcnRpY3VsYXIgcHJvdG90eXBlIGNoYWluKiB0aGF0IHdhcyBhZGRlZFxuICogZm9yIHRoYXQgbWl4aW4uIFRoaXMgbGV0cyBtaXhpbi9taXhpbiBjb2RlIGdldCBiYWNrIHRvIGl0cyBvd25cbiAqIHByb3RvdHlwZSwgbW9zdCBvZnRlbiBpbiBjb21iaW5hdGlvbiB3aXRoIFwic3VwZXJcIiAoc2VlIGJlbG93KSBpbiBvcmRlciB0b1xuICogaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IuXG4gKi9cbkNvbXBvc2FibGUucHJvdG90eXBlLkNvbXBvc2FibGUgPSBDb21wb3NhYmxlLnByb3RvdHlwZTtcblxuLypcbiAqIEFsbCBDb21wb3NhYmxlLWNyZWF0ZWQgb2JqZWN0cyBoYXZlIGEgXCJzdXBlclwiIHByb3BlcnR5IHRoYXQgcmVmZXJlbmNlcyB0aGVcbiAqIHByb3RvdHlwZSBhYm92ZSB0aGVtIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogVGhpcyBcInN1cGVyXCIgcmVmZXJlbmNlIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgRVM2J3MgXCJzdXBlclwiIGtleXdvcmQgaW5cbiAqIGluIEVTNSAob3IgdHJhbnNwaWxlZCBFUzYpIG1peGlucyB0aGF0IHdhbnQgdG8gaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IsXG4gKiB3aGVyZSB0aGUgc3BlY2lmaWMgc3VwZXJjbGFzcyB3aWxsIGRlcGVuZCB1cG9uIHdoaWNoIG1peGlucyBoYXZlIGJlZW4gYXBwbGllZFxuICogdG8gYSBnaXZlbiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogRS5nLjpcbiAqICAgY2xhc3MgTWl4aW4ge1xuICogICAgIGZvbygpIHtcbiAqICAgICAgIGlmICh0aGlzLk1peGluLnN1cGVyLmZvbykge1xuICogICAgICAgICB0aGlzLk1peGluLnN1cGVyLmZvby5jYWxsKHRoaXMpOyAvLyBJbnZva2Ugc3VwZXJjbGFzcycgZm9vKClcbiAqICAgICAgIH1cbiAqICAgICAgIC8vIERvIE1peGluLXNwZWNpZmljIHdvcmsgaGVyZS4uLlxuICogICAgIH1cbiAqICAgfVxuICpcbiAqIEZvciBjb25zaXN0ZW5jeSwgQ29tcG9zYWJsZSBpdHNlbGYgcmVjb3JkcyBpdHMgb3duIHN1cGVyY2xhc3MgYXMgT2JqZWN0LlxuICovXG5Db21wb3NhYmxlLnByb3RvdHlwZS5zdXBlciA9IE9iamVjdC5wcm90b3R5cGU7XG5cblxuQ29tcG9zYWJsZS5wcm90b3R5cGUuY29tcG9zaXRpb25SdWxlcyA9IHtcbiAgY29uc3RydWN0b3I6IENvbXBvc2FibGUub3ZlcnJpZGUsXG4gIHRvU3RyaW5nOiBDb21wb3NhYmxlLm92ZXJyaWRlLFxufTtcblxuXG5mdW5jdGlvbiBhcHBseUNvbXBvc2l0aW9uUnVsZXMob2JqKSB7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAobmFtZSBpbiBiYXNlKSB7XG4gICAgICAvLyBCYXNlIGFsc28gaW1wbGVtZW50cyBhIG1lbWJlciB3aXRoIHRoZSBzYW1lIG5hbWU7IG5lZWQgdG8gY29tYmluZS5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpO1xuICAgICAgbGV0IHJ1bGUgPSBkZXNjcmlwdG9yLnZhbHVlICYmIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZTtcbiAgICAgIGlmICghcnVsZSkge1xuICAgICAgICAvLyBTZWUgaWYgcHJvdG90eXBlIGNoYWluIGhhcyBhIHJ1bGUgZm9yIHRoaXMgbWVtYmVyLlxuICAgICAgICBydWxlID0gb2JqLmNvbXBvc2l0aW9uUnVsZXNbbmFtZV07XG4gICAgICB9XG4gICAgICBpZiAoIXJ1bGUpIHtcbiAgICAgICAgcnVsZSA9IGdldERlZmF1bHRDb21wb3NpdGlvblJ1bGUoZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICAvLyBcIm92ZXJyaWRlXCIgaXMgYSBrbm93biBuby1vcCwgc28gd2UgZG9uJ3QgYm90aGVyIHRyeWluZyB0byByZWRlZmluZSB0aGVcbiAgICAgIC8vIHByb3BlcnR5LlxuICAgICAgaWYgKHJ1bGUgJiYgcnVsZSAhPT0gQ29tcG9zYWJsZS5vdmVycmlkZSkge1xuICAgICAgICBydWxlKG9iaiwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblxuLy8gVGFrZSB0d28gZnVuY3Rpb25zIGFuZCByZXR1cm4gYSBuZXcgY29tcG9zZWQgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGJvdGguXG4vLyBUaGUgY29tcG9zZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kIGZ1bmN0aW9uLlxuZnVuY3Rpb24gY29tcG9zZUZ1bmN0aW9uKGZ1bmN0aW9uMSwgZnVuY3Rpb24yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgaWdub3JlUHJvcGVydHlOYW1lcyA9IFtdKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaWdub3JlUHJvcGVydHlOYW1lcy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBtaXhpbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZShiYXNlLCBtaXhpbikge1xuXG4gIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJhc2UgYW5kIG1peGluIGFyZSBjbGFzc2VzIG9yIHBsYWluIG9iamVjdHMuXG4gIGxldCBiYXNlSXNDbGFzcyA9IGlzQ2xhc3MoYmFzZSk7XG4gIGxldCBtaXhpbklzQ2xhc3MgPSBpc0NsYXNzKG1peGluKTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlICptaXhpbiogaGFzIGEgYmFzZSBjbGFzcy9wcm90b3R5cGUgb2YgaXRzIG93bi5cbiAgbGV0IG1peGluQmFzZSA9IG1peGluSXNDbGFzcyA/XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKG1peGluLnByb3RvdHlwZSkuY29uc3RydWN0b3IgOlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbik7XG4gIGlmIChtaXhpbkJhc2UgJiZcbiAgICAgIG1peGluQmFzZSAhPT0gRnVuY3Rpb24gJiZcbiAgICAgIG1peGluQmFzZSAhPT0gT2JqZWN0ICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAvLyBUaGUgbWl4aW4gaXRzZWxmIGRlcml2ZXMgZnJvbSBhbm90aGVyIGNsYXNzL29iamVjdC5cbiAgICAvLyBSZWN1cnNlLCBhbmQgZXh0ZW5kIHdpdGggdGhlIG1peGluJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gY29tcG9zZShiYXNlLCBtaXhpbkJhc2UpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBleHRlbmRlZCBvYmplY3Qgd2UncmUgZ29pbmcgdG8gcmV0dXJuIGFzIGEgcmVzdWx0LlxuICBsZXQgcmVzdWx0O1xuICBpZiAoYmFzZUlzQ2xhc3MpIHtcbiAgICAvLyBDcmVhdGUgYSBzdWJjbGFzcyBvZiBiYXNlLiBPbmNlIFdlYktpdCBzdXBwb3J0cyBIVE1MRWxlbWVudCBhcyBhIHJlYWxcbiAgICAvLyBjbGFzcywgd2UgY2FuIGp1c3Qgc2F5OlxuICAgIC8vXG4gICAgLy8gICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHVudGlsIHRoYXQncyByZXNvbHZlZCwgd2UgaGF2ZSB0byBjb25zdHJ1Y3QgdGhlIGNsYXNzIG91cnNlbHZlcy5cbiAgICByZXN1bHQgPSBmdW5jdGlvbiBzdWJjbGFzcygpIHt9O1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQsIGJhc2UpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQucHJvdG90eXBlLCBiYXNlLnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ3JlYXRlIGEgcGxhaW4gb2JqZWN0IHRoYXQgc2ltcGx5IHVzZXMgdGhlIGJhc2UgYXMgYSBwcm90b3R5cGUuXG4gICAgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcbiAgfVxuXG4gIGxldCBzb3VyY2U7XG4gIGxldCB0YXJnZXQ7XG4gIGlmIChiYXNlSXNDbGFzcyAmJiBtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24uXG4gICAgLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0IGZ1bmN0aW9uc1xuICAgIC8vIGhhdmUgc29tZSBwcm9wZXJ0aWVzIChhcmd1bWVudHMgYW5kIGNhbGxlcikgd2hpY2ggYXJlIG5vdCByZXR1cm5lZCBieVxuICAgIC8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZ1bmN0aW9uKS5cbiAgICBjb25zdCBGVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAgICAgJ2FyZ3VtZW50cycsXG4gICAgICAnY2FsbGVyJyxcbiAgICAgICdsZW5ndGgnLFxuICAgICAgJ25hbWUnLFxuICAgICAgJ3Byb3RvdHlwZSdcbiAgICBdO1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBXZSdsbCBjb3B5IGluc3RhbmNlIG1lbWJlcnMgaW4gYSBtb21lbnQsIGJ1dCBmaXJzdCBjb3B5IHN0YXRpYyBtZW1iZXJzLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKG1peGluLCByZXN1bHQsIEZVTkNUSU9OX1BST1BFUlRJRVMpO1xuICAgIHNvdXJjZSA9IG1peGluLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIHNvdXJjZSA9IG1peGluLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIW1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IG1peGluIHRvIHJlc3VsdCBwcm90b3R5cGUuXG4gICAgc291cmNlID0gbWl4aW47XG4gICAgdGFyZ2V0ID0gcmVzdWx0LnByb3RvdHlwZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIHBsYWluIG9iamVjdC5cbiAgICBzb3VyY2UgPSBtaXhpbjtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH1cbiAgY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIFsnY29uc3RydWN0b3InXSk7XG5cbiAgYXBwbHlDb21wb3NpdGlvblJ1bGVzKHRhcmdldCk7XG5cbiAgaWYgKG1peGluLm5hbWUpIHtcbiAgICAvLyBVc2UgdGhlIG1peGluJ3MgbmFtZSAodXN1YWxseSB0aGUgbmFtZSBvZiBhIGNsYXNzJyBjb25zdHJ1Y3RvcikgdG9cbiAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIGJhY2sgdG8gdGhlIG5ld2x5LWNyZWF0ZWQgb2JqZWN0IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgdGFyZ2V0W21peGluLm5hbWVdID0gdGFyZ2V0O1xuXG4gICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXJjbGFzcy9zdXBlci1vYmplY3QuIFNlZSB0aGUgY29tbWVudHMgb25cbiAgICAvLyBDb21wb3NhYmxlJ3MgXCJzdXBlclwiIHByb3BlcnR5LlxuICAgIHRhcmdldC5zdXBlciA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdENvbXBvc2l0aW9uUnVsZShkZXNjcmlwdG9yKSB7XG4gIGlmICh0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBDb21wb3NhYmxlLnByb3BhZ2F0ZUZ1bmN0aW9uO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLmdldCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZGVzY3JpcHRvci5zZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBQcm9wZXJ0eSB3aXRoIGdldHRlciBhbmQvb3Igc2V0dGVyLlxuICAgIHJldHVybiBDb21wb3NhYmxlLnByb3BhZ2F0ZVByb3BlcnR5O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbi8vIFdlIHVzZSB0aGlzIHRlc3QgYmVjYXVzZSwgb24gV2ViS2l0LCBjbGFzc2VzIGxpa2UgSFRNTEVsZW1lbnQgYXJlIHNwZWNpYWwsXG4vLyBhbmQgYXJlIG5vdCBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRvIGhhbmRsZSB0aGF0IGNhc2UsIHdlIHVzZSBhIGxvb3NlclxuLy8gZGVmaW5pdGlvbjogYW4gb2JqZWN0IGlzIGEgY2xhc3MgaWYgaXQgaGFzIGEgcHJvdG90eXBlLCBhbmQgdGhhdCBwcm90b3R5cGVcbi8vIGhhcyBhIGNvbnN0cnVjdG9yIHRoYXQgaXMgdGhlIG9yaWdpbmFsIG9iamVjdC4gVGhpcyBjb25kaXRpb24gaG9sZHMgdHJ1ZSBldmVuXG4vLyBmb3IgSFRNTEVsZW1lbnQgb24gV2ViS2l0LlxuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZTtcbiIsIi8qXG4gKiBNYXJzaGFsbCBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXMgKGFuZCBldmVudHVhbGx5IHZpY2UgdmVyc2EpLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIHtcblxuICAvKlxuICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS4gSWdub3JlIGNoYW5nZXMgaW4gc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcy5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKHByb3BlcnR5TmFtZSBpbiB0aGlzICYmICEocHJvcGVydHlOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGUgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgbSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCBnID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG4iLCIvKlxuICogQSBjb21wb3NhYmxlIEhUTUwgZWxlbWVudC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHByb3ZpZGVkIGp1c3QgYXMgYSBjb252ZW5pZW5jZS4gT25lIGNvdWxkIGFsc28gc3RhcnQgd2l0aFxuICogSFRNTEVsZW1lbnQgYXQgdGhlIHRvcCBsZXZlbCwgYW5kIGFkZCBleHRlbnNpYmlsaXR5IGJ5IG1peGluZyBpbiBDb21wb3NhYmxlLlxuICovXG5cbmltcG9ydCBDb21wb3NhYmxlIGZyb20gJy4uL2V4dGVuc2libGUvQ29tcG9zYWJsZSc7XG5cbi8vIFdlIHVzZSBFeHRlbnNpYmxlIHRvIGFkZCBpdHMgb3duIG1lbWJlcnMgdG8gYSBIVE1MRWxlbWVudCBzdWJjbGFzcy5cbi8vIFRoZSByZXN1bHQgaXMgYW4gSFRNTEVsZW1lbnQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBDb21wb3NhYmxlRWxlbWVudCA9IENvbXBvc2FibGUuY29tcG9zZS5jYWxsKEhUTUxFbGVtZW50LCBDb21wb3NhYmxlKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogQSBzYW1wbGUgZ2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cyB0aGF0IG1peGVzXG4gKiBpbiBzb21lIGNvbW1vbiBmZWF0dXJlczogdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LCBhdXRvbWF0aWMgbm9kZVxuICogZmluZGluZywgYW5kIG1hcnNoYWxsaW5nIGJldHdlZW4gYXR0cmlidXRlcyBhbmQgcHJvcGVydGllcy5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZUVsZW1lbnQgZnJvbSAnLi9Db21wb3NhYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIENvbXBvc2FibGVFbGVtZW50IHtcblxuICAvKiBGb3IgZGVidWdnaW5nICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZSA9IEVsZW1lbnRCYXNlLmNvbXBvc2UoXG4gIFRlbXBsYXRlU3RhbXBpbmcsIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG4iLCIvKlxuICogRWxlbWVudCBleHRlbnNpb24gZm9yIHRlbXBsYXRlIHN0YW1waW5nLiBJZiBhIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGVcbiAqIHByb3BlcnR5IChhcyBhIHN0cmluZyBvciByZWZlcmVuY2luZyBhIEhUTUwgdGVtcGxhdGUpLCB3aGVuIHRoZSBjb21wb25lbnRcbiAqIGNsYXNzIGlzIGluc3RhbnRpYXRlZCwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlIGluc3RhbmNlLCBhbmRcbiAqIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGUgc2hhZG93IHJvb3QuXG4gKlxuICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIGV4dGVuc2lvbiByZXRhaW5zIHN1cHBvcnQgZm9yIFNoYWRvdyBET00gdjAuXG4gKiBUaGF0IHdpbGwgZXZlbnR1YWxseSBiZSBkZXByZWNhdGVkIGFzIGJyb3dzZXJzIGltcGxlbWVudCBTaGFkb3cgRE9NIHYxLlxuICovXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSAmJiBVU0lOR19TSEFET1dfRE9NX1YwKSB7XG4gICAgICBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwpIHtcbiAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgIH1cbiAgICAvLyBUT0RPOiBTYXZlIHRoZSBwcm9jZXNzZWQgdGVtcGxhdGUgd2l0aCB0aGUgY29tcG9uZW50J3MgY2xhc3MgcHJvdG90eXBlXG4gICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gVVNJTkdfU0hBRE9XX0RPTV9WMCA/XG4gICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpIDogICAgICAgICAgICAgLy8gU2hhZG93IERPTSB2MFxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTsgIC8vIFNoYWRvdyBET00gdjFcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBvbGQgU2hhZG93IERPTSB2MC5cbmNvbnN0IFVTSU5HX1NIQURPV19ET01fVjAgPSAodHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jcmVhdGVTaGFkb3dSb290ICE9PSAndW5kZWZpbmVkJyk7XG5cblxuLy8gQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXBsYWNlIG9jY3VyZW5jZXMgb2YgdjEgc2xvdCBlbGVtZW50cyB3aXRoIHYwIGNvbnRlbnQgZWxlbWVudHMuXG4vLyBUaGlzIGRvZXMgbm90IHlldCBtYXAgbmFtZWQgc2xvdHMgdG8gY29udGVudCBzZWxlY3QgY2xhdXNlcy5cbmZ1bmN0aW9uIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKSB7XG4gIFtdLmZvckVhY2guY2FsbCh0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Nsb3QnKSwgc2xvdEVsZW1lbnQgPT4ge1xuICAgIGxldCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKTtcbiAgICBzbG90RWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250ZW50RWxlbWVudCwgc2xvdEVsZW1lbnQpO1xuICB9KTtcbn1cblxuLy8gSW52b2tlIGJhc2ljIHN0eWxlIHNoaW1taW5nIHdpdGggU2hhZG93Q1NTLlxuZnVuY3Rpb24gc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0YWcpIHtcbiAgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiJdfQ==
