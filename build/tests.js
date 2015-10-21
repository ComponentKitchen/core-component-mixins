(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      this['super'](AttributeMarshalling, 'attributeChangedCallback');
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

      this['super'](AttributeMarshalling, 'createdCallback');
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

},{}],2:[function(require,module,exports){
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

      this['super'](AutomaticNodeFinding, 'createdCallback');
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

},{}],3:[function(require,module,exports){
/*
 * General-purpose base class for defining custom elements.
 *
 * This ElementBase class implements template stamping into a shadow root,
 * and marshalling between attributes and properties.
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

ElementBase = ElementBase.extend(_TemplateStamping2['default'], _AutomaticNodeFinding2['default'], // before marshalling, so marshalled properties can use it
_AttributeMarshalling2['default']);

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{"./AttributeMarshalling":1,"./AutomaticNodeFinding":2,"./ExtensibleElement":5,"./TemplateStamping":6}],4:[function(require,module,exports){
/*
 * A class which can be extended with other classes.
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
 * are left along by document.registerElement().
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var extensionForPrototype = new Map();

var ExtensibleClass = (function () {
  function ExtensibleClass() {
    _classCallCheck(this, ExtensibleClass);
  }

  /*
   * Copy the given members to the target.
   */

  _createClass(ExtensibleClass, [{
    key: 'super',

    /*
     * Call a superclass implementation of a method if it exists.
     *
     * This walks up the object's class hierarchy in search of the class that
     * implemented the given extension. Then it goes up one level, and looks up
     * the hierarchy from that point to see if any superclass implements the
     * named method. If a superclass method implementation is found, it is invoked
     * with the given arguments, and the result of that is returned.
     */
    value: function _super(extension, name) {
      var prototype = getPrototypeImplementingExtension(this, extension);
      if (prototype) {
        var superProto = Object.getPrototypeOf(prototype);
        if (superProto) {
          var descriptor = getPropertyDescriptor(superProto, name);
          if (descriptor && typeof descriptor.value === 'function') {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              args[_key - 2] = arguments[_key];
            }

            return descriptor.value.apply(this, args);
          }
        }
      }
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
     */
  }], [{
    key: 'extend',
    value: function extend() {
      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      return extensions.reduce(extendClass, this);
    }
  }]);

  return ExtensibleClass;
})();

function copyMembers(members, target, ignoreMembers) {
  Object.getOwnPropertyNames(members).forEach(function (name) {
    if (!ignoreMembers || ignoreMembers.indexOf(name) < 0) {
      var descriptor = Object.getOwnPropertyDescriptor(members, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

/*
 * Return a new subclass of the given baseclass. The new class' prototype will
 * include the members of the indicated extension.
 */
function extendClass(baseClass, extension) {
  var subclass = (function (_baseClass) {
    _inherits(subclass, _baseClass);

    function subclass() {
      _classCallCheck(this, subclass);

      _get(Object.getPrototypeOf(subclass.prototype), 'constructor', this).apply(this, arguments);
    }

    return subclass;
  })(baseClass);

  if (typeof extension === 'function') {
    // Extending with a class.
    // Copy both static and instance methods.
    copyMembers(extension, subclass, Object.getOwnPropertyNames(Function));
    copyMembers(extension.prototype, subclass.prototype, ['constructor']);
  } else {
    // Extending with a plain object.
    copyMembers(extension, subclass.prototype);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(subclass.prototype, extension);

  return subclass;
}

/*
 * Return the prototype for the class that implemented the indicated extension
 * for the given object.
 *
 */
function getPrototypeImplementingExtension(obj, extension) {
  for (var prototype = obj; prototype !== null; prototype = Object.getPrototypeOf(prototype)) {
    if (extensionForPrototype.get(prototype) === extension) {
      return prototype;
    }
  }
  return null;
}

/*
 * Return a descriptor for the named property, looking up the class hierarchy.
 */
function getPropertyDescriptor(_x4, _x5) {
  var _again2 = true;

  _function2: while (_again2) {
    var prototype = _x4,
        name = _x5;
    descriptor = superProto = undefined;
    _again2 = false;

    if (!prototype) {
      return null;
    }
    var descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor) {
      return descriptor;
    }
    var superProto = Object.getPrototypeOf(prototype);
    _x4 = superProto;
    _x5 = name;
    _again2 = true;
    continue _function2;
  }
}

exports['default'] = ExtensibleClass;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
/*
 * An extensible HTML element
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ExtensibleClass = require('./ExtensibleClass');

var _ExtensibleClass2 = _interopRequireDefault(_ExtensibleClass);

// We use ExtensibleClass to add its own members to a HTMLElement subclass.
// The result is an HTMLElement that with .extend() and super() support.
var ExtensibleElement = _ExtensibleClass2['default'].extend.call(HTMLElement, _ExtensibleClass2['default']);

exports['default'] = ExtensibleElement;
module.exports = exports['default'];

},{"./ExtensibleClass":4}],6:[function(require,module,exports){
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
      this['super'](TemplateStamping, 'createdCallback');
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

  test("component can use extension to define a property", function () {
    var element = document.createElement('element-with-property-extension');
    assert.equal(element.property, 'value');
  });

  test("extension method invokes both extension's and component's implementation", function () {
    var element = document.createElement('element-with-method-extension');
    var result = element.method();
    assert.equal(result, 'component result');
    assert(element.extensionMethodInvoked);
    assert(element.componentMethodInvoked);
  });

  test("extension can define createdCallback", function () {
    var element = document.createElement('element-with-created-extension');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });

  test("component can have multiple extensions", function () {
    var element = document.createElement('element-with-multiple-extensions');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.property, 'value');
    element.method();
    assert(element.extensionMethodInvoked);
  });
});

},{"./testElements":8}],8:[function(require,module,exports){
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

/* Element extension that defines a property. */

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

var ElementWithPropertyExtension = (function (_ElementBase4) {
  _inherits(ElementWithPropertyExtension, _ElementBase4);

  function ElementWithPropertyExtension() {
    _classCallCheck(this, ElementWithPropertyExtension);

    _get(Object.getPrototypeOf(ElementWithPropertyExtension.prototype), 'constructor', this).apply(this, arguments);
  }

  return ElementWithPropertyExtension;
})(_srcElementBase2['default']);

ElementWithPropertyExtension = ElementWithPropertyExtension.extend(PropertyExtension);
document.registerElement('element-with-property-extension', ElementWithPropertyExtension);

/* Extension that defines a method. */

var MethodExtension = (function () {
  function MethodExtension() {
    _classCallCheck(this, MethodExtension);
  }

  _createClass(MethodExtension, [{
    key: 'method',
    value: function method() {
      var result = this['super'](MethodExtension, 'method');
      this.extensionMethodInvoked = true;
      return result;
    }
  }]);

  return MethodExtension;
})();

var ElementWithMethodExtension = (function (_ElementBase5) {
  _inherits(ElementWithMethodExtension, _ElementBase5);

  function ElementWithMethodExtension() {
    _classCallCheck(this, ElementWithMethodExtension);

    _get(Object.getPrototypeOf(ElementWithMethodExtension.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ElementWithMethodExtension, [{
    key: 'method',
    value: function method() {
      this.componentMethodInvoked = true;
      return 'component result';
    }
  }]);

  return ElementWithMethodExtension;
})(_srcElementBase2['default']);

ElementWithMethodExtension = ElementWithMethodExtension.extend(MethodExtension);
window.ElementWithMethodExtension = ElementWithMethodExtension;
window.MethodExtension = MethodExtension;
document.registerElement('element-with-method-extension', ElementWithMethodExtension);

/* Extension that defines a createdCallback method. */

var CreatedExtension = (function () {
  function CreatedExtension() {
    _classCallCheck(this, CreatedExtension);
  }

  _createClass(CreatedExtension, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this['super'](CreatedExtension, 'createdCallback');
      this.extensionCreatedCallbackInvoked = true;
    }
  }]);

  return CreatedExtension;
})();

var ElementWithCreatedExtension = (function (_ElementBase6) {
  _inherits(ElementWithCreatedExtension, _ElementBase6);

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

/* A component using multiple extensions. */

var ElementWithMultipleExtensions = (function (_ElementBase7) {
  _inherits(ElementWithMultipleExtensions, _ElementBase7);

  function ElementWithMultipleExtensions() {
    _classCallCheck(this, ElementWithMultipleExtensions);

    _get(Object.getPrototypeOf(ElementWithMultipleExtensions.prototype), 'constructor', this).apply(this, arguments);
  }

  return ElementWithMultipleExtensions;
})(_srcElementBase2['default']);

ElementWithMultipleExtensions = ElementWithMultipleExtensions.extend(PropertyExtension, MethodExtension, CreatedExtension);
document.registerElement('element-with-multiple-extensions', ElementWithMultipleExtensions);

},{"../src/ElementBase":3}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdXRvbWF0aWNOb2RlRmluZGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvRWxlbWVudEJhc2UuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0V4dGVuc2libGVDbGFzcy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL1RlbXBsYXRlU3RhbXBpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvdGVzdC9FbGVtZW50QmFzZS50ZXN0cy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDSU0sb0JBQW9CO1dBQXBCLG9CQUFvQjswQkFBcEIsb0JBQW9COzs7OztlQUFwQixvQkFBb0I7Ozs7OztXQUtBLGtDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ2pELFVBQUksU0FBTSxDQUFDLG9CQUFvQixFQUFFLDBCQUEwQixDQUFDLENBQUM7Ozs7Ozs7O0FBUTdELFVBQUksWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsWUFBWSxDQUFDLEdB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QUcsSUFBSSxDQUFDO0tBQzdDOzs7U0FKRyxnQkFBZ0I7OztJQU1oQiwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7K0JBQTNCLDJCQUEyQjs7O2VBQTNCLDJCQUEyQjs7U0FDbkIsZUFBRztBQUNiLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FIRywyQkFBMkI7OztBQUtqQywyQkFBMkIsR0FBRywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuRixRQUFRLENBQUMsZUFBZSxDQUFDLGdDQUFnQyxFQUFFLDJCQUEyQixDQUFDLENBQUM7Ozs7SUFJbEYsNkJBQTZCO1lBQTdCLDZCQUE2Qjs7V0FBN0IsNkJBQTZCOzBCQUE3Qiw2QkFBNkI7OytCQUE3Qiw2QkFBNkI7OztTQUE3Qiw2QkFBNkI7OztBQUNuQyw2QkFBNkIsR0FBRyw2QkFBNkIsQ0FBQyxNQUFNLENBQ2xFLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsZ0JBQWdCLENBQ2pCLENBQUM7QUFDRixRQUFRLENBQUMsZUFBZSxDQUFDLGtDQUFrQyxFQUFFLDZCQUE2QixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIE1hcnNoYWxsIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyAoYW5kIGV2ZW50dWFsbHkgdmljZSB2ZXJzYSkuXG4gKi9cblxuY2xhc3MgQXR0cmlidXRlTWFyc2hhbGxpbmcge1xuXG4gIC8qXG4gICAqIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqL1xuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5zdXBlcihBdHRyaWJ1dGVNYXJzaGFsbGluZywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycpO1xuICAgIC8vIHRoaXMubG9nKGBhdHRyaWJ1dGUgJHtuYW1lfSBjaGFuZ2VkIHRvICR7bmV3VmFsdWV9YCk7XG4gICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgdGhlbiBzZXQgdGhhdFxuICAgIC8vIHByb3BlcnR5LlxuICAgIC8vIFRPRE86IFRoaXMgbG9va3MgdXAgdGhlIGV4aXN0ZW5jZSBvZiB0aGUgcHJvcGVydHkgZWFjaCB0aW1lLiBJdCB3b3VsZFxuICAgIC8vIGJlIG1vcmUgZWZmaWNpZW50IHRvLCBlLmcuLCBkbyBhIG9uZS10aW1lIGNvbXB1dGF0aW9uIG9mIGFsbCBwcm9wZXJ0aWVzXG4gICAgLy8gZGVmaW5lZCBieSB0aGUgZWxlbWVudCAoaW5jbHVkaW5nIGJhc2UgY2xhc3NlcykuXG4gICAgLy8gVE9ETzogSWdub3JlIHN0YW5kYXJkIGF0dHJpYnV0ZSBuYW1lLlxuICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcbiAgICBpZiAoaGFzUHJvcGVydHkodGhpcywgcHJvcGVydHlOYW1lKSkge1xuICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQXR0cmlidXRlTWFyc2hhbGxpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCAoYXR0cmlidXRlKSA9PiB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuXG4vLyBDb252ZXJ0IGNhbWVsIGNhc2UgZm9vQmFyIG5hbWUgdG8gaHlwaGVuYXRlZCBmb28tYmFyLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCAobSkgPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuZnVuY3Rpb24gaGFzUHJvcGVydHkob2JqLCBuYW1lKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBoYXNQcm9wZXJ0eShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSwgbmFtZSk7XG4gIH1cbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgKGcpID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBBdHRyaWJ1dGVNYXJzaGFsbGluZztcbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnN1cGVyKEF1dG9tYXRpY05vZGVGaW5kaW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIChub2RlKSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9tYXRpY05vZGVGaW5kaW5nO1xuIiwiLypcbiAqIEdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMuXG4gKlxuICogVGhpcyBFbGVtZW50QmFzZSBjbGFzcyBpbXBsZW1lbnRzIHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCxcbiAqIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVFbGVtZW50IGZyb20gJy4vRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsXG4gIEF1dG9tYXRpY05vZGVGaW5kaW5nLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIG1hcnNoYWxsZWQgcHJvcGVydGllcyBjYW4gdXNlIGl0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nXG4pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iLCIvKlxuICogQSBjbGFzcyB3aGljaCBjYW4gYmUgZXh0ZW5kZWQgd2l0aCBvdGhlciBjbGFzc2VzLlxuICovXG5cblxuLypcbiAqIEEgbWFwcGluZyBvZiBjbGFzcyBwcm90b3R5cGVzIHRvIHRoZSBjb3JyZXNwb25kaW5nIGV4dGVuc2lvbiB0aGF0IHdhcyB1c2VkXG4gKiB0byBpbXBsZW1lbnQgdGhlIGV4dGVuc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBzdXBlcihleHRlbnNpb24sIG1ldGhvZClcbiAqIGZhY2lsaXR5IHRoYXQgbGV0cyBleHRlbnNpb24gaW52b2tlIHN1cGVyY2xhc3MgbWV0aG9kcy5cbiAqXG4gKiBOT1RFOiBUaGlzIG1hcCB1c2VzIGNsYXNzIHByb3RvdHlwZXMsIG5vdCBjbGFzc2VzIHRoZW1zZWx2ZXMsIGFzIHRoZSBrZXlzLlxuICogVGhpcyBpcyBkb25lIHRvIHN1cHBvcnQgd2ViIGNvbXBvbmVudHMgYXMgZXh0ZW5zaWJsZSBIVE1MRWxlbWVudCBjbGFzc2VzLlxuICogVGhlIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2N1c3RvbS1lbGVtZW50JykgZnVuY3Rpb24gY2FuIHJldHVybiBhbiBlbGVtZW50XG4gKiB3aG9zZSBjb25zdHJ1Y3RvciBpcyAqbm90KiB0aGUgZnVuY3Rpb24gcGFzc2VkIHRvIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICogVGhhdCBpcywgZWxlbWVudCBjbGFzc2VzIGhhdmUgYSBzcGVjaWFsIG11bmdlZCBjb25zdHJ1Y3RvciwgYW5kIHRoYXRcbiAqIGNvbnN0cnVjdG9yIGNhbid0IGdldCBpbmNsdWRlZCBpbiBvdXIgbWFwLiBXZSB1c2UgcHJvdG90eXBlcyBpbnN0ZWFkLCB3aGljaFxuICogYXJlIGxlZnQgYWxvbmcgYnkgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCkuXG4gKi9cbmxldCBleHRlbnNpb25Gb3JQcm90b3R5cGUgPSBuZXcgTWFwKCk7XG5cblxuY2xhc3MgRXh0ZW5zaWJsZUNsYXNzIHtcblxuICAvKlxuICAgKiBDYWxsIGEgc3VwZXJjbGFzcyBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZCBpZiBpdCBleGlzdHMuXG4gICAqXG4gICAqIFRoaXMgd2Fsa3MgdXAgdGhlIG9iamVjdCdzIGNsYXNzIGhpZXJhcmNoeSBpbiBzZWFyY2ggb2YgdGhlIGNsYXNzIHRoYXRcbiAgICogaW1wbGVtZW50ZWQgdGhlIGdpdmVuIGV4dGVuc2lvbi4gVGhlbiBpdCBnb2VzIHVwIG9uZSBsZXZlbCwgYW5kIGxvb2tzIHVwXG4gICAqIHRoZSBoaWVyYXJjaHkgZnJvbSB0aGF0IHBvaW50IHRvIHNlZSBpZiBhbnkgc3VwZXJjbGFzcyBpbXBsZW1lbnRzIHRoZVxuICAgKiBuYW1lZCBtZXRob2QuIElmIGEgc3VwZXJjbGFzcyBtZXRob2QgaW1wbGVtZW50YXRpb24gaXMgZm91bmQsIGl0IGlzIGludm9rZWRcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLCBhbmQgdGhlIHJlc3VsdCBvZiB0aGF0IGlzIHJldHVybmVkLlxuICAgKi9cbiAgc3VwZXIoZXh0ZW5zaW9uLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IHByb3RvdHlwZSA9IGdldFByb3RvdHlwZUltcGxlbWVudGluZ0V4dGVuc2lvbih0aGlzLCBleHRlbnNpb24pO1xuICAgIGlmIChwcm90b3R5cGUpIHtcbiAgICAgIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgICBpZiAoc3VwZXJQcm90bykge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgcmV0dXJuIGV4dGVuc2lvbnMucmVkdWNlKGV4dGVuZENsYXNzLCB0aGlzKTtcbiAgfVxuXG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIG1lbWJlcnMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU1lbWJlcnMobWVtYmVycywgdGFyZ2V0LCBpZ25vcmVNZW1iZXJzKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1lbWJlcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBpZiAoIWlnbm9yZU1lbWJlcnMgfHwgaWdub3JlTWVtYmVycy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG1lbWJlcnMsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLypcbiAqIFJldHVybiBhIG5ldyBzdWJjbGFzcyBvZiB0aGUgZ2l2ZW4gYmFzZWNsYXNzLiBUaGUgbmV3IGNsYXNzJyBwcm90b3R5cGUgd2lsbFxuICogaW5jbHVkZSB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbi5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kQ2xhc3MoYmFzZUNsYXNzLCBleHRlbnNpb24pIHtcblxuICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2VDbGFzcyB7fVxuXG4gIGlmICh0eXBlb2YgZXh0ZW5zaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXh0ZW5kaW5nIHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IGJvdGggc3RhdGljIGFuZCBpbnN0YW5jZSBtZXRob2RzLlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgc3ViY2xhc3MsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEZ1bmN0aW9uKSk7XG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLnByb3RvdHlwZSwgc3ViY2xhc3MucHJvdG90eXBlLCBbJ2NvbnN0cnVjdG9yJ10pO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgc3ViY2xhc3MucHJvdG90eXBlKTtcbiAgfVxuXG4gIC8vIFJlbWVtYmVyIHdoaWNoIGV4dGVuc2lvbiB3YXMgdXNlZCB0byBjcmVhdGUgdGhpcyBuZXcgY2xhc3Mgc28gdGhhdCBleHRlbmRlZFxuICAvLyBtZXRob2RzIGNhbiBjYWxsIGltcGxlbWVudGF0aW9ucyBpbiB0aGUgc3VwZXIgKGJhc2UpIGNsYXNzLlxuICBleHRlbnNpb25Gb3JQcm90b3R5cGUuc2V0KHN1YmNsYXNzLnByb3RvdHlwZSwgZXh0ZW5zaW9uKTtcblxuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cbi8qXG4gKiBSZXR1cm4gdGhlIHByb3RvdHlwZSBmb3IgdGhlIGNsYXNzIHRoYXQgaW1wbGVtZW50ZWQgdGhlIGluZGljYXRlZCBleHRlbnNpb25cbiAqIGZvciB0aGUgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0UHJvdG90eXBlSW1wbGVtZW50aW5nRXh0ZW5zaW9uKG9iaiwgZXh0ZW5zaW9uKSB7XG4gIGZvciAobGV0IHByb3RvdHlwZSA9IG9iajsgcHJvdG90eXBlICE9PSBudWxsOyBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKSkge1xuICAgIGlmIChleHRlbnNpb25Gb3JQcm90b3R5cGUuZ2V0KHByb3RvdHlwZSkgPT09IGV4dGVuc2lvbikge1xuICAgICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBkZXNjcmlwdG9yIGZvciB0aGUgbmFtZWQgcHJvcGVydHksIGxvb2tpbmcgdXAgdGhlIGNsYXNzIGhpZXJhcmNoeS5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSkge1xuICBpZiAoIXByb3RvdHlwZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICBpZiAoZGVzY3JpcHRvcikge1xuICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICB9XG4gIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUNsYXNzO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50XG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVDbGFzcyBmcm9tICcuL0V4dGVuc2libGVDbGFzcyc7XG5cbi8vIFdlIHVzZSBFeHRlbnNpYmxlQ2xhc3MgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB0aGF0IHdpdGggLmV4dGVuZCgpIGFuZCBzdXBlcigpIHN1cHBvcnQuXG5sZXQgRXh0ZW5zaWJsZUVsZW1lbnQgPSBFeHRlbnNpYmxlQ2xhc3MuZXh0ZW5kLmNhbGwoSFRNTEVsZW1lbnQsIEV4dGVuc2libGVDbGFzcyk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICovXG5cblxuY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICB0aGlzLnN1cGVyKFRlbXBsYXRlU3RhbXBpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIHRoaXMubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICAgICAgbGV0IHJvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8qXG4gKiBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVTdGFtcGluZztcbiIsImltcG9ydCAqIGFzIHRlc3RFbGVtZW50cyBmcm9tIFwiLi90ZXN0RWxlbWVudHNcIjtcblxuc3VpdGUoXCJFbGVtZW50QmFzZVwiLCAoKSA9PiB7XG5cbiAgdGVzdChcImNvbXBvbmVudCBzdGFtcHMgc3RyaW5nIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHJlYWwgdGVtcGxhdGUgaW50byByb290XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gY3JlYXRlIGNvbXBvbmVudCBjbGFzcyB3aXRoIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKVwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCAncHJvcGVydHknKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5tZXRob2QoKSwgJ21ldGhvZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnZhbHVlLCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImh5cGhlbmF0ZWQgYXR0cmlidXRlIG1hcnNoYWxsZWQgdG8gY29ycmVzcG9uZGluZyBjYW1lbENhc2UgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2N1c3RvbS1wcm9wZXJ0eScsIFwiSGVsbG9cIik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuY3VzdG9tUHJvcGVydHksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb21wb25lbnQgY2FuIHVzZSBleHRlbnNpb24gdG8gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXByb3BlcnR5LWV4dGVuc2lvbicpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBtZXRob2QgaW52b2tlcyBib3RoIGV4dGVuc2lvbidzIGFuZCBjb21wb25lbnQncyBpbXBsZW1lbnRhdGlvblwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtbWV0aG9kLWV4dGVuc2lvbicpO1xuICAgIGxldCByZXN1bHQgPSBlbGVtZW50Lm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdjb21wb25lbnQgcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuY29tcG9uZW50TWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gY2FuIGRlZmluZSBjcmVhdGVkQ2FsbGJhY2tcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb21wb25lbnQgY2FuIGhhdmUgbXVsdGlwbGUgZXh0ZW5zaW9uc1wiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtbXVsdGlwbGUtZXh0ZW5zaW9ucycpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnByb3BlcnR5LCAndmFsdWUnKTtcbiAgICBlbGVtZW50Lm1ldGhvZCgpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuXG4vKiBFbGVtZW50IHdpdGggYSBzaW1wbGUgdGVtcGxhdGUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnLCBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IHdpdGggYSByZWFsIHRlbXBsYXRlICovXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudGVtcGxhdGUuY29udGVudC50ZXh0Q29udGVudCA9IFwiSGVsbG9cIjtcbmNsYXNzIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJywgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgY3JlYXRlZCB2aWEgRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpICovXG5sZXQgRXM1Q2xhc3NWaWFFeHRlbmQgPSBFbGVtZW50QmFzZS5leHRlbmQoe1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICdwcm9wZXJ0eSc7XG4gIH0sXG4gIG1ldGhvZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdtZXRob2QnO1xuICB9LFxuICB2YWx1ZTogJ3ZhbHVlJ1xufSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VzNS1jbGFzcy12aWEtZXh0ZW5kJywgRXM1Q2xhc3NWaWFFeHRlbmQpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jdXN0b21Qcm9wZXJ0eTtcbiAgfVxuICBzZXQgY3VzdG9tUHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLl9jdXN0b21Qcm9wZXJ0eSA9IHZhbHVlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5JywgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSk7XG5cblxuLyogRWxlbWVudCBleHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgcHJvcGVydHkuICovXG5jbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gIGdldCBwcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxufVxuY2xhc3MgRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHt9XG5FbGVtZW50V2l0aFByb3BlcnR5RXh0ZW5zaW9uID0gRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbi5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtcHJvcGVydHktZXh0ZW5zaW9uJywgRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbik7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIG1ldGhvZC4gKi9cbmNsYXNzIE1ldGhvZEV4dGVuc2lvbiB7XG4gIG1ldGhvZCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdXBlcihNZXRob2RFeHRlbnNpb24sICdtZXRob2QnKTtcbiAgICB0aGlzLmV4dGVuc2lvbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBtZXRob2QoKSB7XG4gICAgdGhpcy5jb21wb25lbnRNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gJ2NvbXBvbmVudCByZXN1bHQnO1xuICB9XG59XG5FbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uLmV4dGVuZChNZXRob2RFeHRlbnNpb24pO1xud2luZG93LkVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uID0gRWxlbWVudFdpdGhNZXRob2RFeHRlbnNpb247XG53aW5kb3cuTWV0aG9kRXh0ZW5zaW9uID0gTWV0aG9kRXh0ZW5zaW9uO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtbWV0aG9kLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uKTtcblxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZC4gKi9cbmNsYXNzIENyZWF0ZWRFeHRlbnNpb24ge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihDcmVhdGVkRXh0ZW5zaW9uLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgdGhpcy5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkID0gdHJ1ZTtcbiAgfVxufVxuY2xhc3MgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uID0gRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uLmV4dGVuZChDcmVhdGVkRXh0ZW5zaW9uKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJywgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uKTtcblxuXG4vKiBBIGNvbXBvbmVudCB1c2luZyBtdWx0aXBsZSBleHRlbnNpb25zLiAqL1xuY2xhc3MgRWxlbWVudFdpdGhNdWx0aXBsZUV4dGVuc2lvbnMgZXh0ZW5kcyBFbGVtZW50QmFzZSB7fVxuRWxlbWVudFdpdGhNdWx0aXBsZUV4dGVuc2lvbnMgPSBFbGVtZW50V2l0aE11bHRpcGxlRXh0ZW5zaW9ucy5leHRlbmQoXG4gIFByb3BlcnR5RXh0ZW5zaW9uLFxuICBNZXRob2RFeHRlbnNpb24sXG4gIENyZWF0ZWRFeHRlbnNpb25cbik7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1tdWx0aXBsZS1leHRlbnNpb25zJywgRWxlbWVudFdpdGhNdWx0aXBsZUV4dGVuc2lvbnMpO1xuIl19
