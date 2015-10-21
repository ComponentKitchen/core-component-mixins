(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var ElementBase = (function (_ExtensibleElement) {
  _inherits(ElementBase, _ExtensibleElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    _get(Object.getPrototypeOf(ElementBase.prototype), 'constructor', this).apply(this, arguments);
  }

  // Convert camel case fooBar name to hyphenated foo-bar.

  _createClass(ElementBase, [{
    key: 'attributeChangedCallback',

    /*
     * Handle a change to the attribute with the given name.
     */
    value: function attributeChangedCallback(name, oldValue, newValue) {
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

    /*
     * Base createdCallback implementation.
     *
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      // this.log("created");
      var template = this.template;
      if (template) {
        createShadowRootWithTemplate(this, template);
      }
      marshallAttributesToProperties(this);
    }
  }, {
    key: 'log',
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
})(_ExtensibleElement3['default']);

function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

function createShadowRootWithTemplate(element, template) {
  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    template = createTemplateWithInnerHTML(template);
  }
  // element.log("cloning template into shadow root");
  element.root = element.createShadowRoot();
  var clone = document.importNode(template.content, true);
  element.root.appendChild(clone);
}

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

function hasProperty(_x4, _x5) {
  var _again2 = true;

  _function2: while (_again2) {
    var obj = _x4,
        name = _x5;
    _again2 = false;

    if (!obj) {
      return false;
    } else if (obj.hasOwnProperty(name)) {
      return true;
    } else {
      _x4 = Object.getPrototypeOf(obj);
      _x5 = name;
      _again2 = true;
      continue _function2;
    }
  }
}

function marshallAttributesToProperties(element) {
  [].forEach.call(element.attributes, function (attribute) {
    element.attributeChangedCallback(attribute.name, undefined, attribute.value);
  });
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

// class AutomaticNodeFinding {
//
//   createdCallback() {
//     let result = this.super(AutomaticNodeFinding, 'createdCallback');
//     this.log('woohoo!');
//     return result;
//   }
//
// }
//
// ElementBase = ElementBase.extend(AutomaticNodeFinding);

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{"./ExtensibleElement":3}],2:[function(require,module,exports){
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

function copyMembers(members, target) {
  Object.getOwnPropertyNames(members).forEach(function (name) {
    if (name !== 'constructor') {
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

  var members = getMembersForExtension(extension);
  copyMembers(members, subclass.prototype);
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
 * If the extension is a class (function), return its prototype. Otherwise,
 * return the extension as is.
 */
function getMembersForExtension(extension) {
  return typeof extension === 'function' ? extension.prototype : extension;
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

},{}],3:[function(require,module,exports){
/*
 * An extensible HTML element
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ExtensibleClass = require('./ExtensibleClass');

var _ExtensibleClass2 = _interopRequireDefault(_ExtensibleClass);

var ExtensibleElement = (function (_HTMLElement) {
  _inherits(ExtensibleElement, _HTMLElement);

  function ExtensibleElement() {
    _classCallCheck(this, ExtensibleElement);

    _get(Object.getPrototypeOf(ExtensibleElement.prototype), 'constructor', this).apply(this, arguments);
  }

  /*
   * It'd be nice to use ExtensibleClass itself here, but since it doesn't copy
   * over static methods yet, we extend by hand.
   */
  return ExtensibleElement;
})(HTMLElement);

ExtensibleElement.extend = _ExtensibleClass2['default'].extend;
ExtensibleElement.prototype['super'] = _ExtensibleClass2['default'].prototype['super'];

exports['default'] = ExtensibleElement;
module.exports = exports['default'];

},{"./ExtensibleClass":2}],4:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _testElements = require("./testElements");

var testElements = _interopRequireWildcard(_testElements);

suite("ElementBase", function () {

  test("component stamps string template into root", function () {
    var element = document.createElement('element-with-string-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("component stamps real template into root", function () {
    var element = document.createElement('element-with-real-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
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
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("component can have multiple extensions", function () {
    var element = document.createElement('element-with-multiple-extensions');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.property, 'value');
    element.method();
    assert(element.extensionMethodInvoked);
  });
});

},{"./testElements":5}],5:[function(require,module,exports){
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

},{"../src/ElementBase":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FeHRlbnNpYmxlQ2xhc3MuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0V4dGVuc2libGVFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3Rlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvdGVzdC90ZXN0RWxlbWVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0NPOEIscUJBQXFCOzs7O0lBRTdDLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7Ozs7V0FLUyxrQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTs7Ozs7Ozs7QUFRakQsVUFBSSxZQUFZLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsVUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFO0FBQ25DLFlBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDL0I7S0FDRjs7Ozs7Ozs7OztXQVFjLDJCQUFHOztBQUVoQixVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFVBQUksUUFBUSxFQUFFO0FBQ1osb0NBQTRCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzlDO0FBQ0Qsb0NBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FD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O1NBSkcsZ0JBQWdCOzs7SUFNaEIsMkJBQTJCO1lBQTNCLDJCQUEyQjs7V0FBM0IsMkJBQTJCOzBCQUEzQiwyQkFBMkI7OytCQUEzQiwyQkFBMkI7OztlQUEzQiwyQkFBMkI7O1NBQ25CLGVBQUc7QUFDYixhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBSEcsMkJBQTJCOzs7QUFLakMsMkJBQTJCLEdBQUcsMkJBQTJCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbkYsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQ0FBZ0MsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDOzs7O0lBSWxGLDZCQUE2QjtZQUE3Qiw2QkFBNkI7O1dBQTdCLDZCQUE2QjswQkFBN0IsNkJBQTZCOzsrQkFBN0IsNkJBQTZCOzs7U0FBN0IsNkJBQTZCOzs7QUFDbkMsNkJBQTZCLEdBQUcsNkJBQTZCLENBQUMsTUFBTSxDQUNsRSxpQkFBaUIsRUFDakIsZUFBZSxFQUNmLGdCQUFnQixDQUNqQixDQUFDO0FBQ0YsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQ0FBa0MsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBHZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLlxuICpcbiAqIFRoaXMgRWxlbWVudEJhc2UgY2xhc3MgaW1wbGVtZW50cyB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsXG4gKiBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuL0V4dGVuc2libGVFbGVtZW50JztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyB0aGlzLmxvZyhgYXR0cmlidXRlICR7bmFtZX0gY2hhbmdlZCB0byAke25ld1ZhbHVlfWApO1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS5cbiAgICAvLyBUT0RPOiBUaGlzIGxvb2tzIHVwIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHByb3BlcnR5IGVhY2ggdGltZS4gSXQgd291bGRcbiAgICAvLyBiZSBtb3JlIGVmZmljaWVudCB0bywgZS5nLiwgZG8gYSBvbmUtdGltZSBjb21wdXRhdGlvbiBvZiBhbGwgcHJvcGVydGllc1xuICAgIC8vIGRlZmluZWQgYnkgdGhlIGVsZW1lbnQgKGluY2x1ZGluZyBiYXNlIGNsYXNzZXMpLlxuICAgIC8vIFRPRE86IElnbm9yZSBzdGFuZGFyZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGhhc1Byb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIEJhc2UgY3JlYXRlZENhbGxiYWNrIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgLy8gdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBjcmVhdGVTaGFkb3dSb290V2l0aFRlbXBsYXRlKHRoaXMsIHRlbXBsYXRlKTtcbiAgICB9XG4gICAgbWFyc2hhbGxBdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKHRoaXMpO1xuICB9XG5cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICAvLyBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyhlbGVtZW50KSB7XG4gIFtdLmZvckVhY2guY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICBlbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICB9KTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgKGcpID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG4vLyBjbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG4vL1xuLy8gICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4vLyAgICAgbGV0IHJlc3VsdCA9IHRoaXMuc3VwZXIoQXV0b21hdGljTm9kZUZpbmRpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbi8vICAgICB0aGlzLmxvZygnd29vaG9vIScpO1xuLy8gICAgIHJldHVybiByZXN1bHQ7XG4vLyAgIH1cbi8vXG4vLyB9XG4vL1xuLy8gRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoQXV0b21hdGljTm9kZUZpbmRpbmcpO1xuXG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiIsIi8qXG4gKiBBIGNsYXNzIHdoaWNoIGNhbiBiZSBleHRlbmRlZCB3aXRoIG90aGVyIGNsYXNzZXMuXG4gKi9cblxuXG4vKlxuICogQSBtYXBwaW5nIG9mIGNsYXNzIHByb3RvdHlwZXMgdG8gdGhlIGNvcnJlc3BvbmRpbmcgZXh0ZW5zaW9uIHRoYXQgd2FzIHVzZWRcbiAqIHRvIGltcGxlbWVudCB0aGUgZXh0ZW5zaW9uLiBUaGlzIGlzIHVzZWQgYnkgdGhlIHN1cGVyKGV4dGVuc2lvbiwgbWV0aG9kKVxuICogZmFjaWxpdHkgdGhhdCBsZXRzIGV4dGVuc2lvbiBpbnZva2Ugc3VwZXJjbGFzcyBtZXRob2RzLlxuICpcbiAqIE5PVEU6IFRoaXMgbWFwIHVzZXMgY2xhc3MgcHJvdG90eXBlcywgbm90IGNsYXNzZXMgdGhlbXNlbHZlcywgYXMgdGhlIGtleXMuXG4gKiBUaGlzIGlzIGRvbmUgdG8gc3VwcG9ydCB3ZWIgY29tcG9uZW50cyBhcyBleHRlbnNpYmxlIEhUTUxFbGVtZW50IGNsYXNzZXMuXG4gKiBUaGUgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY3VzdG9tLWVsZW1lbnQnKSBmdW5jdGlvbiBjYW4gcmV0dXJuIGFuIGVsZW1lbnRcbiAqIHdob3NlIGNvbnN0cnVjdG9yIGlzICpub3QqIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCkuXG4gKiBUaGF0IGlzLCBlbGVtZW50IGNsYXNzZXMgaGF2ZSBhIHNwZWNpYWwgbXVuZ2VkIGNvbnN0cnVjdG9yLCBhbmQgdGhhdFxuICogY29uc3RydWN0b3IgY2FuJ3QgZ2V0IGluY2x1ZGVkIGluIG91ciBtYXAuIFdlIHVzZSBwcm90b3R5cGVzIGluc3RlYWQsIHdoaWNoXG4gKiBhcmUgbGVmdCBhbG9uZyBieSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqL1xubGV0IGV4dGVuc2lvbkZvclByb3RvdHlwZSA9IG5ldyBNYXAoKTtcblxuXG5jbGFzcyBFeHRlbnNpYmxlQ2xhc3Mge1xuXG4gIC8qXG4gICAqIENhbGwgYSBzdXBlcmNsYXNzIGltcGxlbWVudGF0aW9uIG9mIGEgbWV0aG9kIGlmIGl0IGV4aXN0cy5cbiAgICpcbiAgICogVGhpcyB3YWxrcyB1cCB0aGUgb2JqZWN0J3MgY2xhc3MgaGllcmFyY2h5IGluIHNlYXJjaCBvZiB0aGUgY2xhc3MgdGhhdFxuICAgKiBpbXBsZW1lbnRlZCB0aGUgZ2l2ZW4gZXh0ZW5zaW9uLiBUaGVuIGl0IGdvZXMgdXAgb25lIGxldmVsLCBhbmQgbG9va3MgdXBcbiAgICogdGhlIGhpZXJhcmNoeSBmcm9tIHRoYXQgcG9pbnQgdG8gc2VlIGlmIGFueSBzdXBlcmNsYXNzIGltcGxlbWVudHMgdGhlXG4gICAqIG5hbWVkIG1ldGhvZC4gSWYgYSBzdXBlcmNsYXNzIG1ldGhvZCBpbXBsZW1lbnRhdGlvbiBpcyBmb3VuZCwgaXQgaXMgaW52b2tlZFxuICAgKiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMsIGFuZCB0aGUgcmVzdWx0IG9mIHRoYXQgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBzdXBlcihleHRlbnNpb24sIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcHJvdG90eXBlID0gZ2V0UHJvdG90eXBlSW1wbGVtZW50aW5nRXh0ZW5zaW9uKHRoaXMsIGV4dGVuc2lvbik7XG4gICAgaWYgKHByb3RvdHlwZSkge1xuICAgICAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICAgIGlmIChzdXBlclByb3RvKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG8sIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kQ2xhc3MsIHRoaXMpO1xuICB9XG5cbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gbWVtYmVycyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5TWVtYmVycyhtZW1iZXJzLCB0YXJnZXQpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWVtYmVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGlmIChuYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWVtYmVycywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzIG9mIHRoZSBnaXZlbiBiYXNlY2xhc3MuIFRoZSBuZXcgY2xhc3MnIHByb3RvdHlwZSB3aWxsXG4gKiBpbmNsdWRlIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICovXG5mdW5jdGlvbiBleHRlbmRDbGFzcyhiYXNlQ2xhc3MsIGV4dGVuc2lvbikge1xuICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2VDbGFzcyB7fVxuICBsZXQgbWVtYmVycyA9IGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgY29weU1lbWJlcnMobWVtYmVycywgc3ViY2xhc3MucHJvdG90eXBlKTtcbiAgLy8gUmVtZW1iZXIgd2hpY2ggZXh0ZW5zaW9uIHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0IGV4dGVuZGVkXG4gIC8vIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIGV4dGVuc2lvbkZvclByb3RvdHlwZS5zZXQoc3ViY2xhc3MucHJvdG90eXBlLCBleHRlbnNpb24pO1xuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cbi8qXG4gKiBSZXR1cm4gdGhlIHByb3RvdHlwZSBmb3IgdGhlIGNsYXNzIHRoYXQgaW1wbGVtZW50ZWQgdGhlIGluZGljYXRlZCBleHRlbnNpb25cbiAqIGZvciB0aGUgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0UHJvdG90eXBlSW1wbGVtZW50aW5nRXh0ZW5zaW9uKG9iaiwgZXh0ZW5zaW9uKSB7XG4gIGZvciAobGV0IHByb3RvdHlwZSA9IG9iajsgcHJvdG90eXBlICE9PSBudWxsOyBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKSkge1xuICAgIGlmIChleHRlbnNpb25Gb3JQcm90b3R5cGUuZ2V0KHByb3RvdHlwZSkgPT09IGV4dGVuc2lvbikge1xuICAgICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qXG4gKiBJZiB0aGUgZXh0ZW5zaW9uIGlzIGEgY2xhc3MgKGZ1bmN0aW9uKSwgcmV0dXJuIGl0cyBwcm90b3R5cGUuIE90aGVyd2lzZSxcbiAqIHJldHVybiB0aGUgZXh0ZW5zaW9uIGFzIGlzLlxuICovXG5mdW5jdGlvbiBnZXRNZW1iZXJzRm9yRXh0ZW5zaW9uKGV4dGVuc2lvbikge1xuICByZXR1cm4gdHlwZW9mIGV4dGVuc2lvbiA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgZXh0ZW5zaW9uLnByb3RvdHlwZSA6XG4gICAgZXh0ZW5zaW9uO1xufVxuXG4vKlxuICogUmV0dXJuIGEgZGVzY3JpcHRvciBmb3IgdGhlIG5hbWVkIHByb3BlcnR5LCBsb29raW5nIHVwIHRoZSBjbGFzcyBoaWVyYXJjaHkuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpIHtcbiAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfVxuICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG8sIG5hbWUpO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVDbGFzcztcbiIsIi8qXG4gKiBBbiBleHRlbnNpYmxlIEhUTUwgZWxlbWVudFxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlQ2xhc3MgZnJvbSAnLi9FeHRlbnNpYmxlQ2xhc3MnO1xuXG5jbGFzcyBFeHRlbnNpYmxlRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHt9XG5cbi8qXG4gKiBJdCdkIGJlIG5pY2UgdG8gdXNlIEV4dGVuc2libGVDbGFzcyBpdHNlbGYgaGVyZSwgYnV0IHNpbmNlIGl0IGRvZXNuJ3QgY29weVxuICogb3ZlciBzdGF0aWMgbWV0aG9kcyB5ZXQsIHdlIGV4dGVuZCBieSBoYW5kLlxuICovXG5FeHRlbnNpYmxlRWxlbWVudC5leHRlbmQgPSBFeHRlbnNpYmxlQ2xhc3MuZXh0ZW5kO1xuRXh0ZW5zaWJsZUVsZW1lbnQucHJvdG90eXBlLnN1cGVyID0gRXh0ZW5zaWJsZUNsYXNzLnByb3RvdHlwZS5zdXBlcjtcblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUVsZW1lbnQ7XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnJvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnJvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiB1c2UgZXh0ZW5zaW9uIHRvIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1wcm9wZXJ0eS1leHRlbnNpb24nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGludm9rZXMgYm90aCBleHRlbnNpb24ncyBhbmQgY29tcG9uZW50J3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW1ldGhvZC1leHRlbnNpb24nKTtcbiAgICBsZXQgcmVzdWx0ID0gZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnY29tcG9uZW50IHJlc3VsdCcpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChlbGVtZW50LmNvbXBvbmVudE1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiBoYXZlIG11bHRpcGxlIGV4dGVuc2lvbnNcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW11bHRpcGxlLWV4dGVuc2lvbnMnKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgc2ltcGxlIHRlbXBsYXRlICovXG5jbGFzcyBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJywgRWxlbWVudFdpdGhTdHJpbmdUZW1wbGF0ZSk7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgcmVhbCB0ZW1wbGF0ZSAqL1xubGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbnRlbXBsYXRlLmNvbnRlbnQudGV4dENvbnRlbnQgPSBcIkhlbGxvXCI7XG5jbGFzcyBFbGVtZW50V2l0aFJlYWxUZW1wbGF0ZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScsIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IGNyZWF0ZWQgdmlhIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKSAqL1xubGV0IEVzNUNsYXNzVmlhRXh0ZW5kID0gRWxlbWVudEJhc2UuZXh0ZW5kKHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiAncHJvcGVydHknO1xuICB9LFxuICBtZXRob2Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnbWV0aG9kJztcbiAgfSxcbiAgdmFsdWU6ICd2YWx1ZSdcbn0pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcsIEVzNUNsYXNzVmlhRXh0ZW5kKTtcblxuXG4vKiBFbGVtZW50IHdpdGggY2FtZWxDYXNlIHByb3BlcnR5IG5hbWUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VzdG9tUHJvcGVydHk7XG4gIH1cbiAgc2V0IGN1c3RvbVByb3BlcnR5KHZhbHVlKSB7XG4gICAgdGhpcy5fY3VzdG9tUHJvcGVydHkgPSB2YWx1ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY2FtZWwtY2FzZS1wcm9wZXJ0eScsIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkpO1xuXG5cbi8qIEVsZW1lbnQgZXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5LiAqL1xuY2xhc3MgUHJvcGVydHlFeHRlbnNpb24ge1xuICBnZXQgcHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICd2YWx1ZSc7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24gZXh0ZW5kcyBFbGVtZW50QmFzZSB7fVxuRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24uZXh0ZW5kKFByb3BlcnR5RXh0ZW5zaW9uKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXByb3BlcnR5LWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24pO1xuXG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBtZXRob2QuICovXG5jbGFzcyBNZXRob2RFeHRlbnNpb24ge1xuICBtZXRob2QoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3VwZXIoTWV0aG9kRXh0ZW5zaW9uLCAnbWV0aG9kJyk7XG4gICAgdGhpcy5leHRlbnNpb25NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5jbGFzcyBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgbWV0aG9kKCkge1xuICAgIHRoaXMuY29tcG9uZW50TWV0aG9kSW52b2tlZCA9IHRydWU7XG4gICAgcmV0dXJuICdjb21wb25lbnQgcmVzdWx0JztcbiAgfVxufVxuRWxlbWVudFdpdGhNZXRob2RFeHRlbnNpb24gPSBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbi5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbndpbmRvdy5FbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uO1xud2luZG93Lk1ldGhvZEV4dGVuc2lvbiA9IE1ldGhvZEV4dGVuc2lvbjtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLW1ldGhvZC1leHRlbnNpb24nLCBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbik7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QuICovXG5jbGFzcyBDcmVhdGVkRXh0ZW5zaW9uIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQ3JlYXRlZEV4dGVuc2lvbiwgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIHRoaXMuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCA9IHRydWU7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbkVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbi5leHRlbmQoQ3JlYXRlZEV4dGVuc2lvbik7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbik7XG5cblxuLyogQSBjb21wb25lbnQgdXNpbmcgbXVsdGlwbGUgZXh0ZW5zaW9ucy4gKi9cbmNsYXNzIEVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zIGV4dGVuZHMgRWxlbWVudEJhc2Uge31cbkVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zID0gRWxlbWVudFdpdGhNdWx0aXBsZUV4dGVuc2lvbnMuZXh0ZW5kKFxuICBQcm9wZXJ0eUV4dGVuc2lvbixcbiAgTWV0aG9kRXh0ZW5zaW9uLFxuICBDcmVhdGVkRXh0ZW5zaW9uXG4pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtbXVsdGlwbGUtZXh0ZW5zaW9ucycsIEVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zKTtcbiJdfQ==
