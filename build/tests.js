(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      var base = this.AttributeMarshalling.super.attributeChangedCallback;
      if (base) {
        base.call(this);
      }
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

      var base = this.AttributeMarshalling.super.createdCallback;
      if (base) {
        base.call(this);
      }
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      var base = this.AutomaticNodeFinding.super.createdCallback;
      if (base) {
        base.call(this);
      }
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExtensibleElement2 = require('./ExtensibleElement');

var _ExtensibleElement3 = _interopRequireDefault(_ExtensibleElement2);

var _TemplateStamping = require('./TemplateStamping');

var _TemplateStamping2 = _interopRequireDefault(_TemplateStamping);

var _AutomaticNodeFinding = require('./AutomaticNodeFinding');

var _AutomaticNodeFinding2 = _interopRequireDefault(_AutomaticNodeFinding);

var _AttributeMarshalling = require('./AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A sample general-purpose base class for defining custom elements that mixes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * in some common features: template stamping into a shadow root, automatic node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * finding, and marshalling between attributes and properties.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ElementBase = (function (_ExtensibleElement) {
  _inherits(ElementBase, _ExtensibleElement);

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
})(_ExtensibleElement3.default);

ElementBase = ElementBase.extend(_TemplateStamping2.default, // before node finding, so shadow root is populated
_AutomaticNodeFinding2.default, // before marshalling, so marshalled properties can use it
_AttributeMarshalling2.default);

document.registerElement('element-base', ElementBase);

exports.default = ElementBase;

},{"./AttributeMarshalling":2,"./AutomaticNodeFinding":3,"./ExtensibleElement":5,"./TemplateStamping":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Extensible = require('../extensible/Extensible');

var _Extensible2 = _interopRequireDefault(_Extensible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
var ExtensibleElement = _Extensible2.default.extend.call(HTMLElement, _Extensible2.default); /*
                                                                                              * An extensible HTML element.
                                                                                              *
                                                                                              * This class is provided just as a convenience. One could also start with
                                                                                              * HTMLElement at the top level, and add extensibility by mixing in Extensible.
                                                                                              */

exports.default = ExtensibleElement;

},{"../extensible/Extensible":1}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      // this.log("created");
      var base = this.TemplateStamping.super.createdCallback;
      if (base) {
        base();
      }
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

},{}],7:[function(require,module,exports){
"use strict";

var _testElements = require("./testElements");

var testElements = _interopRequireWildcard(_testElements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    var element = document.createElement('element-with-created-extension');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });
});

},{"./testElements":9}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Extensible3 = require('../extensible/Extensible');

var _Extensible4 = _interopRequireDefault(_Extensible3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

},{"../extensible/Extensible":1}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ElementBase5 = require('../src/ElementBase');

var _ElementBase6 = _interopRequireDefault(_ElementBase5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

/* Element created via ES5-compatible .extend() */
var Es5ClassViaExtend = _ElementBase6.default.extend({
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

/* Extension that defines a createdCallback method. */

var CreatedExtension = (function () {
  function CreatedExtension() {
    _classCallCheck(this, CreatedExtension);
  }

  _createClass(CreatedExtension, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var base = this.CreatedExtension.super.createdCallback;
      if (base) {
        base.call(this);
      }
      this.extensionCreatedCallbackInvoked = true;
    }
  }]);

  return CreatedExtension;
})();

var ElementWithCreatedExtension = (function (_ElementBase4) {
  _inherits(ElementWithCreatedExtension, _ElementBase4);

  function ElementWithCreatedExtension() {
    _classCallCheck(this, ElementWithCreatedExtension);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithCreatedExtension).apply(this, arguments));
  }

  _createClass(ElementWithCreatedExtension, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithCreatedExtension;
})(_ElementBase6.default);

ElementWithCreatedExtension = ElementWithCreatedExtension.extend(CreatedExtension);
document.registerElement('element-with-created-extension', ElementWithCreatedExtension);

},{"../src/ElementBase":4}]},{},[7,8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0V4dGVuc2libGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsInRlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCJ0ZXN0L0V4dGVuc2libGUudGVzdHMuanMiLCJ0ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDS00sVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBeUJlO3dDQUFaLFVBQVU7QUFBVixrQkFBVTs7Ozs7OztBQUt6QixhQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7U0EvQkcsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtEaEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsQUF1QnZELFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTOzs7OztBQUFDLEFBTTlDLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBNEI7TUFBMUIsbUJBQW1CLHlEQUFHLEVBQUU7O0FBQ2pFLFFBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDakQsUUFBSSxtQkFBbUIsQ0FBQyxPQUFP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IihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIEV4dGVuZCBjbGFzc2VzL29iamVjdHMgd2l0aCBvdGhlciBjbGFzc2VzL29iamVjdHMuXG4gKi9cblxuXG5jbGFzcyBFeHRlbnNpYmxlIHtcblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSwgRXh0ZW5zaW9uMiwgRXh0ZW5zaW9uMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgZXh0ZW5zaW9ucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSkuZXh0ZW5kKEV4dGVuc2lvbjIpLmV4dGVuZChFeHRlbnNpb24zKVxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc3RhdGljYWxseSBpbnZva2VkIHRvIGV4dGVuZCBwbGFpbiBvYmplY3RzOlxuICAgKlxuICAgKiAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqMSwgb2JqMik7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggZXh0ZW5zaW9uIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IGV4dGVuc2lvbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBleHRlbnNpb25zLnJlZHVjZShleHRlbmQsIHRoaXMpO1xuICB9XG5cbn1cblxuLypcbiAqIEFsbCBFeHRlbnNpYmxlLWNyZWF0ZWQgb2JqZWN0cyBrZWVwIHJlZmVyZW5jZXMgdG8gdGhlIGV4dGVuc2lvbnMgdGhhdCB3ZXJlXG4gKiBhcHBsaWVkIHRvIGNyZWF0ZSB0aGVtLiBXaGVuIGEgKm5hbWVkKiBleHRlbnNpb24gaXMgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlXG4gKiBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlIGNsYXNzJyBwcm90b3R5cGUpIHdpbGxcbiAqIGhhdmUgYSBuZXcgbWVtYmVyIHdpdGggdGhhdCBuYW1lIHRoYXQgcG9pbnRzIGJhY2sgdG8gdGhlIHNhbWUgb2JqZWN0LlxuICogVGhhdCBmYWNpbGl0eSBpcyB1c2VmdWwgd2hlbiBkZWFsaW5nIHdpdGggY2hhaW5zIHRoYXQgaGF2ZSBiZWVuIGV4dGVuZGVkXG4gKiBtb3JlIHRoYW4gb25jZSwgYXMgYW4gZXh0ZW5zaW9uJ3MgbmFtZSBpcyBzdWZmaWNpZW50IHRvIHJldHJpZXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGF0IHBvaW50IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQSBzaW5nbGUgZXh0ZW5zaW9uIGNhbiBiZSBhcHBsaWVkIHRvIG11bHRpcGxlIHByb3RvdHlwZSBjaGFpbnMgLS0gdGhlIG5hbWVcbiAqIHJlZmVycyB0byB0aGUgcHJvdG90eXBlIG9uICp0aGlzIHBhcnRpY3VsYXIgcHJvdG90eXBlIGNoYWluKiB0aGF0IHdhcyBhZGRlZFxuICogZm9yIHRoYXQgZXh0ZW5zaW9uLiBUaGlzIGxldHMgZXh0ZW5zaW9uL21peGluIGNvZGUgZ2V0IGJhY2sgdG8gaXRzIG93blxuICogcHJvdG90eXBlLCBtb3N0IG9mdGVuIGluIGNvbWJpbmF0aW9uIHdpdGggXCJzdXBlclwiIChzZWUgYmVsb3cpIGluIG9yZGVyIHRvXG4gKiBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvci5cbiAqL1xuRXh0ZW5zaWJsZS5wcm90b3R5cGUuRXh0ZW5zaWJsZSA9IEV4dGVuc2libGUucHJvdG90eXBlO1xuXG4vKlxuICogQWxsIEV4dGVuc2libGUtY3JlYXRlZCBvYmplY3RzIGhhdmUgYSBcInN1cGVyXCIgcHJvcGVydHkgdGhhdCByZWZlcmVuY2VzIHRoZVxuICogcHJvdG90eXBlIGFib3ZlIHRoZW0gaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBUaGlzIFwic3VwZXJcIiByZWZlcmVuY2UgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50IGZvciBFUzYncyBcInN1cGVyXCIga2V5d29yZCBpblxuICogaW4gRVM1IChvciB0cmFuc3BpbGVkIEVTNikgZXh0ZW5zaW9ucy9taXhpbnNcbiAqIHRoYXQgd2FudCB0byBpbnZva2Ugc3VwZXJjbGFzcyBiZWhhdmlvciwgd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbFxuICogZGVwZW5kIHVwb24gd2hpY2ggZXh0ZW5zaW9ucyBoYXZlIGJlZW4gYXBwbGllZCB0byBhIGdpdmVuIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBFLmcuOlxuICogICBjbGFzcyBNaXhpbiB7XG4gKiAgICAgZm9vKCkge1xuICogICAgICAgaWYgKHRoaXMuTWl4aW4uc3VwZXIuZm9vKSB7XG4gKiAgICAgICAgIHRoaXMuTWl4aW4uc3VwZXIuZm9vLmNhbGwodGhpcyk7IC8vIEludm9rZSBzdXBlcmNsYXNzJyBmb28oKVxuICogICAgICAgfVxuICogICAgICAgLy8gRG8gTWl4aW4tc3BlY2lmaWMgd29yayBoZXJlLi4uXG4gKiAgICAgfVxuICogICB9XG4gKlxuICogRm9yIGNvbnNpc3RlbmN5LCBFeHRlbnNpYmxlIGl0c2VsZiByZWNvcmRzIGl0cyBvd24gc3VwZXJjbGFzcyBhcyBPYmplY3QuXG4gKi9cbkV4dGVuc2libGUucHJvdG90eXBlLnN1cGVyID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gcHJvcGVydGllcy9tZXRob2RzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcy9vYmplY3QgdGhhdCBleHRlbmRzIHRoZSBnaXZlbiBiYXNlIGNsYXNzL29iamVjdCB3aXRoXG4gKiB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbi5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIGV4dGVuc2lvbikge1xuXG4gIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJhc2UgYW5kIGV4dGVuc2lvbiBhcmUgY2xhc3NlcyBvciBwbGFpbiBvYmplY3RzLlxuICBsZXQgYmFzZUlzQ2xhc3MgPSBpc0NsYXNzKGJhc2UpO1xuICBsZXQgZXh0ZW5zaW9uSXNDbGFzcyA9IGlzQ2xhc3MoZXh0ZW5zaW9uKTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlICpleHRlbnNpb24qIGhhcyBhIGJhc2UgY2xhc3MvcHJvdG90eXBlIG9mIGl0cyBvd24uXG4gIGxldCBleHRlbnNpb25CYXNlID0gZXh0ZW5zaW9uSXNDbGFzcyA/XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVuc2lvbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yIDpcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZW5zaW9uKTtcbiAgaWYgKGV4dGVuc2lvbkJhc2UgJiZcbiAgICAgIGV4dGVuc2lvbkJhc2UgIT09IEZ1bmN0aW9uICYmXG4gICAgICBleHRlbnNpb25CYXNlICE9PSBPYmplY3QpIHtcbiAgICAvLyBUaGUgZXh0ZW5zaW9uIGl0c2VsZiBkZXJpdmVzIGZyb20gYW5vdGhlciBjbGFzcy9vYmplY3QuXG4gICAgLy8gUmVjdXJzZSwgYW5kIGV4dGVuZCB3aXRoIHRoZSBleHRlbnNpb24ncyBiYXNlIGZpcnN0LlxuICAgIGJhc2UgPSBleHRlbmQoYmFzZSwgZXh0ZW5zaW9uQmFzZSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGV4dGVuZGVkIG9iamVjdCB3ZSdyZSBnb2luZyB0byByZXR1cm4gYXMgYSByZXN1bHQuXG4gIGxldCByZXN1bHQ7XG4gIGlmIChiYXNlSXNDbGFzcykge1xuICAgIC8vIENyZWF0ZSBhIHN1YmNsYXNzIG9mIGJhc2UuIE9uY2UgV2ViS2l0IHN1cHBvcnRzIEhUTUxFbGVtZW50IGFzIGEgcmVhbFxuICAgIC8vIGNsYXNzLCB3ZSBjYW4ganVzdCBzYXk6XG4gICAgLy9cbiAgICAvLyAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdW50aWwgdGhhdCdzIHJlc29sdmVkLCB3ZSBoYXZlIHRvIGNvbnN0cnVjdCB0aGUgY2xhc3Mgb3Vyc2VsdmVzLlxuICAgIHJlc3VsdCA9IGZ1bmN0aW9uIHN1YmNsYXNzKCkge307XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdCwgYmFzZSk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdC5wcm90b3R5cGUsIGJhc2UucHJvdG90eXBlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDcmVhdGUgYSBwbGFpbiBvYmplY3QgdGhhdCBzaW1wbHkgdXNlcyB0aGUgYmFzZSBhcyBhIHByb3RvdHlwZS5cbiAgICByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICB9XG5cbiAgbGV0IHNvdXJjZTtcbiAgbGV0IHRhcmdldDtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBQcm9wZXJ0aWVzIGRlZmluZWQgYnkgRnVuY3Rpb24uXG4gICAgLy8gV2UnZCBwcmVmZXIgdG8gZ2V0IGJ5IGludGVycm9nYXRpbmcgRnVuY3Rpb24gaXRzZWxmLCBidXQgV2ViS2l0IGZ1bmN0aW9uc1xuICAgIC8vIGhhdmUgc29tZSBwcm9wZXJ0aWVzIChhcmd1bWVudHMgYW5kIGNhbGxlcikgd2hpY2ggYXJlIG5vdCByZXR1cm5lZCBieVxuICAgIC8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZ1bmN0aW9uKS5cbiAgICBjb25zdCBGVU5DVElPTl9QUk9QRVJUSUVTID0gW1xuICAgICAgJ2FyZ3VtZW50cycsXG4gICAgICAnY2FsbGVyJyxcbiAgICAgICdsZW5ndGgnLFxuICAgICAgJ25hbWUnLFxuICAgICAgJ3Byb3RvdHlwZSdcbiAgICBdO1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBXZSdsbCBjb3B5IGluc3RhbmNlIG1lbWJlcnMgaW4gYSBtb21lbnQsIGJ1dCBmaXJzdCBjb3B5IHN0YXRpYyBtZW1iZXJzLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbiwgcmVzdWx0LCBGVU5DVElPTl9QUk9QRVJUSUVTKTtcbiAgICBzb3VyY2UgPSBleHRlbnNpb24ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbi5wcm90b3R5cGU7XG4gICAgdGFyZ2V0ID0gcmVzdWx0O1xuICB9IGVsc2UgaWYgKGJhc2VJc0NsYXNzICYmICFleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggcGxhaW4gb2JqZWN0LlxuICAgIC8vIENvcHkgZXh0ZW5zaW9uIHRvIHJlc3VsdCBwcm90b3R5cGUuXG4gICAgc291cmNlID0gZXh0ZW5zaW9uO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgc291cmNlID0gZXh0ZW5zaW9uO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfVxuICBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgWydjb25zdHJ1Y3RvciddKTtcblxuICBpZiAoZXh0ZW5zaW9uLm5hbWUpIHtcbiAgICAvLyBVc2UgdGhlIGV4dGVuc2lvbidzIG5hbWUgKHVzdWFsbHkgdGhlIG5hbWUgb2YgYSBjbGFzcycgY29uc3RydWN0b3IpIHRvXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSBuZXdseS1jcmVhdGVkIG9iamVjdCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIHRhcmdldFtleHRlbnNpb24ubmFtZV0gPSB0YXJnZXQ7XG5cbiAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlcmNsYXNzL3N1cGVyLW9iamVjdC4gU2VlIHRoZSBjb21tZW50cyBvblxuICAgIC8vIEV4dGVuc2libGUncyBcInN1cGVyXCIgcHJvcGVydHkuXG4gICAgdGFyZ2V0LnN1cGVyID0gYmFzZUlzQ2xhc3MgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2U7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbi8vIFdlIHVzZSB0aGlzIHRlc3QgYmVjYXVzZSwgb24gV2ViS2l0LCBjbGFzc2VzIGxpa2UgSFRNTEVsZW1lbnQgYXJlIHNwZWNpYWwsXG4vLyBhbmQgYXJlIG5vdCBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRvIGhhbmRsZSB0aGF0IGNhc2UsIHdlIHVzZSBhIGxvb3NlclxuLy8gZGVmaW5pdGlvbjogYW4gb2JqZWN0IGlzIGEgY2xhc3MgaWYgaXQgaGFzIGEgcHJvdG90eXBlLCBhbmQgdGhhdCBwcm90b3R5cGVcbi8vIGhhcyBhIGNvbnN0cnVjdG9yIHRoYXQgaXMgdGhlIG9yaWdpbmFsIG9iamVjdC4gVGhpcyBjb25kaXRpb24gaG9sZHMgdHJ1ZSBldmVuXG4vLyBmb3IgSFRNTEVsZW1lbnQgb24gV2ViS2l0LlxuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZTtcbiIsIi8qXG4gKiBNYXJzaGFsbCBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXMgKGFuZCBldmVudHVhbGx5IHZpY2UgdmVyc2EpLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIHtcblxuICAvKlxuICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIGxldCBiYXNlID0gdGhpcy5BdHRyaWJ1dGVNYXJzaGFsbGluZy5zdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgdGhlbiBzZXQgdGhhdFxuICAgIC8vIHByb3BlcnR5LiBJZ25vcmUgY2hhbmdlcyBpbiBzdGFuZGFyZCBIVE1MRWxlbWVudCBwcm9wZXJ0aWVzLlxuICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcbiAgICBpZiAocHJvcGVydHlOYW1lIGluIHRoaXMgJiYgIShwcm9wZXJ0eU5hbWUgaW4gSFRNTEVsZW1lbnQucHJvdG90eXBlKSkge1xuICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5BdHRyaWJ1dGVNYXJzaGFsbGluZy5zdXBlci5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLkF1dG9tYXRpY05vZGVGaW5kaW5nLnN1cGVyLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG4iLCIvKlxuICogQSBzYW1wbGUgZ2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cyB0aGF0IG1peGVzXG4gKiBpbiBzb21lIGNvbW1vbiBmZWF0dXJlczogdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LCBhdXRvbWF0aWMgbm9kZVxuICogZmluZGluZywgYW5kIG1hcnNoYWxsaW5nIGJldHdlZW4gYXR0cmlidXRlcyBhbmQgcHJvcGVydGllcy5cbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUVsZW1lbnQgZnJvbSAnLi9FeHRlbnNpYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEV4dGVuc2libGVFbGVtZW50IHtcblxuICAvKiBGb3IgZGVidWdnaW5nICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5FbGVtZW50QmFzZSA9IEVsZW1lbnRCYXNlLmV4dGVuZChcbiAgVGVtcGxhdGVTdGFtcGluZywgLy8gYmVmb3JlIG5vZGUgZmluZGluZywgc28gc2hhZG93IHJvb3QgaXMgcG9wdWxhdGVkXG4gIEF1dG9tYXRpY05vZGVGaW5kaW5nLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIG1hcnNoYWxsZWQgcHJvcGVydGllcyBjYW4gdXNlIGl0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nXG4pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iLCIvKlxuICogQW4gZXh0ZW5zaWJsZSBIVE1MIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcm92aWRlZCBqdXN0IGFzIGEgY29udmVuaWVuY2UuIE9uZSBjb3VsZCBhbHNvIHN0YXJ0IHdpdGhcbiAqIEhUTUxFbGVtZW50IGF0IHRoZSB0b3AgbGV2ZWwsIGFuZCBhZGQgZXh0ZW5zaWJpbGl0eSBieSBtaXhpbmcgaW4gRXh0ZW5zaWJsZS5cbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZSBmcm9tICcuLi9leHRlbnNpYmxlL0V4dGVuc2libGUnO1xuXG4vLyBXZSB1c2UgRXh0ZW5zaWJsZSB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHdpdGggLmV4dGVuZCgpIGFuZCBzdXBlcigpIHN1cHBvcnQuXG5sZXQgRXh0ZW5zaWJsZUVsZW1lbnQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKEhUTUxFbGVtZW50LCBFeHRlbnNpYmxlKTtcblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogRWxlbWVudCBleHRlbnNpb24gZm9yIHRlbXBsYXRlIHN0YW1waW5nLiBJZiBhIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGVcbiAqIHByb3BlcnR5IChhcyBhIHN0cmluZyBvciByZWZlcmVuY2luZyBhIEhUTUwgdGVtcGxhdGUpLCB3aGVuIHRoZSBjb21wb25lbnRcbiAqIGNsYXNzIGlzIGluc3RhbnRpYXRlZCwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlIGluc3RhbmNlLCBhbmRcbiAqIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGUgc2hhZG93IHJvb3QuXG4gKlxuICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIGV4dGVuc2lvbiByZXRhaW5zIHN1cHBvcnQgZm9yIFNoYWRvdyBET00gdjAuXG4gKiBUaGF0IHdpbGwgZXZlbnR1YWxseSBiZSBkZXByZWNhdGVkIGFzIGJyb3dzZXJzIGltcGxlbWVudCBTaGFkb3cgRE9NIHYxLlxuICovXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICBsZXQgYmFzZSA9IHRoaXMuVGVtcGxhdGVTdGFtcGluZy5zdXBlci5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UoKTtcbiAgICB9XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlICYmIFVTSU5HX1NIQURPV19ET01fVjApIHtcbiAgICAgIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCkge1xuICAgICAgc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0aGlzLmxvY2FsTmFtZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IFVTSU5HX1NIQURPV19ET01fVjAgP1xuICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKSA6ICAgICAgICAgICAgIC8vIFNoYWRvdyBET00gdjBcbiAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7ICAvLyBTaGFkb3cgRE9NIHYxXG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vLyBGZWF0dXJlIGRldGVjdGlvbiBmb3Igb2xkIFNoYWRvdyBET00gdjAuXG5jb25zdCBVU0lOR19TSEFET1dfRE9NX1YwID0gKHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdCAhPT0gJ3VuZGVmaW5lZCcpO1xuXG5cbi8vIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuLy8gUmVwbGFjZSBvY2N1cmVuY2VzIG9mIHYxIHNsb3QgZWxlbWVudHMgd2l0aCB2MCBjb250ZW50IGVsZW1lbnRzLlxuLy8gVGhpcyBkb2VzIG5vdCB5ZXQgbWFwIG5hbWVkIHNsb3RzIHRvIGNvbnRlbnQgc2VsZWN0IGNsYXVzZXMuXG5mdW5jdGlvbiBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSkge1xuICBbXS5mb3JFYWNoLmNhbGwodGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzbG90JyksIHNsb3RFbGVtZW50ID0+IHtcbiAgICBsZXQgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50Jyk7XG4gICAgc2xvdEVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY29udGVudEVsZW1lbnQsIHNsb3RFbGVtZW50KTtcbiAgfSk7XG59XG5cbi8vIEludm9rZSBiYXNpYyBzdHlsZSBzaGltbWluZyB3aXRoIFNoYWRvd0NTUy5cbmZ1bmN0aW9uIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGFnKSB7XG4gIFdlYkNvbXBvbmVudHMuU2hhZG93Q1NTLnNoaW1TdHlsaW5nKHRlbXBsYXRlLmNvbnRlbnQsIHRhZyk7XG59XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRXh0ZW5zaWJsZSBmcm9tIFwiLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlXCI7XG5cblxuLyogU2FtcGxlIGNsYXNzZXMgdXNlZCBieSB0aGUgdGVzdCBzdWl0ZSAqL1xuXG4vKiBBIHNpbXBsZSBiYXNlIGNsYXNzICovXG5jbGFzcyBFeGFtcGxlQmFzZSBleHRlbmRzIEV4dGVuc2libGUge1xuICBmb28oKSB7XG4gICAgcmV0dXJuICdFeGFtcGxlQmFzZSc7XG4gIH1cbn1cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5ICovXG5jbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gIGdldCBwcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxufVxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgbWV0aG9kICovXG5jbGFzcyBNZXRob2RFeHRlbnNpb24ge1xuICBtZXRob2QoKSB7XG4gICAgbGV0IHN1cGVyTWV0aG9kID0gdGhpcy5NZXRob2RFeHRlbnNpb24uc3VwZXIubWV0aG9kO1xuICAgIGxldCByZXN1bHQgPSBzdXBlck1ldGhvZCA/IHN1cGVyTWV0aG9kLmNhbGwodGhpcykgOiAnZXh0ZW5zaW9uIHJlc3VsdCc7XG4gICAgdGhpcy5leHRlbnNpb25NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cblxuc3VpdGUoXCJFeHRlbnNpYmxlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBjbGFzcyB3aXRoIEVTNiBjbGFzcyBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgZ2V0IGJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKHtcbiAgICAgIGJhcjogdHJ1ZVxuICAgIH0pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIG1ldGhvZFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIG1ldGhvZCBjYW4gdXNlIHN1cGVyKCkgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICB0aGlzLmJhc2VNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICdiYXNlIHJlc3VsdCc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXNlIHJlc3VsdCcpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuYmFzZU1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwibXVsdGlwbGUgZXh0ZW5zaW9ucyBjYW4gYmUgYXBwbGllZCBpbiBvbmUgY2FsbFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKFxuICAgICAgUHJvcGVydHlFeHRlbnNpb24sXG4gICAgICBNZXRob2RFeHRlbnNpb25cbiAgICApO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBhIHBsYWluIG9iamVjdFwiLCAoKSA9PiB7XG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgcmV0dXJuICdyZXN1bHQnO1xuICAgICAgfVxuICAgIH07XG4gICAgbGV0IGV4dGVuc2lvbiA9IHtcbiAgICAgIHByb3BlcnR5OiAndmFsdWUnXG4gICAgfTtcbiAgICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iaiwgZXh0ZW5zaW9uKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQubWV0aG9kKCksICdyZXN1bHQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQucHJvcGVydHksICd2YWx1ZScpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBoYXMgbXVsdGlwbGUgbGV2ZWxzIG9mIGluaGVyaXRhbmNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBFeHRlbnNpb25TdWJjbGFzcyBleHRlbmRzIE1ldGhvZEV4dGVuc2lvbiB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIGxldCBzdXBlck1ldGhvZCA9IHRoaXMuRXh0ZW5zaW9uU3ViY2xhc3Muc3VwZXIubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IFN1YmNsYXNzID0gRXh0ZW5zaWJsZS5leHRlbmQoRXh0ZW5zaW9uU3ViY2xhc3MpO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBwcm9wZXJ0eSBjYW4gcmVmZXJlbmNlIHN1cGVyY2xhc3MnIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBjbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIGxldCBzdXBlclByb3RvdHlwZSA9IHRoaXMuUHJvcGVydHlFeHRlbnNpb24uc3VwZXI7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gc3VwZXJQcm90b3R5cGUgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvdHlwZSwgJ3Byb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZGVzY3JpcHRvcikgP1xuICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOlxuICAgICAgICAgICdleHRlbnNpb24gdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBTdWJjbGFzcyBleHRlbmRzIEV4dGVuc2libGUge1xuICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICByZXR1cm4gJ2Jhc2UgdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBTdWJjbGFzcyA9IFN1YmNsYXNzLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAnYmFzZSB2YWx1ZScpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuXG4vKiBFbGVtZW50IHdpdGggYSBzaW1wbGUgdGVtcGxhdGUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnLCBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IHdpdGggYSByZWFsIHRlbXBsYXRlICovXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudGVtcGxhdGUuY29udGVudC50ZXh0Q29udGVudCA9IFwiSGVsbG9cIjtcbmNsYXNzIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJywgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgY3JlYXRlZCB2aWEgRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpICovXG5sZXQgRXM1Q2xhc3NWaWFFeHRlbmQgPSBFbGVtZW50QmFzZS5leHRlbmQoe1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICdwcm9wZXJ0eSc7XG4gIH0sXG4gIG1ldGhvZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdtZXRob2QnO1xuICB9LFxuICB2YWx1ZTogJ3ZhbHVlJ1xufSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VzNS1jbGFzcy12aWEtZXh0ZW5kJywgRXM1Q2xhc3NWaWFFeHRlbmQpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jdXN0b21Qcm9wZXJ0eTtcbiAgfVxuICBzZXQgY3VzdG9tUHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLl9jdXN0b21Qcm9wZXJ0eSA9IHZhbHVlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5JywgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSk7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QuICovXG5jbGFzcyBDcmVhdGVkRXh0ZW5zaW9uIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5DcmVhdGVkRXh0ZW5zaW9uLnN1cGVyLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQgPSB0cnVlO1xuICB9XG59XG5jbGFzcyBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24gZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5FbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24gPSBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24uZXh0ZW5kKENyZWF0ZWRFeHRlbnNpb24pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY3JlYXRlZC1leHRlbnNpb24nLCBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24pO1xuIl19
