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

},{}],5:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0F0dHJpYnV0ZU1hcnNoYWxsaW5nLmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9BdXRvbWF0aWNOb2RlRmluZGluZy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvRWxlbWVudEJhc2UuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0V4dGVuc2libGVDbGFzcy5qcyIsIi9EZXZlbG9wZXIvU291cmNlL2VsZW1lbnQtYmFzZS9zcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL1RlbXBsYXRlU3RhbXBpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztJQ0lNLG9CQUFvQjtXQUFwQixvQkFBb0I7MEJBQXBCLG9CQUFvQjs7Ozs7ZUFBcEIsb0JBQW9COzs7Ozs7V0FLQSxrQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUNqRCxVQUFJLFNBQU0sQ0FBQyxvQkFBb0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDOzs7Ozs7OztBQVE3RCxVQUFJLFlBQVksR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUU7QUFDbkMsWUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQztPQUMvQjtLQUNGOzs7V0FFYywyQkFBRzs7O0FBQ2hCLFVBQUksU0FBTSxDQUFDLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDcEQsUUFBRSxDQUFDLE9BQU8sQ0FB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VSxDQUFDLENBQUM7Ozs7QUFJbEQsTUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxLQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxZQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakQ7QUFDRCxTQUFPLFFBQVEsQ0FBQztDQUNqQjs7cUJBRWMsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBNYXJzaGFsbCBhdHRyaWJ1dGVzIHRvIHByb3BlcnRpZXMgKGFuZCBldmVudHVhbGx5IHZpY2UgdmVyc2EpLlxuICovXG5cbmNsYXNzIEF0dHJpYnV0ZU1hcnNoYWxsaW5nIHtcblxuICAvKlxuICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuc3VwZXIoQXR0cmlidXRlTWFyc2hhbGxpbmcsICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snKTtcbiAgICAvLyB0aGlzLmxvZyhgYXR0cmlidXRlICR7bmFtZX0gY2hhbmdlZCB0byAke25ld1ZhbHVlfWApO1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS5cbiAgICAvLyBUT0RPOiBUaGlzIGxvb2tzIHVwIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHByb3BlcnR5IGVhY2ggdGltZS4gSXQgd291bGRcbiAgICAvLyBiZSBtb3JlIGVmZmljaWVudCB0bywgZS5nLiwgZG8gYSBvbmUtdGltZSBjb21wdXRhdGlvbiBvZiBhbGwgcHJvcGVydGllc1xuICAgIC8vIGRlZmluZWQgYnkgdGhlIGVsZW1lbnQgKGluY2x1ZGluZyBiYXNlIGNsYXNzZXMpLlxuICAgIC8vIFRPRE86IElnbm9yZSBzdGFuZGFyZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGhhc1Byb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnN1cGVyKEF0dHJpYnV0ZU1hcnNoYWxsaW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYXR0cmlidXRlcywgKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIChnKSA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQXR0cmlidXRlTWFyc2hhbGxpbmc7XG4iLCIvKlxuICogUG9seW1lci1zdHlsZSBhdXRvbWF0aWMgbm9kZSBmaW5kaW5nLlxuICogU2VlIGh0dHBzOi8vd3d3LnBvbHltZXItcHJvamVjdC5vcmcvMS4wL2RvY3MvZGV2Z3VpZGUvbG9jYWwtZG9tLmh0bWwjbm9kZS1maW5kaW5nLlxuICovXG5cbmNsYXNzIEF1dG9tYXRpY05vZGVGaW5kaW5nIHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdXBlcihBdXRvbWF0aWNOb2RlRmluZGluZywgJ2NyZWF0ZWRDYWxsYmFjaycpO1xuICAgIGlmICh0aGlzLnNoYWRvd1Jvb3QpIHtcbiAgICAgIHRoaXMuJCA9IHt9O1xuICAgICAgdmFyIG5vZGVzV2l0aElkcyA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbaWRdJyk7XG4gICAgICBbXS5mb3JFYWNoLmNhbGwobm9kZXNXaXRoSWRzLCAobm9kZSkgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvbWF0aWNOb2RlRmluZGluZztcbiIsIi8qXG4gKiBHZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLlxuICpcbiAqIFRoaXMgRWxlbWVudEJhc2UgY2xhc3MgaW1wbGVtZW50cyB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsXG4gKiBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuL0V4dGVuc2libGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbkVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuZXh0ZW5kKFxuICBUZW1wbGF0ZVN0YW1waW5nLFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEEgY2xhc3Mgd2hpY2ggY2FuIGJlIGV4dGVuZGVkIHdpdGggb3RoZXIgY2xhc3Nlcy5cbiAqL1xuXG5cbi8qXG4gKiBBIG1hcHBpbmcgb2YgY2xhc3MgcHJvdG90eXBlcyB0byB0aGUgY29ycmVzcG9uZGluZyBleHRlbnNpb24gdGhhdCB3YXMgdXNlZFxuICogdG8gaW1wbGVtZW50IHRoZSBleHRlbnNpb24uIFRoaXMgaXMgdXNlZCBieSB0aGUgc3VwZXIoZXh0ZW5zaW9uLCBtZXRob2QpXG4gKiBmYWNpbGl0eSB0aGF0IGxldHMgZXh0ZW5zaW9uIGludm9rZSBzdXBlcmNsYXNzIG1ldGhvZHMuXG4gKlxuICogTk9URTogVGhpcyBtYXAgdXNlcyBjbGFzcyBwcm90b3R5cGVzLCBub3QgY2xhc3NlcyB0aGVtc2VsdmVzLCBhcyB0aGUga2V5cy5cbiAqIFRoaXMgaXMgZG9uZSB0byBzdXBwb3J0IHdlYiBjb21wb25lbnRzIGFzIGV4dGVuc2libGUgSFRNTEVsZW1lbnQgY2xhc3Nlcy5cbiAqIFRoZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjdXN0b20tZWxlbWVudCcpIGZ1bmN0aW9uIGNhbiByZXR1cm4gYW4gZWxlbWVudFxuICogd2hvc2UgY29uc3RydWN0b3IgaXMgKm5vdCogdGhlIGZ1bmN0aW9uIHBhc3NlZCB0byBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoKS5cbiAqIFRoYXQgaXMsIGVsZW1lbnQgY2xhc3NlcyBoYXZlIGEgc3BlY2lhbCBtdW5nZWQgY29uc3RydWN0b3IsIGFuZCB0aGF0XG4gKiBjb25zdHJ1Y3RvciBjYW4ndCBnZXQgaW5jbHVkZWQgaW4gb3VyIG1hcC4gV2UgdXNlIHByb3RvdHlwZXMgaW5zdGVhZCwgd2hpY2hcbiAqIGFyZSBsZWZ0IGFsb25nIGJ5IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgpLlxuICovXG5sZXQgZXh0ZW5zaW9uRm9yUHJvdG90eXBlID0gbmV3IE1hcCgpO1xuXG5cbmNsYXNzIEV4dGVuc2libGVDbGFzcyB7XG5cbiAgLypcbiAgICogQ2FsbCBhIHN1cGVyY2xhc3MgaW1wbGVtZW50YXRpb24gb2YgYSBtZXRob2QgaWYgaXQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIHdhbGtzIHVwIHRoZSBvYmplY3QncyBjbGFzcyBoaWVyYXJjaHkgaW4gc2VhcmNoIG9mIHRoZSBjbGFzcyB0aGF0XG4gICAqIGltcGxlbWVudGVkIHRoZSBnaXZlbiBleHRlbnNpb24uIFRoZW4gaXQgZ29lcyB1cCBvbmUgbGV2ZWwsIGFuZCBsb29rcyB1cFxuICAgKiB0aGUgaGllcmFyY2h5IGZyb20gdGhhdCBwb2ludCB0byBzZWUgaWYgYW55IHN1cGVyY2xhc3MgaW1wbGVtZW50cyB0aGVcbiAgICogbmFtZWQgbWV0aG9kLiBJZiBhIHN1cGVyY2xhc3MgbWV0aG9kIGltcGxlbWVudGF0aW9uIGlzIGZvdW5kLCBpdCBpcyBpbnZva2VkXG4gICAqIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cywgYW5kIHRoZSByZXN1bHQgb2YgdGhhdCBpcyByZXR1cm5lZC5cbiAgICovXG4gIHN1cGVyKGV4dGVuc2lvbiwgbmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24odGhpcywgZXh0ZW5zaW9uKTtcbiAgICBpZiAocHJvdG90eXBlKSB7XG4gICAgICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgICAgaWYgKHN1cGVyUHJvdG8pIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggbWl4aW5zL2JlaGF2aW9ycy5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICovXG4gIHN0YXRpYyBleHRlbmQoLi4uZXh0ZW5zaW9ucykge1xuICAgIHJldHVybiBleHRlbnNpb25zLnJlZHVjZShleHRlbmRDbGFzcywgdGhpcyk7XG4gIH1cblxufVxuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBtZW1iZXJzIHRvIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mgb2YgdGhlIGdpdmVuIGJhc2VjbGFzcy4gVGhlIG5ldyBjbGFzcycgcHJvdG90eXBlIHdpbGxcbiAqIGluY2x1ZGUgdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZENsYXNzKGJhc2VDbGFzcywgZXh0ZW5zaW9uKSB7XG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG4gIGxldCBtZW1iZXJzID0gZ2V0TWVtYmVyc0ZvckV4dGVuc2lvbihleHRlbnNpb24pO1xuICBjb3B5TWVtYmVycyhtZW1iZXJzLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICAvLyBSZW1lbWJlciB3aGljaCBleHRlbnNpb24gd2FzIHVzZWQgdG8gY3JlYXRlIHRoaXMgbmV3IGNsYXNzIHNvIHRoYXQgZXh0ZW5kZWRcbiAgLy8gbWV0aG9kcyBjYW4gY2FsbCBpbXBsZW1lbnRhdGlvbnMgaW4gdGhlIHN1cGVyIChiYXNlKSBjbGFzcy5cbiAgZXh0ZW5zaW9uRm9yUHJvdG90eXBlLnNldChzdWJjbGFzcy5wcm90b3R5cGUsIGV4dGVuc2lvbik7XG4gIHJldHVybiBzdWJjbGFzcztcbn1cblxuLypcbiAqIFJldHVybiB0aGUgcHJvdG90eXBlIGZvciB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvblxuICogZm9yIHRoZSBnaXZlbiBvYmplY3QuXG4gKlxuICovXG5mdW5jdGlvbiBnZXRQcm90b3R5cGVJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgZm9yIChsZXQgcHJvdG90eXBlID0gb2JqOyBwcm90b3R5cGUgIT09IG51bGw7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSB7XG4gICAgaWYgKGV4dGVuc2lvbkZvclByb3RvdHlwZS5nZXQocHJvdG90eXBlKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbiAqIElmIHRoZSBleHRlbnNpb24gaXMgYSBjbGFzcyAoZnVuY3Rpb24pLCByZXR1cm4gaXRzIHByb3RvdHlwZS4gT3RoZXJ3aXNlLFxuICogcmV0dXJuIHRoZSBleHRlbnNpb24gYXMgaXMuXG4gKi9cbmZ1bmN0aW9uIGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKSB7XG4gIHJldHVybiB0eXBlb2YgZXh0ZW5zaW9uID09PSAnZnVuY3Rpb24nID9cbiAgICBleHRlbnNpb24ucHJvdG90eXBlIDpcbiAgICBleHRlbnNpb247XG59XG5cbi8qXG4gKiBSZXR1cm4gYSBkZXNjcmlwdG9yIGZvciB0aGUgbmFtZWQgcHJvcGVydHksIGxvb2tpbmcgdXAgdGhlIGNsYXNzIGhpZXJhcmNoeS5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSkge1xuICBpZiAoIXByb3RvdHlwZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICBpZiAoZGVzY3JpcHRvcikge1xuICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICB9XG4gIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5zaWJsZUNsYXNzO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50XG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVDbGFzcyBmcm9tICcuL0V4dGVuc2libGVDbGFzcyc7XG5cbmNsYXNzIEV4dGVuc2libGVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge31cblxuLypcbiAqIEl0J2QgYmUgbmljZSB0byB1c2UgRXh0ZW5zaWJsZUNsYXNzIGl0c2VsZiBoZXJlLCBidXQgc2luY2UgaXQgZG9lc24ndCBjb3B5XG4gKiBvdmVyIHN0YXRpYyBtZXRob2RzIHlldCwgd2UgZXh0ZW5kIGJ5IGhhbmQuXG4gKi9cbkV4dGVuc2libGVFbGVtZW50LmV4dGVuZCA9IEV4dGVuc2libGVDbGFzcy5leHRlbmQ7XG5FeHRlbnNpYmxlRWxlbWVudC5wcm90b3R5cGUuc3VwZXIgPSBFeHRlbnNpYmxlQ2xhc3MucHJvdG90eXBlLnN1cGVyO1xuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlRWxlbWVudDtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqL1xuXG5cbmNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgdGhpcy5zdXBlcihUZW1wbGF0ZVN0YW1waW5nLCAnY3JlYXRlZENhbGxiYWNrJyk7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzLmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgICAgIGxldCByb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKlxuICogQ29udmVydCBhIHBsYWluIHN0cmluZyBvZiBIVE1MIGludG8gYSByZWFsIHRlbXBsYXRlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlU3RhbXBpbmc7XG4iXX0=
