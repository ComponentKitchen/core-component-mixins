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

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var XTagExtensions = (function () {
  function XTagExtensions() {
    _classCallCheck(this, XTagExtensions);
  }

  _createClass(XTagExtensions, [{
    key: 'createdCallback',

    /*
     * Demonstrate a very basic XTag-style system for defining event handlers in
     * a JavaScript dictionary called "events" that maps event names to handlers.
     */
    value: function createdCallback() {
      this['super'](XTagExtensions, 'createdCallback');
      var events = this.events || [];
      for (var _name in events) {
        this.addEventListener(_name, events[_name]);
      }
    }

    /*
     * Make "content" and "template" synonymous.
     */
  }, {
    key: 'template',
    get: function get() {
      return this.content;
    },
    set: function set(value) {
      this.content = value;
    }
  }]);

  return XTagExtensions;
})();

exports['default'] = XTagExtensions;
module.exports = exports['default'];

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

  var result = undefined;
  if (typeof baseClass === 'function') {
    (function () {
      // Extending a real class.

      var subclass = (function (_baseClass) {
        _inherits(subclass, _baseClass);

        function subclass() {
          _classCallCheck(this, subclass);

          _get(Object.getPrototypeOf(subclass.prototype), 'constructor', this).apply(this, arguments);
        }

        return subclass;
      })(baseClass);

      result = subclass;
    })();
  } else {
    // Extending a plain object.
    result = {};
    Object.setPrototypeOf(result, baseClass);
  }

  var baseIsClass = typeof baseClass === 'function';
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

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(result.prototype, extension);

  return result;
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

var _extensibleExtensibleClass = require('../extensible/ExtensibleClass');

var _extensibleExtensibleClass2 = _interopRequireDefault(_extensibleExtensibleClass);

// We use ExtensibleClass to add its own members to a HTMLElement subclass.
// The result is an HTMLElement that with .extend() and super() support.
var ExtensibleElement = _extensibleExtensibleClass2['default'].extend.call(HTMLElement, _extensibleExtensibleClass2['default']);

exports['default'] = ExtensibleElement;
module.exports = exports['default'];

},{"../extensible/ExtensibleClass":5}],10:[function(require,module,exports){
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

},{}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL2RlbW9zL3h0YWcvWFRhZ0V4YW1wbGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MveHRhZy9YVGFnRXh0ZW5zaW9ucy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9kZW1vcy94dGFnL3h0YWcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlQ2xhc3MuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdXRvbWF0aWNOb2RlRmluZGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvRWxlbWVudEJhc2UuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0V4dGVuc2libGVFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9UZW1wbGF0ZVN0YW1waW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs4QkNBd0Isb0JBQW9COzs7Ozs7SUFHdEMsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7ZUFBWixZQUFZOzs7O1NBR0QsZUFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztLQUN2QztT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QUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3pCO0tBQ0Y7OztTQXBCRyxnQkFBZ0I7OztBQTRCdEIsU0FBUywyQkFBMkIsQ0FBQyxTQUFTLEVBQUU7QUFDOUMsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztBQUlsRCxNQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLEtBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFlBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNqRDtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCOztxQkFFYyxnQkFBZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gJy4uL3NyYy9FbGVtZW50QmFzZSc7XG5cbi8qIERlZmluZSBhIGN1c3RvbSBlbGVtZW50LiAqL1xuY2xhc3MgR3JlZXRFbGVtZW50IGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuXG4gIC8qIERlZmluZSBhIFwicHVuY3R1YXRpb25cIiBhdHRyaWJ1dGUuICovXG4gIGdldCBwdW5jdHVhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kLnB1bmN0dWF0aW9uLnRleHRDb250ZW50O1xuICB9XG4gIHNldCBwdW5jdHVhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuJC5wdW5jdHVhdGlvbi50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICBIZWxsbyxcbiAgICAgIDxjb250ZW50PjwvY29udGVudD48c3BhbiBpZD1cInB1bmN0dWF0aW9uXCI+Ljwvc3Bhbj5cbiAgICBgO1xuICB9XG5cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdncmVldC1lbGVtZW50JywgR3JlZXRFbGVtZW50KTtcblxuZXhwb3J0IGRlZmF1bHQgR3JlZXRFbGVtZW50O1xuIiwiLypcbiAqIERlbW9uc3RyYXRlIHRoZSB1c2Ugb2YgYSBoeXBvdGhldGljYWwgWFRhZyByZWdpc3RyYXRpb24gZnVuY3Rpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgeHRhZyBmcm9tICcuL3h0YWcnO1xuXG54dGFnLnJlZ2lzdGVyKCd4dGFnLWV4YW1wbGUnLCB7XG5cbiAgY29udGVudDogYFxuICAgIDxidXR0b24+XG4gICAgICA8Y29udGVudD48L2NvbnRlbnQ+XG4gICAgPC9idXR0b24+XG4gIGAsXG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6ICgpID0+IHtcbiAgICAgIGFsZXJ0KCdDbGlja2VkJyk7XG4gICAgfVxuICB9XG5cbn0pO1xuIiwiLypcbiAqIERlbW9uc3RyYXRlIHNvbWUgaHlwb3RoZXRpY2FsIFhUYWctbGlrZSBzdWdhciBmb3IgY29tcG9uZW50IGRldmVsb3BtZW50LlxuICpcbiAqL1xuXG5jbGFzcyBYVGFnRXh0ZW5zaW9ucyB7XG5cbiAgLypcbiAgICogRGVtb25zdHJhdGUgYSB2ZXJ5IGJhc2ljIFhUYWctc3R5bGUgc3lzdGVtIGZvciBkZWZpbmluZyBldmVudCBoYW5kbGVycyBpblxuICAgKiBhIEphdmFTY3JpcHQgZGljdGlvbmFyeSBjYWxsZWQgXCJldmVudHNcIiB0aGF0IG1hcHMgZXZlbnQgbmFtZXMgdG8gaGFuZGxlcnMuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihYVGFnRXh0ZW5zaW9ucywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICBmb3IgKGxldCBuYW1lIGluIGV2ZW50cykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50c1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogTWFrZSBcImNvbnRlbnRcIiBhbmQgXCJ0ZW1wbGF0ZVwiIHN5bm9ueW1vdXMuXG4gICAqL1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFhUYWdFeHRlbnNpb25zO1xuIiwiLypcbiAqIERlbW9uc3RyYXRpb24gb2YgY3JlYXRpb24gb2YgYSBiYXNlIGNsYXNzIGZvciBhIHBhcnRpY3VsYXIgZnJhbWV3b3JrLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuLi8uLi9zcmMvRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi4vLi4vc3JjL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4uLy4uL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5pbXBvcnQgWFRhZ0V4dGVuc2lvbnMgZnJvbSAnLi9YVGFnRXh0ZW5zaW9ucyc7XG5cbi8qXG4gKiBBIGZyYW1ld29yayBiYXNlIGNsYXNzIGNhbiBzdGFydCB3aXRoIEV4dGVuc2libGVFbGVtZW50LCBhbmQgZXh0ZW5kIGl0IHdpdGhcbiAqIGp1c3QgdGhlIGZlYXR1cmVzIGl0IHdhbnRzLiBIZXJlIGl0IHVzZXMgdHdvIHN0YW5kYXJkIGV4dGVuc2lvbiBjbGFzc2VzXG4gKiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcgYW5kIGF0dHJpYnV0ZSBtYXJzaGFsbGluZywgYW5kIGFkZHMgYSBjdXN0b20gZXh0ZW5zaW9uXG4gKiBmb3Igc29tZSBYVGFnLXN0eWxlIGZlYXR1cmVzLiBCeSBkZXNpZ24sIHRoaXMgb21pdHMgYXV0b21hdGljIG5vZGUgZmluZGluZyxcbiAqIGp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgcG9zc2libGUgdG8gbGVhdmUgb3V0IGV4dGVuc2lvbnMgaWYgdGhhdCdzIGRlc2lyZWQuXG4gKi9cbmV4cG9ydCBsZXQgRWxlbWVudCA9IEV4dGVuc2libGVFbGVtZW50LmV4dGVuZChcbiAgVGVtcGxhdGVTdGFtcGluZyxcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmcsXG4gIFhUYWdFeHRlbnNpb25zXG4pO1xuXG4vKlxuICogVGhlIGZyYW1ld29yayBjYW4gc2ltcGx5IGxldCBwZW9wbGUgZXh0ZW5kIGl0cyBiYXNlIGNsYXNzLCBvciBwcm92aWRlIGFcbiAqIGN1c3RvbSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgdGhhdCBiYXNlIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIodGFnLCBwcm90b3R5cGUpIHtcbiAgbGV0IFN1YmNsYXNzID0gRWxlbWVudC5leHRlbmQocHJvdG90eXBlKTtcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZywgU3ViY2xhc3MpO1xuICByZXR1cm4gU3ViY2xhc3M7XG59XG4iLCIvKlxuICogQSBjbGFzcyB3aGljaCBjYW4gYmUgZXh0ZW5kZWQgd2l0aCBvdGhlciBjbGFzc2VzLlxuICovXG5cblxuLypcbiAqIEEgbWFwcGluZyBvZiBjbGFzcyBwcm90b3R5cGVzIHRvIHRoZSBjb3JyZXNwb25kaW5nIGV4dGVuc2lvbiB0aGF0IHdhcyB1c2VkXG4gKiB0byBpbXBsZW1lbnQgdGhlIGV4dGVuc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBzdXBlcihleHRlbnNpb24sIG1ldGhvZClcbiAqIGZhY2lsaXR5IHRoYXQgbGV0cyBleHRlbnNpb24gaW52b2tlIHN1cGVyY2xhc3MgbWV0aG9kcy5cbiAqXG4gKiBOT1RFOiBUaGlzIG1hcCB1c2VzIGNsYXNzIHByb3RvdHlwZXMsIG5vdCBjbGFzc2VzIHRoZW1zZWx2ZXMsIGFzIHRoZSBrZXlzLlxuICogVGhpcyBpcyBkb25lIHRvIHN1cHBvcnQgd2ViIGNvbXBvbmVudHMgYXMgZXh0ZW5zaWJsZSBIVE1MRWxlbWVudCBjbGFzc2VzLlxuICogVGhlIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2N1c3RvbS1lbGVtZW50JykgZnVuY3Rpb24gY2FuIHJldHVybiBhbiBlbGVtZW50XG4gKiB3aG9zZSBjb25zdHJ1Y3RvciBpcyAqbm90KiB0aGUgZnVuY3Rpb24gcGFzc2VkIHRvIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICogVGhhdCBpcywgZWxlbWVudCBjbGFzc2VzIGhhdmUgYSBzcGVjaWFsIG11bmdlZCBjb25zdHJ1Y3RvciwgYW5kIHRoYXRcbiAqIGNvbnN0cnVjdG9yIGNhbid0IGdldCBpbmNsdWRlZCBpbiBvdXIgbWFwLiBXZSB1c2UgcHJvdG90eXBlcyBpbnN0ZWFkLCB3aGljaFxuICogYXJlIGxlZnQgYWxvbmcgYnkgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCkuXG4gKi9cbmxldCBleHRlbnNpb25Gb3JQcm90b3R5cGUgPSBuZXcgTWFwKCk7XG5cblxuY2xhc3MgRXh0ZW5zaWJsZUNsYXNzIHtcblxuICAvKlxuICAgKiBDYWxsIGEgc3VwZXJjbGFzcyBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZCBpZiBpdCBleGlzdHMuXG4gICAqXG4gICAqIFRoaXMgd2Fsa3MgdXAgdGhlIG9iamVjdCdzIGNsYXNzIGhpZXJhcmNoeSBpbiBzZWFyY2ggb2YgdGhlIGNsYXNzIHRoYXRcbiAgICogaW1wbGVtZW50ZWQgdGhlIGdpdmVuIGV4dGVuc2lvbi4gVGhlbiBpdCBnb2VzIHVwIG9uZSBsZXZlbCwgYW5kIGxvb2tzIHVwXG4gICAqIHRoZSBoaWVyYXJjaHkgZnJvbSB0aGF0IHBvaW50IHRvIHNlZSBpZiBhbnkgc3VwZXJjbGFzcyBpbXBsZW1lbnRzIHRoZVxuICAgKiBuYW1lZCBtZXRob2QuIElmIGEgc3VwZXJjbGFzcyBtZXRob2QgaW1wbGVtZW50YXRpb24gaXMgZm91bmQsIGl0IGlzIGludm9rZWRcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLCBhbmQgdGhlIHJlc3VsdCBvZiB0aGF0IGlzIHJldHVybmVkLlxuICAgKi9cbiAgc3VwZXIoZXh0ZW5zaW9uLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IHByb3RvdHlwZSA9IGdldFByb3RvdHlwZUltcGxlbWVudGluZ0V4dGVuc2lvbih0aGlzLCBleHRlbnNpb24pO1xuICAgIGlmIChwcm90b3R5cGUpIHtcbiAgICAgIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgICBpZiAoc3VwZXJQcm90bykge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmV4dGVuZChFeHRlbnNpb24xLCBFeHRlbnNpb24yLCBFeHRlbnNpb24zKVxuICAgKlxuICAgKiB3aWxsIHJldHVybiBhIG5ldyBjbGFzcyBvZiBNeUJhc2VDbGFzcyB0aGF0IGltcGxlbWVudHMgYWxsIHRoZSBtZXRob2RzIGluXG4gICAqIHRoZSB0aHJlZSBleHRlbnNpb25zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmV4dGVuZChFeHRlbnNpb24xKS5leHRlbmQoRXh0ZW5zaW9uMikuZXh0ZW5kKEV4dGVuc2lvbjMpXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBuZXcgc3ViY2xhc3MgZm9yIGVhY2ggZXh0ZW5zaW9uIGluIHR1cm4uIFRoZSByZXN1bHQgb2ZcbiAgICAvLyBiZWNvbWVzIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IGV4dGVuc2lvbnMuIEl0IHR1cm5zXG4gICAgLy8gb3V0IHRoYXQgd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGVcbiAgICAvLyBjdXJyZW50IChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBleHRlbnNpb25zLnJlZHVjZShleHRlbmRDbGFzcywgdGhpcyk7XG4gIH1cblxufVxuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBtZW1iZXJzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCwgaWdub3JlTWVtYmVycykge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmICghaWdub3JlTWVtYmVycyB8fCBpZ25vcmVNZW1iZXJzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWVtYmVycywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzIG9mIHRoZSBnaXZlbiBiYXNlY2xhc3MuIFRoZSBuZXcgY2xhc3MnIHByb3RvdHlwZSB3aWxsXG4gKiBpbmNsdWRlIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICovXG5mdW5jdGlvbiBleHRlbmRDbGFzcyhiYXNlQ2xhc3MsIGV4dGVuc2lvbikge1xuXG4gIGxldCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgYmFzZUNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcmVhbCBjbGFzcy5cbiAgICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2VDbGFzcyB7fVxuICAgIHJlc3VsdCA9IHN1YmNsYXNzO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdC5cbiAgICByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LCBiYXNlQ2xhc3MpO1xuICB9XG5cbiAgbGV0IGJhc2VJc0NsYXNzID0gKHR5cGVvZiBiYXNlQ2xhc3MgPT09ICdmdW5jdGlvbicpO1xuICBsZXQgZXh0ZW5zaW9uSXNDbGFzcyA9ICh0eXBlb2YgZXh0ZW5zaW9uID09PSAnZnVuY3Rpb24nKTtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIGV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBjbGFzcyB3aXRoIGEgY2xhc3MuXG4gICAgLy8gQ29weSBib3RoIHN0YXRpYyBhbmQgaW5zdGFuY2UgbWV0aG9kcy5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24sIHJlc3VsdCwgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pKTtcbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCByZXN1bHQucHJvdG90eXBlLCBbJ2NvbnN0cnVjdG9yJ10pO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IHByb3RvdHlwZSBtZXRob2RzIGRpcmVjdGx5IHRvIHJlc3VsdC5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCByZXN1bHQsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIWV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3QuXG4gICAgLy8gQ29weSBleHRlbnNpb24gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24sIHJlc3VsdC5wcm90b3R5cGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIGNvcHlNZW1iZXJzKGV4dGVuc2lvbiwgcmVzdWx0KTtcbiAgfVxuXG4gIC8vIFJlbWVtYmVyIHdoaWNoIGV4dGVuc2lvbiB3YXMgdXNlZCB0byBjcmVhdGUgdGhpcyBuZXcgY2xhc3Mgc28gdGhhdCBleHRlbmRlZFxuICAvLyBtZXRob2RzIGNhbiBjYWxsIGltcGxlbWVudGF0aW9ucyBpbiB0aGUgc3VwZXIgKGJhc2UpIGNsYXNzLlxuICBleHRlbnNpb25Gb3JQcm90b3R5cGUuc2V0KHJlc3VsdC5wcm90b3R5cGUsIGV4dGVuc2lvbik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvblxuICogZm9yIHRoZSBnaXZlbiBvYmplY3QuXG4gKlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgY2xhc3MgaGllcmFyY2h5LlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlQ2xhc3M7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5jbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyk7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihBdHRyaWJ1dGVNYXJzaGFsbGluZywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZSA9PiB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuXG4vLyBDb252ZXJ0IGNhbWVsIGNhc2UgZm9vQmFyIG5hbWUgdG8gaHlwaGVuYXRlZCBmb28tYmFyLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBtID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIGcgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nO1xuIiwiLypcbiAqIFBvbHltZXItc3R5bGUgYXV0b21hdGljIG5vZGUgZmluZGluZy5cbiAqIFNlZSBodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZy5cbiAqL1xuXG5jbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQXV0b21hdGljTm9kZUZpbmRpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9tYXRpY05vZGVGaW5kaW5nO1xuIiwiLypcbiAqIEdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMuXG4gKlxuICogVGhpcyBFbGVtZW50QmFzZSBjbGFzcyBpbXBsZW1lbnRzIHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCxcbiAqIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVFbGVtZW50IGZyb20gJy4vRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsXG4gIEF1dG9tYXRpY05vZGVGaW5kaW5nLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIG1hcnNoYWxsZWQgcHJvcGVydGllcyBjYW4gdXNlIGl0XG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nXG4pO1xuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iLCIvKlxuICogQW4gZXh0ZW5zaWJsZSBIVE1MIGVsZW1lbnRcbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUNsYXNzIGZyb20gJy4uL2V4dGVuc2libGUvRXh0ZW5zaWJsZUNsYXNzJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGVDbGFzcyB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHRoYXQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBFeHRlbnNpYmxlRWxlbWVudCA9IEV4dGVuc2libGVDbGFzcy5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZUNsYXNzKTtcblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogRWxlbWVudCBleHRlbnNpb24gZm9yIHRlbXBsYXRlIHN0YW1waW5nLiBJZiBhIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGVcbiAqIHByb3BlcnR5IChhcyBhIHN0cmluZyBvciByZWZlcmVuY2luZyBhIEhUTUwgdGVtcGxhdGUpLCB3aGVuIHRoZSBjb21wb25lbnRcbiAqIGNsYXNzIGlzIGluc3RhbnRpYXRlZCwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlIGluc3RhbmNlLCBhbmRcbiAqIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGUgc2hhZG93IHJvb3QuXG4gKi9cblxuXG5jbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgLy8gdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIHRoaXMuc3VwZXIoVGVtcGxhdGVTdGFtcGluZywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLypcbiAqIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZVN0YW1waW5nO1xuIl19
