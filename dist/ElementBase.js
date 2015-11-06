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
  }, {
    key: 'invokeBaseFirst',
    value: function invokeBaseFirst(target, key, descriptor) {
      var mixinImplementation = descriptor.value;
      var base = Object.getPrototypeOf(target);
      var baseImplementation = base[key];
      descriptor.value = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        baseImplementation.apply(this, args);
        return mixinImplementation.apply(this, args);
      };
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
    return Composable.invokeBaseFirst;
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

},{}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"../extensible/Composable":1}],5:[function(require,module,exports){
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

},{"./AttributeMarshalling":2,"./AutomaticNodeFinding":3,"./ComposableElement":4,"./TemplateStamping":6}],6:[function(require,module,exports){
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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0NvbXBvc2FibGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvQ29tcG9zYWJsZUVsZW1lbnQuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztBQUViLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtBQUFFLFdBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUFFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQUUsVUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxBQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEFBQUMsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEFBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUFFO0dBQUUsQUFBQyxPQUFPLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7QUFBRSxRQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEFBQUMsSUFBSSxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsV0FB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LDJCQUEyQixDQUFDLFNBQVMsRUFBRTtBQUM5QyxNQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQzs7OztBQUFBLEFBQUMsTUFJOUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsS0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDMUIsU0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDaEMsWUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2pEO0FBQ0QsU0FBTyxRQUFRLENBQUM7Q0FDakI7Ozs7QUFBQSxTQUlRLHVCQUF1QixDQUFDLFFBQVEsRUFBRTtBQUN6QyxJQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUEsV0FBVyxFQUFJO0FBQ3hFLFFBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkQsZUFBVyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0dBQ2xFLENBQUMsQ0FBQztDQUNKOzs7QUFBQSxTQUdRLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7QUFDekMsZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztDQUM1RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5cbmNsYXNzIENvbXBvc2FibGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xLCBNaXhpbjIsIE1peGluMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgbWl4aW5zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xKS5jb21wb3NlKE1peGluMikuY29tcG9zZShNaXhpbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHM6XG4gICAqXG4gICAqICAgbGV0IGV4dGVuZGVkID0gQ29tcG9zYWJsZS5leHRlbmQuY2FsbChvYmoxLCBvYmoyKTtcbiAgICpcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKC4uLm1peGlucykge1xuICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcyBmb3IgZWFjaCBtaXhpbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAvLyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBtaXhpbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBtaXhpbnMucmVkdWNlKGNvbXBvc2UsIHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGludm9rZUJhc2VGaXJzdCh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICBsZXQgYmFzZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICAgIGxldCBiYXNlSW1wbGVtZW50YXRpb24gPSBiYXNlW2tleV07XG4gICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGJhc2VJbXBsZW1lbnRhdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIHJldHVybiBtaXhpbkltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBkZWNvcmF0ZShkZWNvcmF0b3JzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGRlY29yYXRvcnMpIHtcbiAgICAgIGxldCBkZWNvcmF0b3IgPSBkZWNvcmF0b3JzW2tleV07XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywga2V5KTtcbiAgICAgIGRlY29yYXRvcih0aGlzLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgZGVjb3JhdGUoZGVjb3JhdG9ycykge1xuICAgIENvbXBvc2FibGUuZGVjb3JhdGUuY2FsbCh0aGlzLCBkZWNvcmF0b3JzKTtcbiAgfVxuXG4gIC8vIERlY29yYXRlIGZvciBhbm5vdGF0aW5nIGhvdyBhIGNsYXNzIG1lbWJlciBzaG91bGQgYmUgY29tcG9zZWQgbGF0ZXIuXG4gIC8vIFRoaXMgdGFrZXMgYSBkZWNvcmF0b3IgdGhhdCB3aWxsIGJlIHJ1biBhdCAqY29tcG9zaXRpb24qIHRpbWUuXG4gIC8vIEZvciBub3csIHRoaXMgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBtZXRob2RzLlxuICBzdGF0aWMgcnVsZShkZWNvcmF0b3IpIHtcbiAgICAvLyBXZSByZXR1cm4gYSBkZWNvcmF0b3IgdGhhdCBqdXN0IGFkZHMgdGhlIGRlY29yYXRvciBnaXZlbiBhYm92ZSB0byB0aGVcbiAgICAvLyBtZW1iZXIuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAvLyBUT0RPOiBVc2UgYSBTeW1ib2wgaW5zdGVhZCBvZiBhIHN0cmluZyBwcm9wZXJ0eSBuYW1lIHRvIHNhdmUgdGhpcy5cbiAgICAgIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZSA9IGRlY29yYXRvcjtcbiAgICB9XG4gIH1cblxuICAvLyBDb21iaW5hdG9yIHRoYXQgY2F1c2VzIGEgbWl4aW4gbWV0aG9kIHRvIG92ZXJyaWRlIGl0cyBiYXNlIGltcGxlbWVudGF0aW9uLlxuICAvLyBTaW5jZSB0aGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBwcm90b3R5cGUgY2hhaW4sIHRoaXMgaXMgYSBuby1vcC5cbiAgc3RhdGljIG92ZXJyaWRlKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7fVxuXG59XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMga2VlcCByZWZlcmVuY2VzIHRvIHRoZSBtaXhpbnMgdGhhdCB3ZXJlXG4gKiBhcHBsaWVkIHRvIGNyZWF0ZSB0aGVtLiBXaGVuIGEgKm5hbWVkKiBtaXhpbiBpcyBhcHBsaWVkIHRvIHRoZSBwcm90b3R5cGVcbiAqIGNoYWluLCB0aGUgcmVzdWx0aW5nIG9iamVjdCAob3IsIGZvciBhIGNsYXNzLCB0aGUgY2xhc3MnIHByb3RvdHlwZSkgd2lsbFxuICogaGF2ZSBhIG5ldyBtZW1iZXIgd2l0aCB0aGF0IG5hbWUgdGhhdCBwb2ludHMgYmFjayB0byB0aGUgc2FtZSBvYmplY3QuXG4gKiBUaGF0IGZhY2lsaXR5IGlzIHVzZWZ1bCB3aGVuIGRlYWxpbmcgd2l0aCBjaGFpbnMgdGhhdCBoYXZlIGJlZW4gZXh0ZW5kZWRcbiAqIG1vcmUgdGhhbiBvbmNlLCBhcyBhbiBtaXhpbidzIG5hbWUgaXMgc3VmZmljaWVudCB0byByZXRyaWV2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhhdCBwb2ludCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEEgc2luZ2xlIG1peGluIGNhbiBiZSBhcHBsaWVkIHRvIG11bHRpcGxlIHByb3RvdHlwZSBjaGFpbnMgLS0gdGhlIG5hbWVcbiAqIHJlZmVycyB0byB0aGUgcHJvdG90eXBlIG9uICp0aGlzIHBhcnRpY3VsYXIgcHJvdG90eXBlIGNoYWluKiB0aGF0IHdhcyBhZGRlZFxuICogZm9yIHRoYXQgbWl4aW4uIFRoaXMgbGV0cyBtaXhpbi9taXhpbiBjb2RlIGdldCBiYWNrIHRvIGl0cyBvd25cbiAqIHByb3RvdHlwZSwgbW9zdCBvZnRlbiBpbiBjb21iaW5hdGlvbiB3aXRoIFwic3VwZXJcIiAoc2VlIGJlbG93KSBpbiBvcmRlciB0b1xuICogaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IuXG4gKi9cbkNvbXBvc2FibGUucHJvdG90eXBlLkNvbXBvc2FibGUgPSBDb21wb3NhYmxlLnByb3RvdHlwZTtcblxuLypcbiAqIEFsbCBDb21wb3NhYmxlLWNyZWF0ZWQgb2JqZWN0cyBoYXZlIGEgXCJzdXBlclwiIHByb3BlcnR5IHRoYXQgcmVmZXJlbmNlcyB0aGVcbiAqIHByb3RvdHlwZSBhYm92ZSB0aGVtIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogVGhpcyBcInN1cGVyXCIgcmVmZXJlbmNlIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgRVM2J3MgXCJzdXBlclwiIGtleXdvcmQgaW5cbiAqIGluIEVTNSAob3IgdHJhbnNwaWxlZCBFUzYpIG1peGlucyB0aGF0IHdhbnQgdG8gaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IsXG4gKiB3aGVyZSB0aGUgc3BlY2lmaWMgc3VwZXJjbGFzcyB3aWxsIGRlcGVuZCB1cG9uIHdoaWNoIG1peGlucyBoYXZlIGJlZW4gYXBwbGllZFxuICogdG8gYSBnaXZlbiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogRS5nLjpcbiAqICAgY2xhc3MgTWl4aW4ge1xuICogICAgIGZvbygpIHtcbiAqICAgICAgIGlmICh0aGlzLk1peGluLnN1cGVyLmZvbykge1xuICogICAgICAgICB0aGlzLk1peGluLnN1cGVyLmZvby5jYWxsKHRoaXMpOyAvLyBJbnZva2Ugc3VwZXJjbGFzcycgZm9vKClcbiAqICAgICAgIH1cbiAqICAgICAgIC8vIERvIE1peGluLXNwZWNpZmljIHdvcmsgaGVyZS4uLlxuICogICAgIH1cbiAqICAgfVxuICpcbiAqIEZvciBjb25zaXN0ZW5jeSwgQ29tcG9zYWJsZSBpdHNlbGYgcmVjb3JkcyBpdHMgb3duIHN1cGVyY2xhc3MgYXMgT2JqZWN0LlxuICovXG5Db21wb3NhYmxlLnByb3RvdHlwZS5zdXBlciA9IE9iamVjdC5wcm90b3R5cGU7XG5cblxuQ29tcG9zYWJsZS5wcm90b3R5cGUuY29tcG9zaXRpb25SdWxlcyA9IHtcbiAgY29uc3RydWN0b3I6IENvbXBvc2FibGUub3ZlcnJpZGUsXG4gIHRvU3RyaW5nOiBDb21wb3NhYmxlLm92ZXJyaWRlLFxufTtcblxuXG5mdW5jdGlvbiBhcHBseUNvbXBvc2l0aW9uUnVsZXMob2JqKSB7XG4gIGxldCBiYXNlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAobmFtZSBpbiBiYXNlKSB7XG4gICAgICAvLyBCYXNlIGFsc28gaW1wbGVtZW50cyBhIG1lbWJlciB3aXRoIHRoZSBzYW1lIG5hbWU7IG5lZWQgdG8gY29tYmluZS5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIG5hbWUpO1xuICAgICAgbGV0IHJ1bGUgPSBkZXNjcmlwdG9yLnZhbHVlICYmIGRlc2NyaXB0b3IudmFsdWUuX2NvbXBvc2l0aW9uUnVsZTtcbiAgICAgIGlmICghcnVsZSkge1xuICAgICAgICAvLyBTZWUgaWYgcHJvdG90eXBlIGNoYWluIGhhcyBhIHJ1bGUgZm9yIHRoaXMgbWVtYmVyLlxuICAgICAgICBydWxlID0gb2JqLmNvbXBvc2l0aW9uUnVsZXNbbmFtZV07XG4gICAgICB9XG4gICAgICBpZiAoIXJ1bGUpIHtcbiAgICAgICAgcnVsZSA9IGdldERlZmF1bHRDb21wb3NpdGlvblJ1bGUoZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICAvLyBcIm92ZXJyaWRlXCIgaXMgYSBrbm93biBuby1vcCwgc28gd2UgZG9uJ3QgYm90aGVyIHRyeWluZyB0byByZWRlZmluZSB0aGVcbiAgICAgIC8vIHByb3BlcnR5LlxuICAgICAgaWYgKHJ1bGUgJiYgcnVsZSAhPT0gQ29tcG9zYWJsZS5vdmVycmlkZSkge1xuICAgICAgICBydWxlKG9iaiwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgaWdub3JlUHJvcGVydHlOYW1lcyA9IFtdKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaWdub3JlUHJvcGVydHlOYW1lcy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBtaXhpbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZShiYXNlLCBtaXhpbikge1xuXG4gIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJhc2UgYW5kIG1peGluIGFyZSBjbGFzc2VzIG9yIHBsYWluIG9iamVjdHMuXG4gIGxldCBiYXNlSXNDbGFzcyA9IGlzQ2xhc3MoYmFzZSk7XG4gIGxldCBtaXhpbklzQ2xhc3MgPSBpc0NsYXNzKG1peGluKTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlICptaXhpbiogaGFzIGEgYmFzZSBjbGFzcy9wcm90b3R5cGUgb2YgaXRzIG93bi5cbiAgbGV0IG1peGluQmFzZSA9IG1peGluSXNDbGFzcyA/XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKG1peGluLnByb3RvdHlwZSkuY29uc3RydWN0b3IgOlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbik7XG4gIGlmIChtaXhpbkJhc2UgJiZcbiAgICAgIG1peGluQmFzZSAhPT0gRnVuY3Rpb24gJiZcbiAgICAgIG1peGluQmFzZSAhPT0gT2JqZWN0ICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAvLyBUaGUgbWl4aW4gaXRzZWxmIGRlcml2ZXMgZnJvbSBhbm90aGVyIGNsYXNzL29iamVjdC5cbiAgICAvLyBSZWN1cnNlLCBhbmQgZXh0ZW5kIHdpdGggdGhlIG1peGluJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gY29tcG9zZShiYXNlLCBtaXhpbkJhc2UpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBleHRlbmRlZCBvYmplY3Qgd2UncmUgZ29pbmcgdG8gcmV0dXJuIGFzIGEgcmVzdWx0LlxuICBsZXQgcmVzdWx0O1xuICBpZiAoYmFzZUlzQ2xhc3MpIHtcbiAgICAvLyBDcmVhdGUgYSBzdWJjbGFzcyBvZiBiYXNlLiBPbmNlIFdlYktpdCBzdXBwb3J0cyBIVE1MRWxlbWVudCBhcyBhIHJlYWxcbiAgICAvLyBjbGFzcywgd2UgY2FuIGp1c3Qgc2F5OlxuICAgIC8vXG4gICAgLy8gICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHVudGlsIHRoYXQncyByZXNvbHZlZCwgd2UgaGF2ZSB0byBjb25zdHJ1Y3QgdGhlIGNsYXNzIG91cnNlbHZlcy5cbiAgICByZXN1bHQgPSBmdW5jdGlvbiBzdWJjbGFzcygpIHt9O1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQsIGJhc2UpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQucHJvdG90eXBlLCBiYXNlLnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ3JlYXRlIGEgcGxhaW4gb2JqZWN0IHRoYXQgc2ltcGx5IHVzZXMgdGhlIGJhc2UgYXMgYSBwcm90b3R5cGUuXG4gICAgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcbiAgfVxuXG4gIGxldCBzb3VyY2U7XG4gIGxldCB0YXJnZXQ7XG4gIGlmIChiYXNlSXNDbGFzcyAmJiBtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24uXG4gICAgLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0IGZ1bmN0aW9uc1xuICAgIC8vIGhhdmUgc29tZSBwcm9wZXJ0aWVzIChhcmd1bWVudHMgYW5kIGNhbGxlcikgd2hpY2ggYXJlIG5vdCByZXR1cm5lZCBieVxuICAgIC8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZ1bmN0aW9uKS5cbiAgICBjb25zdCBGVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAgICAgJ2FyZ3VtZW50cycsXG4gICAgICAnY2FsbGVyJyxcbiAgICAgICdsZW5ndGgnLFxuICAgICAgJ25hbWUnLFxuICAgICAgJ3Byb3RvdHlwZSdcbiAgICBdO1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBXZSdsbCBjb3B5IGluc3RhbmNlIG1lbWJlcnMgaW4gYSBtb21lbnQsIGJ1dCBmaXJzdCBjb3B5IHN0YXRpYyBtZW1iZXJzLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKG1peGluLCByZXN1bHQsIEZVTkNUSU9OX1BST1BFUlRJRVMpO1xuICAgIHNvdXJjZSA9IG1peGluLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBtaXhpbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIHNvdXJjZSA9IG1peGluLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIW1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IG1peGluIHRvIHJlc3VsdCBwcm90b3R5cGUuXG4gICAgc291cmNlID0gbWl4aW47XG4gICAgdGFyZ2V0ID0gcmVzdWx0LnByb3RvdHlwZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIHBsYWluIG9iamVjdC5cbiAgICBzb3VyY2UgPSBtaXhpbjtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH1cbiAgY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIFsnY29uc3RydWN0b3InXSk7XG5cbiAgYXBwbHlDb21wb3NpdGlvblJ1bGVzKHRhcmdldCk7XG5cbiAgaWYgKG1peGluLm5hbWUpIHtcbiAgICAvLyBVc2UgdGhlIG1peGluJ3MgbmFtZSAodXN1YWxseSB0aGUgbmFtZSBvZiBhIGNsYXNzJyBjb25zdHJ1Y3RvcikgdG9cbiAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIGJhY2sgdG8gdGhlIG5ld2x5LWNyZWF0ZWQgb2JqZWN0IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgdGFyZ2V0W21peGluLm5hbWVdID0gdGFyZ2V0O1xuXG4gICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXJjbGFzcy9zdXBlci1vYmplY3QuIFNlZSB0aGUgY29tbWVudHMgb25cbiAgICAvLyBDb21wb3NhYmxlJ3MgXCJzdXBlclwiIHByb3BlcnR5LlxuICAgIHRhcmdldC5zdXBlciA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdENvbXBvc2l0aW9uUnVsZShkZXNjcmlwdG9yKSB7XG4gIGlmICh0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBDb21wb3NhYmxlLmludm9rZUJhc2VGaXJzdDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gUmV0dXJuIHRydWUgaWYgYyBpcyBhIEphdmFTY3JpcHQgY2xhc3MuXG4vLyBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuLy8gYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbi8vIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4vLyBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuLy8gZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbmZ1bmN0aW9uIGlzQ2xhc3MoYykge1xuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgfHwgICAgICAgICAgICAgICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIChjLnByb3RvdHlwZSAmJiBjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gYyk7IC8vIEhUTUxFbGVtZW50IGluIFdlYktpdFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvc2FibGU7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgY29tcG9zYWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gQ29tcG9zYWJsZS5cbiAqL1xuXG5pbXBvcnQgQ29tcG9zYWJsZSBmcm9tICcuLi9leHRlbnNpYmxlL0NvbXBvc2FibGUnO1xuXG4vLyBXZSB1c2UgRXh0ZW5zaWJsZSB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHdpdGggLmV4dGVuZCgpIGFuZCBzdXBlcigpIHN1cHBvcnQuXG5sZXQgQ29tcG9zYWJsZUVsZW1lbnQgPSBDb21wb3NhYmxlLmNvbXBvc2UuY2FsbChIVE1MRWxlbWVudCwgQ29tcG9zYWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvc2FibGVFbGVtZW50O1xuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IENvbXBvc2FibGVFbGVtZW50IGZyb20gJy4vQ29tcG9zYWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBDb21wb3NhYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5jb21wb3NlKFxuICBUZW1wbGF0ZVN0YW1waW5nLCAvLyBiZWZvcmUgbm9kZSBmaW5kaW5nLCBzbyBzaGFkb3cgcm9vdCBpcyBwb3B1bGF0ZWRcbiAgQXV0b21hdGljTm9kZUZpbmRpbmcsIC8vIGJlZm9yZSBtYXJzaGFsbGluZywgc28gbWFyc2hhbGxlZCBwcm9wZXJ0aWVzIGNhbiB1c2UgaXRcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmdcbik7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICpcbiAqIEZvciB0aGUgdGltZSBiZWluZywgdGhpcyBleHRlbnNpb24gcmV0YWlucyBzdXBwb3J0IGZvciBTaGFkb3cgRE9NIHYwLlxuICogVGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgZGVwcmVjYXRlZCBhcyBicm93c2VycyBpbXBsZW1lbnQgU2hhZG93IERPTSB2MS5cbiAqL1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGUgJiYgVVNJTkdfU0hBRE9XX0RPTV9WMCkge1xuICAgICAgcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlNoYWRvd0RPTVBvbHlmaWxsKSB7XG4gICAgICBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRoaXMubG9jYWxOYW1lKTtcbiAgICB9XG4gICAgLy8gVE9ETzogU2F2ZSB0aGUgcHJvY2Vzc2VkIHRlbXBsYXRlIHdpdGggdGhlIGNvbXBvbmVudCdzIGNsYXNzIHByb3RvdHlwZVxuICAgIC8vIHNvIGl0IGRvZXNuJ3QgbmVlZCB0byBiZSBwcm9jZXNzZWQgd2l0aCBldmVyeSBpbnN0YW50aWF0aW9uLlxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IFVTSU5HX1NIQURPV19ET01fVjAgP1xuICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKSA6ICAgICAgICAgICAgIC8vIFNoYWRvdyBET00gdjBcbiAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7ICAvLyBTaGFkb3cgRE9NIHYxXG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vLyBGZWF0dXJlIGRldGVjdGlvbiBmb3Igb2xkIFNoYWRvdyBET00gdjAuXG5jb25zdCBVU0lOR19TSEFET1dfRE9NX1YwID0gKHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdCAhPT0gJ3VuZGVmaW5lZCcpO1xuXG5cbi8vIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuLy8gUmVwbGFjZSBvY2N1cmVuY2VzIG9mIHYxIHNsb3QgZWxlbWVudHMgd2l0aCB2MCBjb250ZW50IGVsZW1lbnRzLlxuLy8gVGhpcyBkb2VzIG5vdCB5ZXQgbWFwIG5hbWVkIHNsb3RzIHRvIGNvbnRlbnQgc2VsZWN0IGNsYXVzZXMuXG5mdW5jdGlvbiBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSkge1xuICBbXS5mb3JFYWNoLmNhbGwodGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzbG90JyksIHNsb3RFbGVtZW50ID0+IHtcbiAgICBsZXQgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50Jyk7XG4gICAgc2xvdEVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY29udGVudEVsZW1lbnQsIHNsb3RFbGVtZW50KTtcbiAgfSk7XG59XG5cbi8vIEludm9rZSBiYXNpYyBzdHlsZSBzaGltbWluZyB3aXRoIFNoYWRvd0NTUy5cbmZ1bmN0aW9uIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGFnKSB7XG4gIFdlYkNvbXBvbmVudHMuU2hhZG93Q1NTLnNoaW1TdHlsaW5nKHRlbXBsYXRlLmNvbnRlbnQsIHRhZyk7XG59XG4iXX0=
