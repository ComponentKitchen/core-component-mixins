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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var extensionForPrototype = new Map();

var Extensible = (function () {
  function Extensible() {
    _classCallCheck(this, Extensible);
  }

  /*
   * Copy the given members to the target.
   */

  _createClass(Extensible, [{
    key: 'super',

    /*
     * Call a superclass implementation of a method if it exists.
     *
     * This walks up the object's prototype chain in search of the given
     * extension. Then it goes up one level, and looks up the hierarchy from that
     * point to see if any superclass (object higher up the chain) implements the
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
      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      // We create a new subclass for each extension in turn. The result of
      // becomes the base class extended by any subsequent extensions. It turns
      // out that we can use Array.reduce() to concisely express this, using the
      // current (original) class as the seed for reduce().
      return extensions.reduce(extend, this);
    })
  }]);

  return Extensible;
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
 * Return a new subclass/object that extends the given base class/object with
 * the members of the indicated extension.
 */
function extend(base, extension) {

  var result = undefined;
  if (typeof base === 'function') {
    (function () {
      // Extending a real class.

      var subclass = (function (_base) {
        _inherits(subclass, _base);

        function subclass() {
          _classCallCheck(this, subclass);

          _get(Object.getPrototypeOf(subclass.prototype), 'constructor', this).apply(this, arguments);
        }

        return subclass;
      })(base);

      result = subclass;
    })();
  } else {
    // Extending a plain object.
    result = {};
    Object.setPrototypeOf(result, base);
  }

  var baseIsClass = typeof base === 'function';
  var extensionIsClass = typeof extension === 'function';
  if (baseIsClass && extensionIsClass) {
    // Extending a class with a class.
    // Copy both static and instance methods.
    copyMembers(extension, result, Object.getOwnPropertyNames(Function));
    copyMembers(extension.prototype, result.prototype, ['constructor']);
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    copyMembers(extension.prototype, result, ['constructor']);
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    copyMembers(extension, result.prototype);
  } else {
    // Extending a plain object with a plain object.
    copyMembers(extension, result);
  }

  // Give functions on the result a pointer to the corresponding functions on
  // their new base class.
  addSuperReferences(result, base);
  if (baseIsClass && extensionIsClass) {
    addSuperReferences(result.prototype, base.prototype);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(result.prototype, extension);

  return result;
}

function addSuperReferences(target, base) {
  // TODO: Handle properties.
  Object.getOwnPropertyNames(target).forEach(function (name) {
    var targetDescriptor = Object.getOwnPropertyDescriptor(target, name);
    var baseDescriptor = Object.getOwnPropertyDescriptor(base, name);
    if (typeof targetDescriptor.value === 'function' && baseDescriptor && typeof baseDescriptor.value === 'function') {
      targetDescriptor.value['super'] = baseDescriptor.value;
    }
  });
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

/*
 * Return a descriptor for the named property, looking up the prototype chain.
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

},{}],4:[function(require,module,exports){
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

},{"./AttributeMarshalling":2,"./AutomaticNodeFinding":3,"./ExtensibleElement":5,"./TemplateStamping":6}],5:[function(require,module,exports){
/*
 * An extensible HTML element
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
    value: (function (_method) {
      function method() {
        return _method.apply(this, arguments);
      }

      method.toString = function () {
        return _method.toString();
      };

      return method;
    })(function method() {
      var result = method['super']() || 'extension result';
      // let result = this.super(MethodExtension, 'method') || 'extension result';
      this.extensionMethodInvoked = true;
      return result;
    })
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
      this['super'](CreatedExtension, 'createdCallback');
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FeHRlbnNpYmxlRWxlbWVudC5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L0VsZW1lbnRCYXNlLnRlc3RzLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3Rlc3QvRXh0ZW5zaWJsZS50ZXN0cy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS90ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNrQkEsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztJQUdoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7Ozs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7O1dBV1QsZ0JBQUMsU0FBUyxFQUFFLElBQUksRUFBVztBQUM5QixVQUFJLFNBQVMsR0FBRyxpQ0FBaUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkUsVUFBSSxT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Z2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIEV4dGVuZCBjbGFzc2VzL29iamVjdHMgd2l0aCBvdGhlciBjbGFzc2VzL29iamVjdHMuXG4gKi9cblxuXG4vKlxuICogQSBtYXBwaW5nIG9mIGNsYXNzIHByb3RvdHlwZXMgdG8gdGhlIGNvcnJlc3BvbmRpbmcgZXh0ZW5zaW9uIHRoYXQgd2FzIHVzZWRcbiAqIHRvIGltcGxlbWVudCB0aGUgZXh0ZW5zaW9uLiBUaGlzIGlzIHVzZWQgYnkgdGhlIHN1cGVyKGV4dGVuc2lvbiwgbWV0aG9kKVxuICogZmFjaWxpdHkgdGhhdCBsZXRzIGV4dGVuc2lvbiBpbnZva2Ugc3VwZXJjbGFzcyBtZXRob2RzLlxuICpcbiAqIE5PVEU6IFRoaXMgbWFwIHVzZXMgY2xhc3MgcHJvdG90eXBlcywgbm90IGNsYXNzZXMgdGhlbXNlbHZlcywgYXMgdGhlIGtleXMuXG4gKiBUaGlzIGlzIGRvbmUgdG8gc3VwcG9ydCB3ZWIgY29tcG9uZW50cyBhcyBleHRlbnNpYmxlIEhUTUxFbGVtZW50IGNsYXNzZXMuXG4gKiBUaGUgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY3VzdG9tLWVsZW1lbnQnKSBmdW5jdGlvbiBjYW4gcmV0dXJuIGFuIGVsZW1lbnRcbiAqIHdob3NlIGNvbnN0cnVjdG9yIGlzICpub3QqIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCkuXG4gKiBUaGF0IGlzLCBlbGVtZW50IGNsYXNzZXMgaGF2ZSBhIHNwZWNpYWwgbXVuZ2VkIGNvbnN0cnVjdG9yLCBhbmQgdGhhdFxuICogY29uc3RydWN0b3IgY2FuJ3QgZ2V0IGluY2x1ZGVkIGluIG91ciBtYXAuIFdlIHVzZSBwcm90b3R5cGVzIGluc3RlYWQsIHdoaWNoXG4gKiBhcmUgbGVmdCBhbG9uZSBieSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqL1xubGV0IGV4dGVuc2lvbkZvclByb3RvdHlwZSA9IG5ldyBNYXAoKTtcblxuXG5jbGFzcyBFeHRlbnNpYmxlIHtcblxuICAvKlxuICAgKiBDYWxsIGEgc3VwZXJjbGFzcyBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZCBpZiBpdCBleGlzdHMuXG4gICAqXG4gICAqIFRoaXMgd2Fsa3MgdXAgdGhlIG9iamVjdCdzIHByb3RvdHlwZSBjaGFpbiBpbiBzZWFyY2ggb2YgdGhlIGdpdmVuXG4gICAqIGV4dGVuc2lvbi4gVGhlbiBpdCBnb2VzIHVwIG9uZSBsZXZlbCwgYW5kIGxvb2tzIHVwIHRoZSBoaWVyYXJjaHkgZnJvbSB0aGF0XG4gICAqIHBvaW50IHRvIHNlZSBpZiBhbnkgc3VwZXJjbGFzcyAob2JqZWN0IGhpZ2hlciB1cCB0aGUgY2hhaW4pIGltcGxlbWVudHMgdGhlXG4gICAqIG5hbWVkIG1ldGhvZC4gSWYgYSBzdXBlcmNsYXNzIG1ldGhvZCBpbXBsZW1lbnRhdGlvbiBpcyBmb3VuZCwgaXQgaXMgaW52b2tlZFxuICAgKiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMsIGFuZCB0aGUgcmVzdWx0IG9mIHRoYXQgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBzdXBlcihleHRlbnNpb24sIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcHJvdG90eXBlID0gZ2V0UHJvdG90eXBlSW1wbGVtZW50aW5nRXh0ZW5zaW9uKHRoaXMsIGV4dGVuc2lvbik7XG4gICAgaWYgKHByb3RvdHlwZSkge1xuICAgICAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICAgIGlmIChzdXBlclByb3RvKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG8sIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEsIEV4dGVuc2lvbjIsIEV4dGVuc2lvbjMpXG4gICAqXG4gICAqIHdpbGwgcmV0dXJuIGEgbmV3IGNsYXNzIG9mIE15QmFzZUNsYXNzIHRoYXQgaW1wbGVtZW50cyBhbGwgdGhlIG1ldGhvZHMgaW5cbiAgICogdGhlIHRocmVlIGV4dGVuc2lvbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEpLmV4dGVuZChFeHRlbnNpb24yKS5leHRlbmQoRXh0ZW5zaW9uMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IG9mXG4gICAgLy8gYmVjb21lcyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJuc1xuICAgIC8vIG91dCB0aGF0IHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlXG4gICAgLy8gY3VycmVudCAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kLCB0aGlzKTtcbiAgfVxuXG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIG1lbWJlcnMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU1lbWJlcnMobWVtYmVycywgdGFyZ2V0LCBpZ25vcmVNZW1iZXJzKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1lbWJlcnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKCFpZ25vcmVNZW1iZXJzIHx8IGlnbm9yZU1lbWJlcnMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBleHRlbnNpb24pIHtcblxuICBsZXQgcmVzdWx0O1xuICBpZiAodHlwZW9mIGJhc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSByZWFsIGNsYXNzLlxuICAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAgIHJlc3VsdCA9IHN1YmNsYXNzO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdC5cbiAgICByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LCBiYXNlKTtcbiAgfVxuXG4gIGxldCBiYXNlSXNDbGFzcyA9ICh0eXBlb2YgYmFzZSA9PT0gJ2Z1bmN0aW9uJyk7XG4gIGxldCBleHRlbnNpb25Jc0NsYXNzID0gKHR5cGVvZiBleHRlbnNpb24gPT09ICdmdW5jdGlvbicpO1xuICBpZiAoYmFzZUlzQ2xhc3MgJiYgZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBhIGNsYXNzIHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IGJvdGggc3RhdGljIGFuZCBpbnN0YW5jZSBtZXRob2RzLlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgcmVzdWx0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikpO1xuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbi5wcm90b3R5cGUsIHJlc3VsdC5wcm90b3R5cGUsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgcHJvdG90eXBlIG1ldGhvZHMgZGlyZWN0bHkgdG8gcmVzdWx0LlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbi5wcm90b3R5cGUsIHJlc3VsdCwgWydjb25zdHJ1Y3RvciddKTtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IGV4dGVuc2lvbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgcmVzdWx0LnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLCByZXN1bHQpO1xuICB9XG5cbiAgLy8gR2l2ZSBmdW5jdGlvbnMgb24gdGhlIHJlc3VsdCBhIHBvaW50ZXIgdG8gdGhlIGNvcnJlc3BvbmRpbmcgZnVuY3Rpb25zIG9uXG4gIC8vIHRoZWlyIG5ldyBiYXNlIGNsYXNzLlxuICBhZGRTdXBlclJlZmVyZW5jZXMocmVzdWx0LCBiYXNlKTtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICBhZGRTdXBlclJlZmVyZW5jZXMocmVzdWx0LnByb3RvdHlwZSwgYmFzZS5wcm90b3R5cGUpO1xuICB9XG5cbiAgLy8gUmVtZW1iZXIgd2hpY2ggZXh0ZW5zaW9uIHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0IGV4dGVuZGVkXG4gIC8vIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIGV4dGVuc2lvbkZvclByb3RvdHlwZS5zZXQocmVzdWx0LnByb3RvdHlwZSwgZXh0ZW5zaW9uKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBhZGRTdXBlclJlZmVyZW5jZXModGFyZ2V0LCBiYXNlKSB7XG4gIC8vIFRPRE86IEhhbmRsZSBwcm9wZXJ0aWVzLlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgbGV0IHRhcmdldERlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgbGV0IGJhc2VEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBuYW1lKTtcbiAgICBpZiAodHlwZW9mIHRhcmdldERlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgYmFzZURlc2NyaXB0b3IgJiYgdHlwZW9mIGJhc2VEZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0YXJnZXREZXNjcmlwdG9yLnZhbHVlLnN1cGVyID0gYmFzZURlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICB9KTtcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3Mvb2JqZWN0IHRoYXQgaW1wbGVtZW50ZWQgdGhlIGluZGljYXRlZFxuICogZXh0ZW5zaW9uIGZvciB0aGUgZ2l2ZW4gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlO1xuIiwiLypcbiAqIE1hcnNoYWxsIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyAoYW5kIGV2ZW50dWFsbHkgdmljZSB2ZXJzYSkuXG4gKi9cblxuY2xhc3MgQXR0cmlidXRlTWFyc2hhbGxpbmcge1xuXG4gIC8qXG4gICAqIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqL1xuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5zdXBlcihBdHRyaWJ1dGVNYXJzaGFsbGluZywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycpO1xuICAgIC8vIHRoaXMubG9nKGBhdHRyaWJ1dGUgJHtuYW1lfSBjaGFuZ2VkIHRvICR7bmV3VmFsdWV9YCk7XG4gICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgdGhlbiBzZXQgdGhhdFxuICAgIC8vIHByb3BlcnR5LlxuICAgIC8vIFRPRE86IFRoaXMgbG9va3MgdXAgdGhlIGV4aXN0ZW5jZSBvZiB0aGUgcHJvcGVydHkgZWFjaCB0aW1lLiBJdCB3b3VsZFxuICAgIC8vIGJlIG1vcmUgZWZmaWNpZW50IHRvLCBlLmcuLCBkbyBhIG9uZS10aW1lIGNvbXB1dGF0aW9uIG9mIGFsbCBwcm9wZXJ0aWVzXG4gICAgLy8gZGVmaW5lZCBieSB0aGUgZWxlbWVudCAoaW5jbHVkaW5nIGJhc2UgY2xhc3NlcykuXG4gICAgLy8gVE9ETzogSWdub3JlIHN0YW5kYXJkIGF0dHJpYnV0ZSBuYW1lLlxuICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcbiAgICBpZiAoaGFzUHJvcGVydHkodGhpcywgcHJvcGVydHlOYW1lKSkge1xuICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQXR0cmlidXRlTWFyc2hhbGxpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGUgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgbSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCBnID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBBdHRyaWJ1dGVNYXJzaGFsbGluZztcbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnN1cGVyKEF1dG9tYXRpY05vZGVGaW5kaW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvbWF0aWNOb2RlRmluZGluZztcbiIsIi8qXG4gKiBHZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLlxuICpcbiAqIFRoaXMgRWxlbWVudEJhc2UgY2xhc3MgaW1wbGVtZW50cyB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsXG4gKiBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuL0V4dGVuc2libGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbkVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuZXh0ZW5kKFxuICBUZW1wbGF0ZVN0YW1waW5nLFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50XG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGUgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IEV4dGVuc2libGVFbGVtZW50ID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICovXG5cblxuY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICB0aGlzLnN1cGVyKFRlbXBsYXRlU3RhbXBpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIHRoaXMubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICAgICAgbGV0IHJvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8qXG4gKiBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVTdGFtcGluZztcbiIsImltcG9ydCAqIGFzIHRlc3RFbGVtZW50cyBmcm9tIFwiLi90ZXN0RWxlbWVudHNcIjtcblxuc3VpdGUoXCJFbGVtZW50QmFzZVwiLCAoKSA9PiB7XG5cbiAgdGVzdChcImNvbXBvbmVudCBzdGFtcHMgc3RyaW5nIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtc3RyaW5nLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHJlYWwgdGVtcGxhdGUgaW50byByb290XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuc2hhZG93Um9vdCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gY3JlYXRlIGNvbXBvbmVudCBjbGFzcyB3aXRoIEVTNS1jb21wYXRpYmxlIC5leHRlbmQoKVwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlczUtY2xhc3MtdmlhLWV4dGVuZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCAncHJvcGVydHknKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5tZXRob2QoKSwgJ21ldGhvZCcpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnZhbHVlLCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImh5cGhlbmF0ZWQgYXR0cmlidXRlIG1hcnNoYWxsZWQgdG8gY29ycmVzcG9uZGluZyBjYW1lbENhc2UgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2N1c3RvbS1wcm9wZXJ0eScsIFwiSGVsbG9cIik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuY3VzdG9tUHJvcGVydHksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gY2FuIGRlZmluZSBjcmVhdGVkQ2FsbGJhY2tcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJyk7XG4gICAgYXNzZXJ0KGVsZW1lbnQuZXh0ZW5zaW9uQ3JlYXRlZENhbGxiYWNrSW52b2tlZCk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQuc2hhZG93Um9vdC50ZXh0Q29udGVudC50cmltKCksIFwiSGVsbG9cIik7XG4gIH0pO1xuXG59KTtcbiIsImltcG9ydCBFeHRlbnNpYmxlIGZyb20gXCIuLi9leHRlbnNpYmxlL0V4dGVuc2libGVcIjtcblxuXG4vKiBTYW1wbGUgY2xhc3NlcyB1c2VkIGJ5IHRoZSB0ZXN0IHN1aXRlICovXG5cbi8qIEEgc2ltcGxlIGJhc2UgY2xhc3MgKi9cbmNsYXNzIEV4YW1wbGVCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZSB7XG4gIGZvbygpIHtcbiAgICByZXR1cm4gJ0V4YW1wbGVCYXNlJztcbiAgfVxufVxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgcHJvcGVydHkgKi9cbmNsYXNzIFByb3BlcnR5RXh0ZW5zaW9uIHtcbiAgZ2V0IHByb3BlcnR5KCkge1xuICAgIHJldHVybiAndmFsdWUnO1xuICB9XG59XG5cbi8qIEV4dGVuc2lvbiB0aGF0IGRlZmluZXMgYSBtZXRob2QgKi9cbmNsYXNzIE1ldGhvZEV4dGVuc2lvbiB7XG4gIG1ldGhvZCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWV0aG9kLnN1cGVyKCkgfHwgJ2V4dGVuc2lvbiByZXN1bHQnO1xuICAgIC8vIGxldCByZXN1bHQgPSB0aGlzLnN1cGVyKE1ldGhvZEV4dGVuc2lvbiwgJ21ldGhvZCcpIHx8ICdleHRlbnNpb24gcmVzdWx0JztcbiAgICB0aGlzLmV4dGVuc2lvbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuXG5zdWl0ZShcIkV4dGVuc2libGVcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM2IGNsYXNzIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBnZXQgYmFyKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNhbiBleHRlbmQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKCkgc3ludGF4XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoe1xuICAgICAgYmFyOiB0cnVlXG4gICAgfSk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmZvbygpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGV4dGVuc2lvbiBjYW4gZGVmaW5lIGEgbWV0aG9kXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJleHRlbnNpb24gbWV0aG9kIGNhbiB1c2Ugc3VwZXIoKSB0byBpbnZva2UgYmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvblwiLCAoKSA9PiB7XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBFeGFtcGxlQmFzZSB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIHRoaXMuYmFzZU1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gJ2Jhc2UgcmVzdWx0JztcbiAgICAgIH1cbiAgICB9XG4gICAgU3ViY2xhc3MgPSBTdWJjbGFzcy5leHRlbmQoTWV0aG9kRXh0ZW5zaW9uKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2Jhc2UgcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICAgIGFzc2VydChpbnN0YW5jZS5iYXNlTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJtdWx0aXBsZSBleHRlbnNpb25zIGNhbiBiZSBhcHBsaWVkIGluIG9uZSBjYWxsXCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoXG4gICAgICBQcm9wZXJ0eUV4dGVuc2lvbixcbiAgICAgIE1ldGhvZEV4dGVuc2lvblxuICAgICk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2V4dGVuc2lvbiByZXN1bHQnKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGEgcGxhaW4gb2JqZWN0XCIsICgpID0+IHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICByZXR1cm4gJ3Jlc3VsdCc7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgZXh0ZW5zaW9uID0ge1xuICAgICAgcHJvcGVydHk6ICd2YWx1ZSdcbiAgICB9O1xuICAgIGxldCBleHRlbmRlZCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwob2JqLCBleHRlbnNpb24pO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5tZXRob2QoKSwgJ3Jlc3VsdCcpO1xuICAgIGFzc2VydC5lcXVhbChleHRlbmRlZC5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG59KTtcbiIsImltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi9zcmMvRWxlbWVudEJhc2UnO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBhIHNpbXBsZSB0ZW1wbGF0ZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhTdHJpbmdUZW1wbGF0ZSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBcIkhlbGxvXCI7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScsIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBhIHJlYWwgdGVtcGxhdGUgKi9cbmxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG50ZW1wbGF0ZS5jb250ZW50LnRleHRDb250ZW50ID0gXCJIZWxsb1wiO1xuY2xhc3MgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLXJlYWwtdGVtcGxhdGUnLCBFbGVtZW50V2l0aFJlYWxUZW1wbGF0ZSk7XG5cblxuLyogRWxlbWVudCBjcmVhdGVkIHZpYSBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKCkgKi9cbmxldCBFczVDbGFzc1ZpYUV4dGVuZCA9IEVsZW1lbnRCYXNlLmV4dGVuZCh7XG4gIGdldCBjdXN0b21Qcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3Byb3BlcnR5JztcbiAgfSxcbiAgbWV0aG9kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ21ldGhvZCc7XG4gIH0sXG4gIHZhbHVlOiAndmFsdWUnXG59KTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnLCBFczVDbGFzc1ZpYUV4dGVuZCk7XG5cblxuLyogRWxlbWVudCB3aXRoIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lICovXG5jbGFzcyBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1c3RvbVByb3BlcnR5O1xuICB9XG4gIHNldCBjdXN0b21Qcm9wZXJ0eSh2YWx1ZSkge1xuICAgIHRoaXMuX2N1c3RvbVByb3BlcnR5ID0gdmFsdWU7XG4gIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNhbWVsLWNhc2UtcHJvcGVydHknLCBFbGVtZW50V2l0aENhbWVsQ2FzZVByb3BlcnR5KTtcblxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZC4gKi9cbmNsYXNzIENyZWF0ZWRFeHRlbnNpb24ge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihDcmVhdGVkRXh0ZW5zaW9uLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgdGhpcy5leHRlbnNpb25DcmVhdGVkQ2FsbGJhY2tJbnZva2VkID0gdHJ1ZTtcbiAgfVxufVxuY2xhc3MgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIFwiSGVsbG9cIjtcbiAgfVxufVxuRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uID0gRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uLmV4dGVuZChDcmVhdGVkRXh0ZW5zaW9uKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC13aXRoLWNyZWF0ZWQtZXh0ZW5zaW9uJywgRWxlbWVudFdpdGhDcmVhdGVkRXh0ZW5zaW9uKTtcbiJdfQ==
