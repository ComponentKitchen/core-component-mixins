(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Extend classes/objects with other classes/objects.
 */

/*
 * A mapping of class prototypes to the corresponding extension that was used
 * to implement the extension. This is used by the super(extension, method)
 * facility that lets extension invoke superclass methods.
 *
 * NOTE: This map uses class prototypes, not classes themselves, as the keys.
 * This is done to support web components as extensible HTMLElement classes.
 * The document.createElement('custom-element') function can return an element
 * whose constructor is *not* the function passed to document.registerElement().
 * That is, element classes have a special munged constructor, and that
 * constructor can't get included in our map. We use prototypes instead, which
 * are left alone by document.registerElement().
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var extensionForPrototype = new Map();

var Extensible = (function () {
  function Extensible() {
    _classCallCheck(this, Extensible);
  }

  /*
   * Copy the given properties/methods to the target.
   */

  _createClass(Extensible, [{
    key: 'super',

    /*
     * Return the prototype that's above the one that implemented the given
     * extension in the prototype chain.
     *
     * This is used in ES5-compatible extensions to invoke base property/method
     * implementations, regardless of where the extension ended up in the
     * prototype chain. This can be used by ES5 extensions or transpiled
     * ES6-to-ES5 extensions. Pure ES6 extensions can make simple use of the
     * "super" keyword instead, but that won't work in transpiled ES6-to-ES5
     * (e.g., via Babel).
     */
    value: function _super(extension) {
      // TODO: Maintain this lookup in a Map instead of having to walk up the
      // prototype chain each time.
      var prototype = getPrototypeImplementingExtension(this, extension);
      return prototype && Object.getPrototypeOf(prototype);
    }

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
  }], [{
    key: 'extend',
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
  var baseIsClass = typeof base === 'function';
  var extensionIsClass = typeof extension === 'function';

  // Check to see if the *extension* has a base class/prototype of its own.
  var extensionBase = extensionIsClass ? Object.getPrototypeOf(extension.prototype).constructor : Object.getPrototypeOf(extension);
  if (extensionBase && extensionBase !== Function && extensionBase !== Object) {
    // The extension itself derives from another class/object.
    // Recurse, and extend with the extension's base first.
    base = extend(base, extensionBase);
  }

  var result = baseIsClass ?
  // Extend a real class by creating a subclass.
  (function (_base) {
    _inherits(subclass, _base);

    function subclass() {
      _classCallCheck(this, subclass);

      _get(Object.getPrototypeOf(subclass.prototype), 'constructor', this).apply(this, arguments);
    }

    return subclass;
  })(base) :
  // Extend a plain object by creating another plain object.
  Object.create(base);

  if (baseIsClass && extensionIsClass) {
    // Extending a class with a class.
    // Copy both static and instance methods.
    copyOwnProperties(extension, result, Object.getOwnPropertyNames(Function));
    copyOwnProperties(extension.prototype, result.prototype, ['constructor']);
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    copyOwnProperties(extension.prototype, result, ['constructor']);
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    copyOwnProperties(extension, result.prototype);
  } else {
    // Extending a plain object with a plain object.
    copyOwnProperties(extension, result);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(result.prototype, extension);

  return result;
}

/*
 * Return the prototype for the class/object that implemented the indicated
 * extension for the given object.
 */
function getPrototypeImplementingExtension(obj, extension) {
  for (var prototype = obj; prototype !== null; prototype = Object.getPrototypeOf(prototype)) {
    if (extensionForPrototype.get(prototype) === extension) {
      return prototype;
    }
  }
  return null;
}

exports['default'] = Extensible;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
/*
 * Marshall attributes to properties (and eventually vice versa).
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AttributeMarshalling = (function () {
  function AttributeMarshalling() {
    _classCallCheck(this, AttributeMarshalling);
  }

  // Convert camel case fooBar name to hyphenated foo-bar.

  _createClass(AttributeMarshalling, [{
    key: 'attributeChangedCallback',

    /*
     * Handle a change to the attribute with the given name.
     */
    value: function attributeChangedCallback(name, oldValue, newValue) {
      var base = this['super'](AttributeMarshalling).attributeChangedCallback;
      if (base) {
        base.call(this);
      }
      // this.log(`attribute ${name} changed to ${newValue}`);
      // If the attribute name corresponds to a property name, then set that
      // property.
      // TODO: This looks up the existence of the property each time. It would
      // be more efficient to, e.g., do a one-time computation of all properties
      // defined by the element (including base classes).
      // TODO: Ignore standard attribute name.
      var propertyName = attributeToPropertyName(name);
      if (hasProperty(this, propertyName)) {
        this[propertyName] = newValue;
      }
    }
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      var base = this['super'](AttributeMarshalling).createdCallback;
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

function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

function hasProperty(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var obj = _x,
        name = _x2;
    _again = false;

    if (!obj) {
      return false;
    } else if (obj.hasOwnProperty(name)) {
      return true;
    } else {
      _x = Object.getPrototypeOf(obj);
      _x2 = name;
      _again = true;
      continue _function;
    }
  }
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

exports['default'] = AttributeMarshalling;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/*
 * Polymer-style automatic node finding.
 * See https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AutomaticNodeFinding = (function () {
  function AutomaticNodeFinding() {
    _classCallCheck(this, AutomaticNodeFinding);
  }

  _createClass(AutomaticNodeFinding, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      var base = this['super'](AutomaticNodeFinding).createdCallback;
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

exports['default'] = AutomaticNodeFinding;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/*
 * A sample general-purpose base class for defining custom elements that mixes
 * in some common features: template stamping into a shadow root, automatic node
 * finding, and marshalling between attributes and properties.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ExtensibleElement2 = require('./ExtensibleElement');

var _ExtensibleElement3 = _interopRequireDefault(_ExtensibleElement2);

var _TemplateStamping = require('./TemplateStamping');

var _TemplateStamping2 = _interopRequireDefault(_TemplateStamping);

var _AutomaticNodeFinding = require('./AutomaticNodeFinding');

var _AutomaticNodeFinding2 = _interopRequireDefault(_AutomaticNodeFinding);

var _AttributeMarshalling = require('./AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

var ElementBase = (function (_ExtensibleElement) {
  _inherits(ElementBase, _ExtensibleElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    _get(Object.getPrototypeOf(ElementBase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ElementBase, [{
    key: 'log',

    /* For debugging */
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
})(_ExtensibleElement3['default']);

ElementBase = ElementBase.extend(_TemplateStamping2['default'], // before node finding, so shadow root is populated
_AutomaticNodeFinding2['default'], // before marshalling, so marshalled properties can use it
_AttributeMarshalling2['default']);

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{"./AttributeMarshalling":2,"./AutomaticNodeFinding":3,"./ExtensibleElement":5,"./TemplateStamping":6}],5:[function(require,module,exports){
/*
 * An extensible HTML element.
 *
 * This class is provided just as a convenience. One could also start with
 * HTMLElement at the top level, and add extensibility by mixing in Extensible.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extensibleExtensible = require('../extensible/Extensible');

var _extensibleExtensible2 = _interopRequireDefault(_extensibleExtensible);

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
var ExtensibleElement = _extensibleExtensible2['default'].extend.call(HTMLElement, _extensibleExtensible2['default']);

exports['default'] = ExtensibleElement;
module.exports = exports['default'];

},{"../extensible/Extensible":1}],6:[function(require,module,exports){
/*
 * Element extension for template stamping. If a component defines a template
 * property (as a string or referencing a HTML template), when the component
 * class is instantiated, a shadow root will be created on the instance, and
 * the contents of the template will be cloned into the shadow root.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TemplateStamping = (function () {
  function TemplateStamping() {
    _classCallCheck(this, TemplateStamping);
  }

  /*
   * Convert a plain string of HTML into a real template element.
   */

  _createClass(TemplateStamping, [{
    key: 'createdCallback',

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    value: function createdCallback() {
      // this.log("created");
      var base = this['super'](TemplateStamping).createdCallback;
      if (base) {
        base();
      }
      var template = this.template;
      if (typeof template === 'string') {
        // Upgrade plain string to real template.
        template = createTemplateWithInnerHTML(template);
      }
      if (template) {
        // this.log("cloning template into shadow root");
        var root = this.createShadowRoot();
        var clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
    }
  }]);

  return TemplateStamping;
})();

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

exports['default'] = TemplateStamping;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _testElements = require("./testElements");

var testElements = _interopRequireWildcard(_testElements);

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
      var superMethod = this['super'](MethodExtension).method;
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
          var superMethod = this['super'](ExtensionSubclass).method;
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
          var superPrototype = this['super'](PropertyExtension);
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

},{"../extensible/Extensible":1}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _srcElementBase = require('../src/ElementBase');

var _srcElementBase2 = _interopRequireDefault(_srcElementBase);

/* Element with a simple template */

var ElementWithStringTemplate = (function (_ElementBase) {
  _inherits(ElementWithStringTemplate, _ElementBase);

  function ElementWithStringTemplate() {
    _classCallCheck(this, ElementWithStringTemplate);

    _get(Object.getPrototypeOf(ElementWithStringTemplate.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ElementWithStringTemplate, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithStringTemplate;
})(_srcElementBase2['default']);

document.registerElement('element-with-string-template', ElementWithStringTemplate);

/* Element with a real template */
var template = document.createElement('template');
template.content.textContent = "Hello";

var ElementWithRealTemplate = (function (_ElementBase2) {
  _inherits(ElementWithRealTemplate, _ElementBase2);

  function ElementWithRealTemplate() {
    _classCallCheck(this, ElementWithRealTemplate);

    _get(Object.getPrototypeOf(ElementWithRealTemplate.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ElementWithRealTemplate, [{
    key: 'template',
    get: function get() {
      return template;
    }
  }]);

  return ElementWithRealTemplate;
})(_srcElementBase2['default']);

document.registerElement('element-with-real-template', ElementWithRealTemplate);

/* Element created via ES5-compatible .extend() */
var Es5ClassViaExtend = _srcElementBase2['default'].extend(Object.defineProperties({
  method: function method() {
    return 'method';
  },
  value: 'value'
}, {
  customProperty: {
    get: function get() {
      return 'property';
    },
    configurable: true,
    enumerable: true
  }
}));
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);

/* Element with camelCase property name */

var ElementWithCamelCaseProperty = (function (_ElementBase3) {
  _inherits(ElementWithCamelCaseProperty, _ElementBase3);

  function ElementWithCamelCaseProperty() {
    _classCallCheck(this, ElementWithCamelCaseProperty);

    _get(Object.getPrototypeOf(ElementWithCamelCaseProperty.prototype), 'constructor', this).apply(this, arguments);
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
})(_srcElementBase2['default']);

document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);

/* Extension that defines a createdCallback method. */

var CreatedExtension = (function () {
  function CreatedExtension() {
    _classCallCheck(this, CreatedExtension);
  }

  _createClass(CreatedExtension, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var base = this['super'](CreatedExtension).createdCallback;
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

    _get(Object.getPrototypeOf(ElementWithCreatedExtension.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ElementWithCreatedExtension, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithCreatedExtension;
})(_srcElementBase2['default']);

ElementWithCreatedExtension = ElementWithCreatedExtension.extend(CreatedExtension);
document.registerElement('element-with-created-extension', ElementWithCreatedExtension);

},{"../src/ElementBase":4}]},{},[7,8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FeHRlbnNpYmxlRWxlbWVudC5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L0VsZW1lbnRCYXNlLnRlc3RzLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3Rlc3QvRXh0ZW5zaWJsZS50ZXN0cy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNrQkEsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztJQUdoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7Ozs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7V0FhVCxnQkFBQyxTQUFTLEVBQUU7OztBQUdmLFVBQUksU0FBUyxHQUFHLGlDQUFpQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxhQUFPLFNBQVMsSUFB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ZUFBZSxHQUFHLEtBQUssQ0FBQztLQUM5Qjs7O1NBTkcsNEJBQTRCOzs7QUFRbEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQ0FBa0MsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDOzs7O0lBSXJGLGdCQUFnQjtXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7O2VBQWhCLGdCQUFnQjs7V0FDTCwyQkFBRztBQUNoQixVQUFJLElBQUksR0FBRyxJQUFJLFNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQztBQUN4RCxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7QUFDRCxVQUFJLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDO0tBQzdDOzs7U0FQRyxnQkFBZ0I7OztJQVNoQiwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7K0JBQTNCLDJCQUEyQjs7O2VBQTNCLDJCQUEyQjs7U0FDbkIsZUFBRztBQUNiLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FIRywyQkFBMkI7OztBQUtqQywyQkFBMkIsR0FBRywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuRixRQUFRLENBQUMsZUFBZSxDQUFDLGdDQUFnQyxFQUFFLDJCQUEyQixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIEV4dGVuZCBjbGFzc2VzL29iamVjdHMgd2l0aCBvdGhlciBjbGFzc2VzL29iamVjdHMuXG4gKi9cblxuXG4vKlxuICogQSBtYXBwaW5nIG9mIGNsYXNzIHByb3RvdHlwZXMgdG8gdGhlIGNvcnJlc3BvbmRpbmcgZXh0ZW5zaW9uIHRoYXQgd2FzIHVzZWRcbiAqIHRvIGltcGxlbWVudCB0aGUgZXh0ZW5zaW9uLiBUaGlzIGlzIHVzZWQgYnkgdGhlIHN1cGVyKGV4dGVuc2lvbiwgbWV0aG9kKVxuICogZmFjaWxpdHkgdGhhdCBsZXRzIGV4dGVuc2lvbiBpbnZva2Ugc3VwZXJjbGFzcyBtZXRob2RzLlxuICpcbiAqIE5PVEU6IFRoaXMgbWFwIHVzZXMgY2xhc3MgcHJvdG90eXBlcywgbm90IGNsYXNzZXMgdGhlbXNlbHZlcywgYXMgdGhlIGtleXMuXG4gKiBUaGlzIGlzIGRvbmUgdG8gc3VwcG9ydCB3ZWIgY29tcG9uZW50cyBhcyBleHRlbnNpYmxlIEhUTUxFbGVtZW50IGNsYXNzZXMuXG4gKiBUaGUgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY3VzdG9tLWVsZW1lbnQnKSBmdW5jdGlvbiBjYW4gcmV0dXJuIGFuIGVsZW1lbnRcbiAqIHdob3NlIGNvbnN0cnVjdG9yIGlzICpub3QqIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCkuXG4gKiBUaGF0IGlzLCBlbGVtZW50IGNsYXNzZXMgaGF2ZSBhIHNwZWNpYWwgbXVuZ2VkIGNvbnN0cnVjdG9yLCBhbmQgdGhhdFxuICogY29uc3RydWN0b3IgY2FuJ3QgZ2V0IGluY2x1ZGVkIGluIG91ciBtYXAuIFdlIHVzZSBwcm90b3R5cGVzIGluc3RlYWQsIHdoaWNoXG4gKiBhcmUgbGVmdCBhbG9uZSBieSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqL1xubGV0IGV4dGVuc2lvbkZvclByb3RvdHlwZSA9IG5ldyBNYXAoKTtcblxuXG5jbGFzcyBFeHRlbnNpYmxlIHtcblxuICAvKlxuICAgKiBSZXR1cm4gdGhlIHByb3RvdHlwZSB0aGF0J3MgYWJvdmUgdGhlIG9uZSB0aGF0IGltcGxlbWVudGVkIHRoZSBnaXZlblxuICAgKiBleHRlbnNpb24gaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIGluIEVTNS1jb21wYXRpYmxlIGV4dGVuc2lvbnMgdG8gaW52b2tlIGJhc2UgcHJvcGVydHkvbWV0aG9kXG4gICAqIGltcGxlbWVudGF0aW9ucywgcmVnYXJkbGVzcyBvZiB3aGVyZSB0aGUgZXh0ZW5zaW9uIGVuZGVkIHVwIGluIHRoZVxuICAgKiBwcm90b3R5cGUgY2hhaW4uIFRoaXMgY2FuIGJlIHVzZWQgYnkgRVM1IGV4dGVuc2lvbnMgb3IgdHJhbnNwaWxlZFxuICAgKiBFUzYtdG8tRVM1IGV4dGVuc2lvbnMuIFB1cmUgRVM2IGV4dGVuc2lvbnMgY2FuIG1ha2Ugc2ltcGxlIHVzZSBvZiB0aGVcbiAgICogXCJzdXBlclwiIGtleXdvcmQgaW5zdGVhZCwgYnV0IHRoYXQgd29uJ3Qgd29yayBpbiB0cmFuc3BpbGVkIEVTNi10by1FUzVcbiAgICogKGUuZy4sIHZpYSBCYWJlbCkuXG4gICAqL1xuICBzdXBlcihleHRlbnNpb24pIHtcbiAgICAvLyBUT0RPOiBNYWludGFpbiB0aGlzIGxvb2t1cCBpbiBhIE1hcCBpbnN0ZWFkIG9mIGhhdmluZyB0byB3YWxrIHVwIHRoZVxuICAgIC8vIHByb3RvdHlwZSBjaGFpbiBlYWNoIHRpbWUuXG4gICAgbGV0IHByb3RvdHlwZSA9IGdldFByb3RvdHlwZUltcGxlbWVudGluZ0V4dGVuc2lvbih0aGlzLCBleHRlbnNpb24pO1xuICAgIHJldHVybiBwcm90b3R5cGUgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSwgRXh0ZW5zaW9uMiwgRXh0ZW5zaW9uMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgZXh0ZW5zaW9ucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSkuZXh0ZW5kKEV4dGVuc2lvbjIpLmV4dGVuZChFeHRlbnNpb24zKVxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgc3RhdGljYWxseSBpbnZva2VkIHRvIGV4dGVuZCBwbGFpbiBvYmplY3RzOlxuICAgKlxuICAgKiAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqMSwgb2JqMik7XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggZXh0ZW5zaW9uIGluIHR1cm4uIFRoZSByZXN1bHQgYmVjb21lc1xuICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IGV4dGVuc2lvbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBleHRlbnNpb25zLnJlZHVjZShleHRlbmQsIHRoaXMpO1xuICB9XG5cbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gcHJvcGVydGllcy9tZXRob2RzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBleHRlbnNpb24pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBleHRlbnNpb24gYXJlIGNsYXNzZXMgb3IgcGxhaW4gb2JqZWN0cy5cbiAgbGV0IGJhc2VJc0NsYXNzID0gKHR5cGVvZiBiYXNlID09PSAnZnVuY3Rpb24nKTtcbiAgbGV0IGV4dGVuc2lvbklzQ2xhc3MgPSAodHlwZW9mIGV4dGVuc2lvbiA9PT0gJ2Z1bmN0aW9uJyk7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqZXh0ZW5zaW9uKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZSBvZiBpdHMgb3duLlxuICBsZXQgZXh0ZW5zaW9uQmFzZSA9IGV4dGVuc2lvbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlbnNpb24ucHJvdG90eXBlKS5jb25zdHJ1Y3RvciA6XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVuc2lvbik7XG4gIGlmIChleHRlbnNpb25CYXNlICYmXG4gICAgICBleHRlbnNpb25CYXNlICE9PSBGdW5jdGlvbiAmJlxuICAgICAgZXh0ZW5zaW9uQmFzZSAhPT0gT2JqZWN0KSB7XG4gICAgLy8gVGhlIGV4dGVuc2lvbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgZXh0ZW5zaW9uJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gZXh0ZW5kKGJhc2UsIGV4dGVuc2lvbkJhc2UpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGJhc2VJc0NsYXNzID9cbiAgICAvLyBFeHRlbmQgYSByZWFsIGNsYXNzIGJ5IGNyZWF0aW5nIGEgc3ViY2xhc3MuXG4gICAgY2xhc3Mgc3ViY2xhc3MgZXh0ZW5kcyBiYXNlIHt9IDpcbiAgICAvLyBFeHRlbmQgYSBwbGFpbiBvYmplY3QgYnkgY3JlYXRpbmcgYW5vdGhlciBwbGFpbiBvYmplY3QuXG4gICAgT2JqZWN0LmNyZWF0ZShiYXNlKTtcblxuICBpZiAoYmFzZUlzQ2xhc3MgJiYgZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IGJvdGggc3RhdGljIGFuZCBpbnN0YW5jZSBtZXRob2RzLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbiwgcmVzdWx0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikpO1xuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbi5wcm90b3R5cGUsIHJlc3VsdC5wcm90b3R5cGUsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbi5wcm90b3R5cGUsIHJlc3VsdCwgWydjb25zdHJ1Y3RvciddKTtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IGV4dGVuc2lvbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIGNvcHlPd25Qcm9wZXJ0aWVzKGV4dGVuc2lvbiwgcmVzdWx0LnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgY29weU93blByb3BlcnRpZXMoZXh0ZW5zaW9uLCByZXN1bHQpO1xuICB9XG5cbiAgLy8gUmVtZW1iZXIgd2hpY2ggZXh0ZW5zaW9uIHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0IGV4dGVuZGVkXG4gIC8vIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIGV4dGVuc2lvbkZvclByb3RvdHlwZS5zZXQocmVzdWx0LnByb3RvdHlwZSwgZXh0ZW5zaW9uKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKlxuICogUmV0dXJuIHRoZSBwcm90b3R5cGUgZm9yIHRoZSBjbGFzcy9vYmplY3QgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkXG4gKiBleHRlbnNpb24gZm9yIHRoZSBnaXZlbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3RvdHlwZUltcGxlbWVudGluZ0V4dGVuc2lvbihvYmosIGV4dGVuc2lvbikge1xuICBmb3IgKGxldCBwcm90b3R5cGUgPSBvYmo7IHByb3RvdHlwZSAhPT0gbnVsbDsgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSkpIHtcbiAgICBpZiAoZXh0ZW5zaW9uRm9yUHJvdG90eXBlLmdldChwcm90b3R5cGUpID09PSBleHRlbnNpb24pIHtcbiAgICAgIHJldHVybiBwcm90b3R5cGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGU7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5jbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoQXR0cmlidXRlTWFyc2hhbGxpbmcpLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICAvLyB0aGlzLmxvZyhgYXR0cmlidXRlICR7bmFtZX0gY2hhbmdlZCB0byAke25ld1ZhbHVlfWApO1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS5cbiAgICAvLyBUT0RPOiBUaGlzIGxvb2tzIHVwIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHByb3BlcnR5IGVhY2ggdGltZS4gSXQgd291bGRcbiAgICAvLyBiZSBtb3JlIGVmZmljaWVudCB0bywgZS5nLiwgZG8gYSBvbmUtdGltZSBjb21wdXRhdGlvbiBvZiBhbGwgcHJvcGVydGllc1xuICAgIC8vIGRlZmluZWQgYnkgdGhlIGVsZW1lbnQgKGluY2x1ZGluZyBiYXNlIGNsYXNzZXMpLlxuICAgIC8vIFRPRE86IElnbm9yZSBzdGFuZGFyZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGhhc1Byb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoQXR0cmlidXRlTWFyc2hhbGxpbmcpLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGUgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgbSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCBnID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBBdHRyaWJ1dGVNYXJzaGFsbGluZztcbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoQXV0b21hdGljTm9kZUZpbmRpbmcpLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9tYXRpY05vZGVGaW5kaW5nO1xuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVFbGVtZW50IGZyb20gJy4vRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgcHJvdmlkZWQganVzdCBhcyBhIGNvbnZlbmllbmNlLiBPbmUgY291bGQgYWxzbyBzdGFydCB3aXRoXG4gKiBIVE1MRWxlbWVudCBhdCB0aGUgdG9wIGxldmVsLCBhbmQgYWRkIGV4dGVuc2liaWxpdHkgYnkgbWl4aW5nIGluIEV4dGVuc2libGUuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGUgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IEV4dGVuc2libGVFbGVtZW50ID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICovXG5cblxuY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoVGVtcGxhdGVTdGFtcGluZykuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlKCk7XG4gICAgfVxuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLypcbiAqIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZVN0YW1waW5nO1xuIiwiaW1wb3J0ICogYXMgdGVzdEVsZW1lbnRzIGZyb20gXCIuL3Rlc3RFbGVtZW50c1wiO1xuXG5zdWl0ZShcIkVsZW1lbnRCYXNlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyBzdHJpbmcgdGVtcGxhdGUgaW50byByb290XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnKTtcbiAgICBhc3NlcnQoZWxlbWVudC5zaGFkb3dSb290KTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5zaGFkb3dSb290LnRleHRDb250ZW50LnRyaW0oKSwgXCJIZWxsb1wiKTtcbiAgfSk7XG5cbiAgdGVzdChcImNvbXBvbmVudCBzdGFtcHMgcmVhbCB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXJlYWwtdGVtcGxhdGUnKTtcbiAgICBhc3NlcnQoZWxlbWVudC5zaGFkb3dSb290KTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5zaGFkb3dSb290LnRleHRDb250ZW50LnRyaW0oKSwgXCJIZWxsb1wiKTtcbiAgfSk7XG5cbiAgdGVzdChcImNhbiBjcmVhdGUgY29tcG9uZW50IGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VzNS1jbGFzcy12aWEtZXh0ZW5kJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuY3VzdG9tUHJvcGVydHksICdwcm9wZXJ0eScpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50Lm1ldGhvZCgpLCAnbWV0aG9kJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQudmFsdWUsICd2YWx1ZScpO1xuICB9KTtcblxuICB0ZXN0KFwiaHlwaGVuYXRlZCBhdHRyaWJ1dGUgbWFyc2hhbGxlZCB0byBjb3JyZXNwb25kaW5nIGNhbWVsQ2FzZSBwcm9wZXJ0eVwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtY2FtZWwtY2FzZS1wcm9wZXJ0eScpO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChlbGVtZW50LmN1c3RvbVByb3BlcnR5KTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY3VzdG9tLXByb3BlcnR5JywgXCJIZWxsb1wiKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgXCJIZWxsb1wiKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBjYW4gZGVmaW5lIGNyZWF0ZWRDYWxsYmFja1wiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtY3JlYXRlZC1leHRlbnNpb24nKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5zaGFkb3dSb290LnRleHRDb250ZW50LnRyaW0oKSwgXCJIZWxsb1wiKTtcbiAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IEV4dGVuc2libGUgZnJvbSBcIi4uL2V4dGVuc2libGUvRXh0ZW5zaWJsZVwiO1xuXG5cbi8qIFNhbXBsZSBjbGFzc2VzIHVzZWQgYnkgdGhlIHRlc3Qgc3VpdGUgKi9cblxuLyogQSBzaW1wbGUgYmFzZSBjbGFzcyAqL1xuY2xhc3MgRXhhbXBsZUJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlIHtcbiAgZm9vKCkge1xuICAgIHJldHVybiAnRXhhbXBsZUJhc2UnO1xuICB9XG59XG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBwcm9wZXJ0eSAqL1xuY2xhc3MgUHJvcGVydHlFeHRlbnNpb24ge1xuICBnZXQgcHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICd2YWx1ZSc7XG4gIH1cbn1cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIG1ldGhvZCAqL1xuY2xhc3MgTWV0aG9kRXh0ZW5zaW9uIHtcbiAgbWV0aG9kKCkge1xuICAgIGxldCBzdXBlck1ldGhvZCA9IHRoaXMuc3VwZXIoTWV0aG9kRXh0ZW5zaW9uKS5tZXRob2Q7XG4gICAgbGV0IHJlc3VsdCA9IHN1cGVyTWV0aG9kID8gc3VwZXJNZXRob2QuY2FsbCh0aGlzKSA6ICdleHRlbnNpb24gcmVzdWx0JztcbiAgICB0aGlzLmV4dGVuc2lvbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuXG5zdWl0ZShcIkV4dGVuc2libGVcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM2IGNsYXNzIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBnZXQgYmFyKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNhbiBleHRlbmQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKCkgc3ludGF4XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoe1xuICAgICAgYmFyOiB0cnVlXG4gICAgfSk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgbWV0aG9kXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGNhbiB1c2Ugc3VwZXIoKSB0byBpbnZva2UgYmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvblwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIHRoaXMuYmFzZU1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gJ2Jhc2UgcmVzdWx0JztcbiAgICAgIH1cbiAgICB9XG4gICAgU3ViY2xhc3MgPSBTdWJjbGFzcy5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2Jhc2UgcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJtdWx0aXBsZSBleHRlbnNpb25zIGNhbiBiZSBhcHBsaWVkIGluIG9uZSBjYWxsXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoXG4gICAgICBQcm9wZXJ0eUV4dGVuc2lvbixcbiAgICAgIE1ldGhvZEV4dGVuc2lvblxuICAgICk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGEgcGxhaW4gb2JqZWN0XCIsICgpID0+IHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICByZXR1cm4gJ3Jlc3VsdCc7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgZXh0ZW5zaW9uID0ge1xuICAgICAgcHJvcGVydHk6ICd2YWx1ZSdcbiAgICB9O1xuICAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqLCBleHRlbnNpb24pO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5tZXRob2QoKSwgJ3Jlc3VsdCcpO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gY2FuIGhhcyBtdWx0aXBsZSBsZXZlbHMgb2YgaW5oZXJpdGFuY2VcIiwgKCkgPT4ge1xuICAgIGNsYXNzIEV4dGVuc2lvblN1YmNsYXNzIGV4dGVuZHMgTWV0aG9kRXh0ZW5zaW9uIHtcbiAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgbGV0IHN1cGVyTWV0aG9kID0gdGhpcy5zdXBlcihFeHRlbnNpb25TdWJjbGFzcykubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IFN1YmNsYXNzID0gRXh0ZW5zaWJsZS5leHRlbmQoRXh0ZW5zaW9uU3ViY2xhc3MpO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBwcm9wZXJ0eSBjYW4gcmVmZXJlbmNlIHN1cGVyY2xhc3MnIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBjbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIGxldCBzdXBlclByb3RvdHlwZSA9IHRoaXMuc3VwZXIoUHJvcGVydHlFeHRlbnNpb24pO1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IHN1cGVyUHJvdG90eXBlICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90b3R5cGUsICdwcm9wZXJ0eScpO1xuICAgICAgICByZXR1cm4gKGRlc2NyaXB0b3IpID9cbiAgICAgICAgICBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpIDpcbiAgICAgICAgICAnZXh0ZW5zaW9uIHZhbHVlJztcbiAgICAgIH1cbiAgICB9XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeHRlbnNpYmxlIHtcbiAgICAgIGdldCBwcm9wZXJ0eSgpIHtcbiAgICAgICAgcmV0dXJuICdiYXNlIHZhbHVlJztcbiAgICAgIH1cbiAgICB9XG4gICAgU3ViY2xhc3MgPSBTdWJjbGFzcy5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ2Jhc2UgdmFsdWUnKTtcbiAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgc2ltcGxlIHRlbXBsYXRlICovXG5jbGFzcyBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJywgRWxlbWVudFdpdGhTdHJpbmdUZW1wbGF0ZSk7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgcmVhbCB0ZW1wbGF0ZSAqL1xubGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbnRlbXBsYXRlLmNvbnRlbnQudGV4dENvbnRlbnQgPSBcIkhlbGxvXCI7XG5jbGFzcyBFbGVtZW50V2l0aFJlYWxUZW1wbGF0ZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScsIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IGNyZWF0ZWQgdmlhIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKSAqL1xubGV0IEVzNUNsYXNzVmlhRXh0ZW5kID0gRWxlbWVudEJhc2UuZXh0ZW5kKHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiAncHJvcGVydHknO1xuICB9LFxuICBtZXRob2Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnbWV0aG9kJztcbiAgfSxcbiAgdmFsdWU6ICd2YWx1ZSdcbn0pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcsIEVzNUNsYXNzVmlhRXh0ZW5kKTtcblxuXG4vKiBFbGVtZW50IHdpdGggY2FtZWxDYXNlIHByb3BlcnR5IG5hbWUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VzdG9tUHJvcGVydHk7XG4gIH1cbiAgc2V0IGN1c3RvbVByb3BlcnR5KHZhbHVlKSB7XG4gICAgdGhpcy5fY3VzdG9tUHJvcGVydHkgPSB2YWx1ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY2FtZWwtY2FzZS1wcm9wZXJ0eScsIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkpO1xuXG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBjcmVhdGVkQ2FsbGJhY2sgbWV0aG9kLiAqL1xuY2xhc3MgQ3JlYXRlZEV4dGVuc2lvbiB7XG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoQ3JlYXRlZEV4dGVuc2lvbikuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIHRoaXMuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCA9IHRydWU7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbkVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbi5leHRlbmQoQ3JlYXRlZEV4dGVuc2lvbik7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbik7XG4iXX0=
