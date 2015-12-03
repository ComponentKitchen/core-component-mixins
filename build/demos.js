(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _ElementBase2 = require('../../src/ElementBase');

var _ElementBase3 = _interopRequireDefault(_ElementBase2);

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
    // If a user of this component sets the "punctuation" attribute in markup,
    // the AttributeMarshalling mixin will cause this property to be set.
    get: function get() {
      // Use this.$ reference created by the AutomaticNodeFinding mixin.
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

},{"../../src/ElementBase":13}],2:[function(require,module,exports){
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

var _ElementBase2 = require('../../src/ElementBase');

var _ElementBase3 = _interopRequireDefault(_ElementBase2);

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

},{"../../src/ElementBase":13}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})(); /* A demonstration of the TemplateComposition mixin. */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Composable = require('Composable/src/Composable');

var _Composable2 = _interopRequireDefault(_Composable);

var _SimpleButton = require('./SimpleButton');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

var _TemplateComposition = require('../../src/TemplateComposition');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var IconButton = (function () {
  function IconButton() {
    _classCallCheck(this, IconButton);
  }

  _createClass(IconButton, [{
    key: 'src',
    get: function get() {
      return this.$.icon.src;
    },
    set: function set(value) {
      this.$.icon.src = value;
    }

    // @Composable.rule(foldIntoBaseSlots)

  }, {
    key: 'template',
    get: function get() {
      return '\n       <style>\n       #icon {\n         height: 0.8em;\n         width: 0.8em;\n       }\n       </style>\n\n       <img id=\'icon\' src=\'arrow.svg\'>\n       <slot></slot>\n    ';
    }
  }]);

  return IconButton;
})();
// Indicate that IconButton should have its template folded into the template
// defined by the SimpleButton base class. This effectively inserts IconButtons'
// template into the <content> slot defined by SimpleButton.

_Composable2.default.decorate.call(IconButton.prototype, {
  template: _Composable2.default.rule(_TemplateComposition.foldIntoBaseSlots)
});

exports.default = IconButton = _SimpleButton2.default.compose(IconButton);

document.registerElement('icon-button', IconButton);

},{"../../src/TemplateComposition":14,"./SimpleButton":4,"Composable/src/Composable":8}],4:[function(require,module,exports){
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

var _ElementBase2 = require('../../src/ElementBase');

var _ElementBase3 = _interopRequireDefault(_ElementBase2);

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
} /* A simple base class that defines a template with a <content> slot. */

var SimpleButton = (function (_ElementBase) {
  _inherits(SimpleButton, _ElementBase);

  function SimpleButton() {
    _classCallCheck(this, SimpleButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SimpleButton).apply(this, arguments));
  }

  _createClass(SimpleButton, [{
    key: 'template',
    get: function get() {
      return '\n      <style>\n      button {\n        font-size: inherit;\n        padding: 0.25em;\n      }\n      </style>\n      \n      <button>\n        <slot></slot>\n      </button>\n    ';
    }
  }]);

  return SimpleButton;
})(_ElementBase3.default);

exports.default = SimpleButton;

document.registerElement('simple-button', SimpleButton);

},{"../../src/ElementBase":13}],5:[function(require,module,exports){
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
     *
     * Note that this syntax tried to comply with the existing X-Tag syntax as much
     * as possible.
     */

},{"./xtag":7}],6:[function(require,module,exports){
"use strict";

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

},{}],7:[function(require,module,exports){
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

},{"../../src/AttributeMarshalling":10,"../../src/TemplateStamping":15,"./XTagExtensions":6,"Composable/src/Composable":8}],8:[function(require,module,exports){
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
 * All Composable objects have a "prototypes" key that keeps references to the
 * mixins that were applied along the prototype chain. When a *named* mixin is
 * applied to the prototype chain, the resulting object (or, for a class, the
 * class' prototype) will have a "prototypes" value for that name that points
 * back to the mixin. That is, a mixin can get a pointer to itself in the chain.
 *
 * A single mixin can be applied to multiple prototype chains -- the name
 * refers to the prototype on *this particular prototype chain* that was added
 * for that mixin. This lets mixin/mixin code get back to its own
 * prototype, most often in combination with "super" (see below) in order to
 * invoke superclass behavior.
 */
Composable.prototype.prototypes = {
  Composable: Composable.prototype
};

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
 *       if (this.protoypes.Mixin.super.foo) {
 *         this.prototypes.Mixin.super.foo.call(this); // Invoke superclass' foo()
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
  '__method__': Composable.rules.baseMethodFirst,
  '__property__': Composable.rules.baseSetterFirst,
  'compositionRules': Composable.rules.chainPrototypes,
  'prototypes': Composable.rules.chainPrototypes
};

// Properties defined by Function that we don't want to mixin.
// We'd prefer to get these by interrogating Function itself, but WebKit
// functions have some properties (arguments and caller) which are not returned
// by Object.getOwnPropertyNames(Function).
var NON_MIXABLE_FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];

// Properties defined by Object that we don't want to mixin.
var NON_MIXABLE_OBJECT_PROPERTIES = ['constructor'];

var ORIGINAL_MIXIN_SYMBOL = Symbol('Original mixin');

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
  var defaultCompositionRules = Composable.prototype.compositionRules;

  // For each property name, see if the base has a property with the same name.
  var base = Object.getPrototypeOf(obj);
  Object.getOwnPropertyNames(obj).forEach(function (name) {
    if (name in base && NON_MIXABLE_OBJECT_PROPERTIES.indexOf(name) < 0) {
      // Base does implement a member with the same name; need to combine.
      var descriptor = Object.getOwnPropertyDescriptor(obj, name);
      var key = getGeneralDescriptorKey(descriptor);

      // See if this property has a rule associated with it, checking:
      var rule = ownCompositionRules[name] // object itself
       || inheritedCompositionRules[name] // inherited rules for name
       || inheritedCompositionRules[key] // inherited rules generally
       || defaultCompositionRules[name] // default rules for name
       || defaultCompositionRules[key]; // default rules generally

      // "override" is a known no-op, so we don't bother trying to redefine the
      // property.
      if (rule && rule !== Composable.rules.override) {
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

  // Check to make sure we're not extending the base with a prototype that was
  // already composed into the object's prototype chain.
  var basePrototype = baseIsClass ? base.prototype : base;
  var mixinPrototype = mixinIsClass ? mixin.prototype : mixin;
  if (objectHasPrototype(basePrototype, mixinPrototype) || objectHasMixin(basePrototype, mixin)) {
    // Skip this mixin, return result as is.
    return result;
  }

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

  if (mixin.name) {
    // Use the mixin's name (usually the name of a class' constructor) to
    // save a reference back to the tip of the newly-extended prototype chain.
    // See notes at Composable's "prototypes" property.
    target.prototypes = {};
    target.prototypes[mixin.name] = target;

    // Save a reference to the superclass/super-object. See the comments on
    // Composable's "super" property.
    target.super = baseIsClass ? base.prototype : base;
  }

  // Keep track of the mixin that was composed in at this point.
  Object.defineProperty(target, ORIGINAL_MIXIN_SYMBOL, {
    value: mixin
  });

  // Apply the composition rules in effect at the target.
  applyCompositionRules(target);

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
 * Examine the descriptor to determine which rule key applies.
 */
function getGeneralDescriptorKey(descriptor) {
  if (typeof descriptor.value === 'function') {
    // Method
    return '__method__';
  } else if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
    // Property with getter and/or setter
    return '__property__';
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

/*
 * Return true if the given object either has the given prototype on its
 * chain.
 */
function objectHasPrototype(obj, prototype) {
  if (prototype.constructor === Object) {
    // The prototype is a plain object.
    // Only case to defend against is someone trying to mixin Object itself.
    return prototype === Object.prototype;
  }
  if (obj === prototype || obj instanceof prototype.constructor) {
    // The prototype was found along the prototype chain.
    return true;
  }
  return false;
}

/*
 * Return true if the given mixin was used to create any of the prototypes on
 * on the object's prototype chain.
 */
function objectHasMixin(obj, mixin) {
  if (!obj) {
    return false;
  }
  var descriptor = Object.getOwnPropertyDescriptor(obj, ORIGINAL_MIXIN_SYMBOL);
  if (descriptor && descriptor.value === mixin) {
    // The given mixin was, in fact, composed into this prototype chain.
    return true;
  }
  return objectHasMixin(Object.getPrototypeOf(obj), mixin);
}

},{"./CompositionRules":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeFunction = composeFunction;
exports.chainPrototypes = chainPrototypes;
exports.completePropertyDefinition = completePropertyDefinition;
exports.getBaseDescriptor = getBaseDescriptor;
exports.getPropertyDescriptor = getPropertyDescriptor;
exports.override = override;
exports.preferBaseResult = preferBaseResult;
exports.preferBaseGetter = preferBaseGetter;
exports.preferMixinGetter = preferMixinGetter;
exports.preferMixinResult = preferMixinResult;
exports.baseMethodFirst = baseMethodFirst;
exports.baseSetterFirst = baseSetterFirst;
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
 * Combinator that sets the prototype of a mixin property value to be the
 * corresponding value on the base. This effectively does a shallow merge of
 * of the properties, without copying any information.
 */
function chainPrototypes(target, key, descriptor) {
  var mixinValue = descriptor.value;
  var base = Object.getPrototypeOf(target);
  var baseDescriptor = getPropertyDescriptor(base, key);
  var baseValue = baseDescriptor.value;
  Object.setPrototypeOf(mixinValue, baseValue);
}

/*
 * Helper function to complete a property definition for a mixin.
 *
 * Default JavaScript behavior is that a subclass that defines a getter but not
 * a setter will never have the base class' setter invoked. Similarly, a
 * subclass that defines a setter but not a getter will never have the base
 * class' getter invoked.
 *
 * For mixins, we want the default behavior to be that, if a mixin only defines
 * a getter, but the base class defines a setter, we want the mixin to acquire
 * a default setter than invokes the base setter. Likewise, we want to define
 * a default getter if none is supplied.
 *
 * To carry that out, this helper function rounds out a property definition to
 * ensure it has a default getter or setter if it needs one.
 */
function completePropertyDefinition(descriptor, baseDescriptor) {
  if (descriptor.get && !descriptor.set && baseDescriptor.set) {
    (function () {
      // Mixin has getter but needs a default setter.
      var baseSetter = baseDescriptor.set;
      descriptor.set = function (value) {
        baseSetter.call(this, value);
      };
    })();
  }
  if (descriptor.set && !descriptor.get && baseDescriptor.get) {
    (function () {
      // Mixin has setter but needs a default getter.
      var baseGetter = baseDescriptor.get;
      descriptor.get = function () {
        return baseGetter.call(this);
      };
    })();
  }
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
 * Helper to return the base descriptor for the indicated key. This is used to
 * find the specific implementation that would otherwise be overridden by the
 * mixin.
 */
function getBaseDescriptor(target, key) {
  var base = Object.getPrototypeOf(target);
  return getPropertyDescriptor(base, key);
}

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
 * truthy result, that is returned immediately. Otherwise, the mixin
 * implementation's result is returned.
 */
function preferBaseResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseImplementation = baseDescriptor.value;
  descriptor.value = function () {
    return baseImplementation.apply(this, arguments) || mixinImplementation.apply(this, arguments);
  };
}

/*
 * Like preferBaseResult, but for getter/setters. The base getter is invoked
 * first. If it returns a truthy result, that is returned. Otherwise, the mixin
 * getter's result is returned. Setter is invoked base first, then mixin.
 */
function preferBaseGetter(target, key, descriptor) {
  var mixinGetter = descriptor.get;
  var mixinSetter = descriptor.set;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseGetter = baseDescriptor.get;
  var baseSetter = baseDescriptor.set;
  if (mixinGetter && baseGetter) {
    // Compose getters.
    descriptor.get = function () {
      return baseGetter.apply(this) || mixinGetter.apply(this);
    };
  }
  if (mixinSetter && baseSetter) {
    // Compose setters.
    descriptor.set = composeFunction(baseSetter, mixinSetter);
  }
  completePropertyDefinition(descriptor, baseDescriptor);
}

/*
 * Like preferMixinResult, but for getter/setters. The mixin getter is invoked
 * first. If it returns a truthy result, that is returned. Otherwise, the base
 * getter's result is returned. Setter is still invoked base first, then mixin.
 */
function preferMixinGetter(target, key, descriptor) {
  var mixinGetter = descriptor.get;
  var mixinSetter = descriptor.set;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseGetter = baseDescriptor.get;
  var baseSetter = baseDescriptor.set;
  if (mixinGetter && baseGetter) {
    // Compose getters.
    descriptor.get = function () {
      return mixinGetter.apply(this) || baseGetter.apply(this);
    };
  }
  if (mixinSetter && baseSetter) {
    // Compose setters.
    descriptor.set = composeFunction(baseSetter, mixinSetter);
  }
  completePropertyDefinition(descriptor, baseDescriptor);
}

/*
 * Compose methods, invoking mixin implementation first. If it returns a truthy
 * result, that is returned immediately. Otherwise, the base implementation's
 * result is returned.
 */
function preferMixinResult(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseImplementation = baseDescriptor.value;
  descriptor.value = function () {
    return mixinImplementation.apply(this, arguments) || baseImplementation.apply(this, arguments);
  };
}

/*
 * Default rule for composing methods: invoke base first, then mixin.
 */
function baseMethodFirst(target, key, descriptor) {
  var mixinImplementation = descriptor.value;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseImplementation = baseDescriptor.value;
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
function baseSetterFirst(target, key, descriptor) {
  var mixinSetter = descriptor.set;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseSetter = baseDescriptor.set;
  if (mixinSetter && baseSetter) {
    // Compose setters.
    descriptor.set = composeFunction(baseSetter, mixinSetter);
  }
  completePropertyDefinition(descriptor, baseDescriptor);
}

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
// The result is an HTMLElement with .compose() support.
exports.default = _Composable2.default.compose.call(HTMLElement, _Composable2.default); /*
                                                                                         * A composable HTML element.
                                                                                         *
                                                                                         * This class is provided just as a convenience. One could also start with
                                                                                         * HTMLElement at the top level, and add extensibility by mixing in Composable.
                                                                                         */

},{"Composable/src/Composable":8}],13:[function(require,module,exports){
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

var _ComposableElement = require('./ComposableElement');

var _ComposableElement2 = _interopRequireDefault(_ComposableElement);

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

var ElementBase = (function (_ComposableElement$co) {
  _inherits(ElementBase, _ComposableElement$co);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementBase).apply(this, arguments));
  }

  _createClass(ElementBase, [{
    key: 'log',

    /*
     * Debugging utility: logs a message, prefixed by the component's tag.
     */
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
})(_ComposableElement2.default.compose(_TemplateStamping2.default, // before node finding, so shadow root is populated
_AutomaticNodeFinding2.default, // before marshalling, so marshalled properties can use it
_AttributeMarshalling2.default));

exports.default = ElementBase;

},{"./AttributeMarshalling":10,"./AutomaticNodeFinding":11,"./ComposableElement":12,"./TemplateStamping":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foldIntoBaseSlots = foldIntoBaseSlots;

var _CompositionRules = require('Composable/src/CompositionRules');

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

// Given two templates, "fold" one inside the other. For now, this just entails
// putting the first inside the location of the first <content> node in the
// second template.
//
// Example: if the first (sub) template is
//
//   <template>
//     Hello, <content></content>.
//   </template>
//
// and the second (base) template is
//
//   <template>
//     <b>
//       <content></content>
//     </b>
//   </template>
//
// Then the returned folded template is
//
//   <template>
//     <b>
//       Hello, <content></content>.
//     </b>
//   </template>
//
function foldIntoBaseSlots(target, key, descriptor) {
  var mixinGetter = descriptor.get;
  var baseDescriptor = CompositionRules.getBaseDescriptor(target, key);
  var baseGetter = baseDescriptor.get;
  if (mixinGetter && baseGetter) {

    // Compose getters
    descriptor.get = function () {

      var mixinTemplate = makeTemplate(mixinGetter.call(this));
      var baseTemplate = makeTemplate(baseGetter.call(this));
      var mixinElement = mixinTemplate && mixinTemplate.content.cloneNode(true);
      var baseElement = baseTemplate && baseTemplate.content.cloneNode(true);

      var folded = document.createElement('template');

      // Fold mixin template into first slot element in base template.
      // TODO: Support named slots.
      var slotNode = baseElement.querySelector('slot');
      if (slotNode) {
        slotNode.parentNode.replaceChild(mixinElement, slotNode);
        folded.content.appendChild(baseElement);
      } else {
        // No place in base for mixin template -- throw mixin template away.
        folded.content.appendChild(baseElement);
      }

      return folded;
    };
  }
  CompositionRules.completePropertyDefinition(descriptor, baseDescriptor);
}

function makeTemplate(htmlOrTemplate) {
  return typeof htmlOrTemplate === 'string' ? createTemplateWithInnerHTML(htmlOrTemplate) : htmlOrTemplate;
}

// TODO: Share with TemplateStamping.
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

},{"Composable/src/CompositionRules":9}],15:[function(require,module,exports){
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
      // TODO: Save the processed template with the component's class prototype
      // so it doesn't need to be processed with every instantiation.
      if (template) {

        if (typeof template === 'string') {
          // Upgrade plain string to real template.
          template = createTemplateWithInnerHTML(template);
        }

        if (USING_SHADOW_DOM_V0) {
          polyfillSlotWithContent(template);
        }

        if (window.ShadowDOMPolyfill) {
          shimTemplateStyles(template, this.localName);
        }

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

},{}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vcy9IZWxsbyBXb3JsZC9HcmVldEVsZW1lbnQuanMiLCJkZW1vcy9TdHlsaW5nL0VsZW1lbnRXaXRoU3R5bGUuanMiLCJkZW1vcy9UZW1wbGF0ZSBDb21wb3NpdGlvbi9JY29uQnV0dG9uLmpzIiwiZGVtb3MvVGVtcGxhdGUgQ29tcG9zaXRpb24vU2ltcGxlQnV0dG9uLmpzIiwiZGVtb3MvWC1UYWcvWFRhZ0V4YW1wbGUuanMiLCJkZW1vcy9YLVRhZy9YVGFnRXh0ZW5zaW9ucy5qcyIsImRlbW9zL1gtVGFnL3h0YWcuanMiLCJub2RlX21vZHVsZXMvQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9Db21wb3NhYmxlL3NyYy9Db21wb3NpdGlvblJ1bGVzLmpzIiwic3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwic3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwic3JjL0NvbXBvc2FibGVFbGVtZW50LmpzIiwic3JjL0VsZW1lbnRCYXNlLmpzIiwic3JjL1RlbXBsYXRlQ29tcG9zaXRpb24uanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNRcUIsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOztrRUFBWixZQUFZOzs7ZUFBWixZQUFZOzs7Ozs7d0JBS2IsQUFFaEI7O2FBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3ZDO3NCQUNlLEtBQUssRUFBRSxBQUNyQjtVQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOzs7OztBQUN4Qzs7d0JBR2MsQUFDYjt3RkFHRTtLQUNIOzs7U0FuQmtCLFlBQVk7Oztr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LFNBQVMsR0FBRyxTQUFTLENBQUMsQUFDMUI7U0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQUFDaEM7WUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2pELEFBQ0Q7U0FBTyxRQUFRLENBQUM7Ozs7O0FBQ2pCLEFBSUQsU0FBUyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsQUFDekM7SUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFBLFdBQVcsRUFBSSxBQUN4RTtRQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEFBQ3ZEO2VBQVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztHQUNsRSxDQUFDLENBQUM7Ozs7QUFDSixBQUdELFNBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxBQUN6QztlQUFhLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQzVEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBBIHNhbXBsZSBjdXN0b20gZWxlbWVudCB0aGF0IHVzZXMgdGhlIEVsZW1lbnRCYXNlIGJhc2UgY2xhc3MsIHdoaWNoIGRlZmluZXMgYVxuICogc2V0IG9mIGNvbW1vbiBjdXN0b20gZWxlbWVudCBtaXhpbnMuXG4gKi9cblxuaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uLy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cbi8qIERlZmluZSBhIGN1c3RvbSBlbGVtZW50LiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JlZXRFbGVtZW50IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuXG4gIC8vIERlZmluZSBhIFwicHVuY3R1YXRpb25cIiBhdHRyaWJ1dGUuXG4gIC8vIElmIGEgdXNlciBvZiB0aGlzIGNvbXBvbmVudCBzZXRzIHRoZSBcInB1bmN0dWF0aW9uXCIgYXR0cmlidXRlIGluIG1hcmt1cCxcbiAgLy8gdGhlIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIG1peGluIHdpbGwgY2F1c2UgdGhpcyBwcm9wZXJ0eSB0byBiZSBzZXQuXG4gIGdldCBwdW5jdHVhdGlvbigpIHtcbiAgICAvLyBVc2UgdGhpcy4kIHJlZmVyZW5jZSBjcmVhdGVkIGJ5IHRoZSBBdXRvbWF0aWNOb2RlRmluZGluZyBtaXhpbi5cbiAgICByZXR1cm4gdGhpcy4kLnB1bmN0dWF0aW9uLnRleHRDb250ZW50O1xuICB9XG4gIHNldCBwdW5jdHVhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuJC5wdW5jdHVhdGlvbi50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgLy8gVGhpcyB0ZW1wbGF0ZSBpcyBwaWNrZWQgdXAgYnkgdGhlIFRlbXBsYXRlU3RhbXBpbmcgbWl4aW4uXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgSGVsbG8sXG4gICAgICA8c2xvdD48L3Nsb3Q+PHNwYW4gaWQ9XCJwdW5jdHVhdGlvblwiPi48L3NwYW4+XG4gICAgYDtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZ3JlZXQtZWxlbWVudCcsIEdyZWV0RWxlbWVudCk7XG4iLCIvKlxuICogQSBjb21wb25lbnQgd2l0aCBhIHN0eWxlIGVsZW1lbnQuXG4gKi9cblxuaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uLy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cbi8qIERlZmluZSBhIGN1c3RvbSBlbGVtZW50LiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudFdpdGhTdHlsZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcblxuICAvLyBUaGlzIHRlbXBsYXRlIGlzIHBpY2tlZCB1cCBieSB0aGUgVGVtcGxhdGVTdGFtcGluZyBtaXhpbi5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIGA7XG4gIH1cblxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHlsZScsIEVsZW1lbnRXaXRoU3R5bGUpO1xuIiwiLyogQSBkZW1vbnN0cmF0aW9uIG9mIHRoZSBUZW1wbGF0ZUNvbXBvc2l0aW9uIG1peGluLiAqL1xuXG5cbmltcG9ydCBDb21wb3NhYmxlIGZyb20gJ0NvbXBvc2FibGUvc3JjL0NvbXBvc2FibGUnO1xuaW1wb3J0IFNpbXBsZUJ1dHRvbiBmcm9tICcuL1NpbXBsZUJ1dHRvbic7XG5pbXBvcnQgeyBmb2xkSW50b0Jhc2VTbG90cyB9IGZyb20gJy4uLy4uL3NyYy9UZW1wbGF0ZUNvbXBvc2l0aW9uJztcblxuXG5jbGFzcyBJY29uQnV0dG9uIHtcblxuICBnZXQgc3JjKCkge1xuICAgIHJldHVybiB0aGlzLiQuaWNvbi5zcmM7XG4gIH1cbiAgc2V0IHNyYyh2YWx1ZSkge1xuICAgIHRoaXMuJC5pY29uLnNyYyA9IHZhbHVlO1xuICB9XG5cbiAgLy8gQENvbXBvc2FibGUucnVsZShmb2xkSW50b0Jhc2VTbG90cylcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICAgPHN0eWxlPlxuICAgICAgICNpY29uIHtcbiAgICAgICAgIGhlaWdodDogMC44ZW07XG4gICAgICAgICB3aWR0aDogMC44ZW07XG4gICAgICAgfVxuICAgICAgIDwvc3R5bGU+XG5cbiAgICAgICA8aW1nIGlkPSdpY29uJyBzcmM9J2Fycm93LnN2Zyc+XG4gICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIGA7XG4gIH1cblxufVxuLy8gSW5kaWNhdGUgdGhhdCBJY29uQnV0dG9uIHNob3VsZCBoYXZlIGl0cyB0ZW1wbGF0ZSBmb2xkZWQgaW50byB0aGUgdGVtcGxhdGVcbi8vIGRlZmluZWQgYnkgdGhlIFNpbXBsZUJ1dHRvbiBiYXNlIGNsYXNzLiBUaGlzIGVmZmVjdGl2ZWx5IGluc2VydHMgSWNvbkJ1dHRvbnMnXG4vLyB0ZW1wbGF0ZSBpbnRvIHRoZSA8Y29udGVudD4gc2xvdCBkZWZpbmVkIGJ5IFNpbXBsZUJ1dHRvbi5cbkNvbXBvc2FibGUuZGVjb3JhdGUuY2FsbChJY29uQnV0dG9uLnByb3RvdHlwZSwge1xuICB0ZW1wbGF0ZTogQ29tcG9zYWJsZS5ydWxlKGZvbGRJbnRvQmFzZVNsb3RzKVxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgSWNvbkJ1dHRvbiA9IFNpbXBsZUJ1dHRvbi5jb21wb3NlKEljb25CdXR0b24pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2ljb24tYnV0dG9uJywgSWNvbkJ1dHRvbik7XG4iLCIvKiBBIHNpbXBsZSBiYXNlIGNsYXNzIHRoYXQgZGVmaW5lcyBhIHRlbXBsYXRlIHdpdGggYSA8Y29udGVudD4gc2xvdC4gKi9cblxuXG5pbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVCdXR0b24gZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8c3R5bGU+XG4gICAgICBidXR0b24ge1xuICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7XG4gICAgICAgIHBhZGRpbmc6IDAuMjVlbTtcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICBcbiAgICAgIDxidXR0b24+XG4gICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgIDwvYnV0dG9uPlxuICAgIGA7XG4gIH1cblxufVxuXG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnc2ltcGxlLWJ1dHRvbicsIFNpbXBsZUJ1dHRvbik7XG4iLCIvKlxuICogRGVtb25zdHJhdGUgdGhlIHVzZSBvZiBhIGh5cG90aGV0aWNhbCBYVGFnIHJlZ2lzdHJhdGlvbiBmdW5jdGlvbi5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBzeW50YXggdHJpZWQgdG8gY29tcGx5IHdpdGggdGhlIGV4aXN0aW5nIFgtVGFnIHN5bnRheCBhcyBtdWNoXG4gKiBhcyBwb3NzaWJsZS5cbiAqL1xuXG5cbmltcG9ydCAqIGFzIHh0YWcgZnJvbSAnLi94dGFnJztcblxuXG54dGFnLnJlZ2lzdGVyKCd4dGFnLWV4YW1wbGUnLCB7XG5cbiAgY29udGVudDogYFxuICAgIDxidXR0b24+XG4gICAgICA8Y29udGVudD48L2NvbnRlbnQ+XG4gICAgPC9idXR0b24+XG4gIGAsXG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgYWxlcnQoJ0NsaWNrZWQnKTtcbiAgICB9XG4gIH1cblxufSk7XG4iLCIvKlxuICogRGVtb25zdHJhdGUgc29tZSBoeXBvdGhldGljYWwgWFRhZy1saWtlIHN1Z2FyIGZvciBjb21wb25lbnQgZGV2ZWxvcG1lbnQuXG4gKlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFhUYWdFeHRlbnNpb25zIHtcblxuICAvKlxuICAgKiBEZW1vbnN0cmF0ZSBhIHZlcnkgYmFzaWMgWFRhZy1zdHlsZSBzeXN0ZW0gZm9yIGRlZmluaW5nIGV2ZW50IGhhbmRsZXJzIGluXG4gICAqIGEgSmF2YVNjcmlwdCBkaWN0aW9uYXJ5IGNhbGxlZCBcImV2ZW50c1wiIHRoYXQgbWFwcyBldmVudCBuYW1lcyB0byBoYW5kbGVycy5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgZXZlbnRzID0gdGhpcy5ldmVudHMgfHwgW107XG4gICAgZm9yIChsZXQgbmFtZSBpbiBldmVudHMpIHtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudHNbbmFtZV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIE1ha2UgXCJjb250ZW50XCIgYW5kIFwidGVtcGxhdGVcIiBzeW5vbnltb3VzLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQ7XG4gIH1cbiAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5jb250ZW50ID0gdmFsdWU7XG4gIH1cblxufVxuIiwiLypcbiAqIERlbW9uc3RyYXRpb24gb2YgY3JlYXRpb24gb2YgYSBiYXNlIGNsYXNzIGZvciBhIGh5cG90aGV0aWNhbCB2ZXJzaW9uIG9mIHRoZVxuICogWC1UYWcgZnJhbWV3b3JrLlxuICovXG5cbmltcG9ydCBDb21wb3NhYmxlIGZyb20gJ0NvbXBvc2FibGUvc3JjL0NvbXBvc2FibGUnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi4vLi4vc3JjL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4uLy4uL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5pbXBvcnQgWFRhZ0V4dGVuc2lvbnMgZnJvbSAnLi9YVGFnRXh0ZW5zaW9ucyc7XG5cbi8qXG4gKiBBIGZyYW1ld29yayBiYXNlIGNsYXNzIGNhbiBzdGFydCB3aXRoIEhUTUxFbGVtZW50LCBhZGQgaW4gZXh0ZW5zaWJpbGl0eSxcbiAqIHBsdXMgYW55IG90aGVyIGZlYXR1cmVzIGl0IHdhbnRzIHRvIGJha2UgaW4uIChBbHRlcm5hdGl2ZWx5LCBpdCBjb3VsZCBzdGFydFxuICogYSBjb21tb24gZXh0ZW5zaWJsZSBIVE1MIGVsZW1lbnQgY2xhc3MgbGlrZSBzcmMvQ29tcG9zYWJsZUVsZW1lbnQuanMuKVxuICpcbiAgKiBIZXJlLCB0aGUgaHlwb3RoZXRpY2FsIGZyYW1ld29yayB1c2VzIHR3byBzdGFuZGFyZCBleHRlbnNpb24gY2xhc3Nlc1xuICogZm9yIHRlbXBsYXRlIHN0YW1waW5nIGFuZCBhdHRyaWJ1dGUgbWFyc2hhbGxpbmcsIGFuZCBhZGRzIGEgY3VzdG9tIGV4dGVuc2lvblxuICogZm9yIHNvbWUgWFRhZy1zdHlsZSBmZWF0dXJlcy4gQnkgZGVzaWduLCB0aGlzIG9taXRzIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcsXG4gKiBqdXN0IHRvIHNob3cgdGhhdCBpdCdzIHBvc3NpYmxlIHRvIGxlYXZlIG91dCBleHRlbnNpb25zIGlmIHRoYXQncyBkZXNpcmVkLlxuICovXG5leHBvcnQgbGV0IEVsZW1lbnQgPSBDb21wb3NhYmxlLmNvbXBvc2UuY2FsbChcbiAgSFRNTEVsZW1lbnQsICAgICAgICAgICAgLy8gdGhlIGJhc2UgZnVuY3Rpb25hbGl0eVxuICBDb21wb3NhYmxlLCAgICAgICAgICAgICAvLyBhZGQgZXh0ZW5zaWJpbGl0eVxuICBUZW1wbGF0ZVN0YW1waW5nLCAgICAgICAvLyBhZGQgc2hhZG93IHJvb3QgY3JlYXRpb24gYW5kIHRlbXBsYXRlIHN1cHBvcnRcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmcsICAgLy8gYWRkIG1hcnNoYWxpbmcgb2YgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzXG4gIFhUYWdFeHRlbnNpb25zICAgICAgICAgIC8vIGFkZCBzb21lIFgtVGFnIHNwZWNpZmljIGZlYXR1cmVzIGxpa2UgXCJldmVudHNcIlxuKTtcblxuLypcbiAqIFRoZSBmcmFtZXdvcmsgY2FuIHNpbXBseSBsZXQgcGVvcGxlIGV4dGVuZCBpdHMgYmFzZSBjbGFzcywgb3IgcHJvdmlkZSBhXG4gKiBjdXN0b20gY29uc3RydWN0b3IgdGhhdCBleHRlbmRzIHRoYXQgYmFzZSBjbGFzcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKHRhZywgcHJvdG90eXBlKSB7XG4gIGxldCBtaXhpbnMgPSBwcm90b3R5cGUubWl4aW5zIHx8IFtdOyAvLyBTdXBwb3J0IGEgZGVjbGFyYXRpdmUgXCJtaXhpbnNcIiBrZXkuXG4gIGxldCBTdWJjbGFzcyA9IEVsZW1lbnQuY29tcG9zZShwcm90b3R5cGUsIC4uLm1peGlucyk7XG4gIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCh0YWcsIFN1YmNsYXNzKTtcbiAgcmV0dXJuIFN1YmNsYXNzO1xufVxuIiwiLypcbiAqIEV4dGVuZCBjbGFzc2VzL29iamVjdHMgd2l0aCBvdGhlciBjbGFzc2VzL29iamVjdHMuXG4gKi9cblxuaW1wb3J0ICogYXMgQ29tcG9zaXRpb25SdWxlcyBmcm9tICcuL0NvbXBvc2l0aW9uUnVsZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NhYmxlIHtcblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5jb21wb3NlKE1peGluMSwgTWl4aW4yLCBNaXhpbjMpXG4gICAqXG4gICAqIHdpbGwgcmV0dXJuIGEgbmV3IGNsYXNzIG9mIE15QmFzZUNsYXNzIHRoYXQgaW1wbGVtZW50cyBhbGwgdGhlIG1ldGhvZHMgaW5cbiAgICogdGhlIHRocmVlIG1peGlucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5jb21wb3NlKE1peGluMSkuY29tcG9zZShNaXhpbjIpLmNvbXBvc2UoTWl4aW4zKVxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc3RhdGljYWxseSBpbnZva2VkIHRvIGV4dGVuZCBwbGFpbiBvYmplY3RzIG9yIGNsYXNzZXNcbiAgICogdGhhdCBkb24ndCBpbmhlcml0IGZyb20gdGhpcyBjbGFzczpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBDb21wb3NhYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2UoLi4ubWl4aW5zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIG1peGluIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IG1peGlucy4gSXQgdHVybnMgb3V0IHRoYXRcbiAgICAvLyB3ZSBjYW4gdXNlIEFycmF5LnJlZHVjZSgpIHRvIGNvbmNpc2VseSBleHByZXNzIHRoaXMsIHVzaW5nIHRoZSBjdXJyZW50XG4gICAgLy8gKG9yaWdpbmFsKSBjbGFzcyBhcyB0aGUgc2VlZCBmb3IgcmVkdWNlKCkuXG4gICAgcmV0dXJuIG1peGlucy5yZWR1Y2UoY29tcG9zZSwgdGhpcyk7XG4gIH1cblxuICAvKlxuICAgKiBEZWNvcmF0ZSBcInRoaXNcIiB3aXRoIHRoZSBpbmRpY2F0ZWQgZGVjb3JhdG9ycy4gVGhlIGxhdHRlciBzaG91bGQgYmUgYVxuICAgKiBkaWN0aW9uYXJ5IG1hcHBpbmcgcHJvcGVydHkgbmFtZXMgdG8gKHByb3Bvc2VkKSBFUzctY29tcGxpYW50IGRlY29yYXRvcnMuXG4gICAqIFRoaXMgYWxsb3dzIHRoZSB1c2Ugb2YgZGVjb3JhdG9ycyBpbiBFUzYvNS4gRXhhbXBsZSwgdGhpcyBFUzcgY29kZTpcbiAgICpcbiAgICogICBjbGFzcyBGb28ge1xuICAgKiAgICAgIEBkZWNvcmF0ZShjdXN0b21EZWNvcmF0b3IpXG4gICAqICAgICAgYmFyKCkge31cbiAgICogICB9XG4gICAqXG4gICAqIGNhbiBiZSB3cml0dGVuIHVzaW5nIHRoZSBkZWNvcmF0ZSgpIG1ldGhvZCBhczpcbiAgICpcbiAgICogICBjbGFzcyBGb28ge1xuICAgKiAgICAgIGJhcigpIHt9XG4gICAqICAgfVxuICAgKiAgIENvbXBvc2FibGUuZGVjb3JhdGUuY2FsbChGb28ucHJvdG90eXBlLCB7IGJhcjogY3VzdG9tRGVjb3JhdG9yIH0pO1xuICAgKlxuICAgKiBPciwgaWYgRm9vIGRlcml2ZXMgZnJvbSBDb21wb3NhYmxlIGFscmVhZHksIHRoaXMgY2FuIGJlIHNob3J0ZXI6XG4gICAqXG4gICAqICAgY2xhc3MgRm9vIGV4dGVuZHMgQ29tcG9zYWJsZSB7XG4gICAqICAgICAgYmFyKCkge31cbiAgICogICB9XG4gICAqICAgRm9vLnByb3RvdHlwZS5kZWNvcmF0ZSh7IGJhcjogY3VzdG9tRGVjb3JhdG9yIH0pO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVjb3JhdG9ycykge1xuICAgICAgbGV0IGRlY29yYXRvciA9IGRlY29yYXRvcnNba2V5XTtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLCBrZXkpO1xuICAgICAgZGVjb3JhdG9yKHRoaXMsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBEZWNvcmF0ZXMgdGhlIHByb3RvdHlwZSBvZiBhIGNsYXNzIGRlcml2ZWQgZnJvbSBDb21wb3NhYmxlLlxuICAgKiBTZWUgbm90ZXMgZm9yIHRoZSBzdGF0aWMgZGVjb3JhdGUoKSBtZXRob2QuXG4gICAqL1xuICBkZWNvcmF0ZShkZWNvcmF0b3JzKSB7XG4gICAgQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKHRoaXMsIGRlY29yYXRvcnMpO1xuICB9XG5cbiAgLypcbiAgICogRGVjb3JhdG9yIGZvciBhbm5vdGF0aW5nIGhvdyBhIGNsYXNzIG1lbWJlciBzaG91bGQgYmUgY29tcG9zZWQgbGF0ZXIuXG4gICAqIFRoaXMgdGFrZXMgYSBkZWNvcmF0b3IgdGhhdCB3aWxsIGJlIHJ1biBhdCAqY29tcG9zaXRpb24qIHRpbWUuXG4gICAqIEZvciBub3csIHRoaXMgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBtZXRob2RzLlxuICAgKi9cbiAgc3RhdGljIHJ1bGUoZGVjb3JhdG9yKSB7XG4gICAgLy8gUmV0dXJuIGEgZGVjb3JhdG9yIHRoYXQgcmVjb3JkcyB0aGUgZ2l2ZW4gZGVjb3JhdG9yIG9uIHRoZSBtZW1iZXIgaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgICAgLy8gVE9ETzogVXNlIGEgU3ltYm9sIGluc3RlYWQgb2YgYSBzdHJpbmcgcHJvcGVydHkgbmFtZSB0byBzYXZlIHRoaXMuXG4gICAgICAvLyBkZXNjcmlwdG9yLnZhbHVlLl9jb21wb3NpdGlvblJ1bGUgPSBkZWNvcmF0b3I7XG4gICAgICBpZiAoIXRhcmdldC5fY29tcG9zaXRpb25SdWxlcykge1xuICAgICAgICB0YXJnZXQuX2NvbXBvc2l0aW9uUnVsZXMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRhcmdldC5fY29tcG9zaXRpb25SdWxlc1trZXldID0gZGVjb3JhdG9yO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLypcbiAqIEV4cG9zZSBzdGFuZGFyZCBjb21wb3NpdGlvbiBydWxlcyBhcyBwcm9wZXJ0aWVzIG9mIENvbXBvc2FibGUuXG4gKiBUaGlzIGF2b2lkcyB0aGUgbmVlZCBmb3Igc29tZW9uZSB0byBtYWtlIGEgc2VwYXJhdGUgaW1wb3J0IG9mIHRoZSBydWxlcy5cbiAqL1xuQ29tcG9zYWJsZS5ydWxlcyA9IENvbXBvc2l0aW9uUnVsZXM7XG5cblxuLypcbiAqIEFsbCBDb21wb3NhYmxlIG9iamVjdHMgaGF2ZSBhIFwicHJvdG90eXBlc1wiIGtleSB0aGF0IGtlZXBzIHJlZmVyZW5jZXMgdG8gdGhlXG4gKiBtaXhpbnMgdGhhdCB3ZXJlIGFwcGxpZWQgYWxvbmcgdGhlIHByb3RvdHlwZSBjaGFpbi4gV2hlbiBhICpuYW1lZCogbWl4aW4gaXNcbiAqIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZSBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlXG4gKiBjbGFzcycgcHJvdG90eXBlKSB3aWxsIGhhdmUgYSBcInByb3RvdHlwZXNcIiB2YWx1ZSBmb3IgdGhhdCBuYW1lIHRoYXQgcG9pbnRzXG4gKiBiYWNrIHRvIHRoZSBtaXhpbi4gVGhhdCBpcywgYSBtaXhpbiBjYW4gZ2V0IGEgcG9pbnRlciB0byBpdHNlbGYgaW4gdGhlIGNoYWluLlxuICpcbiAqIEEgc2luZ2xlIG1peGluIGNhbiBiZSBhcHBsaWVkIHRvIG11bHRpcGxlIHByb3RvdHlwZSBjaGFpbnMgLS0gdGhlIG5hbWVcbiAqIHJlZmVycyB0byB0aGUgcHJvdG90eXBlIG9uICp0aGlzIHBhcnRpY3VsYXIgcHJvdG90eXBlIGNoYWluKiB0aGF0IHdhcyBhZGRlZFxuICogZm9yIHRoYXQgbWl4aW4uIFRoaXMgbGV0cyBtaXhpbi9taXhpbiBjb2RlIGdldCBiYWNrIHRvIGl0cyBvd25cbiAqIHByb3RvdHlwZSwgbW9zdCBvZnRlbiBpbiBjb21iaW5hdGlvbiB3aXRoIFwic3VwZXJcIiAoc2VlIGJlbG93KSBpbiBvcmRlciB0b1xuICogaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IuXG4gKi9cbkNvbXBvc2FibGUucHJvdG90eXBlLnByb3RvdHlwZXMgPSB7XG4gIENvbXBvc2FibGU6IENvbXBvc2FibGUucHJvdG90eXBlXG59O1xuXG4vKlxuICogQWxsIENvbXBvc2FibGUtY3JlYXRlZCBvYmplY3RzIGhhdmUgYSBcInN1cGVyXCIgcHJvcGVydHkgdGhhdCByZWZlcmVuY2VzIHRoZVxuICogcHJvdG90eXBlIGFib3ZlIHRoZW0gaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBUaGlzIFwic3VwZXJcIiByZWZlcmVuY2UgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50IGZvciBFUzYncyBcInN1cGVyXCIga2V5d29yZCBpblxuICogaW4gRVM1IChvciB0cmFuc3BpbGVkIEVTNikgbWl4aW5zIHRoYXQgd2FudCB0byBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvcixcbiAqIHdoZXJlIHRoZSBzcGVjaWZpYyBzdXBlcmNsYXNzIHdpbGwgZGVwZW5kIHVwb24gd2hpY2ggbWl4aW5zIGhhdmUgYmVlbiBhcHBsaWVkXG4gKiB0byBhIGdpdmVuIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBFLmcuOlxuICogICBjbGFzcyBNaXhpbiB7XG4gKiAgICAgZm9vKCkge1xuICogICAgICAgaWYgKHRoaXMucHJvdG95cGVzLk1peGluLnN1cGVyLmZvbykge1xuICogICAgICAgICB0aGlzLnByb3RvdHlwZXMuTWl4aW4uc3VwZXIuZm9vLmNhbGwodGhpcyk7IC8vIEludm9rZSBzdXBlcmNsYXNzJyBmb28oKVxuICogICAgICAgfVxuICogICAgICAgLy8gRG8gTWl4aW4tc3BlY2lmaWMgd29yayBoZXJlLi4uXG4gKiAgICAgfVxuICogICB9XG4gKlxuICogRm9yIGNvbnNpc3RlbmN5LCBDb21wb3NhYmxlIGl0c2VsZiByZWNvcmRzIGl0cyBvd24gc3VwZXJjbGFzcyBhcyBPYmplY3QuXG4gKi9cbkNvbXBvc2FibGUucHJvdG90eXBlLnN1cGVyID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXG4vLyBDb21wb3NpdGlvbiBydWxlcyBmb3Igc3RhbmRhcmQgb2JqZWN0IG1lbWJlcnMuXG5Db21wb3NhYmxlLnByb3RvdHlwZS5jb21wb3NpdGlvblJ1bGVzID0ge1xuICAnX19tZXRob2RfXyc6IENvbXBvc2FibGUucnVsZXMuYmFzZU1ldGhvZEZpcnN0LFxuICAnX19wcm9wZXJ0eV9fJzogQ29tcG9zYWJsZS5ydWxlcy5iYXNlU2V0dGVyRmlyc3QsXG4gICdjb21wb3NpdGlvblJ1bGVzJzogQ29tcG9zYWJsZS5ydWxlcy5jaGFpblByb3RvdHlwZXMsXG4gICdwcm90b3R5cGVzJzogQ29tcG9zYWJsZS5ydWxlcy5jaGFpblByb3RvdHlwZXNcbn07XG5cblxuLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IEZ1bmN0aW9uIHRoYXQgd2UgZG9uJ3Qgd2FudCB0byBtaXhpbi5cbi8vIFdlJ2QgcHJlZmVyIHRvIGdldCB0aGVzZSBieSBpbnRlcnJvZ2F0aW5nIEZ1bmN0aW9uIGl0c2VsZiwgYnV0IFdlYktpdFxuLy8gZnVuY3Rpb25zIGhhdmUgc29tZSBwcm9wZXJ0aWVzIChhcmd1bWVudHMgYW5kIGNhbGxlcikgd2hpY2ggYXJlIG5vdCByZXR1cm5lZFxuLy8gYnkgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pLlxuY29uc3QgTk9OX01JWEFCTEVfRlVOQ1RJT05fUFJPUEVSVElFUyA9IFtcbiAgJ2FyZ3VtZW50cycsXG4gICdjYWxsZXInLFxuICAnbGVuZ3RoJyxcbiAgJ25hbWUnLFxuICAncHJvdG90eXBlJ1xuXTtcblxuLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IE9iamVjdCB0aGF0IHdlIGRvbid0IHdhbnQgdG8gbWl4aW4uXG5jb25zdCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyA9IFtcbiAgJ2NvbnN0cnVjdG9yJ1xuXTtcblxuY29uc3QgT1JJR0lOQUxfTUlYSU5fU1lNQk9MID0gU3ltYm9sKCdPcmlnaW5hbCBtaXhpbicpO1xuXG5cbi8qXG4gKiBBcHBseSB0aGUgY29tcG9zaXRpb24gcnVsZXMgaW4gZWZmZWN0IGZvciB0aGUgZ2l2ZW4gb2JqZWN0LCB3aGljaCBsaWVzIGF0XG4gKiB0aGUgdGlwIG9mIGEgcHJvdG90eXBlIGNoYWluLiBUaGlzIGxvb2tzIGZvciBjb25mbGljdHMgYmV0d2VlbiB0aGUgb2JqZWN0J3NcbiAqIG93biBwcm9wZXJ0aWVzIChhbmQgbWV0aG9kcyksIGFuZCBpZGVudGljYWxseS1uYW1lZCBwcm9wZXJ0aWVzIChtZXRob2RzKVxuICogZnVydGhlciB1cCB0aGUgcHJvdG90eXBlIGNoYWluLiBDb25mbGljdHMgYXJlIHJlc29sdmVkIHdpdGggcnVsZXMgZGVmaW5lZCBieVxuICogdGhlIGFmZmVjdCBtZW1iZXJzLlxuICovXG5mdW5jdGlvbiBhcHBseUNvbXBvc2l0aW9uUnVsZXMob2JqKSB7XG4gIGxldCBvd25Db21wb3NpdGlvblJ1bGVzID0gb2JqLmhhc093blByb3BlcnR5KCdfY29tcG9zaXRpb25SdWxlcycpID9cbiAgICBvYmouX2NvbXBvc2l0aW9uUnVsZXMgOlxuICAgIHt9O1xuICBsZXQgaW5oZXJpdGVkQ29tcG9zaXRpb25SdWxlcyA9IG9iai5jb21wb3NpdGlvblJ1bGVzO1xuICBsZXQgZGVmYXVsdENvbXBvc2l0aW9uUnVsZXMgPSBDb21wb3NhYmxlLnByb3RvdHlwZS5jb21wb3NpdGlvblJ1bGVzO1xuXG4gIC8vIEZvciBlYWNoIHByb3BlcnR5IG5hbWUsIHNlZSBpZiB0aGUgYmFzZSBoYXMgYSBwcm9wZXJ0eSB3aXRoIHRoZSBzYW1lIG5hbWUuXG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAobmFtZSBpbiBiYXNlICYmIE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICAvLyBCYXNlIGRvZXMgaW1wbGVtZW50IGEgbWVtYmVyIHdpdGggdGhlIHNhbWUgbmFtZTsgbmVlZCB0byBjb21iaW5lLlxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gICAgICBsZXQga2V5ID0gZ2V0R2VuZXJhbERlc2NyaXB0b3JLZXkoZGVzY3JpcHRvcik7XG5cbiAgICAgIC8vIFNlZSBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJ1bGUgYXNzb2NpYXRlZCB3aXRoIGl0LCBjaGVja2luZzpcbiAgICAgIGxldCBydWxlID0gb3duQ29tcG9zaXRpb25SdWxlc1tuYW1lXSAgICAvLyBvYmplY3QgaXRzZWxmXG4gICAgICAgICAgfHwgaW5oZXJpdGVkQ29tcG9zaXRpb25SdWxlc1tuYW1lXSAgLy8gaW5oZXJpdGVkIHJ1bGVzIGZvciBuYW1lXG4gICAgICAgICAgfHwgaW5oZXJpdGVkQ29tcG9zaXRpb25SdWxlc1trZXldICAgLy8gaW5oZXJpdGVkIHJ1bGVzIGdlbmVyYWxseVxuICAgICAgICAgIHx8IGRlZmF1bHRDb21wb3NpdGlvblJ1bGVzW25hbWVdICAgIC8vIGRlZmF1bHQgcnVsZXMgZm9yIG5hbWVcbiAgICAgICAgICB8fCBkZWZhdWx0Q29tcG9zaXRpb25SdWxlc1trZXldOyAgICAvLyBkZWZhdWx0IHJ1bGVzIGdlbmVyYWxseVxuXG4gICAgICAvLyBcIm92ZXJyaWRlXCIgaXMgYSBrbm93biBuby1vcCwgc28gd2UgZG9uJ3QgYm90aGVyIHRyeWluZyB0byByZWRlZmluZSB0aGVcbiAgICAgIC8vIHByb3BlcnR5LlxuICAgICAgaWYgKHJ1bGUgJiYgcnVsZSAhPT0gQ29tcG9zYWJsZS5ydWxlcy5vdmVycmlkZSkge1xuICAgICAgICBydWxlKG9iaiwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICogUmV0dXJuIHRoZSB1cGRhdGVkIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIGlnbm9yZVByb3BlcnR5TmFtZXMgPSBbXSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKGlnbm9yZVByb3BlcnR5TmFtZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzL29iamVjdCB0aGF0IGV4dGVuZHMgdGhlIGdpdmVuIGJhc2UgY2xhc3Mvb2JqZWN0IHdpdGhcbiAqIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgbWl4aW4uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoYmFzZSwgbWl4aW4pIHtcblxuICAvLyBTZWUgaWYgdGhlICptaXhpbiogaGFzIGEgYmFzZSBjbGFzcy9wcm90b3R5cGUgb2YgaXRzIG93bi5cbiAgbGV0IG1peGluSXNDbGFzcyA9IGlzQ2xhc3MobWl4aW4pO1xuICBsZXQgbWl4aW5CYXNlID0gbWl4aW5Jc0NsYXNzID9cbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YobWl4aW4ucHJvdG90eXBlKS5jb25zdHJ1Y3RvciA6XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKG1peGluKTtcbiAgaWYgKG1peGluQmFzZSAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBGdW5jdGlvbiAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBPYmplY3QgJiZcbiAgICAgIG1peGluQmFzZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgIC8vIFRoZSBtaXhpbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgbWl4aW4ncyBiYXNlIGZpcnN0LlxuICAgIGJhc2UgPSBjb21wb3NlKGJhc2UsIG1peGluQmFzZSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGV4dGVuZGVkIG9iamVjdCB3ZSdyZSBnb2luZyB0byByZXR1cm4gYXMgYSByZXN1bHQuXG4gIGxldCBiYXNlSXNDbGFzcyA9IGlzQ2xhc3MoYmFzZSk7XG4gIGxldCByZXN1bHQgPSBiYXNlSXNDbGFzcyA/XG4gICAgY3JlYXRlU3ViY2xhc3MoYmFzZSkgOlxuICAgIE9iamVjdC5jcmVhdGUoYmFzZSk7XG5cbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHdlJ3JlIG5vdCBleHRlbmRpbmcgdGhlIGJhc2Ugd2l0aCBhIHByb3RvdHlwZSB0aGF0IHdhc1xuICAvLyBhbHJlYWR5IGNvbXBvc2VkIGludG8gdGhlIG9iamVjdCdzIHByb3RvdHlwZSBjaGFpbi5cbiAgbGV0IGJhc2VQcm90b3R5cGUgPSBiYXNlSXNDbGFzcyA/IGJhc2UucHJvdG90eXBlIDogYmFzZTtcbiAgbGV0IG1peGluUHJvdG90eXBlID0gbWl4aW5Jc0NsYXNzID8gbWl4aW4ucHJvdG90eXBlIDogbWl4aW47XG4gIGlmIChvYmplY3RIYXNQcm90b3R5cGUoYmFzZVByb3RvdHlwZSwgbWl4aW5Qcm90b3R5cGUpXG4gICAgICB8fCBvYmplY3RIYXNNaXhpbihiYXNlUHJvdG90eXBlLCBtaXhpbikpIHtcbiAgICAvLyBTa2lwIHRoaXMgbWl4aW4sIHJldHVybiByZXN1bHQgYXMgaXMuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFRoZSBcInRhcmdldFwiIGhlcmUgaXMgdGhlIHRhcmdldCBvZiBvdXIgcHJvcGVydHkvbWV0aG9kIGNvbXBvc2l0aW9uIHJ1bGVzLlxuICBsZXQgdGFyZ2V0O1xuICBpZiAoYmFzZUlzQ2xhc3MgJiYgbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggY2xhc3M6IGNvcHkgc3RhdGljIG1lbWJlcnMsIHRoZW4gcHJvdG90eXBlIG1lbWJlcnMuXG4gICAgY29weU93blByb3BlcnRpZXMobWl4aW4sIHJlc3VsdCwgTk9OX01JWEFCTEVfRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgdGFyZ2V0ID0gY29weU93blByb3BlcnRpZXMobWl4aW4ucHJvdG90eXBlLCByZXN1bHQucHJvdG90eXBlLCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBwbGFpbiBvYmplY3Qgd2l0aCBjbGFzczogY29weSBwcm90b3R5cGUgbWV0aG9kcyB0byByZXN1bHQuXG4gICAgdGFyZ2V0ID0gY29weU93blByb3BlcnRpZXMobWl4aW4ucHJvdG90eXBlLCByZXN1bHQsIE5PTl9NSVhBQkxFX0ZVTkNUSU9OX1BST1BFUlRJRVMpO1xuICB9IGVsc2UgaWYgKGJhc2VJc0NsYXNzICYmICFtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3Q6IGNvcHkgbWl4aW4gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LnByb3RvdHlwZSwgTk9OX01JWEFCTEVfT0JKRUNUX1BST1BFUlRJRVMpO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBwbGFpbiBvYmplY3Qgd2l0aCBwbGFpbiBvYmplY3Q6IGNvcHkgZm9ybWVyIHRvIGxhdHRlci5cbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gIH1cblxuICBpZiAobWl4aW4ubmFtZSkge1xuICAgIC8vIFVzZSB0aGUgbWl4aW4ncyBuYW1lICh1c3VhbGx5IHRoZSBuYW1lIG9mIGEgY2xhc3MnIGNvbnN0cnVjdG9yKSB0b1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgYmFjayB0byB0aGUgdGlwIG9mIHRoZSBuZXdseS1leHRlbmRlZCBwcm90b3R5cGUgY2hhaW4uXG4gICAgLy8gU2VlIG5vdGVzIGF0IENvbXBvc2FibGUncyBcInByb3RvdHlwZXNcIiBwcm9wZXJ0eS5cbiAgICB0YXJnZXQucHJvdG90eXBlcyA9IHt9O1xuICAgIHRhcmdldC5wcm90b3R5cGVzW21peGluLm5hbWVdID0gdGFyZ2V0O1xuXG4gICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXJjbGFzcy9zdXBlci1vYmplY3QuIFNlZSB0aGUgY29tbWVudHMgb25cbiAgICAvLyBDb21wb3NhYmxlJ3MgXCJzdXBlclwiIHByb3BlcnR5LlxuICAgIHRhcmdldC5zdXBlciA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICB9XG5cbiAgLy8gS2VlcCB0cmFjayBvZiB0aGUgbWl4aW4gdGhhdCB3YXMgY29tcG9zZWQgaW4gYXQgdGhpcyBwb2ludC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgT1JJR0lOQUxfTUlYSU5fU1lNQk9MLCB7XG4gICAgdmFsdWU6IG1peGluXG4gIH0pO1xuXG4gIC8vIEFwcGx5IHRoZSBjb21wb3NpdGlvbiBydWxlcyBpbiBlZmZlY3QgYXQgdGhlIHRhcmdldC5cbiAgYXBwbHlDb21wb3NpdGlvblJ1bGVzKHRhcmdldCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzIG9mIHRoZSBnaXZlbiBiYXNlIGNsYXNzLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJjbGFzcyhiYXNlKSB7XG4gIC8vIE9uY2UgV2ViS2l0IHN1cHBvcnRzIEhUTUxFbGVtZW50IGFzIGEgcmVhbCBjbGFzcywgd2UgY2FuIGp1c3Qgc2F5OlxuICAvL1xuICAvLyAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAvL1xuICAvLyBIb3dldmVyLCB1bnRpbCB0aGF0J3MgcmVzb2x2ZWQsIHdlIGp1c3QgY29uc3RydWN0IHRoZSBjbGFzcyBvdXJzZWx2ZXMuXG4gIGZ1bmN0aW9uIHN1YmNsYXNzKCkge307XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJjbGFzcywgYmFzZSk7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJjbGFzcy5wcm90b3R5cGUsIGJhc2UucHJvdG90eXBlKTtcbiAgcmV0dXJuIHN1YmNsYXNzO1xufVxuXG5cbi8qXG4gKiBFeGFtaW5lIHRoZSBkZXNjcmlwdG9yIHRvIGRldGVybWluZSB3aGljaCBydWxlIGtleSBhcHBsaWVzLlxuICovXG5mdW5jdGlvbiBnZXRHZW5lcmFsRGVzY3JpcHRvcktleShkZXNjcmlwdG9yKSB7XG4gIGlmICh0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIE1ldGhvZFxuICAgIHJldHVybiAnX19tZXRob2RfXyc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nXG4gICAgICB8fCB0eXBlb2YgZGVzY3JpcHRvci5zZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBQcm9wZXJ0eSB3aXRoIGdldHRlciBhbmQvb3Igc2V0dGVyXG4gICAgcmV0dXJuICdfX3Byb3BlcnR5X18nO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbiAqXG4gKiBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuICogYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbiAqIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4gKiBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuICogZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbiAqL1xuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG5cblxuLypcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgZWl0aGVyIGhhcyB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9uIGl0c1xuICogY2hhaW4uXG4gKi9cbmZ1bmN0aW9uIG9iamVjdEhhc1Byb3RvdHlwZShvYmosIHByb3RvdHlwZSkge1xuICBpZiAocHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAvLyBUaGUgcHJvdG90eXBlIGlzIGEgcGxhaW4gb2JqZWN0LlxuICAgIC8vIE9ubHkgY2FzZSB0byBkZWZlbmQgYWdhaW5zdCBpcyBzb21lb25lIHRyeWluZyB0byBtaXhpbiBPYmplY3QgaXRzZWxmLlxuICAgIHJldHVybiAocHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlKTtcbiAgfVxuICBpZiAob2JqID09PSBwcm90b3R5cGUgfHwgb2JqIGluc3RhbmNlb2YgcHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgLy8gVGhlIHByb3RvdHlwZSB3YXMgZm91bmQgYWxvbmcgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxuLypcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiBtaXhpbiB3YXMgdXNlZCB0byBjcmVhdGUgYW55IG9mIHRoZSBwcm90b3R5cGVzIG9uXG4gKiBvbiB0aGUgb2JqZWN0J3MgcHJvdG90eXBlIGNoYWluLlxuICovXG5mdW5jdGlvbiBvYmplY3RIYXNNaXhpbihvYmosIG1peGluKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIE9SSUdJTkFMX01JWElOX1NZTUJPTCk7XG4gIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWUgPT09IG1peGluKSB7XG4gICAgLy8gVGhlIGdpdmVuIG1peGluIHdhcywgaW4gZmFjdCwgY29tcG9zZWQgaW50byB0aGlzIHByb3RvdHlwZSBjaGFpbi5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0SGFzTWl4aW4oT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG1peGluKTtcbn1cbiIsIi8qKlxuICogU3RhbmRhcmQgY29tcG9zaXRpb24gcnVsZXNcbiAqL1xuXG4vKlxuICogVGFrZSB0d28gZnVuY3Rpb25zIGFuZCByZXR1cm4gYSBuZXcgY29tcG9zZWQgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGJvdGguXG4gKiBUaGUgY29tcG9zZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBub3QgYSBydWxlLCBidXQgYSBoZWxwZXIgdXNlZCBieSBydWxlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VGdW5jdGlvbihmdW5jdGlvbjEsIGZ1bmN0aW9uMikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24xLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5cbi8qXG4gKiBDb21iaW5hdG9yIHRoYXQgc2V0cyB0aGUgcHJvdG90eXBlIG9mIGEgbWl4aW4gcHJvcGVydHkgdmFsdWUgdG8gYmUgdGhlXG4gKiBjb3JyZXNwb25kaW5nIHZhbHVlIG9uIHRoZSBiYXNlLiBUaGlzIGVmZmVjdGl2ZWx5IGRvZXMgYSBzaGFsbG93IG1lcmdlIG9mXG4gKiBvZiB0aGUgcHJvcGVydGllcywgd2l0aG91dCBjb3B5aW5nIGFueSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoYWluUHJvdG90eXBlcyh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5WYWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBrZXkpO1xuICBsZXQgYmFzZVZhbHVlID0gYmFzZURlc2NyaXB0b3IudmFsdWU7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihtaXhpblZhbHVlLCBiYXNlVmFsdWUpO1xufVxuXG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29tcGxldGUgYSBwcm9wZXJ0eSBkZWZpbml0aW9uIGZvciBhIG1peGluLlxuICpcbiAqIERlZmF1bHQgSmF2YVNjcmlwdCBiZWhhdmlvciBpcyB0aGF0IGEgc3ViY2xhc3MgdGhhdCBkZWZpbmVzIGEgZ2V0dGVyIGJ1dCBub3RcbiAqIGEgc2V0dGVyIHdpbGwgbmV2ZXIgaGF2ZSB0aGUgYmFzZSBjbGFzcycgc2V0dGVyIGludm9rZWQuIFNpbWlsYXJseSwgYVxuICogc3ViY2xhc3MgdGhhdCBkZWZpbmVzIGEgc2V0dGVyIGJ1dCBub3QgYSBnZXR0ZXIgd2lsbCBuZXZlciBoYXZlIHRoZSBiYXNlXG4gKiBjbGFzcycgZ2V0dGVyIGludm9rZWQuXG4gKlxuICogRm9yIG1peGlucywgd2Ugd2FudCB0aGUgZGVmYXVsdCBiZWhhdmlvciB0byBiZSB0aGF0LCBpZiBhIG1peGluIG9ubHkgZGVmaW5lc1xuICogYSBnZXR0ZXIsIGJ1dCB0aGUgYmFzZSBjbGFzcyBkZWZpbmVzIGEgc2V0dGVyLCB3ZSB3YW50IHRoZSBtaXhpbiB0byBhY3F1aXJlXG4gKiBhIGRlZmF1bHQgc2V0dGVyIHRoYW4gaW52b2tlcyB0aGUgYmFzZSBzZXR0ZXIuIExpa2V3aXNlLCB3ZSB3YW50IHRvIGRlZmluZVxuICogYSBkZWZhdWx0IGdldHRlciBpZiBub25lIGlzIHN1cHBsaWVkLlxuICpcbiAqIFRvIGNhcnJ5IHRoYXQgb3V0LCB0aGlzIGhlbHBlciBmdW5jdGlvbiByb3VuZHMgb3V0IGEgcHJvcGVydHkgZGVmaW5pdGlvbiB0b1xuICogZW5zdXJlIGl0IGhhcyBhIGRlZmF1bHQgZ2V0dGVyIG9yIHNldHRlciBpZiBpdCBuZWVkcyBvbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wbGV0ZVByb3BlcnR5RGVmaW5pdGlvbihkZXNjcmlwdG9yLCBiYXNlRGVzY3JpcHRvcikge1xuICBpZiAoZGVzY3JpcHRvci5nZXQgJiYgIWRlc2NyaXB0b3Iuc2V0ICYmIGJhc2VEZXNjcmlwdG9yLnNldCkge1xuICAgIC8vIE1peGluIGhhcyBnZXR0ZXIgYnV0IG5lZWRzIGEgZGVmYXVsdCBzZXR0ZXIuXG4gICAgbGV0IGJhc2VTZXR0ZXIgPSBiYXNlRGVzY3JpcHRvci5zZXQ7XG4gICAgZGVzY3JpcHRvci5zZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgYmFzZVNldHRlci5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9O1xuICB9XG4gIGlmIChkZXNjcmlwdG9yLnNldCAmJiAhZGVzY3JpcHRvci5nZXQgJiYgYmFzZURlc2NyaXB0b3IuZ2V0KSB7XG4gICAgLy8gTWl4aW4gaGFzIHNldHRlciBidXQgbmVlZHMgYSBkZWZhdWx0IGdldHRlci5cbiAgICBsZXQgYmFzZUdldHRlciA9IGJhc2VEZXNjcmlwdG9yLmdldDtcbiAgICBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGJhc2VHZXR0ZXIuY2FsbCh0aGlzKTtcbiAgICB9O1xuICB9XG59XG5cblxuLypcbiAqIFBlcmZvcm0gYSBkZWVwIG1lcmdlIG9mIGEgbWl4aW4gcHJvcGVydHkgb24gdG9wIG9mIGEgYmFzZSBwcm9wZXJ0eS5cbiAqL1xuLy8gZXhwb3J0IGZ1bmN0aW9uIGRlZXBNZXJnZSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuLy8gICBsZXQgbWl4aW5WYWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG4vLyAgIGxldCBiYXNlVmFsdWUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVtrZXldLnZhbHVlO1xuLy8gICBkZXNjcmlwdG9yLnZhbHVlID0gJ21lcmdlZCc7IC8vIG1lcmdlKGJhc2VWYWx1ZSwgbWl4aW5WYWx1ZSk7XG4vLyB9XG5cbi8qXG4gKiBIZWxwZXIgdG8gcmV0dXJuIHRoZSBiYXNlIGRlc2NyaXB0b3IgZm9yIHRoZSBpbmRpY2F0ZWQga2V5LiBUaGlzIGlzIHVzZWQgdG9cbiAqIGZpbmQgdGhlIHNwZWNpZmljIGltcGxlbWVudGF0aW9uIHRoYXQgd291bGQgb3RoZXJ3aXNlIGJlIG92ZXJyaWRkZW4gYnkgdGhlXG4gKiBtaXhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwga2V5KTtcbn1cblxuXG4vKlxuICogTGlrZSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKCksIGJ1dCB3YWxrcyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuICogVGhpcyBpcyBuZWVkZWQgYnkgY29tcG9zaXRpb24gcnVsZXMsIHdoaWNoIHVzdWFsbHkgc3RhcnQgb3V0IGJ5IGdldHRpbmdcbiAqIHRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGEgbWVtYmVyIHRoZXkncmUgY29tcG9zaW5nLlxuICogVGhpcyBpcyBub3QgYSBydWxlLCBidXQgYSBoZWxwZXIgdXNlZCBieSBydWxlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpIHtcbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIC8vIENoZWNraW5nIGZvciBcIm5hbWUgaW4gcHJvdG90eXBlXCIgbGV0cyB1cyBrbm93IHdoZXRoZXIgd2Ugc2hvdWxkIGJvdGhlclxuICAgIC8vIHdhbGtpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICBpZiAocHJvdG90eXBlICYmIG5hbWUgaW4gcHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7IC8vIE5vdCBmb3VuZFxufVxuXG5cbi8qXG4gKiBDb21iaW5hdG9yIHRoYXQgY2F1c2VzIGEgbWl4aW4gbWV0aG9kIHRvIG92ZXJyaWRlIGl0cyBiYXNlIGltcGxlbWVudGF0aW9uLlxuICogU2luY2UgdGhpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgcHJvdG90eXBlIGNoYWluLCB0aGlzIGlzIGEgbm8tb3AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdmVycmlkZSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge31cblxuXG4vKlxuICogQ29tcG9zZSBtZXRob2RzLCBpbnZva2luZyBiYXNlIGltcGxlbWVudGF0aW9uIGZpcnN0LiBJZiBpdCByZXR1cm5zIGFcbiAqIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQgaW1tZWRpYXRlbHkuIE90aGVyd2lzZSwgdGhlIG1peGluXG4gKiBpbXBsZW1lbnRhdGlvbidzIHJlc3VsdCBpcyByZXR1cm5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWZlckJhc2VSZXN1bHQodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluSW1wbGVtZW50YXRpb24gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICBsZXQgYmFzZURlc2NyaXB0b3IgPSBnZXRCYXNlRGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIGxldCBiYXNlSW1wbGVtZW50YXRpb24gPSBiYXNlRGVzY3JpcHRvci52YWx1ZTtcbiAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiYXNlSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB8fCBtaXhpbkltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cblxuLypcbiAqIExpa2UgcHJlZmVyQmFzZVJlc3VsdCwgYnV0IGZvciBnZXR0ZXIvc2V0dGVycy4gVGhlIGJhc2UgZ2V0dGVyIGlzIGludm9rZWRcbiAqIGZpcnN0LiBJZiBpdCByZXR1cm5zIGEgdHJ1dGh5IHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCB0aGUgbWl4aW5cbiAqIGdldHRlcidzIHJlc3VsdCBpcyByZXR1cm5lZC4gU2V0dGVyIGlzIGludm9rZWQgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWZlckJhc2VHZXR0ZXIodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG4gIGxldCBtaXhpblNldHRlciA9IGRlc2NyaXB0b3Iuc2V0O1xuICBsZXQgYmFzZURlc2NyaXB0b3IgPSBnZXRCYXNlRGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIGxldCBiYXNlR2V0dGVyID0gYmFzZURlc2NyaXB0b3IuZ2V0O1xuICBsZXQgYmFzZVNldHRlciA9IGJhc2VEZXNjcmlwdG9yLnNldDtcbiAgaWYgKG1peGluR2V0dGVyICYmIGJhc2VHZXR0ZXIpIHtcbiAgICAvLyBDb21wb3NlIGdldHRlcnMuXG4gICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBiYXNlR2V0dGVyLmFwcGx5KHRoaXMpIHx8IG1peGluR2V0dGVyLmFwcGx5KHRoaXMpO1xuICAgIH07XG4gIH1cbiAgaWYgKG1peGluU2V0dGVyICYmIGJhc2VTZXR0ZXIpIHtcbiAgICAvLyBDb21wb3NlIHNldHRlcnMuXG4gICAgZGVzY3JpcHRvci5zZXQgPSBjb21wb3NlRnVuY3Rpb24oYmFzZVNldHRlciwgbWl4aW5TZXR0ZXIpO1xuICB9XG4gIGNvbXBsZXRlUHJvcGVydHlEZWZpbml0aW9uKGRlc2NyaXB0b3IsIGJhc2VEZXNjcmlwdG9yKTtcbn1cblxuXG4vKlxuICogTGlrZSBwcmVmZXJNaXhpblJlc3VsdCwgYnV0IGZvciBnZXR0ZXIvc2V0dGVycy4gVGhlIG1peGluIGdldHRlciBpcyBpbnZva2VkXG4gKiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhIHRydXRoeSByZXN1bHQsIHRoYXQgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSwgdGhlIGJhc2VcbiAqIGdldHRlcidzIHJlc3VsdCBpcyByZXR1cm5lZC4gU2V0dGVyIGlzIHN0aWxsIGludm9rZWQgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWZlck1peGluR2V0dGVyKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xuICBsZXQgbWl4aW5TZXR0ZXIgPSBkZXNjcmlwdG9yLnNldDtcbiAgbGV0IGJhc2VEZXNjcmlwdG9yID0gZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZUdldHRlciA9IGJhc2VEZXNjcmlwdG9yLmdldDtcbiAgbGV0IGJhc2VTZXR0ZXIgPSBiYXNlRGVzY3JpcHRvci5zZXQ7XG4gIGlmIChtaXhpbkdldHRlciAmJiBiYXNlR2V0dGVyKSB7XG4gICAgLy8gQ29tcG9zZSBnZXR0ZXJzLlxuICAgIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbWl4aW5HZXR0ZXIuYXBwbHkodGhpcykgfHwgYmFzZUdldHRlci5hcHBseSh0aGlzKTtcbiAgICB9O1xuICB9XG4gIGlmIChtaXhpblNldHRlciAmJiBiYXNlU2V0dGVyKSB7XG4gICAgLy8gQ29tcG9zZSBzZXR0ZXJzLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VTZXR0ZXIsIG1peGluU2V0dGVyKTtcbiAgfVxuICBjb21wbGV0ZVByb3BlcnR5RGVmaW5pdGlvbihkZXNjcmlwdG9yLCBiYXNlRGVzY3JpcHRvcik7XG59XG5cblxuLypcbiAqIENvbXBvc2UgbWV0aG9kcywgaW52b2tpbmcgbWl4aW4gaW1wbGVtZW50YXRpb24gZmlyc3QuIElmIGl0IHJldHVybnMgYSB0cnV0aHlcbiAqIHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZCBpbW1lZGlhdGVseS4gT3RoZXJ3aXNlLCB0aGUgYmFzZSBpbXBsZW1lbnRhdGlvbidzXG4gKiByZXN1bHQgaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJNaXhpblJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5JbXBsZW1lbnRhdGlvbiA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IGJhc2VEZXNjcmlwdG9yLnZhbHVlO1xuICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1peGluSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB8fCBiYXNlSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5cbi8qXG4gKiBEZWZhdWx0IHJ1bGUgZm9yIGNvbXBvc2luZyBtZXRob2RzOiBpbnZva2UgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2VNZXRob2RGaXJzdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5JbXBsZW1lbnRhdGlvbiA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IGJhc2VEZXNjcmlwdG9yLnZhbHVlO1xuICBkZXNjcmlwdG9yLnZhbHVlID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VJbXBsZW1lbnRhdGlvbiwgbWl4aW5JbXBsZW1lbnRhdGlvbik7XG59XG5cblxuLypcbiAqIERlZmF1bHQgcnVsZSBmb3IgY29tcG9zaW5nIHByb3BlcnRpZXMuXG4gKiBXZSBvbmx5IGNvbXBvc2Ugc2V0dGVycywgd2hpY2ggaW52b2tlIGJhc2UgZmlyc3QsIHRoZW4gbWl4aW4uXG4gKiBBIGRlZmluZWQgbWl4aW4gZ2V0dGVyIG92ZXJyaWRlcyBhIGJhc2UgZ2V0dGVyLlxuICogTm90ZSB0aGF0LCBiZWNhdXNlIG9mIHRoZSB3YXkgcHJvcGVydHkgZGVzY3JpcHRvcnMgd29yaywgaWYgdGhlIG1peGluIG9ubHlcbiAqIGRlZmluZXMgYSBzZXR0ZXIsIGJ1dCBub3QgYSBnZXR0ZXIsIHdlIGhhdmUgdG8gc3VwcGx5IGEgZGVmYXVsdCBnZXR0ZXIgdGhhdFxuICogaW52b2tlcyB0aGUgYmFzZSBnZXR0ZXIuIFNpbWlsYXJseSwgaWYgdGhlIG1peGluIGp1c3QgZGVmaW5lcyBhIGdldHRlcixcbiAqIHdlIGhhdmUgdG8gc3VwcGx5IGEgZGVmYXVsdCBzZXR0ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlU2V0dGVyRmlyc3QodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluU2V0dGVyID0gZGVzY3JpcHRvci5zZXQ7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VTZXR0ZXIgPSBiYXNlRGVzY3JpcHRvci5zZXQ7XG4gIGlmIChtaXhpblNldHRlciAmJiBiYXNlU2V0dGVyKSB7XG4gICAgLy8gQ29tcG9zZSBzZXR0ZXJzLlxuICAgIGRlc2NyaXB0b3Iuc2V0ID0gY29tcG9zZUZ1bmN0aW9uKGJhc2VTZXR0ZXIsIG1peGluU2V0dGVyKTtcbiAgfVxuICBjb21wbGV0ZVByb3BlcnR5RGVmaW5pdGlvbihkZXNjcmlwdG9yLCBiYXNlRGVzY3JpcHRvcik7XG59XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgY29tcG9zYWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gQ29tcG9zYWJsZS5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICdDb21wb3NhYmxlL3NyYy9Db21wb3NhYmxlJztcblxuXG4vLyBXZSB1c2UgRXh0ZW5zaWJsZSB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHdpdGggLmNvbXBvc2UoKSBzdXBwb3J0LlxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoXG4gIEhUTUxFbGVtZW50LFxuICBDb21wb3NhYmxlXG4pO1xuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuXG5pbXBvcnQgQ29tcG9zYWJsZUVsZW1lbnQgZnJvbSAnLi9Db21wb3NhYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgQ29tcG9zYWJsZUVsZW1lbnQuY29tcG9zZShcbiAgVGVtcGxhdGVTdGFtcGluZywgICAgIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKSB7XG5cbiAgLypcbiAgICogRGVidWdnaW5nIHV0aWxpdHk6IGxvZ3MgYSBtZXNzYWdlLCBwcmVmaXhlZCBieSB0aGUgY29tcG9uZW50J3MgdGFnLlxuICAgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBDb21wb3NpdGlvblJ1bGVzIGZyb20gJ0NvbXBvc2FibGUvc3JjL0NvbXBvc2l0aW9uUnVsZXMnO1xuXG4vLyBHaXZlbiB0d28gdGVtcGxhdGVzLCBcImZvbGRcIiBvbmUgaW5zaWRlIHRoZSBvdGhlci4gRm9yIG5vdywgdGhpcyBqdXN0IGVudGFpbHNcbi8vIHB1dHRpbmcgdGhlIGZpcnN0IGluc2lkZSB0aGUgbG9jYXRpb24gb2YgdGhlIGZpcnN0IDxjb250ZW50PiBub2RlIGluIHRoZVxuLy8gc2Vjb25kIHRlbXBsYXRlLlxuLy9cbi8vIEV4YW1wbGU6IGlmIHRoZSBmaXJzdCAoc3ViKSB0ZW1wbGF0ZSBpc1xuLy9cbi8vICAgPHRlbXBsYXRlPlxuLy8gICAgIEhlbGxvLCA8Y29udGVudD48L2NvbnRlbnQ+LlxuLy8gICA8L3RlbXBsYXRlPlxuLy9cbi8vIGFuZCB0aGUgc2Vjb25kIChiYXNlKSB0ZW1wbGF0ZSBpc1xuLy9cbi8vICAgPHRlbXBsYXRlPlxuLy8gICAgIDxiPlxuLy8gICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PlxuLy8gICAgIDwvYj5cbi8vICAgPC90ZW1wbGF0ZT5cbi8vXG4vLyBUaGVuIHRoZSByZXR1cm5lZCBmb2xkZWQgdGVtcGxhdGUgaXNcbi8vXG4vLyAgIDx0ZW1wbGF0ZT5cbi8vICAgICA8Yj5cbi8vICAgICAgIEhlbGxvLCA8Y29udGVudD48L2NvbnRlbnQ+LlxuLy8gICAgIDwvYj5cbi8vICAgPC90ZW1wbGF0ZT5cbi8vXG5leHBvcnQgZnVuY3Rpb24gZm9sZEludG9CYXNlU2xvdHModGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IENvbXBvc2l0aW9uUnVsZXMuZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZUdldHRlciA9IGJhc2VEZXNjcmlwdG9yLmdldDtcbiAgaWYgKG1peGluR2V0dGVyICYmIGJhc2VHZXR0ZXIpIHtcblxuICAgIC8vIENvbXBvc2UgZ2V0dGVyc1xuICAgIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIGxldCBtaXhpblRlbXBsYXRlID0gbWFrZVRlbXBsYXRlKG1peGluR2V0dGVyLmNhbGwodGhpcykpO1xuICAgICAgbGV0IGJhc2VUZW1wbGF0ZSA9IG1ha2VUZW1wbGF0ZShiYXNlR2V0dGVyLmNhbGwodGhpcykpO1xuICAgICAgbGV0IG1peGluRWxlbWVudCA9IG1peGluVGVtcGxhdGUgJiYgbWl4aW5UZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGxldCBiYXNlRWxlbWVudCA9IGJhc2VUZW1wbGF0ZSAmJiBiYXNlVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIGxldCBmb2xkZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAvLyBGb2xkIG1peGluIHRlbXBsYXRlIGludG8gZmlyc3Qgc2xvdCBlbGVtZW50IGluIGJhc2UgdGVtcGxhdGUuXG4gICAgICAvLyBUT0RPOiBTdXBwb3J0IG5hbWVkIHNsb3RzLlxuICAgICAgbGV0IHNsb3ROb2RlID0gYmFzZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2xvdCcpO1xuICAgICAgaWYgKHNsb3ROb2RlKSB7XG4gICAgICAgIHNsb3ROb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1peGluRWxlbWVudCwgc2xvdE5vZGUpO1xuICAgICAgICBmb2xkZWQuY29udGVudC5hcHBlbmRDaGlsZChiYXNlRWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBwbGFjZSBpbiBiYXNlIGZvciBtaXhpbiB0ZW1wbGF0ZSAtLSB0aHJvdyBtaXhpbiB0ZW1wbGF0ZSBhd2F5LlxuICAgICAgICBmb2xkZWQuY29udGVudC5hcHBlbmRDaGlsZChiYXNlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb2xkZWQ7XG4gICAgfTtcbiAgICBcbiAgfVxuICBDb21wb3NpdGlvblJ1bGVzLmNvbXBsZXRlUHJvcGVydHlEZWZpbml0aW9uKGRlc2NyaXB0b3IsIGJhc2VEZXNjcmlwdG9yKTtcbn1cblxuXG5mdW5jdGlvbiBtYWtlVGVtcGxhdGUoaHRtbE9yVGVtcGxhdGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBodG1sT3JUZW1wbGF0ZSA9PT0gJ3N0cmluZycgP1xuICAgIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChodG1sT3JUZW1wbGF0ZSkgOlxuICAgIGh0bWxPclRlbXBsYXRlO1xufVxuXG5cbi8vIFRPRE86IFNoYXJlIHdpdGggVGVtcGxhdGVTdGFtcGluZy5cbi8vIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqXG4gKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgZXh0ZW5zaW9uIHJldGFpbnMgc3VwcG9ydCBmb3IgU2hhZG93IERPTSB2MC5cbiAqIFRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAvLyBUT0RPOiBTYXZlIHRoZSBwcm9jZXNzZWQgdGVtcGxhdGUgd2l0aCB0aGUgY29tcG9uZW50J3MgY2xhc3MgcHJvdG90eXBlXG4gICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRlbXBsYXRlKSB7XG5cbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFVTSU5HX1NIQURPV19ET01fVjApIHtcbiAgICAgICAgcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAod2luZG93LlNoYWRvd0RPTVBvbHlmaWxsKSB7XG4gICAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gVVNJTkdfU0hBRE9XX0RPTV9WMCA/XG4gICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpIDogICAgICAgICAgICAgLy8gU2hhZG93IERPTSB2MFxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTsgIC8vIFNoYWRvdyBET00gdjFcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBvbGQgU2hhZG93IERPTSB2MC5cbmNvbnN0IFVTSU5HX1NIQURPV19ET01fVjAgPSAodHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jcmVhdGVTaGFkb3dSb290ICE9PSAndW5kZWZpbmVkJyk7XG5cblxuLy8gQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXBsYWNlIG9jY3VyZW5jZXMgb2YgdjEgc2xvdCBlbGVtZW50cyB3aXRoIHYwIGNvbnRlbnQgZWxlbWVudHMuXG4vLyBUaGlzIGRvZXMgbm90IHlldCBtYXAgbmFtZWQgc2xvdHMgdG8gY29udGVudCBzZWxlY3QgY2xhdXNlcy5cbmZ1bmN0aW9uIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKSB7XG4gIFtdLmZvckVhY2guY2FsbCh0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Nsb3QnKSwgc2xvdEVsZW1lbnQgPT4ge1xuICAgIGxldCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKTtcbiAgICBzbG90RWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250ZW50RWxlbWVudCwgc2xvdEVsZW1lbnQpO1xuICB9KTtcbn1cblxuLy8gSW52b2tlIGJhc2ljIHN0eWxlIHNoaW1taW5nIHdpdGggU2hhZG93Q1NTLlxuZnVuY3Rpb24gc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0YWcpIHtcbiAgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiJdfQ==
