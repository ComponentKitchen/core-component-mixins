(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

    /*
     * Decorates the prototype of a class derived from Composable.
     * See notes for the static decorate() method.
     */
    value: function decorate(decorators) {
      Composable.decorate.call(this, decorators);
    }

    /*
     * Decorator for annotating how a class member should be composed later.
     * This takes a decorator that will be run at *composition* time.
     * For now, this can only be applied to methods.
     */

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
     * This method can be statically invoked to extend plain objects or classes
     * that don't inherit from this class:
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

    /*
     * Decorate "this" with the indicated decorators. The latter should be a
     * dictionary mapping property names to (proposed) ES7-compliant decorators.
     * This allows the use of decorators in ES6/5. Example, this ES7 code:
     *
     *   class Foo {
     *      @decorate(customDecorator)
     *      bar() {}
     *   }
     *
     * can be written using the decorate() method as:
     *
     *   class Foo {
     *      bar() {}
     *   }
     *   Composable.decorate.call(Foo.prototype, { bar: customDecorator });
     *
     * Or, if Foo derives from Composable already, this can be shorter:
     *
     *   class Foo extends Composable {
     *      bar() {}
     *   }
     *   Foo.prototype.decorate({ bar: customDecorator });
     *
     */

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
      // Return a decorator that records the given decorator on the member itself.
      return function (target, key, descriptor) {
        // TODO: Use a Symbol instead of a string property name to save this.
        // descriptor.value._compositionRule = decorator;
        if (!target._compositionRules) {
          target._compositionRules = {};
        }
        target._compositionRules[key] = decorator;
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
Composable.prototype.compositionRules = {};

// Properties defined by Function that we don't want to mixin.
// We'd prefer to get these by interrogating Function itself, but WebKit
// functions have some properties (arguments and caller) which are not returned
// by Object.getOwnPropertyNames(Function).
var NON_MIXABLE_FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];

// Properties defined by Object that we don't want to mixin.
var NON_MIXABLE_OBJECT_PROPERTIES = ['constructor'];

/*
 * Apply the composition rules in effect for the given object, which lies at
 * the tip of a prototype chain. This looks for conflicts between the object's
 * own properties (and methods), and identically-named properties (methods)
 * further up the prototype chain. Conflicts are resolved with rules defined by
 * the affect members.
 */
function applyCompositionRules(obj) {
  var ownCompositionRules = obj.hasOwnProperty('_compositionRules') ? obj._compositionRules : {};
  var inheritedCompositionRules = obj.compositionRules;

  // For each property name, see if the base has a property with the same name.
  var base = Object.getPrototypeOf(obj);
  Object.getOwnPropertyNames(obj).forEach(function (name) {
    if (name in base && NON_MIXABLE_OBJECT_PROPERTIES.indexOf(name) < 0) {
      // Base does implement a member with the same name; need to combine.
      var descriptor = Object.getOwnPropertyDescriptor(obj, name);

      // See if this property has a rule associated with it, checking 3 places:
      var rule = ownCompositionRules[name] // 1) object itself
       || inheritedCompositionRules[name] // 2) inherited rules
       || getDefaultCompositionRule(descriptor); // 3) global default rules

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
 * Return the updated target.
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

  // See if the *mixin* has a base class/prototype of its own.
  var mixinIsClass = isClass(mixin);
  var mixinBase = mixinIsClass ? Object.getPrototypeOf(mixin.prototype).constructor : Object.getPrototypeOf(mixin);
  if (mixinBase && mixinBase !== Function && mixinBase !== Object && mixinBase !== Object.prototype) {
    // The mixin itself derives from another class/object.
    // Recurse, and extend with the mixin's base first.
    base = _compose(base, mixinBase);
  }

  // Create the extended object we're going to return as a result.
  var baseIsClass = isClass(base);
  var result = baseIsClass ? createSubclass(base) : Object.create(base);

  // The "target" here is the target of our property/method composition rules.
  var target = undefined;
  if (baseIsClass && mixinIsClass) {
    // Extending class with class: copy static members, then prototype members.
    copyOwnProperties(mixin, result, NON_MIXABLE_FUNCTION_PROPERTIES);
    target = copyOwnProperties(mixin.prototype, result.prototype, NON_MIXABLE_OBJECT_PROPERTIES);
  } else if (!baseIsClass && mixinIsClass) {
    // Extending plain object with class: copy prototype methods to result.
    target = copyOwnProperties(mixin.prototype, result, NON_MIXABLE_FUNCTION_PROPERTIES);
  } else if (baseIsClass && !mixinIsClass) {
    // Extending class with plain object: copy mixin to result prototype.
    target = copyOwnProperties(mixin, result.prototype, NON_MIXABLE_OBJECT_PROPERTIES);
  } else {
    // Extending plain object with plain object: copy former to latter.
    target = copyOwnProperties(mixin, result, NON_MIXABLE_OBJECT_PROPERTIES);
  }

  // Apply the composition rules in effect at the target.
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

/*
 * Return a new subclass of the given base class.
 */
function createSubclass(base) {
  // Once WebKit supports HTMLElement as a real class, we can just say:
  //
  //   class subclass extends base {}
  //
  // However, until that's resolved, we just construct the class ourselves.
  function subclass() {};
  Object.setPrototypeOf(subclass, base);
  Object.setPrototypeOf(subclass.prototype, base.prototype);
  return subclass;
}

/*
 * If the given property descriptor is of a type that has a default composition
 * rule, return that rule.
 */
function getDefaultCompositionRule(descriptor) {
  if (typeof descriptor.value === 'function') {
    // Method
    return Composable.rules.propagateFunction;
  } else if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
    // Property with getter and/or setter
    return Composable.rules.propagateProperty;
  }
  return null;
}

/*
 * Return true if c is a JavaScript class.
 *
 * We use this test because, on WebKit, classes like HTMLElement are special,
 * and are not instances of Function. To handle that case, we use a looser
 * definition: an object is a class if it has a prototype, and that prototype
 * has a constructor that is the original object. This condition holds true even
 * for HTMLElement on WebKit.
 */
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

/*
 * Take two functions and return a new composed function that invokes both.
 * The composed function will return the result of the second function.
 * This is not a rule, but a helper used by rules.
 */
function composeFunction(function1, function2) {
  return function () {
    function1.apply(this, arguments);
    return function2.apply(this, arguments);
  };
}

/*
 * Perform a deep merge of a mixin property on top of a base property.
 */
// export function deepMerge(target, key, descriptor) {
//   let mixinValue = descriptor.value;
//   let baseValue = Object.getPrototypeOf(target)[key].value;
//   descriptor.value = 'merged'; // merge(baseValue, mixinValue);
// }

/*
 * Like Object.getOwnPropertyDescriptor(), but walks up the prototype chain.
 * This is needed by composition rules, which usually start out by getting
 * the base implementation of a member they're composing.
 * This is not a rule, but a helper used by rules.
 */
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

/*
 * Combinator that causes a mixin method to override its base implementation.
 * Since this the default behavior of the prototype chain, this is a no-op.
 */
function override(target, key, descriptor) {}

/*
 * Compose methods, invoking base implementation first. If it returns a
 * truthy result, that is returned. Otherwise, the mixin implementation's
 * result is returned.
 */
function preferBaseResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = function () {
    return baseImplementation.apply(this, arguments) || mixinImplementation.apply(this, arguments);
  };
}

/*
 * Compose methods, invoking mixin implementation first. If it returns a
 * truthy result, that is returned. Otherwise, the base implementation's
 * result is returned.
 */
function preferMixinResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = function () {
    return mixinImplementation.apply(this, arguments) || baseImplementation.apply(this, arguments);
  };
}

/*
 * Default rule for composing methods: invoke base first, then mixin.
 */
function propagateFunction(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseImplementation = Object.getPrototypeOf(target)[key];
  descriptor.value = composeFunction(baseImplementation, mixinImplementation);
}

/*
 * Default rule for composing properties.
 * We only compose setters, which invoke base first, then mixin.
 * A defined mixin getter overrides a base getter.
 * Note that, because of the way property descriptors work, if the mixin only
 * defines a setter, but not a getter, we have to supply a default getter that
 * invokes the base getter. Similarly, if the mixin just defines a getter,
 * we have to supply a default setter.
 */
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
  if (!(instance instanceof Constructor)) {
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

},{}],4:[function(require,module,exports){
'use strict';

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
  if (!(instance instanceof Constructor)) {
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

},{}],5:[function(require,module,exports){
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

},{"Composable/src/Composable":1}],6:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
  if (!(instance instanceof Constructor)) {
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

},{"./AttributeMarshalling":3,"./AutomaticNodeFinding":4,"./ComposableElement":5,"./TemplateStamping":7}],7:[function(require,module,exports){
'use strict';

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
  if (!(instance instanceof Constructor)) {
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9Db21wb3NhYmxlL3NyYy9Db21wb3NpdGlvblJ1bGVzLmpzIiwic3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwic3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwic3JjL0NvbXBvc2FibGVFbGVtZW50LmpzIiwic3JjL0VsZW1lbnRCYXNlLmpzIiwic3JjL1RlbXBsYXRlU3RhbXBpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNJWSxnQkFBZ0I7Ozs7OztJQUVQLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7Ozs7Ozs7NkJBd0VwQixVQUFVLEVBQUU7QUFDbkIsZ0JBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBaER5Qjt3Q0FBUixNQUFNO0FBQU4sY0FBTTs7Ozs7OztBQUt0QixhQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBMkJlLFVBQVUsRUFBRTtBQUMxQixXQUFLLElBQUksR0FBRyxJQUFJLFVBQVUsRUFBRTtBQUMxQixZQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsWUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1RCxpQkFBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakMsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUs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QUNqQixBQUlELFNBQVMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLEFBQ3pDO0lBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBQSxXQUFXLEVBQUksQUFDeEU7UUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxBQUN2RDtlQUFXLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7R0FDbEUsQ0FBQyxDQUFDOzs7O0FBQ0osQUFHRCxTQUFTLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQUFDekM7ZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztDQUM1RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBDb21wb3NpdGlvblJ1bGVzIGZyb20gJy4vQ29tcG9zaXRpb25SdWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2FibGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xLCBNaXhpbjIsIE1peGluMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgbWl4aW5zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xKS5jb21wb3NlKE1peGluMikuY29tcG9zZShNaXhpbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHMgb3IgY2xhc3Nlc1xuICAgKiB0aGF0IGRvbid0IGluaGVyaXQgZnJvbSB0aGlzIGNsYXNzOlxuICAgKlxuICAgKiAgIGxldCBleHRlbmRlZCA9IENvbXBvc2FibGUuZXh0ZW5kLmNhbGwob2JqMSwgb2JqMik7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZSguLi5taXhpbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggbWl4aW4gaW4gdHVybi4gVGhlIHJlc3VsdCBiZWNvbWVzXG4gICAgLy8gdGhlIGJhc2UgY2xhc3MgZXh0ZW5kZWQgYnkgYW55IHN1YnNlcXVlbnQgbWl4aW5zLiBJdCB0dXJucyBvdXQgdGhhdFxuICAgIC8vIHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlIGN1cnJlbnRcbiAgICAvLyAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gbWl4aW5zLnJlZHVjZShjb21wb3NlLCB0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIERlY29yYXRlIFwidGhpc1wiIHdpdGggdGhlIGluZGljYXRlZCBkZWNvcmF0b3JzLiBUaGUgbGF0dGVyIHNob3VsZCBiZSBhXG4gICAqIGRpY3Rpb25hcnkgbWFwcGluZyBwcm9wZXJ0eSBuYW1lcyB0byAocHJvcG9zZWQpIEVTNy1jb21wbGlhbnQgZGVjb3JhdG9ycy5cbiAgICogVGhpcyBhbGxvd3MgdGhlIHVzZSBvZiBkZWNvcmF0b3JzIGluIEVTNi81LiBFeGFtcGxlLCB0aGlzIEVTNyBjb2RlOlxuICAgKlxuICAgKiAgIGNsYXNzIEZvbyB7XG4gICAqICAgICAgQGRlY29yYXRlKGN1c3RvbURlY29yYXRvcilcbiAgICogICAgICBiYXIoKSB7fVxuICAgKiAgIH1cbiAgICpcbiAgICogY2FuIGJlIHdyaXR0ZW4gdXNpbmcgdGhlIGRlY29yYXRlKCkgbWV0aG9kIGFzOlxuICAgKlxuICAgKiAgIGNsYXNzIEZvbyB7XG4gICAqICAgICAgYmFyKCkge31cbiAgICogICB9XG4gICAqICAgQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKEZvby5wcm90b3R5cGUsIHsgYmFyOiBjdXN0b21EZWNvcmF0b3IgfSk7XG4gICAqXG4gICAqIE9yLCBpZiBGb28gZGVyaXZlcyBmcm9tIENvbXBvc2FibGUgYWxyZWFkeSwgdGhpcyBjYW4gYmUgc2hvcnRlcjpcbiAgICpcbiAgICogICBjbGFzcyBGb28gZXh0ZW5kcyBDb21wb3NhYmxlIHtcbiAgICogICAgICBiYXIoKSB7fVxuICAgKiAgIH1cbiAgICogICBGb28ucHJvdG90eXBlLmRlY29yYXRlKHsgYmFyOiBjdXN0b21EZWNvcmF0b3IgfSk7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZGVjb3JhdGUoZGVjb3JhdG9ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBkZWNvcmF0b3JzKSB7XG4gICAgICBsZXQgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1trZXldO1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIGtleSk7XG4gICAgICBkZWNvcmF0b3IodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIERlY29yYXRlcyB0aGUgcHJvdG90eXBlIG9mIGEgY2xhc3MgZGVyaXZlZCBmcm9tIENvbXBvc2FibGUuXG4gICAqIFNlZSBub3RlcyBmb3IgdGhlIHN0YXRpYyBkZWNvcmF0ZSgpIG1ldGhvZC5cbiAgICovXG4gIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBDb21wb3NhYmxlLmRlY29yYXRlLmNhbGwodGhpcywgZGVjb3JhdG9ycyk7XG4gIH1cblxuICAvKlxuICAgKiBEZWNvcmF0b3IgZm9yIGFubm90YXRpbmcgaG93IGEgY2xhc3MgbWVtYmVyIHNob3VsZCBiZSBjb21wb3NlZCBsYXRlci5cbiAgICogVGhpcyB0YWtlcyBhIGRlY29yYXRvciB0aGF0IHdpbGwgYmUgcnVuIGF0ICpjb21wb3NpdGlvbiogdGltZS5cbiAgICogRm9yIG5vdywgdGhpcyBjYW4gb25seSBiZSBhcHBsaWVkIHRvIG1ldGhvZHMuXG4gICAqL1xuICBzdGF0aWMgcnVsZShkZWNvcmF0b3IpIHtcbiAgICAvLyBSZXR1cm4gYSBkZWNvcmF0b3IgdGhhdCByZWNvcmRzIHRoZSBnaXZlbiBkZWNvcmF0b3Igb24gdGhlIG1lbWJlciBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAvLyBUT0RPOiBVc2UgYSBTeW1ib2wgaW5zdGVhZCBvZiBhIHN0cmluZyBwcm9wZXJ0eSBuYW1lIHRvIHNhdmUgdGhpcy5cbiAgICAgIC8vIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZSA9IGRlY29yYXRvcjtcbiAgICAgIGlmICghdGFyZ2V0Ll9jb21wb3NpdGlvblJ1bGVzKSB7XG4gICAgICAgIHRhcmdldC5fY29tcG9zaXRpb25SdWxlcyA9IHt9O1xuICAgICAgfVxuICAgICAgdGFyZ2V0Ll9jb21wb3NpdGlvblJ1bGVzW2tleV0gPSBkZWNvcmF0b3I7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogRXhwb3NlIHN0YW5kYXJkIGNvbXBvc2l0aW9uIHJ1bGVzIGFzIHByb3BlcnRpZXMgb2YgQ29tcG9zYWJsZS5cbiAqIFRoaXMgYXZvaWRzIHRoZSBuZWVkIGZvciBzb21lb25lIHRvIG1ha2UgYSBzZXBhcmF0ZSBpbXBvcnQgb2YgdGhlIHJ1bGVzLlxuICovXG5Db21wb3NhYmxlLnJ1bGVzID0gQ29tcG9zaXRpb25SdWxlcztcblxuXG4vKlxuICogQWxsIENvbXBvc2FibGUtY3JlYXRlZCBvYmplY3RzIGtlZXAgcmVmZXJlbmNlcyB0byB0aGUgbWl4aW5zIHRoYXQgd2VyZVxuICogYXBwbGllZCB0byBjcmVhdGUgdGhlbS4gV2hlbiBhICpuYW1lZCogbWl4aW4gaXMgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlXG4gKiBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlIGNsYXNzJyBwcm90b3R5cGUpIHdpbGxcbiAqIGhhdmUgYSBuZXcgbWVtYmVyIHdpdGggdGhhdCBuYW1lIHRoYXQgcG9pbnRzIGJhY2sgdG8gdGhlIHNhbWUgb2JqZWN0LlxuICogVGhhdCBmYWNpbGl0eSBpcyB1c2VmdWwgd2hlbiBkZWFsaW5nIHdpdGggY2hhaW5zIHRoYXQgaGF2ZSBiZWVuIGV4dGVuZGVkXG4gKiBtb3JlIHRoYW4gb25jZSwgYXMgYW4gbWl4aW4ncyBuYW1lIGlzIHN1ZmZpY2llbnQgdG8gcmV0cmlldmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoYXQgcG9pbnQgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBBIHNpbmdsZSBtaXhpbiBjYW4gYmUgYXBwbGllZCB0byBtdWx0aXBsZSBwcm90b3R5cGUgY2hhaW5zIC0tIHRoZSBuYW1lXG4gKiByZWZlcnMgdG8gdGhlIHByb3RvdHlwZSBvbiAqdGhpcyBwYXJ0aWN1bGFyIHByb3RvdHlwZSBjaGFpbiogdGhhdCB3YXMgYWRkZWRcbiAqIGZvciB0aGF0IG1peGluLiBUaGlzIGxldHMgbWl4aW4vbWl4aW4gY29kZSBnZXQgYmFjayB0byBpdHMgb3duXG4gKiBwcm90b3R5cGUsIG1vc3Qgb2Z0ZW4gaW4gY29tYmluYXRpb24gd2l0aCBcInN1cGVyXCIgKHNlZSBiZWxvdykgaW4gb3JkZXIgdG9cbiAqIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLlxuICovXG5Db21wb3NhYmxlLnByb3RvdHlwZS5Db21wb3NhYmxlID0gQ29tcG9zYWJsZS5wcm90b3R5cGU7XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMgaGF2ZSBhIFwic3VwZXJcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlXG4gKiBwcm90b3R5cGUgYWJvdmUgdGhlbSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIFRoaXMgXCJzdXBlclwiIHJlZmVyZW5jZSBpcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIEVTNidzIFwic3VwZXJcIiBrZXl3b3JkIGluXG4gKiBpbiBFUzUgKG9yIHRyYW5zcGlsZWQgRVM2KSBtaXhpbnMgdGhhdCB3YW50IHRvIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLFxuICogd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbCBkZXBlbmQgdXBvbiB3aGljaCBtaXhpbnMgaGF2ZSBiZWVuIGFwcGxpZWRcbiAqIHRvIGEgZ2l2ZW4gcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEUuZy46XG4gKiAgIGNsYXNzIE1peGluIHtcbiAqICAgICBmb28oKSB7XG4gKiAgICAgICBpZiAodGhpcy5NaXhpbi5zdXBlci5mb28pIHtcbiAqICAgICAgICAgdGhpcy5NaXhpbi5zdXBlci5mb28uY2FsbCh0aGlzKTsgLy8gSW52b2tlIHN1cGVyY2xhc3MnIGZvbygpXG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBEbyBNaXhpbi1zcGVjaWZpYyB3b3JrIGhlcmUuLi5cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBGb3IgY29uc2lzdGVuY3ksIENvbXBvc2FibGUgaXRzZWxmIHJlY29yZHMgaXRzIG93biBzdXBlcmNsYXNzIGFzIE9iamVjdC5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUuc3VwZXIgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cbi8vIENvbXBvc2l0aW9uIHJ1bGVzIGZvciBzdGFuZGFyZCBvYmplY3QgbWVtYmVycy5cbkNvbXBvc2FibGUucHJvdG90eXBlLmNvbXBvc2l0aW9uUnVsZXMgPSB7fTtcblxuXG4vLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24gdGhhdCB3ZSBkb24ndCB3YW50IHRvIG1peGluLlxuLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IHRoZXNlIGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0XG4vLyBmdW5jdGlvbnMgaGF2ZSBzb21lIHByb3BlcnRpZXMgKGFyZ3VtZW50cyBhbmQgY2FsbGVyKSB3aGljaCBhcmUgbm90IHJldHVybmVkXG4vLyBieSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikuXG5jb25zdCBOT05fTUlYQUJMRV9GVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAnYXJndW1lbnRzJyxcbiAgJ2NhbGxlcicsXG4gICdsZW5ndGgnLFxuICAnbmFtZScsXG4gICdwcm90b3R5cGUnXG5dO1xuXG4vLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgT2JqZWN0IHRoYXQgd2UgZG9uJ3Qgd2FudCB0byBtaXhpbi5cbmNvbnN0IE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTID0gW1xuICAnY29uc3RydWN0b3InXG5dO1xuXG5cbi8qXG4gKiBBcHBseSB0aGUgY29tcG9zaXRpb24gcnVsZXMgaW4gZWZmZWN0IGZvciB0aGUgZ2l2ZW4gb2JqZWN0LCB3aGljaCBsaWVzIGF0XG4gKiB0aGUgdGlwIG9mIGEgcHJvdG90eXBlIGNoYWluLiBUaGlzIGxvb2tzIGZvciBjb25mbGljdHMgYmV0d2VlbiB0aGUgb2JqZWN0J3NcbiAqIG93biBwcm9wZXJ0aWVzIChhbmQgbWV0aG9kcyksIGFuZCBpZGVudGljYWxseS1uYW1lZCBwcm9wZXJ0aWVzIChtZXRob2RzKVxuICogZnVydGhlciB1cCB0aGUgcHJvdG90eXBlIGNoYWluLiBDb25mbGljdHMgYXJlIHJlc29sdmVkIHdpdGggcnVsZXMgZGVmaW5lZCBieVxuICogdGhlIGFmZmVjdCBtZW1iZXJzLlxuICovXG5mdW5jdGlvbiBhcHBseUNvbXBvc2l0aW9uUnVsZXMob2JqKSB7XG4gIGxldCBvd25Db21wb3NpdGlvblJ1bGVzID0gb2JqLmhhc093blByb3BlcnR5KCdfY29tcG9zaXRpb25SdWxlcycpID9cbiAgICBvYmouX2NvbXBvc2l0aW9uUnVsZXMgOlxuICAgIHt9O1xuICBsZXQgaW5oZXJpdGVkQ29tcG9zaXRpb25SdWxlcyA9IG9iai5jb21wb3NpdGlvblJ1bGVzO1xuXG4gIC8vIEZvciBlYWNoIHByb3BlcnR5IG5hbWUsIHNlZSBpZiB0aGUgYmFzZSBoYXMgYSBwcm9wZXJ0eSB3aXRoIHRoZSBzYW1lIG5hbWUuXG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAobmFtZSBpbiBiYXNlICYmIE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICAvLyBCYXNlIGRvZXMgaW1wbGVtZW50IGEgbWVtYmVyIHdpdGggdGhlIHNhbWUgbmFtZTsgbmVlZCB0byBjb21iaW5lLlxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG5cbiAgICAgIC8vIFNlZSBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJ1bGUgYXNzb2NpYXRlZCB3aXRoIGl0LCBjaGVja2luZyAzIHBsYWNlczpcbiAgICAgIGxldCBydWxlID0gb3duQ29tcG9zaXRpb25SdWxlc1tuYW1lXSAgICAgICAgICAvLyAxKSBvYmplY3QgaXRzZWxmXG4gICAgICAgICAgfHwgaW5oZXJpdGVkQ29tcG9zaXRpb25SdWxlc1tuYW1lXSAgICAgICAgLy8gMikgaW5oZXJpdGVkIHJ1bGVzXG4gICAgICAgICAgfHwgZ2V0RGVmYXVsdENvbXBvc2l0aW9uUnVsZShkZXNjcmlwdG9yKTsgLy8gMykgZ2xvYmFsIGRlZmF1bHQgcnVsZXNcblxuICAgICAgLy8gXCJvdmVycmlkZVwiIGlzIGEga25vd24gbm8tb3AsIHNvIHdlIGRvbid0IGJvdGhlciB0cnlpbmcgdG8gcmVkZWZpbmUgdGhlXG4gICAgICAvLyBwcm9wZXJ0eS5cbiAgICAgIGlmIChydWxlICYmIHJ1bGUgIT09IENvbXBvc2FibGUub3ZlcnJpZGUpIHtcbiAgICAgICAgcnVsZShvYmosIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBwcm9wZXJ0aWVzL21ldGhvZHMgdG8gdGhlIHRhcmdldC5cbiAqIFJldHVybiB0aGUgdXBkYXRlZCB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcy9vYmplY3QgdGhhdCBleHRlbmRzIHRoZSBnaXZlbiBiYXNlIGNsYXNzL29iamVjdCB3aXRoXG4gKiB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIG1peGluLlxuICovXG5mdW5jdGlvbiBjb21wb3NlKGJhc2UsIG1peGluKSB7XG5cbiAgLy8gU2VlIGlmIHRoZSAqbWl4aW4qIGhhcyBhIGJhc2UgY2xhc3MvcHJvdG90eXBlIG9mIGl0cyBvd24uXG4gIGxldCBtaXhpbklzQ2xhc3MgPSBpc0NsYXNzKG1peGluKTtcbiAgbGV0IG1peGluQmFzZSA9IG1peGluSXNDbGFzcyA/XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKG1peGluLnByb3RvdHlwZSkuY29uc3RydWN0b3IgOlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbik7XG4gIGlmIChtaXhpbkJhc2UgJiZcbiAgICAgIG1peGluQmFzZSAhPT0gRnVuY3Rpb24gJiZcbiAgICAgIG1peGluQmFzZSAhPT0gT2JqZWN0ICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAvLyBUaGUgbWl4aW4gaXRzZWxmIGRlcml2ZXMgZnJvbSBhbm90aGVyIGNsYXNzL29iamVjdC5cbiAgICAvLyBSZWN1cnNlLCBhbmQgZXh0ZW5kIHdpdGggdGhlIG1peGluJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gY29tcG9zZShiYXNlLCBtaXhpbkJhc2UpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBleHRlbmRlZCBvYmplY3Qgd2UncmUgZ29pbmcgdG8gcmV0dXJuIGFzIGEgcmVzdWx0LlxuICBsZXQgYmFzZUlzQ2xhc3MgPSBpc0NsYXNzKGJhc2UpO1xuICBsZXQgcmVzdWx0ID0gYmFzZUlzQ2xhc3MgP1xuICAgIGNyZWF0ZVN1YmNsYXNzKGJhc2UpIDpcbiAgICBPYmplY3QuY3JlYXRlKGJhc2UpO1xuXG4gIC8vIFRoZSBcInRhcmdldFwiIGhlcmUgaXMgdGhlIHRhcmdldCBvZiBvdXIgcHJvcGVydHkvbWV0aG9kIGNvbXBvc2l0aW9uIHJ1bGVzLlxuICBsZXQgdGFyZ2V0O1xuICBpZiAoYmFzZUlzQ2xhc3MgJiYgbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggY2xhc3M6IGNvcHkgc3RhdGljIG1lbWJlcnMsIHRoZW4gcHJvdG90eXBlIG1lbWJlcnMuXG4gICAgY29weU93blByb3BlcnRpZXMobWl4aW4sIHJlc3VsdCwgTk9OX01JWEFCTEVfRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgdGFyZ2V0ID0gY29weU93blByb3BlcnRpZXMobWl4aW4ucHJvdG90eXBlLCByZXN1bHQucHJvdG90eXBlLCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBwbGFpbiBvYmplY3Qgd2l0aCBjbGFzczogY29weSBwcm90b3R5cGUgbWV0aG9kcyB0byByZXN1bHQuXG4gICAgdGFyZ2V0ID0gY29weU93blByb3BlcnRpZXMobWl4aW4ucHJvdG90eXBlLCByZXN1bHQsIE5PTl9NSVhBQkxFX0ZVTkNUSU9OX1BST1BFUlRJRVMpO1xuICB9IGVsc2UgaWYgKGJhc2VJc0NsYXNzICYmICFtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3Q6IGNvcHkgbWl4aW4gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LnByb3RvdHlwZSwgTk9OX01JWEFCTEVfT0JKRUNUX1BST1BFUlRJRVMpO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBwbGFpbiBvYmplY3Qgd2l0aCBwbGFpbiBvYmplY3Q6IGNvcHkgZm9ybWVyIHRvIGxhdHRlci5cbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gIH1cblxuICAvLyBBcHBseSB0aGUgY29tcG9zaXRpb24gcnVsZXMgaW4gZWZmZWN0IGF0IHRoZSB0YXJnZXQuXG4gIGFwcGx5Q29tcG9zaXRpb25SdWxlcyh0YXJnZXQpO1xuXG4gIGlmIChtaXhpbi5uYW1lKSB7XG4gICAgLy8gVXNlIHRoZSBtaXhpbidzIG5hbWUgKHVzdWFsbHkgdGhlIG5hbWUgb2YgYSBjbGFzcycgY29uc3RydWN0b3IpIHRvXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSBuZXdseS1jcmVhdGVkIG9iamVjdCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIHRhcmdldFttaXhpbi5uYW1lXSA9IHRhcmdldDtcblxuICAgIC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHN1cGVyY2xhc3Mvc3VwZXItb2JqZWN0LiBTZWUgdGhlIGNvbW1lbnRzIG9uXG4gICAgLy8gQ29tcG9zYWJsZSdzIFwic3VwZXJcIiBwcm9wZXJ0eS5cbiAgICB0YXJnZXQuc3VwZXIgPSBiYXNlSXNDbGFzcyA/IGJhc2UucHJvdG90eXBlIDogYmFzZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcyBvZiB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3ViY2xhc3MoYmFzZSkge1xuICAvLyBPbmNlIFdlYktpdCBzdXBwb3J0cyBIVE1MRWxlbWVudCBhcyBhIHJlYWwgY2xhc3MsIHdlIGNhbiBqdXN0IHNheTpcbiAgLy9cbiAgLy8gICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgLy9cbiAgLy8gSG93ZXZlciwgdW50aWwgdGhhdCdzIHJlc29sdmVkLCB3ZSBqdXN0IGNvbnN0cnVjdCB0aGUgY2xhc3Mgb3Vyc2VsdmVzLlxuICBmdW5jdGlvbiBzdWJjbGFzcygpIHt9O1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViY2xhc3MsIGJhc2UpO1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViY2xhc3MucHJvdG90eXBlLCBiYXNlLnByb3RvdHlwZSk7XG4gIHJldHVybiBzdWJjbGFzcztcbn1cblxuXG4vKlxuICogSWYgdGhlIGdpdmVuIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb2YgYSB0eXBlIHRoYXQgaGFzIGEgZGVmYXVsdCBjb21wb3NpdGlvblxuICogcnVsZSwgcmV0dXJuIHRoYXQgcnVsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdENvbXBvc2l0aW9uUnVsZShkZXNjcmlwdG9yKSB7XG4gIGlmICh0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIE1ldGhvZFxuICAgIHJldHVybiBDb21wb3NhYmxlLnJ1bGVzLnByb3BhZ2F0ZUZ1bmN0aW9uO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLmdldCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgfHwgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gUHJvcGVydHkgd2l0aCBnZXR0ZXIgYW5kL29yIHNldHRlclxuICAgIHJldHVybiBDb21wb3NhYmxlLnJ1bGVzLnByb3BhZ2F0ZVByb3BlcnR5O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbiAqXG4gKiBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuICogYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbiAqIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4gKiBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuICogZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbiAqL1xuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG4iLCIvKipcbiAqIFN0YW5kYXJkIGNvbXBvc2l0aW9uIHJ1bGVzXG4gKi9cblxuLypcbiAqIFRha2UgdHdvIGZ1bmN0aW9ucyBhbmQgcmV0dXJuIGEgbmV3IGNvbXBvc2VkIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBib3RoLlxuICogVGhlIGNvbXBvc2VkIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIHNlY29uZCBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgbm90IGEgcnVsZSwgYnV0IGEgaGVscGVyIHVzZWQgYnkgcnVsZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlRnVuY3Rpb24oZnVuY3Rpb24xLCBmdW5jdGlvbjIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uMS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuXG4vKlxuICogUGVyZm9ybSBhIGRlZXAgbWVyZ2Ugb2YgYSBtaXhpbiBwcm9wZXJ0eSBvbiB0b3Agb2YgYSBiYXNlIHByb3BlcnR5LlxuICovXG4vLyBleHBvcnQgZnVuY3Rpb24gZGVlcE1lcmdlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4vLyAgIGxldCBtaXhpblZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcbi8vICAgbGV0IGJhc2VWYWx1ZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV0udmFsdWU7XG4vLyAgIGRlc2NyaXB0b3IudmFsdWUgPSAnbWVyZ2VkJzsgLy8gbWVyZ2UoYmFzZVZhbHVlLCBtaXhpblZhbHVlKTtcbi8vIH1cblxuLypcbiAqIExpa2UgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcigpLCBidXQgd2Fsa3MgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqIFRoaXMgaXMgbmVlZGVkIGJ5IGNvbXBvc2l0aW9uIHJ1bGVzLCB3aGljaCB1c3VhbGx5IHN0YXJ0IG91dCBieSBnZXR0aW5nXG4gKiB0aGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBhIG1lbWJlciB0aGV5J3JlIGNvbXBvc2luZy5cbiAqIFRoaXMgaXMgbm90IGEgcnVsZSwgYnV0IGEgaGVscGVyIHVzZWQgYnkgcnVsZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKSB7XG4gIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpO1xuICBpZiAoZGVzY3JpcHRvcikge1xuICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICB9IGVsc2Uge1xuICAgIGxldCBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICAvLyBDaGVja2luZyBmb3IgXCJuYW1lIGluIHByb3RvdHlwZVwiIGxldHMgdXMga25vdyB3aGV0aGVyIHdlIHNob3VsZCBib3RoZXJcbiAgICAvLyB3YWxraW5nIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgaWYgKHByb3RvdHlwZSAmJiBuYW1lIGluIHByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkOyAvLyBOb3QgZm91bmRcbn1cblxuXG4vKlxuICogQ29tYmluYXRvciB0aGF0IGNhdXNlcyBhIG1peGluIG1ldGhvZCB0byBvdmVycmlkZSBpdHMgYmFzZSBpbXBsZW1lbnRhdGlvbi5cbiAqIFNpbmNlIHRoaXMgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIHByb3RvdHlwZSBjaGFpbiwgdGhpcyBpcyBhIG5vLW9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb3ZlcnJpZGUodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHt9XG5cblxuLypcbiAqIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgYmFzZSBpbXBsZW1lbnRhdGlvbiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhXG4gKiB0cnV0aHkgcmVzdWx0LCB0aGF0IGlzIHJldHVybmVkLiBPdGhlcndpc2UsIHRoZSBtaXhpbiBpbXBsZW1lbnRhdGlvbidzXG4gKiByZXN1bHQgaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJCYXNlUmVzdWx0KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV07XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfHwgbWl4aW5JbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG59XG5cblxuLypcbiAqIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgbWl4aW4gaW1wbGVtZW50YXRpb24gZmlyc3QuIElmIGl0IHJldHVybnMgYVxuICogdHJ1dGh5IHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCB0aGUgYmFzZSBpbXBsZW1lbnRhdGlvbidzXG4gKiByZXN1bHQgaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJNaXhpblJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5JbXBsZW1lbnRhdGlvbiA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlSW1wbGVtZW50YXRpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVtrZXldO1xuICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1peGluSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB8fCBiYXNlSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5cbi8qXG4gKiBEZWZhdWx0IHJ1bGUgZm9yIGNvbXBvc2luZyBtZXRob2RzOiBpbnZva2UgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZUZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpW2tleV07XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBjb21wb3NlRnVuY3Rpb24oYmFzZUltcGxlbWVudGF0aW9uLCBtaXhpbkltcGxlbWVudGF0aW9uKTtcbn1cblxuXG4vKlxuICogRGVmYXVsdCBydWxlIGZvciBjb21wb3NpbmcgcHJvcGVydGllcy5cbiAqIFdlIG9ubHkgY29tcG9zZSBzZXR0ZXJzLCB3aGljaCBpbnZva2UgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqIEEgZGVmaW5lZCBtaXhpbiBnZXR0ZXIgb3ZlcnJpZGVzIGEgYmFzZSBnZXR0ZXIuXG4gKiBOb3RlIHRoYXQsIGJlY2F1c2Ugb2YgdGhlIHdheSBwcm9wZXJ0eSBkZXNjcmlwdG9ycyB3b3JrLCBpZiB0aGUgbWl4aW4gb25seVxuICogZGVmaW5lcyBhIHNldHRlciwgYnV0IG5vdCBhIGdldHRlciwgd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IGdldHRlciB0aGF0XG4gKiBpbnZva2VzIHRoZSBiYXNlIGdldHRlci4gU2ltaWxhcmx5LCBpZiB0aGUgbWl4aW4ganVzdCBkZWZpbmVzIGEgZ2V0dGVyLFxuICogd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IHNldHRlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBrZXkpO1xuICBpZiAoZGVzY3JpcHRvci5nZXQgJiYgIWRlc2NyaXB0b3Iuc2V0ICYmIGJhc2VEZXNjcmlwdG9yLnNldCkge1xuICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgc2V0dGVyLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGJhc2VEZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgaWYgKCFkZXNjcmlwdG9yLmdldCAmJiBiYXNlRGVzY3JpcHRvci5nZXQpIHtcbiAgICAgIC8vIE5lZWQgdG8gc3VwcGx5IGRlZmF1bHQgZ2V0dGVyLlxuICAgICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VEZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gQ29tcG9zZSBzZXR0ZXJzLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VEZXNjcmlwdG9yLnNldCwgZGVzY3JpcHRvci5zZXQpO1xuICB9XG59XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgY29tcG9zYWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gQ29tcG9zYWJsZS5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICdDb21wb3NhYmxlL3NyYy9Db21wb3NhYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IENvbXBvc2FibGVFbGVtZW50ID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoSFRNTEVsZW1lbnQsIENvbXBvc2FibGUpO1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb3NhYmxlRWxlbWVudDtcbiIsIi8qXG4gKiBBIHNhbXBsZSBnZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzIHRoYXQgbWl4ZXNcbiAqIGluIHNvbWUgY29tbW9uIGZlYXR1cmVzOiB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsIGF1dG9tYXRpYyBub2RlXG4gKiBmaW5kaW5nLCBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBDb21wb3NhYmxlRWxlbWVudCBmcm9tICcuL0NvbXBvc2FibGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgQ29tcG9zYWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuY29tcG9zZShcbiAgVGVtcGxhdGVTdGFtcGluZywgLy8gYmVmb3JlIG5vZGUgZmluZGluZywgc28gc2hhZG93IHJvb3QgaXMgcG9wdWxhdGVkXG4gIEF1dG9tYXRpY05vZGVGaW5kaW5nLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIG1hcnNoYWxsZWQgcHJvcGVydGllcyBjYW4gdXNlIGl0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nXG4pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqXG4gKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgZXh0ZW5zaW9uIHJldGFpbnMgc3VwcG9ydCBmb3IgU2hhZG93IERPTSB2MC5cbiAqIFRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlICYmIFVTSU5HX1NIQURPV19ET01fVjApIHtcbiAgICAgIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCkge1xuICAgICAgc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0aGlzLmxvY2FsTmFtZSk7XG4gICAgfVxuICAgIC8vIFRPRE86IFNhdmUgdGhlIHByb2Nlc3NlZCB0ZW1wbGF0ZSB3aXRoIHRoZSBjb21wb25lbnQncyBjbGFzcyBwcm90b3R5cGVcbiAgICAvLyBzbyBpdCBkb2Vzbid0IG5lZWQgdG8gYmUgcHJvY2Vzc2VkIHdpdGggZXZlcnkgaW5zdGFudGlhdGlvbi5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIHRoaXMubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICAgICAgbGV0IHJvb3QgPSBVU0lOR19TSEFET1dfRE9NX1YwID9cbiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCkgOiAgICAgICAgICAgICAvLyBTaGFkb3cgRE9NIHYwXG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pOyAgLy8gU2hhZG93IERPTSB2MVxuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLy8gRmVhdHVyZSBkZXRlY3Rpb24gZm9yIG9sZCBTaGFkb3cgRE9NIHYwLlxuY29uc3QgVVNJTkdfU0hBRE9XX0RPTV9WMCA9ICh0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNyZWF0ZVNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnKTtcblxuXG4vLyBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbi8vIFJlcGxhY2Ugb2NjdXJlbmNlcyBvZiB2MSBzbG90IGVsZW1lbnRzIHdpdGggdjAgY29udGVudCBlbGVtZW50cy5cbi8vIFRoaXMgZG9lcyBub3QgeWV0IG1hcCBuYW1lZCBzbG90cyB0byBjb250ZW50IHNlbGVjdCBjbGF1c2VzLlxuZnVuY3Rpb24gcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpIHtcbiAgW10uZm9yRWFjaC5jYWxsKHRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2xvdCcpLCBzbG90RWxlbWVudCA9PiB7XG4gICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpO1xuICAgIHNsb3RFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNvbnRlbnRFbGVtZW50LCBzbG90RWxlbWVudCk7XG4gIH0pO1xufVxuXG4vLyBJbnZva2UgYmFzaWMgc3R5bGUgc2hpbW1pbmcgd2l0aCBTaGFkb3dDU1MuXG5mdW5jdGlvbiBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRhZykge1xuICBXZWJDb21wb25lbnRzLlNoYWRvd0NTUy5zaGltU3R5bGluZyh0ZW1wbGF0ZS5jb250ZW50LCB0YWcpO1xufVxuIl19
