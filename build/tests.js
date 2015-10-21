(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Base class for defining custom elements. */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElementBase = (function (_HTMLElement) {
  _inherits(ElementBase, _HTMLElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    _get(Object.getPrototypeOf(ElementBase.prototype), 'constructor', this).apply(this, arguments);
  }

  // Convert camel case fooBar name to hyphenated foo-bar.

  _createClass(ElementBase, [{
    key: 'attributeChangedCallback',

    // Handle a change to the attribute with the given name.
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
     * Help an extension method call a base class implementation if it exists.
     *
     * This walks up the object's class hierarchy in search of the class that
     * implemented the given extension. That it goes up one level, and looks up
     * the hierarchy from that point to see if any base class implements the
     * named method. If a base method implementation is found, it is invoked with
     * the given arguments, and the result of that is return.
     */
  }, {
    key: 'callBase',
    value: function callBase(extension, name) {
      var classFn = getClassImplementingExtension(this, extension);
      if (classFn) {
        var prototype = classFn.prototype;
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

    /*
     * Return a subclass of the current class that includes the members indicated
     * in the argument. The argument can be a plain JavaScript object, or a class
     * whose prototype contains the members that will be copied.
     *
     * This can be used for a couple of purposes:
     * 1. Extend a class with a mixin/behavior.
     * 2. Create a component class in ES5.
     *
     */
  }, {
    key: 'log',
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }], [{
    key: 'extend',
    value: function extend() {
      var subclass = undefined;
      var baseClass = this;

      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      extensions.forEach(function (extension) {
        subclass = extendClass(baseClass, extension);
        baseClass = subclass;
      });
      return subclass;
    }
  }]);

  return ElementBase;
})(HTMLElement);

function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

function copyMembers(members, target) {
  Object.getOwnPropertyNames(members).forEach(function (name) {
    if (name !== 'constructor') {
      var descriptor = Object.getOwnPropertyDescriptor(members, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
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
  // subclass.prototype.superPrototype = baseClass.prototype;
  // Remember which class was extended to create this new class so that
  // extended methods can call implementations in the super (base) class.
  subclass._implements = members;
  return subclass;
}

// Return the class that implemented the indicated extension for the given
// object.
function getClassImplementingExtension(obj, extension) {
  var members = getMembersForExtension(extension);
  for (var classFn = obj.constructor; classFn !== null; classFn = Object.getPrototypeOf(classFn.prototype).constructor) {
    if (classFn._implements === members) {
      return classFn;
    }
  }
  return null;
}

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

function hasProperty(_x6, _x7) {
  var _again3 = true;

  _function3: while (_again3) {
    var obj = _x6,
        name = _x7;
    _again3 = false;

    if (!obj) {
      return false;
    } else if (obj.hasOwnProperty(name)) {
      return true;
    } else {
      _x6 = Object.getPrototypeOf(obj);
      _x7 = name;
      _again3 = true;
      continue _function3;
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

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
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

},{"./testElements":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _srcElementBase = require("../src/ElementBase");

var _srcElementBase2 = _interopRequireDefault(_srcElementBase);

/* Element with a simple template */

var ElementWithStringTemplate = (function (_ElementBase) {
  _inherits(ElementWithStringTemplate, _ElementBase);

  function ElementWithStringTemplate() {
    _classCallCheck(this, ElementWithStringTemplate);

    _get(Object.getPrototypeOf(ElementWithStringTemplate.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementWithStringTemplate, [{
    key: "template",
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithStringTemplate;
})(_srcElementBase2["default"]);

document.registerElement('element-with-string-template', ElementWithStringTemplate);

/* Element with a real template */
var template = document.createElement('template');
template.content.textContent = "Hello";

var ElementWithRealTemplate = (function (_ElementBase2) {
  _inherits(ElementWithRealTemplate, _ElementBase2);

  function ElementWithRealTemplate() {
    _classCallCheck(this, ElementWithRealTemplate);

    _get(Object.getPrototypeOf(ElementWithRealTemplate.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementWithRealTemplate, [{
    key: "template",
    get: function get() {
      return template;
    }
  }]);

  return ElementWithRealTemplate;
})(_srcElementBase2["default"]);

document.registerElement('element-with-real-template', ElementWithRealTemplate);

/* Element created via ES5-compatible .extend() */
var Es5ClassViaExtend = _srcElementBase2["default"].extend(Object.defineProperties({
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

    _get(Object.getPrototypeOf(ElementWithCamelCaseProperty.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementWithCamelCaseProperty, [{
    key: "customProperty",
    get: function get() {
      return this._customProperty;
    },
    set: function set(value) {
      this._customProperty = value;
    }
  }]);

  return ElementWithCamelCaseProperty;
})(_srcElementBase2["default"]);

document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);

/* Element extension that defines a property. */

var PropertyExtension = (function () {
  function PropertyExtension() {
    _classCallCheck(this, PropertyExtension);
  }

  _createClass(PropertyExtension, [{
    key: "property",
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

    _get(Object.getPrototypeOf(ElementWithPropertyExtension.prototype), "constructor", this).apply(this, arguments);
  }

  return ElementWithPropertyExtension;
})(_srcElementBase2["default"]);

ElementWithPropertyExtension = ElementWithPropertyExtension.extend(PropertyExtension);
document.registerElement('element-with-property-extension', ElementWithPropertyExtension);

/* Extension that defines a method. */

var MethodExtension = (function () {
  function MethodExtension() {
    _classCallCheck(this, MethodExtension);
  }

  _createClass(MethodExtension, [{
    key: "method",
    value: function method() {
      var result = this.callBase(MethodExtension, 'method');
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

    _get(Object.getPrototypeOf(ElementWithMethodExtension.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementWithMethodExtension, [{
    key: "method",
    value: function method() {
      this.componentMethodInvoked = true;
      return 'component result';
    }
  }]);

  return ElementWithMethodExtension;
})(_srcElementBase2["default"]);

ElementWithMethodExtension = ElementWithMethodExtension.extend(MethodExtension);
document.registerElement('element-with-method-extension', ElementWithMethodExtension);

/* Extension that defines a createdCallback method. */

var CreatedExtension = (function () {
  function CreatedExtension() {
    _classCallCheck(this, CreatedExtension);
  }

  _createClass(CreatedExtension, [{
    key: "createdCallback",
    value: function createdCallback() {
      this.callBase(CreatedExtension, 'createdCallback');
      this.extensionCreatedCallbackInvoked = true;
    }
  }]);

  return CreatedExtension;
})();

var ElementWithCreatedExtension = (function (_ElementBase6) {
  _inherits(ElementWithCreatedExtension, _ElementBase6);

  function ElementWithCreatedExtension() {
    _classCallCheck(this, ElementWithCreatedExtension);

    _get(Object.getPrototypeOf(ElementWithCreatedExtension.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementWithCreatedExtension, [{
    key: "template",
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithCreatedExtension;
})(_srcElementBase2["default"]);

ElementWithCreatedExtension = ElementWithCreatedExtension.extend(CreatedExtension);
document.registerElement('element-with-created-extension', ElementWithCreatedExtension);

var ElementWithMultipleExtensions = (function (_ElementBase7) {
  _inherits(ElementWithMultipleExtensions, _ElementBase7);

  function ElementWithMultipleExtensions() {
    _classCallCheck(this, ElementWithMultipleExtensions);

    _get(Object.getPrototypeOf(ElementWithMultipleExtensions.prototype), "constructor", this).apply(this, arguments);
  }

  return ElementWithMultipleExtensions;
})(_srcElementBase2["default"]);

ElementWithMultipleExtensions = ElementWithMultipleExtensions.extend(PropertyExtension, MethodExtension, CreatedExtension);
document.registerElement('element-with-multiple-extensions', ElementWithMultipleExtensions);

},{"../src/ElementBase":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3Rlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvdGVzdC90ZXN0RWxlbWVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDRU0sV0FBVztZQUFYLFdBQVc7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzsrQkFBWCxXQUFXOzs7OztlQUFYLFdBQVc7Ozs7V0FHUyxrQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTs7Ozs7Ozs7QUFRakQsVUFBSSxZQUFZLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsVUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFO0FBQ25DLFlBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDL0I7S0FDRjs7Ozs7Ozs7Ozs7OztXQVdPLGtCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQVc7QUFDakMsVUFBSSxPQUFPLEdBQUcsNkJBQTZCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdELFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNsQyxZQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xELFlBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSSxVQUFVLEdBQUcscUJBQXFCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pELGNBQUks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LGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsZ0JBQWdCLENBQ2pCLENBQUM7QUFDRixRQUFRLENBQUMsZUFBZSxDQUFDLGtDQUFrQyxFQUFFLDZCQUE2QixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLiAqL1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAvLyBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBIZWxwIGFuIGV4dGVuc2lvbiBtZXRob2QgY2FsbCBhIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb24gaWYgaXQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIHdhbGtzIHVwIHRoZSBvYmplY3QncyBjbGFzcyBoaWVyYXJjaHkgaW4gc2VhcmNoIG9mIHRoZSBjbGFzcyB0aGF0XG4gICAqIGltcGxlbWVudGVkIHRoZSBnaXZlbiBleHRlbnNpb24uIFRoYXQgaXQgZ29lcyB1cCBvbmUgbGV2ZWwsIGFuZCBsb29rcyB1cFxuICAgKiB0aGUgaGllcmFyY2h5IGZyb20gdGhhdCBwb2ludCB0byBzZWUgaWYgYW55IGJhc2UgY2xhc3MgaW1wbGVtZW50cyB0aGVcbiAgICogbmFtZWQgbWV0aG9kLiBJZiBhIGJhc2UgbWV0aG9kIGltcGxlbWVudGF0aW9uIGlzIGZvdW5kLCBpdCBpcyBpbnZva2VkIHdpdGhcbiAgICogdGhlIGdpdmVuIGFyZ3VtZW50cywgYW5kIHRoZSByZXN1bHQgb2YgdGhhdCBpcyByZXR1cm4uXG4gICAqL1xuICBjYWxsQmFzZShleHRlbnNpb24sIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgY2xhc3NGbiA9IGdldENsYXNzSW1wbGVtZW50aW5nRXh0ZW5zaW9uKHRoaXMsIGV4dGVuc2lvbik7XG4gICAgaWYgKGNsYXNzRm4pIHtcbiAgICAgIGxldCBwcm90b3R5cGUgPSBjbGFzc0ZuLnByb3RvdHlwZTtcbiAgICAgIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgICBpZiAoc3VwZXJQcm90bykge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIEJhc2UgY3JlYXRlZENhbGxiYWNrIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgLy8gdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBjcmVhdGVTaGFkb3dSb290V2l0aFRlbXBsYXRlKHRoaXMsIHRlbXBsYXRlKTtcbiAgICB9XG4gICAgbWFyc2hhbGxBdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKHRoaXMpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIGEgbWl4aW4vYmVoYXZpb3IuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICBsZXQgc3ViY2xhc3M7XG4gICAgbGV0IGJhc2VDbGFzcyA9IHRoaXM7XG4gICAgZXh0ZW5zaW9ucy5mb3JFYWNoKChleHRlbnNpb24pID0+IHtcbiAgICAgIHN1YmNsYXNzID0gZXh0ZW5kQ2xhc3MoYmFzZUNsYXNzLCBleHRlbnNpb24pO1xuICAgICAgYmFzZUNsYXNzID0gc3ViY2xhc3M7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YmNsYXNzO1xuICB9XG5cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICAvLyBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZENsYXNzKGJhc2VDbGFzcywgZXh0ZW5zaW9uKSB7XG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG4gIGxldCBtZW1iZXJzID0gZ2V0TWVtYmVyc0ZvckV4dGVuc2lvbihleHRlbnNpb24pO1xuICBjb3B5TWVtYmVycyhtZW1iZXJzLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICAvLyBzdWJjbGFzcy5wcm90b3R5cGUuc3VwZXJQcm90b3R5cGUgPSBiYXNlQ2xhc3MucHJvdG90eXBlO1xuICAvLyBSZW1lbWJlciB3aGljaCBjbGFzcyB3YXMgZXh0ZW5kZWQgdG8gY3JlYXRlIHRoaXMgbmV3IGNsYXNzIHNvIHRoYXRcbiAgLy8gZXh0ZW5kZWQgbWV0aG9kcyBjYW4gY2FsbCBpbXBsZW1lbnRhdGlvbnMgaW4gdGhlIHN1cGVyIChiYXNlKSBjbGFzcy5cbiAgc3ViY2xhc3MuX2ltcGxlbWVudHMgPSBtZW1iZXJzO1xuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cbi8vIFJldHVybiB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbiBmb3IgdGhlIGdpdmVuXG4vLyBvYmplY3QuXG5mdW5jdGlvbiBnZXRDbGFzc0ltcGxlbWVudGluZ0V4dGVuc2lvbihvYmosIGV4dGVuc2lvbikge1xuICBsZXQgbWVtYmVycyA9IGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgZm9yIChsZXQgY2xhc3NGbiA9IG9iai5jb25zdHJ1Y3RvcjsgY2xhc3NGbiAhPT0gbnVsbDsgY2xhc3NGbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjbGFzc0ZuLnByb3RvdHlwZSkuY29uc3RydWN0b3IpIHtcbiAgICBpZiAoY2xhc3NGbi5faW1wbGVtZW50cyA9PT0gbWVtYmVycykge1xuICAgICAgcmV0dXJuIGNsYXNzRm47XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRNZW1iZXJzRm9yRXh0ZW5zaW9uKGV4dGVuc2lvbikge1xuICByZXR1cm4gdHlwZW9mIGV4dGVuc2lvbiA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgZXh0ZW5zaW9uLnByb3RvdHlwZSA6XG4gICAgZXh0ZW5zaW9uO1xufVxuXG4vKlxuICogUmV0dXJuIGEgZGVzY3JpcHRvciBmb3IgdGhlIG5hbWVkIHByb3BlcnR5LCBsb29raW5nIHVwIHRoZSBjbGFzcyBoaWVyYXJjaHkuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpIHtcbiAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfVxuICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG8sIG5hbWUpO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJzaGFsbEF0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoZWxlbWVudCkge1xuICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCAoYXR0cmlidXRlKSA9PiB7XG4gICAgZWxlbWVudC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgfSk7XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIChnKSA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG5cblxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnJvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnJvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiB1c2UgZXh0ZW5zaW9uIHRvIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1wcm9wZXJ0eS1leHRlbnNpb24nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGludm9rZXMgYm90aCBleHRlbnNpb24ncyBhbmQgY29tcG9uZW50J3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW1ldGhvZC1leHRlbnNpb24nKTtcbiAgICBsZXQgcmVzdWx0ID0gZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnY29tcG9uZW50IHJlc3VsdCcpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChlbGVtZW50LmNvbXBvbmVudE1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnJvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiBoYXZlIG11bHRpcGxlIGV4dGVuc2lvbnNcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW11bHRpcGxlLWV4dGVuc2lvbnMnKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gXCIuLi9zcmMvRWxlbWVudEJhc2VcIjtcblxuXG4vKiBFbGVtZW50IHdpdGggYSBzaW1wbGUgdGVtcGxhdGUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnLCBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IHdpdGggYSByZWFsIHRlbXBsYXRlICovXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudGVtcGxhdGUuY29udGVudC50ZXh0Q29udGVudCA9IFwiSGVsbG9cIjtcbmNsYXNzIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJywgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgY3JlYXRlZCB2aWEgRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpICovXG5sZXQgRXM1Q2xhc3NWaWFFeHRlbmQgPSBFbGVtZW50QmFzZS5leHRlbmQoe1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICdwcm9wZXJ0eSc7XG4gIH0sXG4gIG1ldGhvZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdtZXRob2QnO1xuICB9LFxuICB2YWx1ZTogJ3ZhbHVlJ1xufSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VzNS1jbGFzcy12aWEtZXh0ZW5kJywgRXM1Q2xhc3NWaWFFeHRlbmQpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jdXN0b21Qcm9wZXJ0eTtcbiAgfVxuICBzZXQgY3VzdG9tUHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLl9jdXN0b21Qcm9wZXJ0eSA9IHZhbHVlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5JywgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSk7XG5cblxuLyogRWxlbWVudCBleHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgcHJvcGVydHkuICovXG5jbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gIGdldCBwcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxufVxuY2xhc3MgRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHt9XG5FbGVtZW50V2l0aFByb3BlcnR5RXh0ZW5zaW9uID0gRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbi5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtcHJvcGVydHktZXh0ZW5zaW9uJywgRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbik7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIG1ldGhvZC4gKi9cbmNsYXNzIE1ldGhvZEV4dGVuc2lvbiB7XG4gIG1ldGhvZCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5jYWxsQmFzZShNZXRob2RFeHRlbnNpb24sICdtZXRob2QnKTtcbiAgICB0aGlzLmV4dGVuc2lvbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBtZXRob2QoKSB7XG4gICAgdGhpcy5jb21wb25lbnRNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gJ2NvbXBvbmVudCByZXN1bHQnO1xuICB9XG59XG5FbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uLmV4dGVuZChNZXRob2RFeHRlbnNpb24pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtbWV0aG9kLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uKTtcblxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZC4gKi9cbmNsYXNzIENyZWF0ZWRFeHRlbnNpb24ge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5jYWxsQmFzZShDcmVhdGVkRXh0ZW5zaW9uLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgdGhpcy5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkID0gdHJ1ZTtcbiAgfVxufVxuY2xhc3MgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uID0gRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uLmV4dGVuZChDcmVhdGVkRXh0ZW5zaW9uKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJywgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uKTtcblxuXG5jbGFzcyBFbGVtZW50V2l0aE11bHRpcGxlRXh0ZW5zaW9ucyBleHRlbmRzIEVsZW1lbnRCYXNlIHt9XG5FbGVtZW50V2l0aE11bHRpcGxlRXh0ZW5zaW9ucyA9IEVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zLmV4dGVuZChcbiAgUHJvcGVydHlFeHRlbnNpb24sXG4gIE1ldGhvZEV4dGVuc2lvbixcbiAgQ3JlYXRlZEV4dGVuc2lvblxuKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLW11bHRpcGxlLWV4dGVuc2lvbnMnLCBFbGVtZW50V2l0aE11bHRpcGxlRXh0ZW5zaW9ucyk7XG4iXX0=
