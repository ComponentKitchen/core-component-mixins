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

// Register the element. This could alternatively be handled by the importer.

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
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
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
exports.baseMethodFirst = baseMethodFirst;
exports.baseSetterFirst = baseSetterFirst;
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
exports.shallowMerge = shallowMerge;
/**
 * Standard composition rules
 */

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
 * Perform a shallow merge of a mixin property on top of a base property.
 */
function shallowMerge(target, key, descriptor) {
  var mixinValue = descriptor.value;
  var baseDescriptor = getBaseDescriptor(target, key);
  var baseValue = baseDescriptor.value;
  var result = {};
  copyProperties(baseValue, result);
  copyProperties(mixinValue, result);
  descriptor.value = result;
}

/*
 * Helper function to copy properties from one object to another.
 */
function copyProperties(source, destination) {
  for (var key in source) {
    destination[key] = source[key];
  }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vcy9IZWxsbyBXb3JsZC9HcmVldEVsZW1lbnQuanMiLCJkZW1vcy9TdHlsaW5nL0VsZW1lbnRXaXRoU3R5bGUuanMiLCJkZW1vcy9UZW1wbGF0ZSBDb21wb3NpdGlvbi9JY29uQnV0dG9uLmpzIiwiZGVtb3MvVGVtcGxhdGUgQ29tcG9zaXRpb24vU2ltcGxlQnV0dG9uLmpzIiwiZGVtb3MvWC1UYWcvWFRhZ0V4YW1wbGUuanMiLCJkZW1vcy9YLVRhZy9YVGFnRXh0ZW5zaW9ucy5qcyIsImRlbW9zL1gtVGFnL3h0YWcuanMiLCJub2RlX21vZHVsZXMvQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9Db21wb3NhYmxlL3NyYy9Db21wb3NpdGlvblJ1bGVzLmpzIiwic3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwic3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwic3JjL0NvbXBvc2FibGVFbGVtZW50LmpzIiwic3JjL0VsZW1lbnRCYXNlLmpzIiwic3JjL1RlbXBsYXRlQ29tcG9zaXRpb24uanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNTcUIsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOztrRUFBWixZQUFZOzs7ZUFBWixZQUFZOzs7Ozs7d0JBS2IsQUFFaEI7O2FBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3ZDO3NCQUNlLEtBQUssRUFBRSxBQUNyQjtVQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOzs7OztBQUN4Qzs7d0JBR2MsQUFDYjt3RkFHRTtLQUNIOzs7U0FuQmtCLFlBQVk7Ozs7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QVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztHQUNsRSxDQUFDLENBQUM7Ozs7QUFDSixBQUdELFNBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxBQUN6QztlQUFhLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQzVEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBBIHNhbXBsZSBjdXN0b20gZWxlbWVudCB0aGF0IHVzZXMgdGhlIEVsZW1lbnRCYXNlIGJhc2UgY2xhc3MsIHdoaWNoIGRlZmluZXMgYVxuICogc2V0IG9mIGNvbW1vbiBjdXN0b20gZWxlbWVudCBtaXhpbnMuXG4gKi9cblxuaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uLy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cblxuLyogRGVmaW5lIGEgY3VzdG9tIGVsZW1lbnQuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmVldEVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG5cbiAgLy8gRGVmaW5lIGEgXCJwdW5jdHVhdGlvblwiIGF0dHJpYnV0ZS5cbiAgLy8gSWYgYSB1c2VyIG9mIHRoaXMgY29tcG9uZW50IHNldHMgdGhlIFwicHVuY3R1YXRpb25cIiBhdHRyaWJ1dGUgaW4gbWFya3VwLFxuICAvLyB0aGUgQXR0cmlidXRlTWFyc2hhbGxpbmcgbWl4aW4gd2lsbCBjYXVzZSB0aGlzIHByb3BlcnR5IHRvIGJlIHNldC5cbiAgZ2V0IHB1bmN0dWF0aW9uKCkge1xuICAgIC8vIFVzZSB0aGlzLiQgcmVmZXJlbmNlIGNyZWF0ZWQgYnkgdGhlIEF1dG9tYXRpY05vZGVGaW5kaW5nIG1peGluLlxuICAgIHJldHVybiB0aGlzLiQucHVuY3R1YXRpb24udGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IHB1bmN0dWF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy4kLnB1bmN0dWF0aW9uLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICAvLyBUaGlzIHRlbXBsYXRlIGlzIHBpY2tlZCB1cCBieSB0aGUgVGVtcGxhdGVTdGFtcGluZyBtaXhpbi5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICBIZWxsbyxcbiAgICAgIDxzbG90Pjwvc2xvdD48c3BhbiBpZD1cInB1bmN0dWF0aW9uXCI+Ljwvc3Bhbj5cbiAgICBgO1xuICB9XG5cbn1cblxuXG4vLyBSZWdpc3RlciB0aGUgZWxlbWVudC4gVGhpcyBjb3VsZCBhbHRlcm5hdGl2ZWx5IGJlIGhhbmRsZWQgYnkgdGhlIGltcG9ydGVyLlxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdncmVldC1lbGVtZW50JywgR3JlZXRFbGVtZW50KTtcbiIsIi8qXG4gKiBBIGNvbXBvbmVudCB3aXRoIGEgc3R5bGUgZWxlbWVudC5cbiAqL1xuXG5pbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuLyogRGVmaW5lIGEgY3VzdG9tIGVsZW1lbnQuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50V2l0aFN0eWxlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuXG4gIC8vIFRoaXMgdGVtcGxhdGUgaXMgcGlja2VkIHVwIGJ5IHRoZSBUZW1wbGF0ZVN0YW1waW5nIG1peGluLlxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgY29sb3I6IHJlZDtcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgYDtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXN0eWxlJywgRWxlbWVudFdpdGhTdHlsZSk7XG4iLCIvKiBBIGRlbW9uc3RyYXRpb24gb2YgdGhlIFRlbXBsYXRlQ29tcG9zaXRpb24gbWl4aW4uICovXG5cblxuaW1wb3J0IENvbXBvc2FibGUgZnJvbSAnQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZSc7XG5pbXBvcnQgU2ltcGxlQnV0dG9uIGZyb20gJy4vU2ltcGxlQnV0dG9uJztcbmltcG9ydCB7IGZvbGRJbnRvQmFzZVNsb3RzIH0gZnJvbSAnLi4vLi4vc3JjL1RlbXBsYXRlQ29tcG9zaXRpb24nO1xuXG5cbmNsYXNzIEljb25CdXR0b24ge1xuXG4gIGdldCBzcmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuJC5pY29uLnNyYztcbiAgfVxuICBzZXQgc3JjKHZhbHVlKSB7XG4gICAgdGhpcy4kLmljb24uc3JjID0gdmFsdWU7XG4gIH1cblxuICAvLyBAQ29tcG9zYWJsZS5ydWxlKGZvbGRJbnRvQmFzZVNsb3RzKVxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgICA8c3R5bGU+XG4gICAgICAgI2ljb24ge1xuICAgICAgICAgaGVpZ2h0OiAwLjhlbTtcbiAgICAgICAgIHdpZHRoOiAwLjhlbTtcbiAgICAgICB9XG4gICAgICAgPC9zdHlsZT5cblxuICAgICAgIDxpbWcgaWQ9J2ljb24nIHNyYz0nYXJyb3cuc3ZnJz5cbiAgICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgYDtcbiAgfVxuXG59XG4vLyBJbmRpY2F0ZSB0aGF0IEljb25CdXR0b24gc2hvdWxkIGhhdmUgaXRzIHRlbXBsYXRlIGZvbGRlZCBpbnRvIHRoZSB0ZW1wbGF0ZVxuLy8gZGVmaW5lZCBieSB0aGUgU2ltcGxlQnV0dG9uIGJhc2UgY2xhc3MuIFRoaXMgZWZmZWN0aXZlbHkgaW5zZXJ0cyBJY29uQnV0dG9ucydcbi8vIHRlbXBsYXRlIGludG8gdGhlIDxjb250ZW50PiBzbG90IGRlZmluZWQgYnkgU2ltcGxlQnV0dG9uLlxuQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKEljb25CdXR0b24ucHJvdG90eXBlLCB7XG4gIHRlbXBsYXRlOiBDb21wb3NhYmxlLnJ1bGUoZm9sZEludG9CYXNlU2xvdHMpXG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBJY29uQnV0dG9uID0gU2ltcGxlQnV0dG9uLmNvbXBvc2UoSWNvbkJ1dHRvbik7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnaWNvbi1idXR0b24nLCBJY29uQnV0dG9uKTtcbiIsIi8qIEEgc2ltcGxlIGJhc2UgY2xhc3MgdGhhdCBkZWZpbmVzIGEgdGVtcGxhdGUgd2l0aCBhIDxjb250ZW50PiBzbG90LiAqL1xuXG5cbmltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi8uLi9zcmMvRWxlbWVudEJhc2UnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZUJ1dHRvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIGJ1dHRvbiB7XG4gICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgICAgICAgcGFkZGluZzogMC4yNWVtO1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIFxuICAgICAgPGJ1dHRvbj5cbiAgICAgICAgPHNsb3Q+PC9zbG90PlxuICAgICAgPC9idXR0b24+XG4gICAgYDtcbiAgfVxuXG59XG5cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdzaW1wbGUtYnV0dG9uJywgU2ltcGxlQnV0dG9uKTtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSB0aGUgdXNlIG9mIGEgaHlwb3RoZXRpY2FsIFhUYWcgcmVnaXN0cmF0aW9uIGZ1bmN0aW9uLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIHN5bnRheCB0cmllZCB0byBjb21wbHkgd2l0aCB0aGUgZXhpc3RpbmcgWC1UYWcgc3ludGF4IGFzIG11Y2hcbiAqIGFzIHBvc3NpYmxlLlxuICovXG5cblxuaW1wb3J0ICogYXMgeHRhZyBmcm9tICcuL3h0YWcnO1xuXG5cbnh0YWcucmVnaXN0ZXIoJ3h0YWctZXhhbXBsZScsIHtcblxuICBjb250ZW50OiBgXG4gICAgPGJ1dHRvbj5cbiAgICAgIDxjb250ZW50PjwvY29udGVudD5cbiAgICA8L2J1dHRvbj5cbiAgYCxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICBhbGVydCgnQ2xpY2tlZCcpO1xuICAgIH1cbiAgfVxuXG59KTtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSBzb21lIGh5cG90aGV0aWNhbCBYVGFnLWxpa2Ugc3VnYXIgZm9yIGNvbXBvbmVudCBkZXZlbG9wbWVudC5cbiAqXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWFRhZ0V4dGVuc2lvbnMge1xuXG4gIC8qXG4gICAqIERlbW9uc3RyYXRlIGEgdmVyeSBiYXNpYyBYVGFnLXN0eWxlIHN5c3RlbSBmb3IgZGVmaW5pbmcgZXZlbnQgaGFuZGxlcnMgaW5cbiAgICogYSBKYXZhU2NyaXB0IGRpY3Rpb25hcnkgY2FsbGVkIFwiZXZlbnRzXCIgdGhhdCBtYXBzIGV2ZW50IG5hbWVzIHRvIGhhbmRsZXJzLlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICBmb3IgKGxldCBuYW1lIGluIGV2ZW50cykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50c1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogTWFrZSBcImNvbnRlbnRcIiBhbmQgXCJ0ZW1wbGF0ZVwiIHN5bm9ueW1vdXMuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG59XG4iLCIvKlxuICogRGVtb25zdHJhdGlvbiBvZiBjcmVhdGlvbiBvZiBhIGJhc2UgY2xhc3MgZm9yIGEgaHlwb3RoZXRpY2FsIHZlcnNpb24gb2YgdGhlXG4gKiBYLVRhZyBmcmFtZXdvcmsuXG4gKi9cblxuaW1wb3J0IENvbXBvc2FibGUgZnJvbSAnQ29tcG9zYWJsZS9zcmMvQ29tcG9zYWJsZSc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuLi8uLi9zcmMvVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi4vLi4vc3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcbmltcG9ydCBYVGFnRXh0ZW5zaW9ucyBmcm9tICcuL1hUYWdFeHRlbnNpb25zJztcblxuLypcbiAqIEEgZnJhbWV3b3JrIGJhc2UgY2xhc3MgY2FuIHN0YXJ0IHdpdGggSFRNTEVsZW1lbnQsIGFkZCBpbiBleHRlbnNpYmlsaXR5LFxuICogcGx1cyBhbnkgb3RoZXIgZmVhdHVyZXMgaXQgd2FudHMgdG8gYmFrZSBpbi4gKEFsdGVybmF0aXZlbHksIGl0IGNvdWxkIHN0YXJ0XG4gKiBhIGNvbW1vbiBleHRlbnNpYmxlIEhUTUwgZWxlbWVudCBjbGFzcyBsaWtlIHNyYy9Db21wb3NhYmxlRWxlbWVudC5qcy4pXG4gKlxuICAqIEhlcmUsIHRoZSBoeXBvdGhldGljYWwgZnJhbWV3b3JrIHVzZXMgdHdvIHN0YW5kYXJkIGV4dGVuc2lvbiBjbGFzc2VzXG4gKiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcgYW5kIGF0dHJpYnV0ZSBtYXJzaGFsbGluZywgYW5kIGFkZHMgYSBjdXN0b20gZXh0ZW5zaW9uXG4gKiBmb3Igc29tZSBYVGFnLXN0eWxlIGZlYXR1cmVzLiBCeSBkZXNpZ24sIHRoaXMgb21pdHMgYXV0b21hdGljIG5vZGUgZmluZGluZyxcbiAqIGp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgcG9zc2libGUgdG8gbGVhdmUgb3V0IGV4dGVuc2lvbnMgaWYgdGhhdCdzIGRlc2lyZWQuXG4gKi9cbmV4cG9ydCBsZXQgRWxlbWVudCA9IENvbXBvc2FibGUuY29tcG9zZS5jYWxsKFxuICBIVE1MRWxlbWVudCwgICAgICAgICAgICAvLyB0aGUgYmFzZSBmdW5jdGlvbmFsaXR5XG4gIENvbXBvc2FibGUsICAgICAgICAgICAgIC8vIGFkZCBleHRlbnNpYmlsaXR5XG4gIFRlbXBsYXRlU3RhbXBpbmcsICAgICAgIC8vIGFkZCBzaGFkb3cgcm9vdCBjcmVhdGlvbiBhbmQgdGVtcGxhdGUgc3VwcG9ydFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZywgICAvLyBhZGQgbWFyc2hhbGluZyBvZiBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXNcbiAgWFRhZ0V4dGVuc2lvbnMgICAgICAgICAgLy8gYWRkIHNvbWUgWC1UYWcgc3BlY2lmaWMgZmVhdHVyZXMgbGlrZSBcImV2ZW50c1wiXG4pO1xuXG4vKlxuICogVGhlIGZyYW1ld29yayBjYW4gc2ltcGx5IGxldCBwZW9wbGUgZXh0ZW5kIGl0cyBiYXNlIGNsYXNzLCBvciBwcm92aWRlIGFcbiAqIGN1c3RvbSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgdGhhdCBiYXNlIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIodGFnLCBwcm90b3R5cGUpIHtcbiAgbGV0IG1peGlucyA9IHByb3RvdHlwZS5taXhpbnMgfHwgW107IC8vIFN1cHBvcnQgYSBkZWNsYXJhdGl2ZSBcIm1peGluc1wiIGtleS5cbiAgbGV0IFN1YmNsYXNzID0gRWxlbWVudC5jb21wb3NlKHByb3RvdHlwZSwgLi4ubWl4aW5zKTtcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZywgU3ViY2xhc3MpO1xuICByZXR1cm4gU3ViY2xhc3M7XG59XG4iLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBDb21wb3NpdGlvblJ1bGVzIGZyb20gJy4vQ29tcG9zaXRpb25SdWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2FibGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xLCBNaXhpbjIsIE1peGluMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgbWl4aW5zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xKS5jb21wb3NlKE1peGluMikuY29tcG9zZShNaXhpbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHMgb3IgY2xhc3Nlc1xuICAgKiB0aGF0IGRvbid0IGluaGVyaXQgZnJvbSB0aGlzIGNsYXNzOlxuICAgKlxuICAgKiAgIGxldCBleHRlbmRlZCA9IENvbXBvc2FibGUuZXh0ZW5kLmNhbGwob2JqMSwgb2JqMik7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZSguLi5taXhpbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggbWl4aW4gaW4gdHVybi4gVGhlIHJlc3VsdCBiZWNvbWVzXG4gICAgLy8gdGhlIGJhc2UgY2xhc3MgZXh0ZW5kZWQgYnkgYW55IHN1YnNlcXVlbnQgbWl4aW5zLiBJdCB0dXJucyBvdXQgdGhhdFxuICAgIC8vIHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlIGN1cnJlbnRcbiAgICAvLyAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gbWl4aW5zLnJlZHVjZShjb21wb3NlLCB0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIERlY29yYXRlIFwidGhpc1wiIHdpdGggdGhlIGluZGljYXRlZCBkZWNvcmF0b3JzLiBUaGUgbGF0dGVyIHNob3VsZCBiZSBhXG4gICAqIGRpY3Rpb25hcnkgbWFwcGluZyBwcm9wZXJ0eSBuYW1lcyB0byAocHJvcG9zZWQpIEVTNy1jb21wbGlhbnQgZGVjb3JhdG9ycy5cbiAgICogVGhpcyBhbGxvd3MgdGhlIHVzZSBvZiBkZWNvcmF0b3JzIGluIEVTNi81LiBFeGFtcGxlLCB0aGlzIEVTNyBjb2RlOlxuICAgKlxuICAgKiAgIGNsYXNzIEZvbyB7XG4gICAqICAgICAgQGRlY29yYXRlKGN1c3RvbURlY29yYXRvcilcbiAgICogICAgICBiYXIoKSB7fVxuICAgKiAgIH1cbiAgICpcbiAgICogY2FuIGJlIHdyaXR0ZW4gdXNpbmcgdGhlIGRlY29yYXRlKCkgbWV0aG9kIGFzOlxuICAgKlxuICAgKiAgIGNsYXNzIEZvbyB7XG4gICAqICAgICAgYmFyKCkge31cbiAgICogICB9XG4gICAqICAgQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKEZvby5wcm90b3R5cGUsIHsgYmFyOiBjdXN0b21EZWNvcmF0b3IgfSk7XG4gICAqXG4gICAqIE9yLCBpZiBGb28gZGVyaXZlcyBmcm9tIENvbXBvc2FibGUgYWxyZWFkeSwgdGhpcyBjYW4gYmUgc2hvcnRlcjpcbiAgICpcbiAgICogICBjbGFzcyBGb28gZXh0ZW5kcyBDb21wb3NhYmxlIHtcbiAgICogICAgICBiYXIoKSB7fVxuICAgKiAgIH1cbiAgICogICBGb28ucHJvdG90eXBlLmRlY29yYXRlKHsgYmFyOiBjdXN0b21EZWNvcmF0b3IgfSk7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZGVjb3JhdGUoZGVjb3JhdG9ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBkZWNvcmF0b3JzKSB7XG4gICAgICBsZXQgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1trZXldO1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIGtleSk7XG4gICAgICBkZWNvcmF0b3IodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIERlY29yYXRlcyB0aGUgcHJvdG90eXBlIG9mIGEgY2xhc3MgZGVyaXZlZCBmcm9tIENvbXBvc2FibGUuXG4gICAqIFNlZSBub3RlcyBmb3IgdGhlIHN0YXRpYyBkZWNvcmF0ZSgpIG1ldGhvZC5cbiAgICovXG4gIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBDb21wb3NhYmxlLmRlY29yYXRlLmNhbGwodGhpcywgZGVjb3JhdG9ycyk7XG4gIH1cblxuICAvKlxuICAgKiBEZWNvcmF0b3IgZm9yIGFubm90YXRpbmcgaG93IGEgY2xhc3MgbWVtYmVyIHNob3VsZCBiZSBjb21wb3NlZCBsYXRlci5cbiAgICogVGhpcyB0YWtlcyBhIGRlY29yYXRvciB0aGF0IHdpbGwgYmUgcnVuIGF0ICpjb21wb3NpdGlvbiogdGltZS5cbiAgICogRm9yIG5vdywgdGhpcyBjYW4gb25seSBiZSBhcHBsaWVkIHRvIG1ldGhvZHMuXG4gICAqL1xuICBzdGF0aWMgcnVsZShkZWNvcmF0b3IpIHtcbiAgICAvLyBSZXR1cm4gYSBkZWNvcmF0b3IgdGhhdCByZWNvcmRzIHRoZSBnaXZlbiBkZWNvcmF0b3Igb24gdGhlIG1lbWJlciBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAvLyBUT0RPOiBVc2UgYSBTeW1ib2wgaW5zdGVhZCBvZiBhIHN0cmluZyBwcm9wZXJ0eSBuYW1lIHRvIHNhdmUgdGhpcy5cbiAgICAgIC8vIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZSA9IGRlY29yYXRvcjtcbiAgICAgIGlmICghdGFyZ2V0Ll9jb21wb3NpdGlvblJ1bGVzKSB7XG4gICAgICAgIHRhcmdldC5fY29tcG9zaXRpb25SdWxlcyA9IHt9O1xuICAgICAgfVxuICAgICAgdGFyZ2V0Ll9jb21wb3NpdGlvblJ1bGVzW2tleV0gPSBkZWNvcmF0b3I7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogRXhwb3NlIHN0YW5kYXJkIGNvbXBvc2l0aW9uIHJ1bGVzIGFzIHByb3BlcnRpZXMgb2YgQ29tcG9zYWJsZS5cbiAqIFRoaXMgYXZvaWRzIHRoZSBuZWVkIGZvciBzb21lb25lIHRvIG1ha2UgYSBzZXBhcmF0ZSBpbXBvcnQgb2YgdGhlIHJ1bGVzLlxuICovXG5Db21wb3NhYmxlLnJ1bGVzID0gQ29tcG9zaXRpb25SdWxlcztcblxuXG4vKlxuICogQWxsIENvbXBvc2FibGUgb2JqZWN0cyBoYXZlIGEgXCJwcm90b3R5cGVzXCIga2V5IHRoYXQga2VlcHMgcmVmZXJlbmNlcyB0byB0aGVcbiAqIG1peGlucyB0aGF0IHdlcmUgYXBwbGllZCBhbG9uZyB0aGUgcHJvdG90eXBlIGNoYWluLiBXaGVuIGEgKm5hbWVkKiBtaXhpbiBpc1xuICogYXBwbGllZCB0byB0aGUgcHJvdG90eXBlIGNoYWluLCB0aGUgcmVzdWx0aW5nIG9iamVjdCAob3IsIGZvciBhIGNsYXNzLCB0aGVcbiAqIGNsYXNzJyBwcm90b3R5cGUpIHdpbGwgaGF2ZSBhIFwicHJvdG90eXBlc1wiIHZhbHVlIGZvciB0aGF0IG5hbWUgdGhhdCBwb2ludHNcbiAqIGJhY2sgdG8gdGhlIG1peGluLiBUaGF0IGlzLCBhIG1peGluIGNhbiBnZXQgYSBwb2ludGVyIHRvIGl0c2VsZiBpbiB0aGUgY2hhaW4uXG4gKlxuICogQSBzaW5nbGUgbWl4aW4gY2FuIGJlIGFwcGxpZWQgdG8gbXVsdGlwbGUgcHJvdG90eXBlIGNoYWlucyAtLSB0aGUgbmFtZVxuICogcmVmZXJzIHRvIHRoZSBwcm90b3R5cGUgb24gKnRoaXMgcGFydGljdWxhciBwcm90b3R5cGUgY2hhaW4qIHRoYXQgd2FzIGFkZGVkXG4gKiBmb3IgdGhhdCBtaXhpbi4gVGhpcyBsZXRzIG1peGluL21peGluIGNvZGUgZ2V0IGJhY2sgdG8gaXRzIG93blxuICogcHJvdG90eXBlLCBtb3N0IG9mdGVuIGluIGNvbWJpbmF0aW9uIHdpdGggXCJzdXBlclwiIChzZWUgYmVsb3cpIGluIG9yZGVyIHRvXG4gKiBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvci5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUucHJvdG90eXBlcyA9IHtcbiAgQ29tcG9zYWJsZTogQ29tcG9zYWJsZS5wcm90b3R5cGVcbn07XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMgaGF2ZSBhIFwic3VwZXJcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlXG4gKiBwcm90b3R5cGUgYWJvdmUgdGhlbSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIFRoaXMgXCJzdXBlclwiIHJlZmVyZW5jZSBpcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIEVTNidzIFwic3VwZXJcIiBrZXl3b3JkIGluXG4gKiBpbiBFUzUgKG9yIHRyYW5zcGlsZWQgRVM2KSBtaXhpbnMgdGhhdCB3YW50IHRvIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLFxuICogd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbCBkZXBlbmQgdXBvbiB3aGljaCBtaXhpbnMgaGF2ZSBiZWVuIGFwcGxpZWRcbiAqIHRvIGEgZ2l2ZW4gcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEUuZy46XG4gKiAgIGNsYXNzIE1peGluIHtcbiAqICAgICBmb28oKSB7XG4gKiAgICAgICBpZiAodGhpcy5wcm90b3lwZXMuTWl4aW4uc3VwZXIuZm9vKSB7XG4gKiAgICAgICAgIHRoaXMucHJvdG90eXBlcy5NaXhpbi5zdXBlci5mb28uY2FsbCh0aGlzKTsgLy8gSW52b2tlIHN1cGVyY2xhc3MnIGZvbygpXG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBEbyBNaXhpbi1zcGVjaWZpYyB3b3JrIGhlcmUuLi5cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBGb3IgY29uc2lzdGVuY3ksIENvbXBvc2FibGUgaXRzZWxmIHJlY29yZHMgaXRzIG93biBzdXBlcmNsYXNzIGFzIE9iamVjdC5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUuc3VwZXIgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cbi8vIENvbXBvc2l0aW9uIHJ1bGVzIGZvciBzdGFuZGFyZCBvYmplY3QgbWVtYmVycy5cbkNvbXBvc2FibGUucHJvdG90eXBlLmNvbXBvc2l0aW9uUnVsZXMgPSB7XG4gICdfX21ldGhvZF9fJzogQ29tcG9zYWJsZS5ydWxlcy5iYXNlTWV0aG9kRmlyc3QsXG4gICdfX3Byb3BlcnR5X18nOiBDb21wb3NhYmxlLnJ1bGVzLmJhc2VTZXR0ZXJGaXJzdCxcbiAgJ2NvbXBvc2l0aW9uUnVsZXMnOiBDb21wb3NhYmxlLnJ1bGVzLmNoYWluUHJvdG90eXBlcyxcbiAgJ3Byb3RvdHlwZXMnOiBDb21wb3NhYmxlLnJ1bGVzLmNoYWluUHJvdG90eXBlc1xufTtcblxuXG4vLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24gdGhhdCB3ZSBkb24ndCB3YW50IHRvIG1peGluLlxuLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IHRoZXNlIGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0XG4vLyBmdW5jdGlvbnMgaGF2ZSBzb21lIHByb3BlcnRpZXMgKGFyZ3VtZW50cyBhbmQgY2FsbGVyKSB3aGljaCBhcmUgbm90IHJldHVybmVkXG4vLyBieSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikuXG5jb25zdCBOT05fTUlYQUJMRV9GVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAnYXJndW1lbnRzJyxcbiAgJ2NhbGxlcicsXG4gICdsZW5ndGgnLFxuICAnbmFtZScsXG4gICdwcm90b3R5cGUnXG5dO1xuXG4vLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgT2JqZWN0IHRoYXQgd2UgZG9uJ3Qgd2FudCB0byBtaXhpbi5cbmNvbnN0IE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTID0gW1xuICAnY29uc3RydWN0b3InXG5dO1xuXG5jb25zdCBPUklHSU5BTF9NSVhJTl9TWU1CT0wgPSBTeW1ib2woJ09yaWdpbmFsIG1peGluJyk7XG5cblxuLypcbiAqIEFwcGx5IHRoZSBjb21wb3NpdGlvbiBydWxlcyBpbiBlZmZlY3QgZm9yIHRoZSBnaXZlbiBvYmplY3QsIHdoaWNoIGxpZXMgYXRcbiAqIHRoZSB0aXAgb2YgYSBwcm90b3R5cGUgY2hhaW4uIFRoaXMgbG9va3MgZm9yIGNvbmZsaWN0cyBiZXR3ZWVuIHRoZSBvYmplY3Qnc1xuICogb3duIHByb3BlcnRpZXMgKGFuZCBtZXRob2RzKSwgYW5kIGlkZW50aWNhbGx5LW5hbWVkIHByb3BlcnRpZXMgKG1ldGhvZHMpXG4gKiBmdXJ0aGVyIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uIENvbmZsaWN0cyBhcmUgcmVzb2x2ZWQgd2l0aCBydWxlcyBkZWZpbmVkIGJ5XG4gKiB0aGUgYWZmZWN0IG1lbWJlcnMuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5Q29tcG9zaXRpb25SdWxlcyhvYmopIHtcbiAgbGV0IG93bkNvbXBvc2l0aW9uUnVsZXMgPSBvYmouaGFzT3duUHJvcGVydHkoJ19jb21wb3NpdGlvblJ1bGVzJykgP1xuICAgIG9iai5fY29tcG9zaXRpb25SdWxlcyA6XG4gICAge307XG4gIGxldCBpbmhlcml0ZWRDb21wb3NpdGlvblJ1bGVzID0gb2JqLmNvbXBvc2l0aW9uUnVsZXM7XG4gIGxldCBkZWZhdWx0Q29tcG9zaXRpb25SdWxlcyA9IENvbXBvc2FibGUucHJvdG90eXBlLmNvbXBvc2l0aW9uUnVsZXM7XG5cbiAgLy8gRm9yIGVhY2ggcHJvcGVydHkgbmFtZSwgc2VlIGlmIHRoZSBiYXNlIGhhcyBhIHByb3BlcnR5IHdpdGggdGhlIHNhbWUgbmFtZS5cbiAgbGV0IGJhc2UgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChuYW1lIGluIGJhc2UgJiYgTk9OX01JWEFCTEVfT0JKRUNUX1BST1BFUlRJRVMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIC8vIEJhc2UgZG9lcyBpbXBsZW1lbnQgYSBtZW1iZXIgd2l0aCB0aGUgc2FtZSBuYW1lOyBuZWVkIHRvIGNvbWJpbmUuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcbiAgICAgIGxldCBrZXkgPSBnZXRHZW5lcmFsRGVzY3JpcHRvcktleShkZXNjcmlwdG9yKTtcblxuICAgICAgLy8gU2VlIGlmIHRoaXMgcHJvcGVydHkgaGFzIGEgcnVsZSBhc3NvY2lhdGVkIHdpdGggaXQsIGNoZWNraW5nOlxuICAgICAgbGV0IHJ1bGUgPSBvd25Db21wb3NpdGlvblJ1bGVzW25hbWVdICAgIC8vIG9iamVjdCBpdHNlbGZcbiAgICAgICAgICB8fCBpbmhlcml0ZWRDb21wb3NpdGlvblJ1bGVzW25hbWVdICAvLyBpbmhlcml0ZWQgcnVsZXMgZm9yIG5hbWVcbiAgICAgICAgICB8fCBpbmhlcml0ZWRDb21wb3NpdGlvblJ1bGVzW2tleV0gICAvLyBpbmhlcml0ZWQgcnVsZXMgZ2VuZXJhbGx5XG4gICAgICAgICAgfHwgZGVmYXVsdENvbXBvc2l0aW9uUnVsZXNbbmFtZV0gICAgLy8gZGVmYXVsdCBydWxlcyBmb3IgbmFtZVxuICAgICAgICAgIHx8IGRlZmF1bHRDb21wb3NpdGlvblJ1bGVzW2tleV07ICAgIC8vIGRlZmF1bHQgcnVsZXMgZ2VuZXJhbGx5XG5cbiAgICAgIC8vIFwib3ZlcnJpZGVcIiBpcyBhIGtub3duIG5vLW9wLCBzbyB3ZSBkb24ndCBib3RoZXIgdHJ5aW5nIHRvIHJlZGVmaW5lIHRoZVxuICAgICAgLy8gcHJvcGVydHkuXG4gICAgICBpZiAocnVsZSAmJiBydWxlICE9PSBDb21wb3NhYmxlLnJ1bGVzLm92ZXJyaWRlKSB7XG4gICAgICAgIHJ1bGUob2JqLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gcHJvcGVydGllcy9tZXRob2RzIHRvIHRoZSB0YXJnZXQuXG4gKiBSZXR1cm4gdGhlIHVwZGF0ZWQgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgaWdub3JlUHJvcGVydHlOYW1lcyA9IFtdKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaWdub3JlUHJvcGVydHlOYW1lcy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBtaXhpbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZShiYXNlLCBtaXhpbikge1xuXG4gIC8vIFNlZSBpZiB0aGUgKm1peGluKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZSBvZiBpdHMgb3duLlxuICBsZXQgbWl4aW5Jc0NsYXNzID0gaXNDbGFzcyhtaXhpbik7XG4gIGxldCBtaXhpbkJhc2UgPSBtaXhpbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yIDpcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YobWl4aW4pO1xuICBpZiAobWl4aW5CYXNlICYmXG4gICAgICBtaXhpbkJhc2UgIT09IEZ1bmN0aW9uICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdCAmJlxuICAgICAgbWl4aW5CYXNlICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgLy8gVGhlIG1peGluIGl0c2VsZiBkZXJpdmVzIGZyb20gYW5vdGhlciBjbGFzcy9vYmplY3QuXG4gICAgLy8gUmVjdXJzZSwgYW5kIGV4dGVuZCB3aXRoIHRoZSBtaXhpbidzIGJhc2UgZmlyc3QuXG4gICAgYmFzZSA9IGNvbXBvc2UoYmFzZSwgbWl4aW5CYXNlKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgZXh0ZW5kZWQgb2JqZWN0IHdlJ3JlIGdvaW5nIHRvIHJldHVybiBhcyBhIHJlc3VsdC5cbiAgbGV0IGJhc2VJc0NsYXNzID0gaXNDbGFzcyhiYXNlKTtcbiAgbGV0IHJlc3VsdCA9IGJhc2VJc0NsYXNzID9cbiAgICBjcmVhdGVTdWJjbGFzcyhiYXNlKSA6XG4gICAgT2JqZWN0LmNyZWF0ZShiYXNlKTtcblxuICAvLyBDaGVjayB0byBtYWtlIHN1cmUgd2UncmUgbm90IGV4dGVuZGluZyB0aGUgYmFzZSB3aXRoIGEgcHJvdG90eXBlIHRoYXQgd2FzXG4gIC8vIGFscmVhZHkgY29tcG9zZWQgaW50byB0aGUgb2JqZWN0J3MgcHJvdG90eXBlIGNoYWluLlxuICBsZXQgYmFzZVByb3RvdHlwZSA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICBsZXQgbWl4aW5Qcm90b3R5cGUgPSBtaXhpbklzQ2xhc3MgPyBtaXhpbi5wcm90b3R5cGUgOiBtaXhpbjtcbiAgaWYgKG9iamVjdEhhc1Byb3RvdHlwZShiYXNlUHJvdG90eXBlLCBtaXhpblByb3RvdHlwZSlcbiAgICAgIHx8IG9iamVjdEhhc01peGluKGJhc2VQcm90b3R5cGUsIG1peGluKSkge1xuICAgIC8vIFNraXAgdGhpcyBtaXhpbiwgcmV0dXJuIHJlc3VsdCBhcyBpcy5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gVGhlIFwidGFyZ2V0XCIgaGVyZSBpcyB0aGUgdGFyZ2V0IG9mIG91ciBwcm9wZXJ0eS9tZXRob2QgY29tcG9zaXRpb24gcnVsZXMuXG4gIGxldCB0YXJnZXQ7XG4gIGlmIChiYXNlSXNDbGFzcyAmJiBtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBjbGFzczogY29weSBzdGF0aWMgbWVtYmVycywgdGhlbiBwcm90b3R5cGUgbWVtYmVycy5cbiAgICBjb3B5T3duUHJvcGVydGllcyhtaXhpbiwgcmVzdWx0LCBOT05fTUlYQUJMRV9GVU5DVElPTl9QUk9QRVJUSUVTKTtcbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbi5wcm90b3R5cGUsIHJlc3VsdC5wcm90b3R5cGUsIE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTKTtcbiAgfSBlbHNlIGlmICghYmFzZUlzQ2xhc3MgJiYgbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIHBsYWluIG9iamVjdCB3aXRoIGNsYXNzOiBjb3B5IHByb3RvdHlwZSBtZXRob2RzIHRvIHJlc3VsdC5cbiAgICB0YXJnZXQgPSBjb3B5T3duUHJvcGVydGllcyhtaXhpbi5wcm90b3R5cGUsIHJlc3VsdCwgTk9OX01JWEFCTEVfRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIW1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdDogY29weSBtaXhpbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIHRhcmdldCA9IGNvcHlPd25Qcm9wZXJ0aWVzKG1peGluLCByZXN1bHQucHJvdG90eXBlLCBOT05fTUlYQUJMRV9PQkpFQ1RfUFJPUEVSVElFUyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIHBsYWluIG9iamVjdCB3aXRoIHBsYWluIG9iamVjdDogY29weSBmb3JtZXIgdG8gbGF0dGVyLlxuICAgIHRhcmdldCA9IGNvcHlPd25Qcm9wZXJ0aWVzKG1peGluLCByZXN1bHQsIE5PTl9NSVhBQkxFX09CSkVDVF9QUk9QRVJUSUVTKTtcbiAgfVxuXG4gIGlmIChtaXhpbi5uYW1lKSB7XG4gICAgLy8gVXNlIHRoZSBtaXhpbidzIG5hbWUgKHVzdWFsbHkgdGhlIG5hbWUgb2YgYSBjbGFzcycgY29uc3RydWN0b3IpIHRvXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSB0aXAgb2YgdGhlIG5ld2x5LWV4dGVuZGVkIHByb3RvdHlwZSBjaGFpbi5cbiAgICAvLyBTZWUgbm90ZXMgYXQgQ29tcG9zYWJsZSdzIFwicHJvdG90eXBlc1wiIHByb3BlcnR5LlxuICAgIHRhcmdldC5wcm90b3R5cGVzID0ge307XG4gICAgdGFyZ2V0LnByb3RvdHlwZXNbbWl4aW4ubmFtZV0gPSB0YXJnZXQ7XG5cbiAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlcmNsYXNzL3N1cGVyLW9iamVjdC4gU2VlIHRoZSBjb21tZW50cyBvblxuICAgIC8vIENvbXBvc2FibGUncyBcInN1cGVyXCIgcHJvcGVydHkuXG4gICAgdGFyZ2V0LnN1cGVyID0gYmFzZUlzQ2xhc3MgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2U7XG4gIH1cblxuICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBtaXhpbiB0aGF0IHdhcyBjb21wb3NlZCBpbiBhdCB0aGlzIHBvaW50LlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBPUklHSU5BTF9NSVhJTl9TWU1CT0wsIHtcbiAgICB2YWx1ZTogbWl4aW5cbiAgfSk7XG5cbiAgLy8gQXBwbHkgdGhlIGNvbXBvc2l0aW9uIHJ1bGVzIGluIGVmZmVjdCBhdCB0aGUgdGFyZ2V0LlxuICBhcHBseUNvbXBvc2l0aW9uUnVsZXModGFyZ2V0KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mgb2YgdGhlIGdpdmVuIGJhc2UgY2xhc3MuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YmNsYXNzKGJhc2UpIHtcbiAgLy8gT25jZSBXZWJLaXQgc3VwcG9ydHMgSFRNTEVsZW1lbnQgYXMgYSByZWFsIGNsYXNzLCB3ZSBjYW4ganVzdCBzYXk6XG4gIC8vXG4gIC8vICAgY2xhc3Mgc3ViY2xhc3MgZXh0ZW5kcyBiYXNlIHt9XG4gIC8vXG4gIC8vIEhvd2V2ZXIsIHVudGlsIHRoYXQncyByZXNvbHZlZCwgd2UganVzdCBjb25zdHJ1Y3QgdGhlIGNsYXNzIG91cnNlbHZlcy5cbiAgZnVuY3Rpb24gc3ViY2xhc3MoKSB7fTtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YmNsYXNzLCBiYXNlKTtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YmNsYXNzLnByb3RvdHlwZSwgYmFzZS5wcm90b3R5cGUpO1xuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cblxuLypcbiAqIEV4YW1pbmUgdGhlIGRlc2NyaXB0b3IgdG8gZGV0ZXJtaW5lIHdoaWNoIHJ1bGUga2V5IGFwcGxpZXMuXG4gKi9cbmZ1bmN0aW9uIGdldEdlbmVyYWxEZXNjcmlwdG9yS2V5KGRlc2NyaXB0b3IpIHtcbiAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gTWV0aG9kXG4gICAgcmV0dXJuICdfX21ldGhvZF9fJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbidcbiAgICAgIHx8IHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFByb3BlcnR5IHdpdGggZ2V0dGVyIGFuZC9vciBzZXR0ZXJcbiAgICByZXR1cm4gJ19fcHJvcGVydHlfXyc7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cblxuLypcbiAqIFJldHVybiB0cnVlIGlmIGMgaXMgYSBKYXZhU2NyaXB0IGNsYXNzLlxuICpcbiAqIFdlIHVzZSB0aGlzIHRlc3QgYmVjYXVzZSwgb24gV2ViS2l0LCBjbGFzc2VzIGxpa2UgSFRNTEVsZW1lbnQgYXJlIHNwZWNpYWwsXG4gKiBhbmQgYXJlIG5vdCBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRvIGhhbmRsZSB0aGF0IGNhc2UsIHdlIHVzZSBhIGxvb3NlclxuICogZGVmaW5pdGlvbjogYW4gb2JqZWN0IGlzIGEgY2xhc3MgaWYgaXQgaGFzIGEgcHJvdG90eXBlLCBhbmQgdGhhdCBwcm90b3R5cGVcbiAqIGhhcyBhIGNvbnN0cnVjdG9yIHRoYXQgaXMgdGhlIG9yaWdpbmFsIG9iamVjdC4gVGhpcyBjb25kaXRpb24gaG9sZHMgdHJ1ZSBldmVuXG4gKiBmb3IgSFRNTEVsZW1lbnQgb24gV2ViS2l0LlxuICovXG5mdW5jdGlvbiBpc0NsYXNzKGMpIHtcbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nIHx8ICAgICAgICAgICAgICAgICAgIC8vIFN0YW5kYXJkXG4gICAgICAoYy5wcm90b3R5cGUgJiYgYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09IGMpOyAvLyBIVE1MRWxlbWVudCBpbiBXZWJLaXRcbn1cblxuXG4vKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIG9iamVjdCBlaXRoZXIgaGFzIHRoZSBnaXZlbiBwcm90b3R5cGUgb24gaXRzXG4gKiBjaGFpbi5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0SGFzUHJvdG90eXBlKG9iaiwgcHJvdG90eXBlKSB7XG4gIGlmIChwcm90b3R5cGUuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgIC8vIFRoZSBwcm90b3R5cGUgaXMgYSBwbGFpbiBvYmplY3QuXG4gICAgLy8gT25seSBjYXNlIHRvIGRlZmVuZCBhZ2FpbnN0IGlzIHNvbWVvbmUgdHJ5aW5nIHRvIG1peGluIE9iamVjdCBpdHNlbGYuXG4gICAgcmV0dXJuIChwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUpO1xuICB9XG4gIGlmIChvYmogPT09IHByb3RvdHlwZSB8fCBvYmogaW5zdGFuY2VvZiBwcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAvLyBUaGUgcHJvdG90eXBlIHdhcyBmb3VuZCBhbG9uZyB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIG1peGluIHdhcyB1c2VkIHRvIGNyZWF0ZSBhbnkgb2YgdGhlIHByb3RvdHlwZXMgb25cbiAqIG9uIHRoZSBvYmplY3QncyBwcm90b3R5cGUgY2hhaW4uXG4gKi9cbmZ1bmN0aW9uIG9iamVjdEhhc01peGluKG9iaiwgbWl4aW4pIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgT1JJR0lOQUxfTUlYSU5fU1lNQk9MKTtcbiAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZSA9PT0gbWl4aW4pIHtcbiAgICAvLyBUaGUgZ2l2ZW4gbWl4aW4gd2FzLCBpbiBmYWN0LCBjb21wb3NlZCBpbnRvIHRoaXMgcHJvdG90eXBlIGNoYWluLlxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBvYmplY3RIYXNNaXhpbihPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSwgbWl4aW4pO1xufVxuIiwiLyoqXG4gKiBTdGFuZGFyZCBjb21wb3NpdGlvbiBydWxlc1xuICovXG5cblxuLypcbiAqIERlZmF1bHQgcnVsZSBmb3IgY29tcG9zaW5nIG1ldGhvZHM6IGludm9rZSBiYXNlIGZpcnN0LCB0aGVuIG1peGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFzZU1ldGhvZEZpcnN0KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VEZXNjcmlwdG9yID0gZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gYmFzZURlc2NyaXB0b3IudmFsdWU7XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBjb21wb3NlRnVuY3Rpb24oYmFzZUltcGxlbWVudGF0aW9uLCBtaXhpbkltcGxlbWVudGF0aW9uKTtcbn1cblxuXG4vKlxuICogRGVmYXVsdCBydWxlIGZvciBjb21wb3NpbmcgcHJvcGVydGllcy5cbiAqIFdlIG9ubHkgY29tcG9zZSBzZXR0ZXJzLCB3aGljaCBpbnZva2UgYmFzZSBmaXJzdCwgdGhlbiBtaXhpbi5cbiAqIEEgZGVmaW5lZCBtaXhpbiBnZXR0ZXIgb3ZlcnJpZGVzIGEgYmFzZSBnZXR0ZXIuXG4gKiBOb3RlIHRoYXQsIGJlY2F1c2Ugb2YgdGhlIHdheSBwcm9wZXJ0eSBkZXNjcmlwdG9ycyB3b3JrLCBpZiB0aGUgbWl4aW4gb25seVxuICogZGVmaW5lcyBhIHNldHRlciwgYnV0IG5vdCBhIGdldHRlciwgd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IGdldHRlciB0aGF0XG4gKiBpbnZva2VzIHRoZSBiYXNlIGdldHRlci4gU2ltaWxhcmx5LCBpZiB0aGUgbWl4aW4ganVzdCBkZWZpbmVzIGEgZ2V0dGVyLFxuICogd2UgaGF2ZSB0byBzdXBwbHkgYSBkZWZhdWx0IHNldHRlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2VTZXR0ZXJGaXJzdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5TZXR0ZXIgPSBkZXNjcmlwdG9yLnNldDtcbiAgbGV0IGJhc2VEZXNjcmlwdG9yID0gZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZVNldHRlciA9IGJhc2VEZXNjcmlwdG9yLnNldDtcbiAgaWYgKG1peGluU2V0dGVyICYmIGJhc2VTZXR0ZXIpIHtcbiAgICAvLyBDb21wb3NlIHNldHRlcnMuXG4gICAgZGVzY3JpcHRvci5zZXQgPSBjb21wb3NlRnVuY3Rpb24oYmFzZVNldHRlciwgbWl4aW5TZXR0ZXIpO1xuICB9XG4gIGNvbXBsZXRlUHJvcGVydHlEZWZpbml0aW9uKGRlc2NyaXB0b3IsIGJhc2VEZXNjcmlwdG9yKTtcbn1cblxuXG4vKlxuICogVGFrZSB0d28gZnVuY3Rpb25zIGFuZCByZXR1cm4gYSBuZXcgY29tcG9zZWQgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGJvdGguXG4gKiBUaGUgY29tcG9zZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBub3QgYSBydWxlLCBidXQgYSBoZWxwZXIgdXNlZCBieSBydWxlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VGdW5jdGlvbihmdW5jdGlvbjEsIGZ1bmN0aW9uMikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24xLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5cbi8qXG4gKiBDb21iaW5hdG9yIHRoYXQgc2V0cyB0aGUgcHJvdG90eXBlIG9mIGEgbWl4aW4gcHJvcGVydHkgdmFsdWUgdG8gYmUgdGhlXG4gKiBjb3JyZXNwb25kaW5nIHZhbHVlIG9uIHRoZSBiYXNlLiBUaGlzIGVmZmVjdGl2ZWx5IGRvZXMgYSBzaGFsbG93IG1lcmdlIG9mXG4gKiBvZiB0aGUgcHJvcGVydGllcywgd2l0aG91dCBjb3B5aW5nIGFueSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoYWluUHJvdG90eXBlcyh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5WYWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBrZXkpO1xuICBsZXQgYmFzZVZhbHVlID0gYmFzZURlc2NyaXB0b3IudmFsdWU7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihtaXhpblZhbHVlLCBiYXNlVmFsdWUpO1xufVxuXG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29tcGxldGUgYSBwcm9wZXJ0eSBkZWZpbml0aW9uIGZvciBhIG1peGluLlxuICpcbiAqIERlZmF1bHQgSmF2YVNjcmlwdCBiZWhhdmlvciBpcyB0aGF0IGEgc3ViY2xhc3MgdGhhdCBkZWZpbmVzIGEgZ2V0dGVyIGJ1dCBub3RcbiAqIGEgc2V0dGVyIHdpbGwgbmV2ZXIgaGF2ZSB0aGUgYmFzZSBjbGFzcycgc2V0dGVyIGludm9rZWQuIFNpbWlsYXJseSwgYVxuICogc3ViY2xhc3MgdGhhdCBkZWZpbmVzIGEgc2V0dGVyIGJ1dCBub3QgYSBnZXR0ZXIgd2lsbCBuZXZlciBoYXZlIHRoZSBiYXNlXG4gKiBjbGFzcycgZ2V0dGVyIGludm9rZWQuXG4gKlxuICogRm9yIG1peGlucywgd2Ugd2FudCB0aGUgZGVmYXVsdCBiZWhhdmlvciB0byBiZSB0aGF0LCBpZiBhIG1peGluIG9ubHkgZGVmaW5lc1xuICogYSBnZXR0ZXIsIGJ1dCB0aGUgYmFzZSBjbGFzcyBkZWZpbmVzIGEgc2V0dGVyLCB3ZSB3YW50IHRoZSBtaXhpbiB0byBhY3F1aXJlXG4gKiBhIGRlZmF1bHQgc2V0dGVyIHRoYW4gaW52b2tlcyB0aGUgYmFzZSBzZXR0ZXIuIExpa2V3aXNlLCB3ZSB3YW50IHRvIGRlZmluZVxuICogYSBkZWZhdWx0IGdldHRlciBpZiBub25lIGlzIHN1cHBsaWVkLlxuICpcbiAqIFRvIGNhcnJ5IHRoYXQgb3V0LCB0aGlzIGhlbHBlciBmdW5jdGlvbiByb3VuZHMgb3V0IGEgcHJvcGVydHkgZGVmaW5pdGlvbiB0b1xuICogZW5zdXJlIGl0IGhhcyBhIGRlZmF1bHQgZ2V0dGVyIG9yIHNldHRlciBpZiBpdCBuZWVkcyBvbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wbGV0ZVByb3BlcnR5RGVmaW5pdGlvbihkZXNjcmlwdG9yLCBiYXNlRGVzY3JpcHRvcikge1xuICBpZiAoZGVzY3JpcHRvci5nZXQgJiYgIWRlc2NyaXB0b3Iuc2V0ICYmIGJhc2VEZXNjcmlwdG9yLnNldCkge1xuICAgIC8vIE1peGluIGhhcyBnZXR0ZXIgYnV0IG5lZWRzIGEgZGVmYXVsdCBzZXR0ZXIuXG4gICAgbGV0IGJhc2VTZXR0ZXIgPSBiYXNlRGVzY3JpcHRvci5zZXQ7XG4gICAgZGVzY3JpcHRvci5zZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgYmFzZVNldHRlci5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9O1xuICB9XG4gIGlmIChkZXNjcmlwdG9yLnNldCAmJiAhZGVzY3JpcHRvci5nZXQgJiYgYmFzZURlc2NyaXB0b3IuZ2V0KSB7XG4gICAgLy8gTWl4aW4gaGFzIHNldHRlciBidXQgbmVlZHMgYSBkZWZhdWx0IGdldHRlci5cbiAgICBsZXQgYmFzZUdldHRlciA9IGJhc2VEZXNjcmlwdG9yLmdldDtcbiAgICBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGJhc2VHZXR0ZXIuY2FsbCh0aGlzKTtcbiAgICB9O1xuICB9XG59XG5cblxuLypcbiAqIEhlbHBlciB0byByZXR1cm4gdGhlIGJhc2UgZGVzY3JpcHRvciBmb3IgdGhlIGluZGljYXRlZCBrZXkuIFRoaXMgaXMgdXNlZCB0b1xuICogZmluZCB0aGUgc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gdGhhdCB3b3VsZCBvdGhlcndpc2UgYmUgb3ZlcnJpZGRlbiBieSB0aGVcbiAqIG1peGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcbiAgbGV0IGJhc2UgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBrZXkpO1xufVxuXG5cbi8qXG4gKiBMaWtlIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoKSwgYnV0IHdhbGtzIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKiBUaGlzIGlzIG5lZWRlZCBieSBjb21wb3NpdGlvbiBydWxlcywgd2hpY2ggdXN1YWxseSBzdGFydCBvdXQgYnkgZ2V0dGluZ1xuICogdGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYSBtZW1iZXIgdGhleSdyZSBjb21wb3NpbmcuXG4gKiBUaGlzIGlzIG5vdCBhIHJ1bGUsIGJ1dCBhIGhlbHBlciB1c2VkIGJ5IHJ1bGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgbmFtZSkge1xuICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcbiAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgLy8gQ2hlY2tpbmcgZm9yIFwibmFtZSBpbiBwcm90b3R5cGVcIiBsZXRzIHVzIGtub3cgd2hldGhlciB3ZSBzaG91bGQgYm90aGVyXG4gICAgLy8gd2Fsa2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIGlmIChwcm90b3R5cGUgJiYgbmFtZSBpbiBwcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gTm90IGZvdW5kXG59XG5cblxuLypcbiAqIENvbWJpbmF0b3IgdGhhdCBjYXVzZXMgYSBtaXhpbiBtZXRob2QgdG8gb3ZlcnJpZGUgaXRzIGJhc2UgaW1wbGVtZW50YXRpb24uXG4gKiBTaW5jZSB0aGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBwcm90b3R5cGUgY2hhaW4sIHRoaXMgaXMgYSBuby1vcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG92ZXJyaWRlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7fVxuXG5cbi8qXG4gKiBDb21wb3NlIG1ldGhvZHMsIGludm9raW5nIGJhc2UgaW1wbGVtZW50YXRpb24gZmlyc3QuIElmIGl0IHJldHVybnMgYVxuICogdHJ1dGh5IHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZCBpbW1lZGlhdGVseS4gT3RoZXJ3aXNlLCB0aGUgbWl4aW5cbiAqIGltcGxlbWVudGF0aW9uJ3MgcmVzdWx0IGlzIHJldHVybmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVyQmFzZVJlc3VsdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5JbXBsZW1lbnRhdGlvbiA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VJbXBsZW1lbnRhdGlvbiA9IGJhc2VEZXNjcmlwdG9yLnZhbHVlO1xuICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJhc2VJbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHx8IG1peGluSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuXG4vKlxuICogTGlrZSBwcmVmZXJCYXNlUmVzdWx0LCBidXQgZm9yIGdldHRlci9zZXR0ZXJzLiBUaGUgYmFzZSBnZXR0ZXIgaXMgaW52b2tlZFxuICogZmlyc3QuIElmIGl0IHJldHVybnMgYSB0cnV0aHkgcmVzdWx0LCB0aGF0IGlzIHJldHVybmVkLiBPdGhlcndpc2UsIHRoZSBtaXhpblxuICogZ2V0dGVyJ3MgcmVzdWx0IGlzIHJldHVybmVkLiBTZXR0ZXIgaXMgaW52b2tlZCBiYXNlIGZpcnN0LCB0aGVuIG1peGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVyQmFzZUdldHRlcih0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5HZXR0ZXIgPSBkZXNjcmlwdG9yLmdldDtcbiAgbGV0IG1peGluU2V0dGVyID0gZGVzY3JpcHRvci5zZXQ7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VHZXR0ZXIgPSBiYXNlRGVzY3JpcHRvci5nZXQ7XG4gIGxldCBiYXNlU2V0dGVyID0gYmFzZURlc2NyaXB0b3Iuc2V0O1xuICBpZiAobWl4aW5HZXR0ZXIgJiYgYmFzZUdldHRlcikge1xuICAgIC8vIENvbXBvc2UgZ2V0dGVycy5cbiAgICBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGJhc2VHZXR0ZXIuYXBwbHkodGhpcykgfHwgbWl4aW5HZXR0ZXIuYXBwbHkodGhpcyk7XG4gICAgfTtcbiAgfVxuICBpZiAobWl4aW5TZXR0ZXIgJiYgYmFzZVNldHRlcikge1xuICAgIC8vIENvbXBvc2Ugc2V0dGVycy5cbiAgICBkZXNjcmlwdG9yLnNldCA9IGNvbXBvc2VGdW5jdGlvbihiYXNlU2V0dGVyLCBtaXhpblNldHRlcik7XG4gIH1cbiAgY29tcGxldGVQcm9wZXJ0eURlZmluaXRpb24oZGVzY3JpcHRvciwgYmFzZURlc2NyaXB0b3IpO1xufVxuXG5cbi8qXG4gKiBMaWtlIHByZWZlck1peGluUmVzdWx0LCBidXQgZm9yIGdldHRlci9zZXR0ZXJzLiBUaGUgbWl4aW4gZ2V0dGVyIGlzIGludm9rZWRcbiAqIGZpcnN0LiBJZiBpdCByZXR1cm5zIGEgdHJ1dGh5IHJlc3VsdCwgdGhhdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCB0aGUgYmFzZVxuICogZ2V0dGVyJ3MgcmVzdWx0IGlzIHJldHVybmVkLiBTZXR0ZXIgaXMgc3RpbGwgaW52b2tlZCBiYXNlIGZpcnN0LCB0aGVuIG1peGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVyTWl4aW5HZXR0ZXIodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG4gIGxldCBtaXhpblNldHRlciA9IGRlc2NyaXB0b3Iuc2V0O1xuICBsZXQgYmFzZURlc2NyaXB0b3IgPSBnZXRCYXNlRGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gIGxldCBiYXNlR2V0dGVyID0gYmFzZURlc2NyaXB0b3IuZ2V0O1xuICBsZXQgYmFzZVNldHRlciA9IGJhc2VEZXNjcmlwdG9yLnNldDtcbiAgaWYgKG1peGluR2V0dGVyICYmIGJhc2VHZXR0ZXIpIHtcbiAgICAvLyBDb21wb3NlIGdldHRlcnMuXG4gICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtaXhpbkdldHRlci5hcHBseSh0aGlzKSB8fCBiYXNlR2V0dGVyLmFwcGx5KHRoaXMpO1xuICAgIH07XG4gIH1cbiAgaWYgKG1peGluU2V0dGVyICYmIGJhc2VTZXR0ZXIpIHtcbiAgICAvLyBDb21wb3NlIHNldHRlcnMuXG4gICAgZGVzY3JpcHRvci5zZXQgPSBjb21wb3NlRnVuY3Rpb24oYmFzZVNldHRlciwgbWl4aW5TZXR0ZXIpO1xuICB9XG4gIGNvbXBsZXRlUHJvcGVydHlEZWZpbml0aW9uKGRlc2NyaXB0b3IsIGJhc2VEZXNjcmlwdG9yKTtcbn1cblxuXG4vKlxuICogQ29tcG9zZSBtZXRob2RzLCBpbnZva2luZyBtaXhpbiBpbXBsZW1lbnRhdGlvbiBmaXJzdC4gSWYgaXQgcmV0dXJucyBhIHRydXRoeVxuICogcmVzdWx0LCB0aGF0IGlzIHJldHVybmVkIGltbWVkaWF0ZWx5LiBPdGhlcndpc2UsIHRoZSBiYXNlIGltcGxlbWVudGF0aW9uJ3NcbiAqIHJlc3VsdCBpcyByZXR1cm5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWZlck1peGluUmVzdWx0KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgbGV0IGJhc2VEZXNjcmlwdG9yID0gZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZUltcGxlbWVudGF0aW9uID0gYmFzZURlc2NyaXB0b3IudmFsdWU7XG4gIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWl4aW5JbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHx8IGJhc2VJbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG59XG5cblxuLypcbiAqIFBlcmZvcm0gYSBzaGFsbG93IG1lcmdlIG9mIGEgbWl4aW4gcHJvcGVydHkgb24gdG9wIG9mIGEgYmFzZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3dNZXJnZSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICBsZXQgbWl4aW5WYWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IGdldEJhc2VEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgbGV0IGJhc2VWYWx1ZSA9IGJhc2VEZXNjcmlwdG9yLnZhbHVlO1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGNvcHlQcm9wZXJ0aWVzKGJhc2VWYWx1ZSwgcmVzdWx0KTtcbiAgY29weVByb3BlcnRpZXMobWl4aW5WYWx1ZSwgcmVzdWx0KTtcbiAgZGVzY3JpcHRvci52YWx1ZSA9IHJlc3VsdDtcbn1cblxuXG4vKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcHkgcHJvcGVydGllcyBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cbiAqL1xuZnVuY3Rpb24gY29weVByb3BlcnRpZXMoc291cmNlLCBkZXN0aW5hdGlvbikge1xuICBmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG4gICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG59XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgY29tcG9zYWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gQ29tcG9zYWJsZS5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICdDb21wb3NhYmxlL3NyYy9Db21wb3NhYmxlJztcblxuXG4vLyBXZSB1c2UgRXh0ZW5zaWJsZSB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHdpdGggLmNvbXBvc2UoKSBzdXBwb3J0LlxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwoXG4gIEhUTUxFbGVtZW50LFxuICBDb21wb3NhYmxlXG4pO1xuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuXG5pbXBvcnQgQ29tcG9zYWJsZUVsZW1lbnQgZnJvbSAnLi9Db21wb3NhYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgQ29tcG9zYWJsZUVsZW1lbnQuY29tcG9zZShcbiAgVGVtcGxhdGVTdGFtcGluZywgICAgIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKSB7XG5cbiAgLypcbiAgICogRGVidWdnaW5nIHV0aWxpdHk6IGxvZ3MgYSBtZXNzYWdlLCBwcmVmaXhlZCBieSB0aGUgY29tcG9uZW50J3MgdGFnLlxuICAgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBDb21wb3NpdGlvblJ1bGVzIGZyb20gJ0NvbXBvc2FibGUvc3JjL0NvbXBvc2l0aW9uUnVsZXMnO1xuXG4vLyBHaXZlbiB0d28gdGVtcGxhdGVzLCBcImZvbGRcIiBvbmUgaW5zaWRlIHRoZSBvdGhlci4gRm9yIG5vdywgdGhpcyBqdXN0IGVudGFpbHNcbi8vIHB1dHRpbmcgdGhlIGZpcnN0IGluc2lkZSB0aGUgbG9jYXRpb24gb2YgdGhlIGZpcnN0IDxjb250ZW50PiBub2RlIGluIHRoZVxuLy8gc2Vjb25kIHRlbXBsYXRlLlxuLy9cbi8vIEV4YW1wbGU6IGlmIHRoZSBmaXJzdCAoc3ViKSB0ZW1wbGF0ZSBpc1xuLy9cbi8vICAgPHRlbXBsYXRlPlxuLy8gICAgIEhlbGxvLCA8Y29udGVudD48L2NvbnRlbnQ+LlxuLy8gICA8L3RlbXBsYXRlPlxuLy9cbi8vIGFuZCB0aGUgc2Vjb25kIChiYXNlKSB0ZW1wbGF0ZSBpc1xuLy9cbi8vICAgPHRlbXBsYXRlPlxuLy8gICAgIDxiPlxuLy8gICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PlxuLy8gICAgIDwvYj5cbi8vICAgPC90ZW1wbGF0ZT5cbi8vXG4vLyBUaGVuIHRoZSByZXR1cm5lZCBmb2xkZWQgdGVtcGxhdGUgaXNcbi8vXG4vLyAgIDx0ZW1wbGF0ZT5cbi8vICAgICA8Yj5cbi8vICAgICAgIEhlbGxvLCA8Y29udGVudD48L2NvbnRlbnQ+LlxuLy8gICAgIDwvYj5cbi8vICAgPC90ZW1wbGF0ZT5cbi8vXG5leHBvcnQgZnVuY3Rpb24gZm9sZEludG9CYXNlU2xvdHModGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgbGV0IG1peGluR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG4gIGxldCBiYXNlRGVzY3JpcHRvciA9IENvbXBvc2l0aW9uUnVsZXMuZ2V0QmFzZURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICBsZXQgYmFzZUdldHRlciA9IGJhc2VEZXNjcmlwdG9yLmdldDtcbiAgaWYgKG1peGluR2V0dGVyICYmIGJhc2VHZXR0ZXIpIHtcblxuICAgIC8vIENvbXBvc2UgZ2V0dGVyc1xuICAgIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIGxldCBtaXhpblRlbXBsYXRlID0gbWFrZVRlbXBsYXRlKG1peGluR2V0dGVyLmNhbGwodGhpcykpO1xuICAgICAgbGV0IGJhc2VUZW1wbGF0ZSA9IG1ha2VUZW1wbGF0ZShiYXNlR2V0dGVyLmNhbGwodGhpcykpO1xuICAgICAgbGV0IG1peGluRWxlbWVudCA9IG1peGluVGVtcGxhdGUgJiYgbWl4aW5UZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGxldCBiYXNlRWxlbWVudCA9IGJhc2VUZW1wbGF0ZSAmJiBiYXNlVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIGxldCBmb2xkZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAvLyBGb2xkIG1peGluIHRlbXBsYXRlIGludG8gZmlyc3Qgc2xvdCBlbGVtZW50IGluIGJhc2UgdGVtcGxhdGUuXG4gICAgICAvLyBUT0RPOiBTdXBwb3J0IG5hbWVkIHNsb3RzLlxuICAgICAgbGV0IHNsb3ROb2RlID0gYmFzZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2xvdCcpO1xuICAgICAgaWYgKHNsb3ROb2RlKSB7XG4gICAgICAgIHNsb3ROb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1peGluRWxlbWVudCwgc2xvdE5vZGUpO1xuICAgICAgICBmb2xkZWQuY29udGVudC5hcHBlbmRDaGlsZChiYXNlRWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBwbGFjZSBpbiBiYXNlIGZvciBtaXhpbiB0ZW1wbGF0ZSAtLSB0aHJvdyBtaXhpbiB0ZW1wbGF0ZSBhd2F5LlxuICAgICAgICBmb2xkZWQuY29udGVudC5hcHBlbmRDaGlsZChiYXNlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb2xkZWQ7XG4gICAgfTtcbiAgICBcbiAgfVxuICBDb21wb3NpdGlvblJ1bGVzLmNvbXBsZXRlUHJvcGVydHlEZWZpbml0aW9uKGRlc2NyaXB0b3IsIGJhc2VEZXNjcmlwdG9yKTtcbn1cblxuXG5mdW5jdGlvbiBtYWtlVGVtcGxhdGUoaHRtbE9yVGVtcGxhdGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBodG1sT3JUZW1wbGF0ZSA9PT0gJ3N0cmluZycgP1xuICAgIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChodG1sT3JUZW1wbGF0ZSkgOlxuICAgIGh0bWxPclRlbXBsYXRlO1xufVxuXG5cbi8vIFRPRE86IFNoYXJlIHdpdGggVGVtcGxhdGVTdGFtcGluZy5cbi8vIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqXG4gKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgZXh0ZW5zaW9uIHJldGFpbnMgc3VwcG9ydCBmb3IgU2hhZG93IERPTSB2MC5cbiAqIFRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAvLyBUT0RPOiBTYXZlIHRoZSBwcm9jZXNzZWQgdGVtcGxhdGUgd2l0aCB0aGUgY29tcG9uZW50J3MgY2xhc3MgcHJvdG90eXBlXG4gICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRlbXBsYXRlKSB7XG5cbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFVTSU5HX1NIQURPV19ET01fVjApIHtcbiAgICAgICAgcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAod2luZG93LlNoYWRvd0RPTVBvbHlmaWxsKSB7XG4gICAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gVVNJTkdfU0hBRE9XX0RPTV9WMCA/XG4gICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpIDogICAgICAgICAgICAgLy8gU2hhZG93IERPTSB2MFxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTsgIC8vIFNoYWRvdyBET00gdjFcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBvbGQgU2hhZG93IERPTSB2MC5cbmNvbnN0IFVTSU5HX1NIQURPV19ET01fVjAgPSAodHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jcmVhdGVTaGFkb3dSb290ICE9PSAndW5kZWZpbmVkJyk7XG5cblxuLy8gQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXBsYWNlIG9jY3VyZW5jZXMgb2YgdjEgc2xvdCBlbGVtZW50cyB3aXRoIHYwIGNvbnRlbnQgZWxlbWVudHMuXG4vLyBUaGlzIGRvZXMgbm90IHlldCBtYXAgbmFtZWQgc2xvdHMgdG8gY29udGVudCBzZWxlY3QgY2xhdXNlcy5cbmZ1bmN0aW9uIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKSB7XG4gIFtdLmZvckVhY2guY2FsbCh0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Nsb3QnKSwgc2xvdEVsZW1lbnQgPT4ge1xuICAgIGxldCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKTtcbiAgICBzbG90RWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250ZW50RWxlbWVudCwgc2xvdEVsZW1lbnQpO1xuICB9KTtcbn1cblxuLy8gSW52b2tlIGJhc2ljIHN0eWxlIHNoaW1taW5nIHdpdGggU2hhZG93Q1NTLlxuZnVuY3Rpb24gc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0YWcpIHtcbiAgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiJdfQ==
