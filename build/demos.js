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

},{"../src/ElementBase":9}],2:[function(require,module,exports){
/*
 * Demonstration of creation of a base class for a particular framework.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extensibleExtensibleElement = require('../extensible/ExtensibleElement');

var _extensibleExtensibleElement2 = _interopRequireDefault(_extensibleExtensibleElement);

var _srcTemplateStamping = require('../src/TemplateStamping');

var _srcTemplateStamping2 = _interopRequireDefault(_srcTemplateStamping);

var _srcAttributeMarshalling = require('../src/AttributeMarshalling');

var _srcAttributeMarshalling2 = _interopRequireDefault(_srcAttributeMarshalling);

var _XTagEvents = require('./XTagEvents');

var _XTagEvents2 = _interopRequireDefault(_XTagEvents);

/*
 * A framework base class can start with ExtensibleElement, and extend it with
 * just the features it wants. Here it uses two standard extension classes
 * for template stamping and attribute marshalling, and adds an XTag-specific
 * extension for its handling of the "events" key.
 */
var XTagElement = _extensibleExtensibleElement2['default'].extend(_srcTemplateStamping2['default'], _srcAttributeMarshalling2['default'], _XTagEvents2['default']);

exports['default'] = XTagElement;
module.exports = exports['default'];

},{"../extensible/ExtensibleElement":6,"../src/AttributeMarshalling":7,"../src/TemplateStamping":10,"./XTagEvents":3}],3:[function(require,module,exports){
/*
 * Demonstrate a very basic XTag-style system for defining event handlers in
 * a JavaScript dictionary called "events" that maps event names to handlers.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var XTagEvents = (function () {
  function XTagEvents() {
    _classCallCheck(this, XTagEvents);
  }

  _createClass(XTagEvents, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this['super'](XTagEvents, 'createdCallback');
      var events = this.events || [];
      for (var _name in events) {
        this.addEventListener(_name, events[_name]);
      }
    }
  }]);

  return XTagEvents;
})();

exports['default'] = XTagEvents;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/*
 * Demonstrate the use of a hypothetical XTag base class.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _XTagElement = require('./XTagElement');

var _XTagElement2 = _interopRequireDefault(_XTagElement);

var XTagExample = _XTagElement2['default'].extend({

  events: {
    click: function click() {
      alert('Clicked');
    }
  },

  template: '\n    <button>\n      <content></content>\n    </button>\n  '

});

document.registerElement('xtag-example', XTagExample);

exports['default'] = XTagExample;
module.exports = exports['default'];

},{"./XTagElement":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./ExtensibleClass":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../extensible/ExtensibleElement":6,"./AttributeMarshalling":7,"./AutomaticNodeFinding":8,"./TemplateStamping":10}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL2RlbW9zL1hUYWdFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL2RlbW9zL1hUYWdFdmVudHMuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MvWFRhZ0V4YW1wbGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlQ2xhc3MuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZXh0ZW5zaWJsZS9FeHRlbnNpYmxlRWxlbWVudC5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0F1dG9tYXRpY05vZGVGaW5kaW5nLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FbGVtZW50QmFzZS5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDQXdCLG9CQUFvQjs7Ozs7O0lBR3RDLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7OztTQUdELGVBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7S0FDdkM7U0FDYyxh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QUM7QUFDN0IsVUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7O0FBRWhDLGdCQUFRLEdBQUcsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDbEQ7QUFDRCxVQUFJLFFBQVEsRUFBRTs7QUFFWixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUNuQyxZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6QjtLQUNGOzs7U0FwQkcsZ0JBQWdCOzs7QUE0QnRCLFNBQVMsMkJBQTJCLENBQUMsU0FBUyxFQUFFO0FBQzlDLE1BQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7QUFJbEQsTUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxLQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxZQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakQ7QUFDRCxTQUFPLFFBQVEsQ0FBQztDQUNqQjs7cUJBRWMsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBFbGVtZW50QmFzZSBmcm9tICcuLi9zcmMvRWxlbWVudEJhc2UnO1xuXG4vKiBEZWZpbmUgYSBjdXN0b20gZWxlbWVudC4gKi9cbmNsYXNzIEdyZWV0RWxlbWVudCBleHRlbmRzIEVsZW1lbnRCYXNlIHtcblxuICAvKiBEZWZpbmUgYSBcInB1bmN0dWF0aW9uXCIgYXR0cmlidXRlLiAqL1xuICBnZXQgcHVuY3R1YXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJC5wdW5jdHVhdGlvbi50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgcHVuY3R1YXRpb24odmFsdWUpIHtcbiAgICB0aGlzLiQucHVuY3R1YXRpb24udGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgSGVsbG8sXG4gICAgICA8Y29udGVudD48L2NvbnRlbnQ+PHNwYW4gaWQ9XCJwdW5jdHVhdGlvblwiPi48L3NwYW4+XG4gICAgYDtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZ3JlZXQtZWxlbWVudCcsIEdyZWV0RWxlbWVudCk7XG5cbmV4cG9ydCBkZWZhdWx0IEdyZWV0RWxlbWVudDtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0aW9uIG9mIGNyZWF0aW9uIG9mIGEgYmFzZSBjbGFzcyBmb3IgYSBwYXJ0aWN1bGFyIGZyYW1ld29yay5cbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUVsZW1lbnQgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuLi9zcmMvVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi4vc3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcbmltcG9ydCBYVGFnRXZlbnRzIGZyb20gJy4vWFRhZ0V2ZW50cyc7XG5cbi8qXG4gKiBBIGZyYW1ld29yayBiYXNlIGNsYXNzIGNhbiBzdGFydCB3aXRoIEV4dGVuc2libGVFbGVtZW50LCBhbmQgZXh0ZW5kIGl0IHdpdGhcbiAqIGp1c3QgdGhlIGZlYXR1cmVzIGl0IHdhbnRzLiBIZXJlIGl0IHVzZXMgdHdvIHN0YW5kYXJkIGV4dGVuc2lvbiBjbGFzc2VzXG4gKiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcgYW5kIGF0dHJpYnV0ZSBtYXJzaGFsbGluZywgYW5kIGFkZHMgYW4gWFRhZy1zcGVjaWZpY1xuICogZXh0ZW5zaW9uIGZvciBpdHMgaGFuZGxpbmcgb2YgdGhlIFwiZXZlbnRzXCIga2V5LlxuICovXG5sZXQgWFRhZ0VsZW1lbnQgPSBFeHRlbnNpYmxlRWxlbWVudC5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsXG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nLFxuICBYVGFnRXZlbnRzXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBYVGFnRWxlbWVudDtcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSBhIHZlcnkgYmFzaWMgWFRhZy1zdHlsZSBzeXN0ZW0gZm9yIGRlZmluaW5nIGV2ZW50IGhhbmRsZXJzIGluXG4gKiBhIEphdmFTY3JpcHQgZGljdGlvbmFyeSBjYWxsZWQgXCJldmVudHNcIiB0aGF0IG1hcHMgZXZlbnQgbmFtZXMgdG8gaGFuZGxlcnMuXG4gKi9cblxuY2xhc3MgWFRhZ0V2ZW50cyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoWFRhZ0V2ZW50cywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIGxldCBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICBmb3IgKGxldCBuYW1lIGluIGV2ZW50cykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50c1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgWFRhZ0V2ZW50cztcbiIsIi8qXG4gKiBEZW1vbnN0cmF0ZSB0aGUgdXNlIG9mIGEgaHlwb3RoZXRpY2FsIFhUYWcgYmFzZSBjbGFzcy5cbiAqL1xuXG5pbXBvcnQgWFRhZ0VsZW1lbnQgZnJvbSAnLi9YVGFnRWxlbWVudCc7XG5cbmxldCBYVGFnRXhhbXBsZSA9IFhUYWdFbGVtZW50LmV4dGVuZCh7XG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6ICgpID0+IHtcbiAgICAgIGFsZXJ0KCdDbGlja2VkJyk7XG4gICAgfVxuICB9LFxuXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvbj5cbiAgICAgIDxjb250ZW50PjwvY29udGVudD5cbiAgICA8L2J1dHRvbj5cbiAgYFxuXG59KTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd4dGFnLWV4YW1wbGUnLCBYVGFnRXhhbXBsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFhUYWdFeGFtcGxlO1xuIiwiLypcbiAqIEEgY2xhc3Mgd2hpY2ggY2FuIGJlIGV4dGVuZGVkIHdpdGggb3RoZXIgY2xhc3Nlcy5cbiAqL1xuXG5cbi8qXG4gKiBBIG1hcHBpbmcgb2YgY2xhc3MgcHJvdG90eXBlcyB0byB0aGUgY29ycmVzcG9uZGluZyBleHRlbnNpb24gdGhhdCB3YXMgdXNlZFxuICogdG8gaW1wbGVtZW50IHRoZSBleHRlbnNpb24uIFRoaXMgaXMgdXNlZCBieSB0aGUgc3VwZXIoZXh0ZW5zaW9uLCBtZXRob2QpXG4gKiBmYWNpbGl0eSB0aGF0IGxldHMgZXh0ZW5zaW9uIGludm9rZSBzdXBlcmNsYXNzIG1ldGhvZHMuXG4gKlxuICogTk9URTogVGhpcyBtYXAgdXNlcyBjbGFzcyBwcm90b3R5cGVzLCBub3QgY2xhc3NlcyB0aGVtc2VsdmVzLCBhcyB0aGUga2V5cy5cbiAqIFRoaXMgaXMgZG9uZSB0byBzdXBwb3J0IHdlYiBjb21wb25lbnRzIGFzIGV4dGVuc2libGUgSFRNTEVsZW1lbnQgY2xhc3Nlcy5cbiAqIFRoZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjdXN0b20tZWxlbWVudCcpIGZ1bmN0aW9uIGNhbiByZXR1cm4gYW4gZWxlbWVudFxuICogd2hvc2UgY29uc3RydWN0b3IgaXMgKm5vdCogdGhlIGZ1bmN0aW9uIHBhc3NlZCB0byBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqIFRoYXQgaXMsIGVsZW1lbnQgY2xhc3NlcyBoYXZlIGEgc3BlY2lhbCBtdW5nZWQgY29uc3RydWN0b3IsIGFuZCB0aGF0XG4gKiBjb25zdHJ1Y3RvciBjYW4ndCBnZXQgaW5jbHVkZWQgaW4gb3VyIG1hcC4gV2UgdXNlIHByb3RvdHlwZXMgaW5zdGVhZCwgd2hpY2hcbiAqIGFyZSBsZWZ0IGFsb25nIGJ5IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICovXG5sZXQgZXh0ZW5zaW9uRm9yUHJvdG90eXBlID0gbmV3IE1hcCgpO1xuXG5cbmNsYXNzIEV4dGVuc2libGVDbGFzcyB7XG5cbiAgLypcbiAgICogQ2FsbCBhIHN1cGVyY2xhc3MgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2QgaWYgaXQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIHdhbGtzIHVwIHRoZSBvYmplY3QncyBjbGFzcyBoaWVyYXJjaHkgaW4gc2VhcmNoIG9mIHRoZSBjbGFzcyB0aGF0XG4gICAqIGltcGxlbWVudGVkIHRoZSBnaXZlbiBleHRlbnNpb24uIFRoZW4gaXQgZ29lcyB1cCBvbmUgbGV2ZWwsIGFuZCBsb29rcyB1cFxuICAgKiB0aGUgaGllcmFyY2h5IGZyb20gdGhhdCBwb2ludCB0byBzZWUgaWYgYW55IHN1cGVyY2xhc3MgaW1wbGVtZW50cyB0aGVcbiAgICogbmFtZWQgbWV0aG9kLiBJZiBhIHN1cGVyY2xhc3MgbWV0aG9kIGltcGxlbWVudGF0aW9uIGlzIGZvdW5kLCBpdCBpcyBpbnZva2VkXG4gICAqIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cywgYW5kIHRoZSByZXN1bHQgb2YgdGhhdCBpcyByZXR1cm5lZC5cbiAgICovXG4gIHN1cGVyKGV4dGVuc2lvbiwgbmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24odGhpcywgZXh0ZW5zaW9uKTtcbiAgICBpZiAocHJvdG90eXBlKSB7XG4gICAgICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgICAgaWYgKHN1cGVyUHJvdG8pIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICogVGhlIGNhbGxcbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSwgRXh0ZW5zaW9uMiwgRXh0ZW5zaW9uMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgZXh0ZW5zaW9ucyBnaXZlbi4gVGhlIGFib3ZlIGlzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogICBNeUJhc2VDbGFzcy5leHRlbmQoRXh0ZW5zaW9uMSkuZXh0ZW5kKEV4dGVuc2lvbjIpLmV4dGVuZChFeHRlbnNpb24zKVxuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IG9mXG4gICAgLy8gYmVjb21lcyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJuc1xuICAgIC8vIG91dCB0aGF0IHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlXG4gICAgLy8gY3VycmVudCAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kQ2xhc3MsIHRoaXMpO1xuICB9XG5cbn1cblxuXG4vKlxuICogQ29weSB0aGUgZ2l2ZW4gbWVtYmVycyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5TWVtYmVycyhtZW1iZXJzLCB0YXJnZXQsIGlnbm9yZU1lbWJlcnMpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWVtYmVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGlmICghaWdub3JlTWVtYmVycyB8fCBpZ25vcmVNZW1iZXJzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWVtYmVycywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzIG9mIHRoZSBnaXZlbiBiYXNlY2xhc3MuIFRoZSBuZXcgY2xhc3MnIHByb3RvdHlwZSB3aWxsXG4gKiBpbmNsdWRlIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICovXG5mdW5jdGlvbiBleHRlbmRDbGFzcyhiYXNlQ2xhc3MsIGV4dGVuc2lvbikge1xuXG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG5cbiAgaWYgKHR5cGVvZiBleHRlbnNpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFeHRlbmRpbmcgd2l0aCBhIGNsYXNzLlxuICAgIC8vIENvcHkgYm90aCBzdGF0aWMgYW5kIGluc3RhbmNlIG1ldGhvZHMuXG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLCBzdWJjbGFzcywgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pKTtcbiAgICBjb3B5TWVtYmVycyhleHRlbnNpb24ucHJvdG90eXBlLCBzdWJjbGFzcy5wcm90b3R5cGUsIFsnY29uc3RydWN0b3InXSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRXh0ZW5kaW5nIHdpdGggYSBwbGFpbiBvYmplY3QuXG4gICAgY29weU1lbWJlcnMoZXh0ZW5zaW9uLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICB9XG5cbiAgLy8gUmVtZW1iZXIgd2hpY2ggZXh0ZW5zaW9uIHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0IGV4dGVuZGVkXG4gIC8vIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIGV4dGVuc2lvbkZvclByb3RvdHlwZS5zZXQoc3ViY2xhc3MucHJvdG90eXBlLCBleHRlbnNpb24pO1xuXG4gIHJldHVybiBzdWJjbGFzcztcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvblxuICogZm9yIHRoZSBnaXZlbiBvYmplY3QuXG4gKlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgY2xhc3MgaGllcmFyY2h5LlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlQ2xhc3M7XG4iLCIvKlxuICogQW4gZXh0ZW5zaWJsZSBIVE1MIGVsZW1lbnRcbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUNsYXNzIGZyb20gJy4vRXh0ZW5zaWJsZUNsYXNzJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGVDbGFzcyB0byBhZGQgaXRzIG93biBtZW1iZXJzIHRvIGEgSFRNTEVsZW1lbnQgc3ViY2xhc3MuXG4vLyBUaGUgcmVzdWx0IGlzIGFuIEhUTUxFbGVtZW50IHRoYXQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBFeHRlbnNpYmxlRWxlbWVudCA9IEV4dGVuc2libGVDbGFzcy5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZUNsYXNzKTtcblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUVsZW1lbnQ7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5jbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyk7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihBdHRyaWJ1dGVNYXJzaGFsbGluZywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIChtKSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCAoZykgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nO1xuIiwiLypcbiAqIFBvbHltZXItc3R5bGUgYXV0b21hdGljIG5vZGUgZmluZGluZy5cbiAqIFNlZSBodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZy5cbiAqL1xuXG5jbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3VwZXIoQXV0b21hdGljTm9kZUZpbmRpbmcsICdjcmVhdGVkQ2FsbGJhY2snKTtcbiAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICB0aGlzLiQgPSB7fTtcbiAgICAgIHZhciBub2Rlc1dpdGhJZHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIGlkID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIHRoaXMuJFtpZF0gPSBub2RlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXV0b21hdGljTm9kZUZpbmRpbmc7XG4iLCIvKlxuICogR2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cy5cbiAqXG4gKiBUaGlzIEVsZW1lbnRCYXNlIGNsYXNzIGltcGxlbWVudHMgdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LFxuICogYW5kIG1hcnNoYWxsaW5nIGJldHdlZW4gYXR0cmlidXRlcyBhbmQgcHJvcGVydGllcy5cbiAqL1xuXG5pbXBvcnQgRXh0ZW5zaWJsZUVsZW1lbnQgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlRWxlbWVudCc7XG5pbXBvcnQgVGVtcGxhdGVTdGFtcGluZyBmcm9tICcuL1RlbXBsYXRlU3RhbXBpbmcnO1xuaW1wb3J0IEF1dG9tYXRpY05vZGVGaW5kaW5nIGZyb20gJy4vQXV0b21hdGljTm9kZUZpbmRpbmcnO1xuaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nIGZyb20gJy4vQXR0cmlidXRlTWFyc2hhbGxpbmcnO1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEV4dGVuc2libGVFbGVtZW50IHtcblxuICAvKiBGb3IgZGVidWdnaW5nICovXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5FbGVtZW50QmFzZSA9IEVsZW1lbnRCYXNlLmV4dGVuZChcbiAgVGVtcGxhdGVTdGFtcGluZyxcbiAgQXV0b21hdGljTm9kZUZpbmRpbmcsIC8vIGJlZm9yZSBtYXJzaGFsbGluZywgc28gbWFyc2hhbGxlZCBwcm9wZXJ0aWVzIGNhbiB1c2UgaXRcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmdcbik7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqL1xuXG5cbmNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgdGhpcy5zdXBlcihUZW1wbGF0ZVN0YW1waW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlU3RhbXBpbmc7XG4iXX0=
