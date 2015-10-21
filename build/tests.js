(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
     * The call
     *
     *   MyBaseClass.extend(Extension1, Extension2, Extension3)
     *
     * will return a new class of MyBaseClass that implements all the methods in
     * the three extensions given. The above is equivalent to
     *
     *   MyBaseClass.extend(Extension1).extend(Extension2).extend(Extension3)
     *
     */
  }], [{
    key: 'extend',
    value: function extend() {
      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      // We create a new subclass for each extension in turn. The result of
      // becomes the base class extended by any subsequent extensions. It turns
      // out that we can use Array.reduce() to concisely express this, using the
      // current (original) class as the seed for reduce().
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

},{}],2:[function(require,module,exports){
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

},{"./ExtensibleClass":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

var _extensibleExtensibleElement = require('../extensible/ExtensibleElement');

var _extensibleExtensibleElement2 = _interopRequireDefault(_extensibleExtensibleElement);

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
})(_extensibleExtensibleElement2['default']);

ElementBase = ElementBase.extend(_TemplateStamping2['default'], _AutomaticNodeFinding2['default'], // before marshalling, so marshalled properties can use it
_AttributeMarshalling2['default']);

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{"../extensible/ExtensibleElement":2,"./AttributeMarshalling":3,"./AutomaticNodeFinding":4,"./TemplateStamping":6}],6:[function(require,module,exports){
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

},{"../src/ElementBase":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlQ2xhc3MuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlRWxlbWVudC5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FbGVtZW50QmFzZS5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L0VsZW1lbnRCYXNlLnRlc3RzLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3Rlc3QvdGVzdEVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2tCQSxJQUFJLHFCQUFxQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0lBR2hDLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7Ozs7Ozs7ZUFBZixlQUFlOzs7Ozs7Ozs7Ozs7V0FXZCxnQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFXO0FBQzlCLFVBQUksU0FBUyxHQUFHLGlDQUFpQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxVQUFJLFNBQVMsRUFBRTtBQUNiLFlBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENB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Q0FBQztBQUNoRCxVQUFJLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDO0tBQzdDOzs7U0FKRyxnQkFBZ0I7OztJQU1oQiwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7K0JBQTNCLDJCQUEyQjs7O2VBQTNCLDJCQUEyQjs7U0FDbkIsZUFBRztBQUNiLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FIRywyQkFBMkI7OztBQUtqQywyQkFBMkIsR0FBRywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuRixRQUFRLENBQUMsZUFBZSxDQUFDLGdDQUFnQyxFQUFFLDJCQUEyQixDQUFDLENBQUM7Ozs7SUFJbEYsNkJBQTZCO1lBQTdCLDZCQUE2Qjs7V0FBN0IsNkJBQTZCOzBCQUE3Qiw2QkFBNkI7OytCQUE3Qiw2QkFBNkI7OztTQUE3Qiw2QkFBNkI7OztBQUNuQyw2QkFBNkIsR0FBRyw2QkFBNkIsQ0FBQyxNQUFNLENBQ2xFLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsZ0JBQWdCLENBQ2pCLENBQUM7QUFDRixRQUFRLENBQUMsZUFBZSxDQUFDLGtDQUFrQyxFQUFFLDZCQUE2QixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIEEgY2xhc3Mgd2hpY2ggY2FuIGJlIGV4dGVuZGVkIHdpdGggb3RoZXIgY2xhc3Nlcy5cbiAqL1xuXG5cbi8qXG4gKiBBIG1hcHBpbmcgb2YgY2xhc3MgcHJvdG90eXBlcyB0byB0aGUgY29ycmVzcG9uZGluZyBleHRlbnNpb24gdGhhdCB3YXMgdXNlZFxuICogdG8gaW1wbGVtZW50IHRoZSBleHRlbnNpb24uIFRoaXMgaXMgdXNlZCBieSB0aGUgc3VwZXIoZXh0ZW5zaW9uLCBtZXRob2QpXG4gKiBmYWNpbGl0eSB0aGF0IGxldHMgZXh0ZW5zaW9uIGludm9rZSBzdXBlcmNsYXNzIG1ldGhvZHMuXG4gKlxuICogTk9URTogVGhpcyBtYXAgdXNlcyBjbGFzcyBwcm90b3R5cGVzLCBub3QgY2xhc3NlcyB0aGVtc2VsdmVzLCBhcyB0aGUga2V5cy5cbiAqIFRoaXMgaXMgZG9uZSB0byBzdXBwb3J0IHdlYiBjb21wb25lbnRzIGFzIGV4dGVuc2libGUgSFRNTEVsZW1lbnQgY2xhc3Nlcy5cbiAqIFRoZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjdXN0b20tZWxlbWVudCcpIGZ1bmN0aW9uIGNhbiByZXR1cm4gYW4gZWxlbWVudFxuICogd2hvc2UgY29uc3RydWN0b3IgaXMgKm5vdCogdGhlIGZ1bmN0aW9uIHBhc3NlZCB0byBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqIFRoYXQgaXMsIGVsZW1lbnQgY2xhc3NlcyBoYXZlIGEgc3BlY2lhbCBtdW5nZWQgY29uc3RydWN0b3IsIGFuZCB0aGF0XG4gKiBjb25zdHJ1Y3RvciBjYW4ndCBnZXQgaW5jbHVkZWQgaW4gb3VyIG1hcC4gV2UgdXNlIHByb3RvdHlwZXMgaW5zdGVhZCwgd2hpY2hcbiAqIGFyZSBsZWZ0IGFsb25nIGJ5IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICovXG5sZXQgZXh0ZW5zaW9uRm9yUHJvdG90eXBlID0gbmV3IE1hcCgpO1xuXG5cbmNsYXNzIEV4dGVuc2libGVDbGFzcyB7XG5cbiAgLypcbiAgICogQ2FsbCBhIHN1cGVyY2xhc3MgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2QgaWYgaXQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIHdhbGtzIHVwIHRoZSBvYmplY3QncyBjbGFzcyBoaWVyYXJjaHkgaW4gc2VhcmNoIG9mIHRoZSBjbGFzcyB0aGF0XG4gICAqIGltcGxlbWVudGVkIHRoZSBnaXZlbiBleHRlbnNpb24uIFRoZW4gaXQgZ29lcyB1cCBvbmUgbGV2ZWwsIGFuZCBsb29rcyB1cFxuICAgKiB0aGUgaGllcmFyY2h5IGZyb20gdGhhdCBwb2ludCB0byBzZWUgaWYgYW55IHN1cGVyY2xhc3MgaW1wbGVtZW50cyB0aGVcbiAgICogbmFtZWQgbWV0aG9kLiBJZiBhIHN1cGVyY2xhc3MgbWV0aG9kIGltcGxlbWVudGF0aW9uIGlzIGZvdW5kLCBpdCBpcyBpbnZva2VkXG4gICAqIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cywgYW5kIHRoZSByZXN1bHQgb2YgdGhhdCBpcyByZXR1cm5lZC5cbiAgICovXG4gIHN1cGVyKGV4dGVuc2lvbiwgbmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24odGhpcywgZXh0ZW5zaW9uKTtcbiAgICBpZiAocHJvdG90eXBlKSB7XG4gICAgICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgICAgaWYgKHN1cGVyUHJvdG8pIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSwgRXh0ZW5zaW9uMiwgRXh0ZW5zaW9uMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgZXh0ZW5zaW9ucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSkuZXh0ZW5kKEV4dGVuc2lvbjIpLmV4dGVuZChFeHRlbnNpb24zKVxuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IG9mXG4gICAgLy8gYmVjb21lcyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJuc1xuICAgIC8vIG91dCB0aGF0IHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlXG4gICAgLy8gY3VycmVudCAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kQ2xhc3MsIHRoaXMpO1xuICB9XG5cbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gbWVtYmVycyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5TWVtYmVycyhtZW1iZXJzLCB0YXJnZXQsIGlnbm9yZU1lbWJlcnMpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWVtYmVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGlmICghaWdub3JlTWVtYmVycyB8fCBpZ25vcmVNZW1iZXJzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWVtYmVycywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzIG9mIHRoZSBnaXZlbiBiYXNlY2xhc3MuIFRoZSBuZXcgY2xhc3MnIHByb3RvdHlwZSB3aWxsXG4gKiBpbmNsdWRlIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICovXG5mdW5jdGlvbiBleHRlbmRDbGFzcyhiYXNlQ2xhc3MsIGV4dGVuc2lvbikge1xuXG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG5cbiAgaWYgKHR5cGVvZiBleHRlbnNpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFeHRlbmRpbmcgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgYm90aCBzdGF0aWMgYW5kIGluc3RhbmNlIG1ldGhvZHMuXG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLCBzdWJjbGFzcywgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pKTtcbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCBzdWJjbGFzcy5wcm90b3R5cGUsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICB9XG5cbiAgLy8gUmVtZW1iZXIgd2hpY2ggZXh0ZW5zaW9uIHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0IGV4dGVuZGVkXG4gIC8vIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIGV4dGVuc2lvbkZvclByb3RvdHlwZS5zZXQoc3ViY2xhc3MucHJvdG90eXBlLCBleHRlbnNpb24pO1xuXG4gIHJldHVybiBzdWJjbGFzcztcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvblxuICogZm9yIHRoZSBnaXZlbiBvYmplY3QuXG4gKlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgY2xhc3MgaGllcmFyY2h5LlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlQ2xhc3M7XG4iLCIvKlxuICogQW4gZXh0ZW5zaWJsZSBIVE1MIGVsZW1lbnRcbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUNsYXNzIGZyb20gJy4vRXh0ZW5zaWJsZUNsYXNzJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGVDbGFzcyB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHRoYXQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBFeHRlbnNpYmxlRWxlbWVudCA9IEV4dGVuc2libGVDbGFzcy5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZUNsYXNzKTtcblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5jbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyk7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihBdHRyaWJ1dGVNYXJzaGFsbGluZywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIChtKSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCAoZykgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nO1xuIiwiLypcbiAqIFBvbHltZXItc3R5bGUgYXV0b21hdGljIG5vZGUgZmluZGluZy5cbiAqIFNlZSBodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZy5cbiAqL1xuXG5jbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQXV0b21hdGljTm9kZUZpbmRpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIGlkID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIHRoaXMuJFtpZF0gPSBub2RlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXV0b21hdGljTm9kZUZpbmRpbmc7XG4iLCIvKlxuICogR2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cy5cbiAqXG4gKiBUaGlzIEVsZW1lbnRCYXNlIGNsYXNzIGltcGxlbWVudHMgdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LFxuICogYW5kIG1hcnNoYWxsaW5nIGJldHdlZW4gYXR0cmlidXRlcyBhbmQgcHJvcGVydGllcy5cbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUVsZW1lbnQgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEV4dGVuc2libGVFbGVtZW50IHtcblxuICAvKiBGb3IgZGVidWdnaW5nICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5FbGVtZW50QmFzZSA9IEVsZW1lbnRCYXNlLmV4dGVuZChcbiAgVGVtcGxhdGVTdGFtcGluZyxcbiAgQXV0b21hdGljTm9kZUZpbmRpbmcsIC8vIGJlZm9yZSBtYXJzaGFsbGluZywgc28gbWFyc2hhbGxlZCBwcm9wZXJ0aWVzIGNhbiB1c2UgaXRcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmdcbik7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqL1xuXG5cbmNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgdGhpcy5zdXBlcihUZW1wbGF0ZVN0YW1waW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlU3RhbXBpbmc7XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiB1c2UgZXh0ZW5zaW9uIHRvIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1wcm9wZXJ0eS1leHRlbnNpb24nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGludm9rZXMgYm90aCBleHRlbnNpb24ncyBhbmQgY29tcG9uZW50J3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW1ldGhvZC1leHRlbnNpb24nKTtcbiAgICBsZXQgcmVzdWx0ID0gZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnY29tcG9uZW50IHJlc3VsdCcpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChlbGVtZW50LmNvbXBvbmVudE1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IGNhbiBoYXZlIG11bHRpcGxlIGV4dGVuc2lvbnNcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLW11bHRpcGxlLWV4dGVuc2lvbnMnKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgZWxlbWVudC5tZXRob2QoKTtcbiAgICBhc3NlcnQoZWxlbWVudC5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgc2ltcGxlIHRlbXBsYXRlICovXG5jbGFzcyBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJywgRWxlbWVudFdpdGhTdHJpbmdUZW1wbGF0ZSk7XG5cblxuLyogRWxlbWVudCB3aXRoIGEgcmVhbCB0ZW1wbGF0ZSAqL1xubGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbnRlbXBsYXRlLmNvbnRlbnQudGV4dENvbnRlbnQgPSBcIkhlbGxvXCI7XG5jbGFzcyBFbGVtZW50V2l0aFJlYWxUZW1wbGF0ZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScsIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IGNyZWF0ZWQgdmlhIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKSAqL1xubGV0IEVzNUNsYXNzVmlhRXh0ZW5kID0gRWxlbWVudEJhc2UuZXh0ZW5kKHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiAncHJvcGVydHknO1xuICB9LFxuICBtZXRob2Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnbWV0aG9kJztcbiAgfSxcbiAgdmFsdWU6ICd2YWx1ZSdcbn0pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcsIEVzNUNsYXNzVmlhRXh0ZW5kKTtcblxuXG4vKiBFbGVtZW50IHdpdGggY2FtZWxDYXNlIHByb3BlcnR5IG5hbWUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VzdG9tUHJvcGVydHk7XG4gIH1cbiAgc2V0IGN1c3RvbVByb3BlcnR5KHZhbHVlKSB7XG4gICAgdGhpcy5fY3VzdG9tUHJvcGVydHkgPSB2YWx1ZTtcbiAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY2FtZWwtY2FzZS1wcm9wZXJ0eScsIEVsZW1lbnRXaXRoQ2FtZWxDYXNlUHJvcGVydHkpO1xuXG5cbi8qIEVsZW1lbnQgZXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5LiAqL1xuY2xhc3MgUHJvcGVydHlFeHRlbnNpb24ge1xuICBnZXQgcHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICd2YWx1ZSc7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24gZXh0ZW5kcyBFbGVtZW50QmFzZSB7fVxuRWxlbWVudFdpdGhQcm9wZXJ0eUV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24uZXh0ZW5kKFByb3BlcnR5RXh0ZW5zaW9uKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXByb3BlcnR5LWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoUHJvcGVydHlFeHRlbnNpb24pO1xuXG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBtZXRob2QuICovXG5jbGFzcyBNZXRob2RFeHRlbnNpb24ge1xuICBtZXRob2QoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3VwZXIoTWV0aG9kRXh0ZW5zaW9uLCAnbWV0aG9kJyk7XG4gICAgdGhpcy5leHRlbnNpb25NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5jbGFzcyBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgbWV0aG9kKCkge1xuICAgIHRoaXMuY29tcG9uZW50TWV0aG9kSW52b2tlZCA9IHRydWU7XG4gICAgcmV0dXJuICdjb21wb25lbnQgcmVzdWx0JztcbiAgfVxufVxuRWxlbWVudFdpdGhNZXRob2RFeHRlbnNpb24gPSBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbi5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbndpbmRvdy5FbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoTWV0aG9kRXh0ZW5zaW9uO1xud2luZG93Lk1ldGhvZEV4dGVuc2lvbiA9IE1ldGhvZEV4dGVuc2lvbjtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLW1ldGhvZC1leHRlbnNpb24nLCBFbGVtZW50V2l0aE1ldGhvZEV4dGVuc2lvbik7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QuICovXG5jbGFzcyBDcmVhdGVkRXh0ZW5zaW9uIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQ3JlYXRlZEV4dGVuc2lvbiwgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIHRoaXMuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCA9IHRydWU7XG4gIH1cbn1cbmNsYXNzIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbkVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbiA9IEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbi5leHRlbmQoQ3JlYXRlZEV4dGVuc2lvbik7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicsIEVsZW1lbnRXaXRoQ3JlYXRlZEV4dGVuc2lvbik7XG5cblxuLyogQSBjb21wb25lbnQgdXNpbmcgbXVsdGlwbGUgZXh0ZW5zaW9ucy4gKi9cbmNsYXNzIEVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zIGV4dGVuZHMgRWxlbWVudEJhc2Uge31cbkVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zID0gRWxlbWVudFdpdGhNdWx0aXBsZUV4dGVuc2lvbnMuZXh0ZW5kKFxuICBQcm9wZXJ0eUV4dGVuc2lvbixcbiAgTWV0aG9kRXh0ZW5zaW9uLFxuICBDcmVhdGVkRXh0ZW5zaW9uXG4pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtbXVsdGlwbGUtZXh0ZW5zaW9ucycsIEVsZW1lbnRXaXRoTXVsdGlwbGVFeHRlbnNpb25zKTtcbiJdfQ==
