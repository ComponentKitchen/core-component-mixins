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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0V4dGVuc2libGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsInRlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCJ0ZXN0L0V4dGVuc2libGUudGVzdHMuanMiLCJ0ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDS00sVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBeUJlO3dDQUFaLFVBQVU7QUFBVixrQkFBVTs7Ozs7OztBQUt6QixhQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7U0EvQkcsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtEaEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsQUF1QnZELFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTOzs7OztBQUFDLEFBTTlDLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBNEI7TUFBMUIsbUJBQW1CLHlEQUFHLEVBQUU7O0FBQ2pFLFFBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDakQsUUFBSSxtQkFBbUIsQ0FBQyxPQUFP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dGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBFeHRlbmQgY2xhc3Nlcy9vYmplY3RzIHdpdGggb3RoZXIgY2xhc3Nlcy9vYmplY3RzLlxuICovXG5cblxuY2xhc3MgRXh0ZW5zaWJsZSB7XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEsIEV4dGVuc2lvbjIsIEV4dGVuc2lvbjMpXG4gICAqXG4gICAqIHdpbGwgcmV0dXJuIGEgbmV3IGNsYXNzIG9mIE15QmFzZUNsYXNzIHRoYXQgaW1wbGVtZW50cyBhbGwgdGhlIG1ldGhvZHMgaW5cbiAgICogdGhlIHRocmVlIGV4dGVuc2lvbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEpLmV4dGVuZChFeHRlbnNpb24yKS5leHRlbmQoRXh0ZW5zaW9uMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAvLyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJucyBvdXQgdGhhdFxuICAgIC8vIHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlIGN1cnJlbnRcbiAgICAvLyAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kLCB0aGlzKTtcbiAgfVxuXG59XG5cbi8qXG4gKiBBbGwgRXh0ZW5zaWJsZS1jcmVhdGVkIG9iamVjdHMga2VlcCByZWZlcmVuY2VzIHRvIHRoZSBleHRlbnNpb25zIHRoYXQgd2VyZVxuICogYXBwbGllZCB0byBjcmVhdGUgdGhlbS4gV2hlbiBhICpuYW1lZCogZXh0ZW5zaW9uIGlzIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZVxuICogY2hhaW4sIHRoZSByZXN1bHRpbmcgb2JqZWN0IChvciwgZm9yIGEgY2xhc3MsIHRoZSBjbGFzcycgcHJvdG90eXBlKSB3aWxsXG4gKiBoYXZlIGEgbmV3IG1lbWJlciB3aXRoIHRoYXQgbmFtZSB0aGF0IHBvaW50cyBiYWNrIHRvIHRoZSBzYW1lIG9iamVjdC5cbiAqIFRoYXQgZmFjaWxpdHkgaXMgdXNlZnVsIHdoZW4gZGVhbGluZyB3aXRoIGNoYWlucyB0aGF0IGhhdmUgYmVlbiBleHRlbmRlZFxuICogbW9yZSB0aGFuIG9uY2UsIGFzIGFuIGV4dGVuc2lvbidzIG5hbWUgaXMgc3VmZmljaWVudCB0byByZXRyaWV2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhhdCBwb2ludCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEEgc2luZ2xlIGV4dGVuc2lvbiBjYW4gYmUgYXBwbGllZCB0byBtdWx0aXBsZSBwcm90b3R5cGUgY2hhaW5zIC0tIHRoZSBuYW1lXG4gKiByZWZlcnMgdG8gdGhlIHByb3RvdHlwZSBvbiAqdGhpcyBwYXJ0aWN1bGFyIHByb3RvdHlwZSBjaGFpbiogdGhhdCB3YXMgYWRkZWRcbiAqIGZvciB0aGF0IGV4dGVuc2lvbi4gVGhpcyBsZXRzIGV4dGVuc2lvbi9taXhpbiBjb2RlIGdldCBiYWNrIHRvIGl0cyBvd25cbiAqIHByb3RvdHlwZSwgbW9zdCBvZnRlbiBpbiBjb21iaW5hdGlvbiB3aXRoIFwic3VwZXJcIiAoc2VlIGJlbG93KSBpbiBvcmRlciB0b1xuICogaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IuXG4gKi9cbkV4dGVuc2libGUucHJvdG90eXBlLkV4dGVuc2libGUgPSBFeHRlbnNpYmxlLnByb3RvdHlwZTtcblxuLypcbiAqIEFsbCBFeHRlbnNpYmxlLWNyZWF0ZWQgb2JqZWN0cyBoYXZlIGEgXCJzdXBlclwiIHByb3BlcnR5IHRoYXQgcmVmZXJlbmNlcyB0aGVcbiAqIHByb3RvdHlwZSBhYm92ZSB0aGVtIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogVGhpcyBcInN1cGVyXCIgcmVmZXJlbmNlIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgRVM2J3MgXCJzdXBlclwiIGtleXdvcmQgaW5cbiAqIGluIEVTNSAob3IgdHJhbnNwaWxlZCBFUzYpIGV4dGVuc2lvbnMvbWl4aW5zXG4gKiB0aGF0IHdhbnQgdG8gaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IsIHdoZXJlIHRoZSBzcGVjaWZpYyBzdXBlcmNsYXNzIHdpbGxcbiAqIGRlcGVuZCB1cG9uIHdoaWNoIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGFwcGxpZWQgdG8gYSBnaXZlbiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogRS5nLjpcbiAqICAgY2xhc3MgTWl4aW4ge1xuICogICAgIGZvbygpIHtcbiAqICAgICAgIGlmICh0aGlzLk1peGluLnN1cGVyLmZvbykge1xuICogICAgICAgICB0aGlzLk1peGluLnN1cGVyLmZvby5jYWxsKHRoaXMpOyAvLyBJbnZva2Ugc3VwZXJjbGFzcycgZm9vKClcbiAqICAgICAgIH1cbiAqICAgICAgIC8vIERvIE1peGluLXNwZWNpZmljIHdvcmsgaGVyZS4uLlxuICogICAgIH1cbiAqICAgfVxuICpcbiAqIEZvciBjb25zaXN0ZW5jeSwgRXh0ZW5zaWJsZSBpdHNlbGYgcmVjb3JkcyBpdHMgb3duIHN1cGVyY2xhc3MgYXMgT2JqZWN0LlxuICovXG5FeHRlbnNpYmxlLnByb3RvdHlwZS5zdXBlciA9IE9iamVjdC5wcm90b3R5cGU7XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgaWdub3JlUHJvcGVydHlOYW1lcyA9IFtdKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaWdub3JlUHJvcGVydHlOYW1lcy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBleHRlbnNpb24pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBleHRlbnNpb24gYXJlIGNsYXNzZXMgb3IgcGxhaW4gb2JqZWN0cy5cbiAgbGV0IGJhc2VJc0NsYXNzID0gaXNDbGFzcyhiYXNlKTtcbiAgbGV0IGV4dGVuc2lvbklzQ2xhc3MgPSBpc0NsYXNzKGV4dGVuc2lvbik7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqZXh0ZW5zaW9uKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZSBvZiBpdHMgb3duLlxuICBsZXQgZXh0ZW5zaW9uQmFzZSA9IGV4dGVuc2lvbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlbnNpb24ucHJvdG90eXBlKS5jb25zdHJ1Y3RvciA6XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVuc2lvbik7XG4gIGlmIChleHRlbnNpb25CYXNlICYmXG4gICAgICBleHRlbnNpb25CYXNlICE9PSBGdW5jdGlvbiAmJlxuICAgICAgZXh0ZW5zaW9uQmFzZSAhPT0gT2JqZWN0KSB7XG4gICAgLy8gVGhlIGV4dGVuc2lvbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgZXh0ZW5zaW9uJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gZXh0ZW5kKGJhc2UsIGV4dGVuc2lvbkJhc2UpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBleHRlbmRlZCBvYmplY3Qgd2UncmUgZ29pbmcgdG8gcmV0dXJuIGFzIGEgcmVzdWx0LlxuICBsZXQgcmVzdWx0O1xuICBpZiAoYmFzZUlzQ2xhc3MpIHtcbiAgICAvLyBDcmVhdGUgYSBzdWJjbGFzcyBvZiBiYXNlLiBPbmNlIFdlYktpdCBzdXBwb3J0cyBIVE1MRWxlbWVudCBhcyBhIHJlYWxcbiAgICAvLyBjbGFzcywgd2UgY2FuIGp1c3Qgc2F5OlxuICAgIC8vXG4gICAgLy8gICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHVudGlsIHRoYXQncyByZXNvbHZlZCwgd2UgaGF2ZSB0byBjb25zdHJ1Y3QgdGhlIGNsYXNzIG91cnNlbHZlcy5cbiAgICByZXN1bHQgPSBmdW5jdGlvbiBzdWJjbGFzcygpIHt9O1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQsIGJhc2UpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQucHJvdG90eXBlLCBiYXNlLnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ3JlYXRlIGEgcGxhaW4gb2JqZWN0IHRoYXQgc2ltcGx5IHVzZXMgdGhlIGJhc2UgYXMgYSBwcm90b3R5cGUuXG4gICAgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcbiAgfVxuXG4gIGxldCBzb3VyY2U7XG4gIGxldCB0YXJnZXQ7XG4gIGlmIChiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IEZ1bmN0aW9uLlxuICAgIC8vIFdlJ2QgcHJlZmVyIHRvIGdldCBieSBpbnRlcnJvZ2F0aW5nIEZ1bmN0aW9uIGl0c2VsZiwgYnV0IFdlYktpdCBmdW5jdGlvbnNcbiAgICAvLyBoYXZlIHNvbWUgcHJvcGVydGllcyAoYXJndW1lbnRzIGFuZCBjYWxsZXIpIHdoaWNoIGFyZSBub3QgcmV0dXJuZWQgYnlcbiAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikuXG4gICAgY29uc3QgRlVOQ1RJT05fUFJPUEVSVElFUyA9IFtcbiAgICAgICdhcmd1bWVudHMnLFxuICAgICAgJ2NhbGxlcicsXG4gICAgICAnbGVuZ3RoJyxcbiAgICAgICduYW1lJyxcbiAgICAgICdwcm90b3R5cGUnXG4gICAgXTtcbiAgICAvLyBFeHRlbmRpbmcgYSBjbGFzcyB3aXRoIGEgY2xhc3MuXG4gICAgLy8gV2UnbGwgY29weSBpbnN0YW5jZSBtZW1iZXJzIGluIGEgbW9tZW50LCBidXQgZmlyc3QgY29weSBzdGF0aWMgbWVtYmVycy5cbiAgICBjb3B5T3duUHJvcGVydGllcyhleHRlbnNpb24sIHJlc3VsdCwgRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgc291cmNlID0gZXh0ZW5zaW9uLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IHByb3RvdHlwZSBtZXRob2RzIGRpcmVjdGx5IHRvIHJlc3VsdC5cbiAgICBzb3VyY2UgPSBleHRlbnNpb24ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IGV4dGVuc2lvbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbjtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbjtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH1cbiAgY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIFsnY29uc3RydWN0b3InXSk7XG5cbiAgaWYgKGV4dGVuc2lvbi5uYW1lKSB7XG4gICAgLy8gVXNlIHRoZSBleHRlbnNpb24ncyBuYW1lICh1c3VhbGx5IHRoZSBuYW1lIG9mIGEgY2xhc3MnIGNvbnN0cnVjdG9yKSB0b1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgYmFjayB0byB0aGUgbmV3bHktY3JlYXRlZCBvYmplY3QgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICB0YXJnZXRbZXh0ZW5zaW9uLm5hbWVdID0gdGFyZ2V0O1xuXG4gICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXJjbGFzcy9zdXBlci1vYmplY3QuIFNlZSB0aGUgY29tbWVudHMgb25cbiAgICAvLyBFeHRlbnNpYmxlJ3MgXCJzdXBlclwiIHByb3BlcnR5LlxuICAgIHRhcmdldC5zdXBlciA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gUmV0dXJuIHRydWUgaWYgYyBpcyBhIEphdmFTY3JpcHQgY2xhc3MuXG4vLyBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuLy8gYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbi8vIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4vLyBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuLy8gZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbmZ1bmN0aW9uIGlzQ2xhc3MoYykge1xuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgfHwgICAgICAgICAgICAgICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIChjLnByb3RvdHlwZSAmJiBjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gYyk7IC8vIEhUTUxFbGVtZW50IGluIFdlYktpdFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGU7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuQXR0cmlidXRlTWFyc2hhbGxpbmcuc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS4gSWdub3JlIGNoYW5nZXMgaW4gc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcy5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKHByb3BlcnR5TmFtZSBpbiB0aGlzICYmICEocHJvcGVydHlOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuQXR0cmlidXRlTWFyc2hhbGxpbmcuc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZSA9PiB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuXG4vLyBDb252ZXJ0IGNhbWVsIGNhc2UgZm9vQmFyIG5hbWUgdG8gaHlwaGVuYXRlZCBmb28tYmFyLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBtID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIGcgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuIiwiLypcbiAqIFBvbHltZXItc3R5bGUgYXV0b21hdGljIG5vZGUgZmluZGluZy5cbiAqIFNlZSBodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZy5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5BdXRvbWF0aWNOb2RlRmluZGluZy5zdXBlci5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVFbGVtZW50IGZyb20gJy4vRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgcHJvdmlkZWQganVzdCBhcyBhIGNvbnZlbmllbmNlLiBPbmUgY291bGQgYWxzbyBzdGFydCB3aXRoXG4gKiBIVE1MRWxlbWVudCBhdCB0aGUgdG9wIGxldmVsLCBhbmQgYWRkIGV4dGVuc2liaWxpdHkgYnkgbWl4aW5nIGluIEV4dGVuc2libGUuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGUgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IEV4dGVuc2libGVFbGVtZW50ID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICpcbiAqIEZvciB0aGUgdGltZSBiZWluZywgdGhpcyBleHRlbnNpb24gcmV0YWlucyBzdXBwb3J0IGZvciBTaGFkb3cgRE9NIHYwLlxuICogVGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgZGVwcmVjYXRlZCBhcyBicm93c2VycyBpbXBsZW1lbnQgU2hhZG93IERPTSB2MS5cbiAqL1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgbGV0IGJhc2UgPSB0aGlzLlRlbXBsYXRlU3RhbXBpbmcuc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlKCk7XG4gICAgfVxuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSAmJiBVU0lOR19TSEFET1dfRE9NX1YwKSB7XG4gICAgICBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwpIHtcbiAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgIH1cbiAgICAvLyBUT0RPOiBTYXZlIHRoZSBwcm9jZXNzZWQgdGVtcGxhdGUgd2l0aCB0aGUgY29tcG9uZW50J3MgY2xhc3MgcHJvdG90eXBlXG4gICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gVVNJTkdfU0hBRE9XX0RPTV9WMCA/XG4gICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpIDogICAgICAgICAgICAgLy8gU2hhZG93IERPTSB2MFxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTsgIC8vIFNoYWRvdyBET00gdjFcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBvbGQgU2hhZG93IERPTSB2MC5cbmNvbnN0IFVTSU5HX1NIQURPV19ET01fVjAgPSAodHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jcmVhdGVTaGFkb3dSb290ICE9PSAndW5kZWZpbmVkJyk7XG5cblxuLy8gQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXBsYWNlIG9jY3VyZW5jZXMgb2YgdjEgc2xvdCBlbGVtZW50cyB3aXRoIHYwIGNvbnRlbnQgZWxlbWVudHMuXG4vLyBUaGlzIGRvZXMgbm90IHlldCBtYXAgbmFtZWQgc2xvdHMgdG8gY29udGVudCBzZWxlY3QgY2xhdXNlcy5cbmZ1bmN0aW9uIHBvbHlmaWxsU2xvdFdpdGhDb250ZW50KHRlbXBsYXRlKSB7XG4gIFtdLmZvckVhY2guY2FsbCh0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Nsb3QnKSwgc2xvdEVsZW1lbnQgPT4ge1xuICAgIGxldCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKTtcbiAgICBzbG90RWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250ZW50RWxlbWVudCwgc2xvdEVsZW1lbnQpO1xuICB9KTtcbn1cblxuLy8gSW52b2tlIGJhc2ljIHN0eWxlIHNoaW1taW5nIHdpdGggU2hhZG93Q1NTLlxuZnVuY3Rpb24gc2hpbVRlbXBsYXRlU3R5bGVzKHRlbXBsYXRlLCB0YWcpIHtcbiAgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiIsImltcG9ydCAqIGFzIHRlc3RFbGVtZW50cyBmcm9tIFwiLi90ZXN0RWxlbWVudHNcIjtcblxuc3VpdGUoXCJFbGVtZW50QmFzZVwiLCAoKSA9PiB7XG5cbiAgdGVzdChcImNvbXBvbmVudCBzdGFtcHMgc3RyaW5nIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHJlYWwgdGVtcGxhdGUgaW50byByb290XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gY3JlYXRlIGNvbXBvbmVudCBjbGFzcyB3aXRoIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKVwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCAncHJvcGVydHknKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5tZXRob2QoKSwgJ21ldGhvZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnZhbHVlLCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImh5cGhlbmF0ZWQgYXR0cmlidXRlIG1hcnNoYWxsZWQgdG8gY29ycmVzcG9uZGluZyBjYW1lbENhc2UgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2N1c3RvbS1wcm9wZXJ0eScsIFwiSGVsbG9cIik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuY3VzdG9tUHJvcGVydHksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gY2FuIGRlZmluZSBjcmVhdGVkQ2FsbGJhY2tcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG59KTtcbiIsImltcG9ydCBFeHRlbnNpYmxlIGZyb20gXCIuLi9leHRlbnNpYmxlL0V4dGVuc2libGVcIjtcblxuXG4vKiBTYW1wbGUgY2xhc3NlcyB1c2VkIGJ5IHRoZSB0ZXN0IHN1aXRlICovXG5cbi8qIEEgc2ltcGxlIGJhc2UgY2xhc3MgKi9cbmNsYXNzIEV4YW1wbGVCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZSB7XG4gIGZvbygpIHtcbiAgICByZXR1cm4gJ0V4YW1wbGVCYXNlJztcbiAgfVxufVxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgcHJvcGVydHkgKi9cbmNsYXNzIFByb3BlcnR5RXh0ZW5zaW9uIHtcbiAgZ2V0IHByb3BlcnR5KCkge1xuICAgIHJldHVybiAndmFsdWUnO1xuICB9XG59XG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBtZXRob2QgKi9cbmNsYXNzIE1ldGhvZEV4dGVuc2lvbiB7XG4gIG1ldGhvZCgpIHtcbiAgICBsZXQgc3VwZXJNZXRob2QgPSB0aGlzLk1ldGhvZEV4dGVuc2lvbi5zdXBlci5tZXRob2Q7XG4gICAgbGV0IHJlc3VsdCA9IHN1cGVyTWV0aG9kID8gc3VwZXJNZXRob2QuY2FsbCh0aGlzKSA6ICdleHRlbnNpb24gcmVzdWx0JztcbiAgICB0aGlzLmV4dGVuc2lvbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuXG5zdWl0ZShcIkV4dGVuc2libGVcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM2IGNsYXNzIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBnZXQgYmFyKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNhbiBleHRlbmQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKCkgc3ludGF4XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoe1xuICAgICAgYmFyOiB0cnVlXG4gICAgfSk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgbWV0aG9kXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGNhbiB1c2Ugc3VwZXIoKSB0byBpbnZva2UgYmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvblwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIHRoaXMuYmFzZU1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gJ2Jhc2UgcmVzdWx0JztcbiAgICAgIH1cbiAgICB9XG4gICAgU3ViY2xhc3MgPSBTdWJjbGFzcy5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2Jhc2UgcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJtdWx0aXBsZSBleHRlbnNpb25zIGNhbiBiZSBhcHBsaWVkIGluIG9uZSBjYWxsXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoXG4gICAgICBQcm9wZXJ0eUV4dGVuc2lvbixcbiAgICAgIE1ldGhvZEV4dGVuc2lvblxuICAgICk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGEgcGxhaW4gb2JqZWN0XCIsICgpID0+IHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICByZXR1cm4gJ3Jlc3VsdCc7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgZXh0ZW5zaW9uID0ge1xuICAgICAgcHJvcGVydHk6ICd2YWx1ZSdcbiAgICB9O1xuICAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqLCBleHRlbnNpb24pO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5tZXRob2QoKSwgJ3Jlc3VsdCcpO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gY2FuIGhhcyBtdWx0aXBsZSBsZXZlbHMgb2YgaW5oZXJpdGFuY2VcIiwgKCkgPT4ge1xuICAgIGNsYXNzIEV4dGVuc2lvblN1YmNsYXNzIGV4dGVuZHMgTWV0aG9kRXh0ZW5zaW9uIHtcbiAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgbGV0IHN1cGVyTWV0aG9kID0gdGhpcy5FeHRlbnNpb25TdWJjbGFzcy5zdXBlci5tZXRob2Q7XG4gICAgICAgIGlmIChzdXBlck1ldGhvZCkge1xuICAgICAgICAgIHN1cGVyTWV0aG9kLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5leHRlbnNpb25TdWJjbGFzc01ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgU3ViY2xhc3MgPSBFeHRlbnNpYmxlLmV4dGVuZChFeHRlbnNpb25TdWJjbGFzcyk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25TdWJjbGFzc01ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIHByb3BlcnR5IGNhbiByZWZlcmVuY2Ugc3VwZXJjbGFzcycgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFByb3BlcnR5RXh0ZW5zaW9uIHtcbiAgICAgIGdldCBwcm9wZXJ0eSgpIHtcbiAgICAgICAgbGV0IHN1cGVyUHJvdG90eXBlID0gdGhpcy5Qcm9wZXJ0eUV4dGVuc2lvbi5zdXBlcjtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBzdXBlclByb3RvdHlwZSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG90eXBlLCAncHJvcGVydHknKTtcbiAgICAgICAgcmV0dXJuIChkZXNjcmlwdG9yKSA/XG4gICAgICAgICAgZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6XG4gICAgICAgICAgJ2V4dGVuc2lvbiB2YWx1ZSc7XG4gICAgICB9XG4gICAgfVxuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXh0ZW5zaWJsZSB7XG4gICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIHJldHVybiAnYmFzZSB2YWx1ZSc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuZXh0ZW5kKFByb3BlcnR5RXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UucHJvcGVydHksICdiYXNlIHZhbHVlJyk7XG4gIH0pO1xuXG59KTtcbiIsImltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi9zcmMvRWxlbWVudEJhc2UnO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBhIHNpbXBsZSB0ZW1wbGF0ZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhTdHJpbmdUZW1wbGF0ZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScsIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBhIHJlYWwgdGVtcGxhdGUgKi9cbmxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG50ZW1wbGF0ZS5jb250ZW50LnRleHRDb250ZW50ID0gXCJIZWxsb1wiO1xuY2xhc3MgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXJlYWwtdGVtcGxhdGUnLCBFbGVtZW50V2l0aFJlYWxUZW1wbGF0ZSk7XG5cblxuLyogRWxlbWVudCBjcmVhdGVkIHZpYSBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKCkgKi9cbmxldCBFczVDbGFzc1ZpYUV4dGVuZCA9IEVsZW1lbnRCYXNlLmV4dGVuZCh7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3Byb3BlcnR5JztcbiAgfSxcbiAgbWV0aG9kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ21ldGhvZCc7XG4gIH0sXG4gIHZhbHVlOiAndmFsdWUnXG59KTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnLCBFczVDbGFzc1ZpYUV4dGVuZCk7XG5cblxuLyogRWxlbWVudCB3aXRoIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lICovXG5jbGFzcyBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1c3RvbVByb3BlcnR5O1xuICB9XG4gIHNldCBjdXN0b21Qcm9wZXJ0eSh2YWx1ZSkge1xuICAgIHRoaXMuX2N1c3RvbVByb3BlcnR5ID0gdmFsdWU7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknLCBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5KTtcblxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZC4gKi9cbmNsYXNzIENyZWF0ZWRFeHRlbnNpb24ge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLkNyZWF0ZWRFeHRlbnNpb24uc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIHRoaXMuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCA9IHRydWU7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbkVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbi5leHRlbmQoQ3JlYXRlZEV4dGVuc2lvbik7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbik7XG4iXX0=
