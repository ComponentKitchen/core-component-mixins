(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _srcElementBase = require('../src/ElementBase');

var _srcElementBase2 = _interopRequireDefault(_srcElementBase);

/* Define a custom element. */

var GreetElement = (function (_ElementBase) {
  _inherits(GreetElement, _ElementBase);

  function GreetElement() {
    _classCallCheck(this, GreetElement);

    _get(Object.getPrototypeOf(GreetElement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GreetElement, [{
    key: 'punctuation',

    /* Define a "punctuation" attribute. */
    get: function get() {
      return this.$.punctuation.textContent;
    },
    set: function set(value) {
      this.$.punctuation.textContent = value;
    }
  }, {
    key: 'template',
    get: function get() {
      return '\n      Hello,\n      <content></content><span id="punctuation">.</span>\n    ';
    }
  }]);

  return GreetElement;
})(_srcElementBase2['default']);

document.registerElement('greet-element', GreetElement);

exports['default'] = GreetElement;
module.exports = exports['default'];

},{"../src/ElementBase":8}],2:[function(require,module,exports){
/*
 * Demonstrate the use of a hypothetical XTag registration function.
 */

'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _xtag = require('./xtag');

var xtag = _interopRequireWildcard(_xtag);

xtag.register('xtag-example', {

  content: '\n    <button>\n      <content></content>\n    </button>\n  ',

  events: {
    click: function click() {
      alert('Clicked');
    }
  }

});

},{"./xtag":4}],3:[function(require,module,exports){
/*
 * Demonstrate some hypothetical XTag-like sugar for component development.
 *
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      var base = this["super"](XTagExtensions).createdCallback;
      if (base) {
        base.call(this);
      }
      var events = this.events || [];
      for (var _name in events) {
        this.addEventListener(_name, events[_name]);
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

exports["default"] = XTagExtensions;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
/*
 * Demonstration of creation of a base class for a particular framework.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.register = register;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcExtensibleElement = require('../../src/ExtensibleElement');

var _srcExtensibleElement2 = _interopRequireDefault(_srcExtensibleElement);

var _srcTemplateStamping = require('../../src/TemplateStamping');

var _srcTemplateStamping2 = _interopRequireDefault(_srcTemplateStamping);

var _srcAttributeMarshalling = require('../../src/AttributeMarshalling');

var _srcAttributeMarshalling2 = _interopRequireDefault(_srcAttributeMarshalling);

var _XTagExtensions = require('./XTagExtensions');

var _XTagExtensions2 = _interopRequireDefault(_XTagExtensions);

/*
 * A framework base class can start with ExtensibleElement, and extend it with
 * just the features it wants. Here it uses two standard extension classes
 * for template stamping and attribute marshalling, and adds a custom extension
 * for some XTag-style features. By design, this omits automatic node finding,
 * just to show that it's possible to leave out extensions if that's desired.
 */
var Element = _srcExtensibleElement2['default'].extend(_srcTemplateStamping2['default'], _srcAttributeMarshalling2['default'], _XTagExtensions2['default']);

exports.Element = Element;
/*
 * The framework can simply let people extend its base class, or provide a
 * custom constructor that extends that base class.
 */

function register(tag, prototype) {
  var Subclass = Element.extend(prototype);
  document.registerElement(tag, Subclass);
  return Subclass;
}

},{"../../src/AttributeMarshalling":6,"../../src/ExtensibleElement":9,"../../src/TemplateStamping":10,"./XTagExtensions":3}],5:[function(require,module,exports){
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
     * Return the prototype in the prototype chain that's above the one that
     * implemented the given extension.
     *
     * This is used in ES5-compatible extensions to invoke base property/method
     * implementations, regardless of where the extension ended up in the
     * prototype chain. This can be used by ES5 extensions or transpiled
     * ES6-to-ES5 extensions. Pure ES6 extensions can make simple use of the
     * "super" keyword instead, but that won't work in transpiled ES6-to-ES5
     * (e.g., via Babel).
     */
    value: function _super(extension) {
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

  // Check whether the base and extension are classes or plain objects.
  var baseIsClass = typeof base === 'function';
  var extensionIsClass = typeof extension === 'function';

  // Check to see if the *extension* has a base class/prototype.
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./AttributeMarshalling":6,"./AutomaticNodeFinding":7,"./ExtensibleElement":9,"./TemplateStamping":10}],9:[function(require,module,exports){
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

},{"../extensible/Extensible":5}],10:[function(require,module,exports){
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

},{}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL2RlbW9zL3h0YWcvWFRhZ0V4YW1wbGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MveHRhZy9YVGFnRXh0ZW5zaW9ucy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9kZW1vcy94dGFnL3h0YWcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FeHRlbnNpYmxlRWxlbWVudC5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDQXdCLG9CQUFvQjs7Ozs7O0lBR3RDLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7OztTQUdELGVBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7S0FDdkM7U0FDYyxhQUFDLEtBQUssRUFBRTtBQUNyQixVQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQ3hDOzs7U0FFVyxlQUFHO0FBQ2IsOEZBR0U7S0FDSDs7O1NBZkcsWUFBWTs7O0FBbUJsQixRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7cUJBRXpDLFlBQVk7Ozs7Ozs7Ozs7OztvQkNwQkwsUUFBUTs7SUFBbEIsSUFBSTs7QUFFaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7O0FBRTVCLFNBQU8sZ0VBSU47O0FBRUQsUUFBTSxFQUFFO0FBQ04sU0FBSyxFQUFFLGlCQUFNO0FBQ1gsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2xCO0dBQ0Y7O0NBRUYsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNmRyxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOzs7Ozs7O1dBTUgsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDO0FBQ3RELFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjtBQUNELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQy9CLFdBQUssSUFBSSxLQUFJLElBQUksTUFBTSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUksQ0FBQyxDQUFDLENBQUM7T0FDM0M7S0FDRjs7Ozs7OztTQUtXLGVBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FDVyxhQUFDLEtBQUssRUFBRTtBQUNsQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBekJHLGNBQWM7OztxQkE2QkwsY0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0NDOUJDLDZCQUE2Qjs7OzttQ0FDOUIsNEJBQTRCOzs7O3VDQUN4QixnQ0FBZ0M7Ozs7OEJBQ3RDLGtCQUFrQjs7Ozs7Ozs7Ozs7QUFTdEMsSUFBSSxPQUFPLEdBQUcsa0NBQWtCLE1BQU0scUdBSTVDLENBQUM7Ozs7Ozs7O0FBTUssU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtBQUN2QyxNQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLFVBQVEsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLFNBQU8sUUFBUSxDQUFDO0NBQ2pCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkQsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztJQUdoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7Ozs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7V0FhVCxnQkFBQyxTQUFTLEVBQUU7QUFDZixVQUFJLFNBQVMsR0FBRyxpQ0FBaUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkUsYUFBTyxTQUFTLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlCWSxZQUFnQjt3Q0FBWixVQUFVO0FBQVYsa0JBQVU7Ozs7Ozs7QUFLekIsYUFBTyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7O1NBL0NHLFVBQVU7OztBQXVEaEIsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUU7QUFDbkQsUUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNsRCxRQUFJLENBQUMsYUFBYSxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3JELFVBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEUsWUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ2pEO0dBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxNQUFNLENBQUM7Q0FDZjs7Ozs7O0FBTUQsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTs7O0FBRy9CLE1BQUksV0FBVyxHQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsQUFBQyxDQUFDO0FBQy9DLE1BQUksZ0JBQWdCLEdBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxBQUFDLENBQUM7OztBQUd6RCxNQUFJLGFBQWEsR0FBRyxnQkFBZ0IsR0FDbEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxHQUN0RCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLE1BQUksYUFBYSxJQUNiLGFBQWEsS0FBSyxRQUFRLElBQzFCLGFBQWEsS0FBSyxNQUFNLEVBQUU7OztBQUc1QixRQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztHQUNwQzs7QUFFRCxNQUFJLE1BQU0sR0FBRyxXQUFXOzs7Y0FFaEIsUUFBUTs7YUFBUixRQUFROzRCQUFSLFFBQVE7O2lDQUFSLFFBQVE7OztXQUFSLFFBQVE7S0FBUyxJQUFJOztBQUUzQixRQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QixNQUFJLFdBQVcsSUFBSSxnQkFBZ0IsRUFBRTs7O0FBR25DLGVBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLGVBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0dBQ3JFLE1BQU0sSUFBSSxDQUFDLFdBQVcsSUFBSSxnQkFBZ0IsRUFBRTs7O0FBRzNDLGVBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7R0FDM0QsTUFBTSxJQUFJLFdBQVcsSUFBSSxDQUFDLGdCQUFnQixFQUFFOzs7QUFHM0MsZUFBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDMUMsTUFBTTs7QUFFTCxlQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ2hDOzs7O0FBSUQsdUJBQXFCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRXZELFNBQU8sTUFBTSxDQUFDO0NBQ2Y7Ozs7OztBQU1ELFNBQVMsaUNBQWlDLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtBQUN6RCxPQUFLLElBQUksU0FBUyxHQUFHLEdBQUcsRUFBRSxTQUFTLEtBQUssSUFBSSxFQUFFLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzFGLFFBQUkscUJBQXFCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUN0RCxhQUFPLFNBQVMsQ0FBQztLQUNsQjtHQUNGO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYjs7Ozs7QUFLRCxTQUFTLHFCQUFxQjs7OzhCQUFrQjtRQUFqQixTQUFTO1FBQUUsSUFBSTtBQUl4QyxjQUFVLEdBSVYsVUFBVTs7O0FBUGQsUUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDO0tBQ2I7QUFDRCxRQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xFLFFBQUksVUFBVSxFQUFFO0FBQ2QsYUFBTyxVQUFVLENBQUM7S0FDbkI7QUFDRCxRQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1VBQ3JCLFVBQVU7VUFBRSxJQUFJOzs7R0FDOUM7Q0FBQTs7cUJBR2MsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDcEtuQixvQkFBb0I7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7Ozs7O2VBQXBCLG9CQUFvQjs7Ozs7O1dBS0Esa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDakQsVUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztBQUNyRSxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7Ozs7Ozs7O0FBUUQsVUFBSSxZQUFZLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsVUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFO0FBQ25DLFlBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDL0I7S0FDRjs7O1dBRWMsMkJBQUc7OztBQUNoQixVQUFJLElBQUksR0FBRyxJQUFJLFNBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQztBQUM1RCxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7QUFDRCxRQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUEsU0FBUyxFQUFJO0FBQzVDLGNBQUssd0JBQXdCLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzNFLENBQUMsQ0FBQztLQUNKOzs7U0EvQkcsb0JBQW9COzs7QUFxQzFCLFNBQVMsdUJBQXVCLENBQUMsYUFBYSxFQUFFO0FBQzlDLE1BQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFVBQUEsQ0FBQztXQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7R0FBQSxDQUFDLENBQUM7QUFDL0UsU0FBTyxZQUFZLENBQUM7Q0FDckI7O0FBRUQsU0FBUyxXQUFXOzs7NEJBQVk7UUFBWCxHQUFHO1FBQUUsSUFBSTs7O0FBQzVCLFFBQUksQ0FBQyxHQUFHLEVBQUU7QUFDUixhQUFPLEtBQUssQ0FBQztLQUNkLE1BQU0sSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDO0tBQ2IsTUFBTTtXQUNjLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSTs7O0tBQ3BEO0dBQ0Y7Q0FBQTs7O0FBR0QsU0FBUyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUU7QUFDN0MsTUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsVUFBQSxDQUFDO1dBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO0dBQUEsQ0FBQyxDQUFDO0FBQ2hHLFNBQU8sYUFBYSxDQUFDO0NBQ3RCOztxQkFHYyxvQkFBb0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUMxRDdCLG9CQUFvQjtXQUFwQixvQkFBb0I7MEJBQXBCLG9CQUFvQjs7O2VBQXBCLG9CQUFvQjs7V0FFVCwyQkFBRzs7O0FBQ2hCLFVBQUksSUFBSSxHQUFHLElBQUksU0FBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsZUFBZSxDQUFDO0FBQzVELFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjtBQUNELFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNaLFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUQsVUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ3BDLGNBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsZ0JBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNuQixDQUFDLENBQUM7T0FDSjtLQUNGOzs7U0FmRyxvQkFBb0I7OztxQkFtQlgsb0JBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NDakJMLHFCQUFxQjs7OztnQ0FDdEIsb0JBQW9COzs7O29DQUNoQix3QkFBd0I7Ozs7b0NBQ3hCLHdCQUF3Qjs7OztJQUVuRCxXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7OztlQUFYLFdBQVc7Ozs7V0FHWixhQUFDLElBQUksRUFBRTtBQUNSLGFBQU8sQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLFNBQVMsVUFBSyxJQUFJLENBQUcsQ0FBQztLQUMzQzs7O1NBTEcsV0FBVzs7O0FBU2pCLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTTtrQ0FJL0IsQ0FBQzs7QUFFRixRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRXZDLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7b0NDekJILDBCQUEwQjs7Ozs7O0FBSWpELElBQUksaUJBQWlCLEdBQUcsa0NBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLG9DQUFhLENBQUM7O3FCQUV6RCxpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0YxQixnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7Ozs7Ozs7ZUFBaEIsZ0JBQWdCOzs7Ozs7O1dBTUwsMkJBQUc7O0FBRWhCLFVBQUksSUFBSSxHQUFHLElBQUksU0FBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsZUFBZSxDQUFDO0FBQ3hELFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxFQUFFLENBQUM7T0FDUjtBQUNELFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDN0IsVUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7O0FBRWhDLGdCQUFRLEdBQUcsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDbEQ7QUFDRCxVQUFJLFFBQVEsRUFBRTs7QUFFWixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUNuQyxZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6QjtLQUNGOzs7U0F2QkcsZ0JBQWdCOzs7QUErQnRCLFNBQVMsMkJBQTJCLENBQUMsU0FBUyxFQUFFO0FBQzlDLE1BQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7QUFJbEQsTUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxLQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxZQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakQ7QUFDRCxTQUFPLFFBQVEsQ0FBQztDQUNqQjs7cUJBRWMsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi9zcmMvRWxlbWVudEJhc2UnO1xuXG4vKiBEZWZpbmUgYSBjdXN0b20gZWxlbWVudC4gKi9cbmNsYXNzIEdyZWV0RWxlbWVudCBleHRlbmRzIEVsZW1lbnRCYXNlIHtcblxuICAvKiBEZWZpbmUgYSBcInB1bmN0dWF0aW9uXCIgYXR0cmlidXRlLiAqL1xuICBnZXQgcHVuY3R1YXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJC5wdW5jdHVhdGlvbi50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgcHVuY3R1YXRpb24odmFsdWUpIHtcbiAgICB0aGlzLiQucHVuY3R1YXRpb24udGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgSGVsbG8sXG4gICAgICA8Y29udGVudD48L2NvbnRlbnQ+PHNwYW4gaWQ9XCJwdW5jdHVhdGlvblwiPi48L3NwYW4+XG4gICAgYDtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZ3JlZXQtZWxlbWVudCcsIEdyZWV0RWxlbWVudCk7XG5cbmV4cG9ydCBkZWZhdWx0IEdyZWV0RWxlbWVudDtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSB0aGUgdXNlIG9mIGEgaHlwb3RoZXRpY2FsIFhUYWcgcmVnaXN0cmF0aW9uIGZ1bmN0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIHh0YWcgZnJvbSAnLi94dGFnJztcblxueHRhZy5yZWdpc3RlcigneHRhZy1leGFtcGxlJywge1xuXG4gIGNvbnRlbnQ6IGBcbiAgICA8YnV0dG9uPlxuICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PlxuICAgIDwvYnV0dG9uPlxuICBgLFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICBhbGVydCgnQ2xpY2tlZCcpO1xuICAgIH1cbiAgfVxuXG59KTtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSBzb21lIGh5cG90aGV0aWNhbCBYVGFnLWxpa2Ugc3VnYXIgZm9yIGNvbXBvbmVudCBkZXZlbG9wbWVudC5cbiAqXG4gKi9cblxuY2xhc3MgWFRhZ0V4dGVuc2lvbnMge1xuXG4gIC8qXG4gICAqIERlbW9uc3RyYXRlIGEgdmVyeSBiYXNpYyBYVGFnLXN0eWxlIHN5c3RlbSBmb3IgZGVmaW5pbmcgZXZlbnQgaGFuZGxlcnMgaW5cbiAgICogYSBKYXZhU2NyaXB0IGRpY3Rpb25hcnkgY2FsbGVkIFwiZXZlbnRzXCIgdGhhdCBtYXBzIGV2ZW50IG5hbWVzIHRvIGhhbmRsZXJzLlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5zdXBlcihYVGFnRXh0ZW5zaW9ucykuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICBmb3IgKGxldCBuYW1lIGluIGV2ZW50cykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50c1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogTWFrZSBcImNvbnRlbnRcIiBhbmQgXCJ0ZW1wbGF0ZVwiIHN5bm9ueW1vdXMuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFhUYWdFeHRlbnNpb25zO1xuIiwiLypcbiAqIERlbW9uc3RyYXRpb24gb2YgY3JlYXRpb24gb2YgYSBiYXNlIGNsYXNzIGZvciBhIHBhcnRpY3VsYXIgZnJhbWV3b3JrLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuLi8uLi9zcmMvRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi4vLi4vc3JjL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4uLy4uL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5pbXBvcnQgWFRhZ0V4dGVuc2lvbnMgZnJvbSAnLi9YVGFnRXh0ZW5zaW9ucyc7XG5cbi8qXG4gKiBBIGZyYW1ld29yayBiYXNlIGNsYXNzIGNhbiBzdGFydCB3aXRoIEV4dGVuc2libGVFbGVtZW50LCBhbmQgZXh0ZW5kIGl0IHdpdGhcbiAqIGp1c3QgdGhlIGZlYXR1cmVzIGl0IHdhbnRzLiBIZXJlIGl0IHVzZXMgdHdvIHN0YW5kYXJkIGV4dGVuc2lvbiBjbGFzc2VzXG4gKiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcgYW5kIGF0dHJpYnV0ZSBtYXJzaGFsbGluZywgYW5kIGFkZHMgYSBjdXN0b20gZXh0ZW5zaW9uXG4gKiBmb3Igc29tZSBYVGFnLXN0eWxlIGZlYXR1cmVzLiBCeSBkZXNpZ24sIHRoaXMgb21pdHMgYXV0b21hdGljIG5vZGUgZmluZGluZyxcbiAqIGp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgcG9zc2libGUgdG8gbGVhdmUgb3V0IGV4dGVuc2lvbnMgaWYgdGhhdCdzIGRlc2lyZWQuXG4gKi9cbmV4cG9ydCBsZXQgRWxlbWVudCA9IEV4dGVuc2libGVFbGVtZW50LmV4dGVuZChcbiAgVGVtcGxhdGVTdGFtcGluZyxcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmcsXG4gIFhUYWdFeHRlbnNpb25zXG4pO1xuXG4vKlxuICogVGhlIGZyYW1ld29yayBjYW4gc2ltcGx5IGxldCBwZW9wbGUgZXh0ZW5kIGl0cyBiYXNlIGNsYXNzLCBvciBwcm92aWRlIGFcbiAqIGN1c3RvbSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgdGhhdCBiYXNlIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIodGFnLCBwcm90b3R5cGUpIHtcbiAgbGV0IFN1YmNsYXNzID0gRWxlbWVudC5leHRlbmQocHJvdG90eXBlKTtcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZywgU3ViY2xhc3MpO1xuICByZXR1cm4gU3ViY2xhc3M7XG59XG4iLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5cbi8qXG4gKiBBIG1hcHBpbmcgb2YgY2xhc3MgcHJvdG90eXBlcyB0byB0aGUgY29ycmVzcG9uZGluZyBleHRlbnNpb24gdGhhdCB3YXMgdXNlZFxuICogdG8gaW1wbGVtZW50IHRoZSBleHRlbnNpb24uIFRoaXMgaXMgdXNlZCBieSB0aGUgc3VwZXIoZXh0ZW5zaW9uLCBtZXRob2QpXG4gKiBmYWNpbGl0eSB0aGF0IGxldHMgZXh0ZW5zaW9uIGludm9rZSBzdXBlcmNsYXNzIG1ldGhvZHMuXG4gKlxuICogTk9URTogVGhpcyBtYXAgdXNlcyBjbGFzcyBwcm90b3R5cGVzLCBub3QgY2xhc3NlcyB0aGVtc2VsdmVzLCBhcyB0aGUga2V5cy5cbiAqIFRoaXMgaXMgZG9uZSB0byBzdXBwb3J0IHdlYiBjb21wb25lbnRzIGFzIGV4dGVuc2libGUgSFRNTEVsZW1lbnQgY2xhc3Nlcy5cbiAqIFRoZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjdXN0b20tZWxlbWVudCcpIGZ1bmN0aW9uIGNhbiByZXR1cm4gYW4gZWxlbWVudFxuICogd2hvc2UgY29uc3RydWN0b3IgaXMgKm5vdCogdGhlIGZ1bmN0aW9uIHBhc3NlZCB0byBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqIFRoYXQgaXMsIGVsZW1lbnQgY2xhc3NlcyBoYXZlIGEgc3BlY2lhbCBtdW5nZWQgY29uc3RydWN0b3IsIGFuZCB0aGF0XG4gKiBjb25zdHJ1Y3RvciBjYW4ndCBnZXQgaW5jbHVkZWQgaW4gb3VyIG1hcC4gV2UgdXNlIHByb3RvdHlwZXMgaW5zdGVhZCwgd2hpY2hcbiAqIGFyZSBsZWZ0IGFsb25lIGJ5IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICovXG5sZXQgZXh0ZW5zaW9uRm9yUHJvdG90eXBlID0gbmV3IE1hcCgpO1xuXG5cbmNsYXNzIEV4dGVuc2libGUge1xuXG4gIC8qXG4gICAqIFJldHVybiB0aGUgcHJvdG90eXBlIGluIHRoZSBwcm90b3R5cGUgY2hhaW4gdGhhdCdzIGFib3ZlIHRoZSBvbmUgdGhhdFxuICAgKiBpbXBsZW1lbnRlZCB0aGUgZ2l2ZW4gZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBUaGlzIGlzIHVzZWQgaW4gRVM1LWNvbXBhdGlibGUgZXh0ZW5zaW9ucyB0byBpbnZva2UgYmFzZSBwcm9wZXJ0eS9tZXRob2RcbiAgICogaW1wbGVtZW50YXRpb25zLCByZWdhcmRsZXNzIG9mIHdoZXJlIHRoZSBleHRlbnNpb24gZW5kZWQgdXAgaW4gdGhlXG4gICAqIHByb3RvdHlwZSBjaGFpbi4gVGhpcyBjYW4gYmUgdXNlZCBieSBFUzUgZXh0ZW5zaW9ucyBvciB0cmFuc3BpbGVkXG4gICAqIEVTNi10by1FUzUgZXh0ZW5zaW9ucy4gUHVyZSBFUzYgZXh0ZW5zaW9ucyBjYW4gbWFrZSBzaW1wbGUgdXNlIG9mIHRoZVxuICAgKiBcInN1cGVyXCIga2V5d29yZCBpbnN0ZWFkLCBidXQgdGhhdCB3b24ndCB3b3JrIGluIHRyYW5zcGlsZWQgRVM2LXRvLUVTNVxuICAgKiAoZS5nLiwgdmlhIEJhYmVsKS5cbiAgICovXG4gIHN1cGVyKGV4dGVuc2lvbikge1xuICAgIGxldCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24odGhpcywgZXh0ZW5zaW9uKTtcbiAgICByZXR1cm4gcHJvdG90eXBlICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEsIEV4dGVuc2lvbjIsIEV4dGVuc2lvbjMpXG4gICAqXG4gICAqIHdpbGwgcmV0dXJuIGEgbmV3IGNsYXNzIG9mIE15QmFzZUNsYXNzIHRoYXQgaW1wbGVtZW50cyBhbGwgdGhlIG1ldGhvZHMgaW5cbiAgICogdGhlIHRocmVlIGV4dGVuc2lvbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEpLmV4dGVuZChFeHRlbnNpb24yKS5leHRlbmQoRXh0ZW5zaW9uMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IG9mXG4gICAgLy8gYmVjb21lcyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJuc1xuICAgIC8vIG91dCB0aGF0IHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlXG4gICAgLy8gY3VycmVudCAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kLCB0aGlzKTtcbiAgfVxuXG59XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIG1lbWJlcnMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU1lbWJlcnMobWVtYmVycywgdGFyZ2V0LCBpZ25vcmVNZW1iZXJzKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1lbWJlcnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKCFpZ25vcmVNZW1iZXJzIHx8IGlnbm9yZU1lbWJlcnMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBleHRlbnNpb24pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBleHRlbnNpb24gYXJlIGNsYXNzZXMgb3IgcGxhaW4gb2JqZWN0cy5cbiAgbGV0IGJhc2VJc0NsYXNzID0gKHR5cGVvZiBiYXNlID09PSAnZnVuY3Rpb24nKTtcbiAgbGV0IGV4dGVuc2lvbklzQ2xhc3MgPSAodHlwZW9mIGV4dGVuc2lvbiA9PT0gJ2Z1bmN0aW9uJyk7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqZXh0ZW5zaW9uKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZS5cbiAgbGV0IGV4dGVuc2lvbkJhc2UgPSBleHRlbnNpb25Jc0NsYXNzID9cbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZW5zaW9uLnByb3RvdHlwZSkuY29uc3RydWN0b3IgOlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlbnNpb24pO1xuICBpZiAoZXh0ZW5zaW9uQmFzZSAmJlxuICAgICAgZXh0ZW5zaW9uQmFzZSAhPT0gRnVuY3Rpb24gJiZcbiAgICAgIGV4dGVuc2lvbkJhc2UgIT09IE9iamVjdCkge1xuICAgIC8vIFRoZSBleHRlbnNpb24gaXRzZWxmIGRlcml2ZXMgZnJvbSBhbm90aGVyIGNsYXNzL29iamVjdC5cbiAgICAvLyBSZWN1cnNlLCBhbmQgZXh0ZW5kIHdpdGggdGhlIGV4dGVuc2lvbidzIGJhc2UgZmlyc3QuXG4gICAgYmFzZSA9IGV4dGVuZChiYXNlLCBleHRlbnNpb25CYXNlKTtcbiAgfVxuXG4gIGxldCByZXN1bHQgPSBiYXNlSXNDbGFzcyA/XG4gICAgLy8gRXh0ZW5kIGEgcmVhbCBjbGFzcyBieSBjcmVhdGluZyBhIHN1YmNsYXNzLlxuICAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fSA6XG4gICAgLy8gRXh0ZW5kIGEgcGxhaW4gb2JqZWN0IGJ5IGNyZWF0aW5nIGFub3RoZXIgcGxhaW4gb2JqZWN0LlxuICAgIE9iamVjdC5jcmVhdGUoYmFzZSk7XG5cbiAgaWYgKGJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBjbGFzcyB3aXRoIGEgY2xhc3MuXG4gICAgLy8gQ29weSBib3RoIHN0YXRpYyBhbmQgaW5zdGFuY2UgbWV0aG9kcy5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24sIHJlc3VsdCwgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pKTtcbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCByZXN1bHQucHJvdG90eXBlLCBbJ2NvbnN0cnVjdG9yJ10pO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IHByb3RvdHlwZSBtZXRob2RzIGRpcmVjdGx5IHRvIHJlc3VsdC5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCByZXN1bHQsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIWV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3QuXG4gICAgLy8gQ29weSBleHRlbnNpb24gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24sIHJlc3VsdC5wcm90b3R5cGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgcmVzdWx0KTtcbiAgfVxuXG4gIC8vIFJlbWVtYmVyIHdoaWNoIGV4dGVuc2lvbiB3YXMgdXNlZCB0byBjcmVhdGUgdGhpcyBuZXcgY2xhc3Mgc28gdGhhdCBleHRlbmRlZFxuICAvLyBtZXRob2RzIGNhbiBjYWxsIGltcGxlbWVudGF0aW9ucyBpbiB0aGUgc3VwZXIgKGJhc2UpIGNsYXNzLlxuICBleHRlbnNpb25Gb3JQcm90b3R5cGUuc2V0KHJlc3VsdC5wcm90b3R5cGUsIGV4dGVuc2lvbik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3Mvb2JqZWN0IHRoYXQgaW1wbGVtZW50ZWQgdGhlIGluZGljYXRlZFxuICogZXh0ZW5zaW9uIGZvciB0aGUgZ2l2ZW4gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlO1xuIiwiLypcbiAqIE1hcnNoYWxsIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyAoYW5kIGV2ZW50dWFsbHkgdmljZSB2ZXJzYSkuXG4gKi9cblxuY2xhc3MgQXR0cmlidXRlTWFyc2hhbGxpbmcge1xuXG4gIC8qXG4gICAqIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqL1xuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nKS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nKS5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIG0gPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuZnVuY3Rpb24gaGFzUHJvcGVydHkob2JqLCBuYW1lKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBoYXNQcm9wZXJ0eShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSwgbmFtZSk7XG4gIH1cbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgZyA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQXR0cmlidXRlTWFyc2hhbGxpbmc7XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLnN1cGVyKEF1dG9tYXRpY05vZGVGaW5kaW5nKS5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvbWF0aWNOb2RlRmluZGluZztcbiIsIi8qXG4gKiBHZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLlxuICpcbiAqIFRoaXMgRWxlbWVudEJhc2UgY2xhc3MgaW1wbGVtZW50cyB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsXG4gKiBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuL0V4dGVuc2libGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbkVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuZXh0ZW5kKFxuICBUZW1wbGF0ZVN0YW1waW5nLFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50XG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGUgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IEV4dGVuc2libGVFbGVtZW50ID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICovXG5cblxuY2xhc3MgVGVtcGxhdGVTdGFtcGluZyB7XG5cbiAgLypcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICBsZXQgYmFzZSA9IHRoaXMuc3VwZXIoVGVtcGxhdGVTdGFtcGluZykuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlKCk7XG4gICAgfVxuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLypcbiAqIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZVN0YW1waW5nO1xuIl19
