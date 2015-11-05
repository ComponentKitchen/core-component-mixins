(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Extend classes/objects with other classes/objects.
 */

var Extensible = (function () {
  function Extensible() {
    _classCallCheck(this, Extensible);
  }

  _createClass(Extensible, null, [{
    key: 'extend',

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
    value: function extend() {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      // We create a new subclass for each extension in turn. The result becomes
      // the base class extended by any subsequent extensions. It turns out that
      // we can use Array.reduce() to concisely express this, using the current
      // (original) class as the seed for reduce().
      return extensions.reduce(_extend, this);
    }
  }]);

  return Extensible;
})();

/*
 * All Extensible-created objects keep references to the extensions that were
 * applied to create them. When a *named* extension is applied to the prototype
 * chain, the resulting object (or, for a class, the class' prototype) will
 * have a new member with that name that points back to the same object.
 * That facility is useful when dealing with chains that have been extended
 * more than once, as an extension's name is sufficient to retrieve a reference
 * to that point in the prototype chain.
 *
 * A single extension can be applied to multiple prototype chains -- the name
 * refers to the prototype on *this particular prototype chain* that was added
 * for that extension. This lets extension/mixin code get back to its own
 * prototype, most often in combination with "super" (see below) in order to
 * invoke superclass behavior.
 */

Extensible.prototype.Extensible = Extensible.prototype;

/*
 * All Extensible-created objects have a "super" property that references the
 * prototype above them in the prototype chain.
 *
 * This "super" reference is used as a replacement for ES6's "super" keyword in
 * in ES5 (or transpiled ES6) extensions/mixins
 * that want to invoke superclass behavior, where the specific superclass will
 * depend upon which extensions have been applied to a given prototype chain.
 *
 * E.g.:
 *   class Mixin {
 *     foo() {
 *       if (this.Mixin.super.foo) {
 *         this.Mixin.super.foo.call(this); // Invoke superclass' foo()
 *       }
 *       // Do Mixin-specific work here...
 *     }
 *   }
 *
 * For consistency, Extensible itself records its own superclass as Object.
 */
Extensible.prototype.super = Object.prototype;

/*
 * Copy the given properties/methods to the target.
 */
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
function _extend(base, extension) {

  // Check whether the base and extension are classes or plain objects.
  var baseIsClass = isClass(base);
  var extensionIsClass = isClass(extension);

  // Check to see if the *extension* has a base class/prototype of its own.
  var extensionBase = extensionIsClass ? Object.getPrototypeOf(extension.prototype).constructor : Object.getPrototypeOf(extension);
  if (extensionBase && extensionBase !== Function && extensionBase !== Object) {
    // The extension itself derives from another class/object.
    // Recurse, and extend with the extension's base first.
    base = _extend(base, extensionBase);
  }

  // Create the extended object we're going to return as a result.
  var result = undefined;
  if (baseIsClass) {
    // Create a subclass of base. Once WebKit supports HTMLElement as a real
    // class, we can just say:
    //
    //   class subclass extends base {}
    //
    // However, until that's resolved, we have to construct the class ourselves.
    result = function subclass() {};
    Object.setPrototypeOf(result, base);
    Object.setPrototypeOf(result.prototype, base.prototype);
  } else {
    // Create a plain object that simply uses the base as a prototype.
    result = Object.create(base);
  }

  var source = undefined;
  var target = undefined;
  if (baseIsClass && extensionIsClass) {
    // Properties defined by Function.
    // We'd prefer to get by interrogating Function itself, but WebKit functions
    // have some properties (arguments and caller) which are not returned by
    // Object.getOwnPropertyNames(Function).
    var FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];
    // Extending a class with a class.
    // We'll copy instance members in a moment, but first copy static members.
    copyOwnProperties(extension, result, FUNCTION_PROPERTIES);
    source = extension.prototype;
    target = result.prototype;
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    source = extension.prototype;
    target = result;
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    source = extension;
    target = result.prototype;
  } else {
    // Extending a plain object with a plain object.
    source = extension;
    target = result;
  }
  copyOwnProperties(source, target, ['constructor']);

  if (extension.name) {
    // Use the extension's name (usually the name of a class' constructor) to
    // save a reference back to the newly-created object in the prototype chain.
    target[extension.name] = target;

    // Save a reference to the superclass/super-object. See the comments on
    // Extensible's "super" property.
    target.super = baseIsClass ? base.prototype : base;
  }

  return result;
}

// Return true if c is a JavaScript class.
// We use this test because, on WebKit, classes like HTMLElement are special,
// and are not instances of Function. To handle that case, we use a looser
// definition: an object is a class if it has a prototype, and that prototype
// has a constructor that is the original object. This condition holds true even
// for HTMLElement on WebKit.
function isClass(c) {
  return typeof c === 'function' || // Standard
  c.prototype && c.prototype.constructor === c; // HTMLElement in WebKit
}

exports.default = Extensible;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Marshall attributes to properties (and eventually vice versa).
 */

var AttributeMarshalling = (function () {
  function AttributeMarshalling() {
    _classCallCheck(this, AttributeMarshalling);
  }

  _createClass(AttributeMarshalling, [{
    key: 'attributeChangedCallback',

    /*
     * Handle a change to the attribute with the given name.
     */
    value: function attributeChangedCallback(name, oldValue, newValue) {
      var base = this.AttributeMarshalling.super.attributeChangedCallback;
      if (base) {
        base.call(this);
      }
      // If the attribute name corresponds to a property name, then set that
      // property. Ignore changes in standard HTMLElement properties.
      var propertyName = attributeToPropertyName(name);
      if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
        this[propertyName] = newValue;
      }
    }
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      var base = this.AttributeMarshalling.super.createdCallback;
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

// Convert camel case fooBar name to hyphenated foo-bar.

exports.default = AttributeMarshalling;
function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Polymer-style automatic node finding.
 * See https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding.
 */

var AutomaticNodeFinding = (function () {
  function AutomaticNodeFinding() {
    _classCallCheck(this, AutomaticNodeFinding);
  }

  _createClass(AutomaticNodeFinding, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      var base = this.AutomaticNodeFinding.super.createdCallback;
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

exports.default = AutomaticNodeFinding;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExtensibleElement2 = require('./ExtensibleElement');

var _ExtensibleElement3 = _interopRequireDefault(_ExtensibleElement2);

var _TemplateStamping = require('./TemplateStamping');

var _TemplateStamping2 = _interopRequireDefault(_TemplateStamping);

var _AutomaticNodeFinding = require('./AutomaticNodeFinding');

var _AutomaticNodeFinding2 = _interopRequireDefault(_AutomaticNodeFinding);

var _AttributeMarshalling = require('./AttributeMarshalling');

var _AttributeMarshalling2 = _interopRequireDefault(_AttributeMarshalling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A sample general-purpose base class for defining custom elements that mixes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * in some common features: template stamping into a shadow root, automatic node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * finding, and marshalling between attributes and properties.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ElementBase = (function (_ExtensibleElement) {
  _inherits(ElementBase, _ExtensibleElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementBase).apply(this, arguments));
  }

  _createClass(ElementBase, [{
    key: 'log',

    /* For debugging */
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }
  }]);

  return ElementBase;
})(_ExtensibleElement3.default);

ElementBase = ElementBase.extend(_TemplateStamping2.default, // before node finding, so shadow root is populated
_AutomaticNodeFinding2.default, // before marshalling, so marshalled properties can use it
_AttributeMarshalling2.default);

document.registerElement('element-base', ElementBase);

exports.default = ElementBase;

},{"./AttributeMarshalling":2,"./AutomaticNodeFinding":3,"./ExtensibleElement":5,"./TemplateStamping":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Extensible = require('../extensible/Extensible');

var _Extensible2 = _interopRequireDefault(_Extensible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
var ExtensibleElement = _Extensible2.default.extend.call(HTMLElement, _Extensible2.default); /*
                                                                                              * An extensible HTML element.
                                                                                              *
                                                                                              * This class is provided just as a convenience. One could also start with
                                                                                              * HTMLElement at the top level, and add extensibility by mixing in Extensible.
                                                                                              */

exports.default = ExtensibleElement;

},{"../extensible/Extensible":1}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Element extension for template stamping. If a component defines a template
 * property (as a string or referencing a HTML template), when the component
 * class is instantiated, a shadow root will be created on the instance, and
 * the contents of the template will be cloned into the shadow root.
 *
 * For the time being, this extension retains support for Shadow DOM v0.
 * That will eventually be deprecated as browsers implement Shadow DOM v1.
 */

var TemplateStamping = (function () {
  function TemplateStamping() {
    _classCallCheck(this, TemplateStamping);
  }

  _createClass(TemplateStamping, [{
    key: 'createdCallback',

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    value: function createdCallback() {
      // this.log("created");
      var base = this.TemplateStamping.super.createdCallback;
      if (base) {
        base();
      }
      var template = this.template;
      if (typeof template === 'string') {
        // Upgrade plain string to real template.
        template = createTemplateWithInnerHTML(template);
      }
      if (template && USING_SHADOW_DOM_V0) {
        polyfillSlotWithContent(template);
      }
      if (window.ShadowDOMPolyfill) {
        shimTemplateStyles(template, this.localName);
      }
      // TODO: Save the processed template with the component's class prototype
      // so it doesn't need to be processed with every instantiation.
      if (template) {
        // this.log("cloning template into shadow root");
        var root = USING_SHADOW_DOM_V0 ? this.createShadowRoot() : // Shadow DOM v0
        this.attachShadow({ mode: 'open' }); // Shadow DOM v1
        var clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
    }
  }]);

  return TemplateStamping;
})();

// Feature detection for old Shadow DOM v0.

exports.default = TemplateStamping;
var USING_SHADOW_DOM_V0 = typeof HTMLElement.prototype.createShadowRoot !== 'undefined';

// Convert a plain string of HTML into a real template element.
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

// Replace occurences of v1 slot elements with v0 content elements.
// This does not yet map named slots to content select clauses.
function polyfillSlotWithContent(template) {
  [].forEach.call(template.content.querySelectorAll('slot'), function (slotElement) {
    var contentElement = document.createElement('content');
    slotElement.parentNode.replaceChild(contentElement, slotElement);
  });
}

// Invoke basic style shimming with ShadowCSS.
function shimTemplateStyles(template, tag) {
  WebComponents.ShadowCSS.shimStyling(template.content, tag);
}

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0V4dGVuc2libGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDS00sVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBeUJlO3dDQUFaLFVBQVU7QUFBVixrQkFBVTs7Ozs7OztBQUt6QixhQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7U0EvQkcsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtEaEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsQUF1QnZELFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTOzs7OztBQUFDLEFBTTlDLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBNEI7TUFBMUIsbUJBQW1CLHlEQUFHLEVBQUU7O0FBQ2pFLFFBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDakQsUUFBSSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3pDLFVBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFN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RSxXQUFXLENBQUMsQ0FBQztHQUNsRSxDQUFDLENBQUM7Q0FDSjs7O0FBQUEsQUFHRCxTQUFTLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7QUFDekMsZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztDQUM1RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5cbmNsYXNzIEV4dGVuc2libGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmV4dGVuZChFeHRlbnNpb24xLCBFeHRlbnNpb24yLCBFeHRlbnNpb24zKVxuICAgKlxuICAgKiB3aWxsIHJldHVybiBhIG5ldyBjbGFzcyBvZiBNeUJhc2VDbGFzcyB0aGF0IGltcGxlbWVudHMgYWxsIHRoZSBtZXRob2RzIGluXG4gICAqIHRoZSB0aHJlZSBleHRlbnNpb25zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmV4dGVuZChFeHRlbnNpb24xKS5leHRlbmQoRXh0ZW5zaW9uMikuZXh0ZW5kKEV4dGVuc2lvbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHM6XG4gICAqXG4gICAqICAgbGV0IGV4dGVuZGVkID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChvYmoxLCBvYmoyKTtcbiAgICpcbiAgICovXG4gIHN0YXRpYyBleHRlbmQoLi4uZXh0ZW5zaW9ucykge1xuICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcyBmb3IgZWFjaCBleHRlbnNpb24gaW4gdHVybi4gVGhlIHJlc3VsdCBiZWNvbWVzXG4gICAgLy8gdGhlIGJhc2UgY2xhc3MgZXh0ZW5kZWQgYnkgYW55IHN1YnNlcXVlbnQgZXh0ZW5zaW9ucy4gSXQgdHVybnMgb3V0IHRoYXRcbiAgICAvLyB3ZSBjYW4gdXNlIEFycmF5LnJlZHVjZSgpIHRvIGNvbmNpc2VseSBleHByZXNzIHRoaXMsIHVzaW5nIHRoZSBjdXJyZW50XG4gICAgLy8gKG9yaWdpbmFsKSBjbGFzcyBhcyB0aGUgc2VlZCBmb3IgcmVkdWNlKCkuXG4gICAgcmV0dXJuIGV4dGVuc2lvbnMucmVkdWNlKGV4dGVuZCwgdGhpcyk7XG4gIH1cblxufVxuXG4vKlxuICogQWxsIEV4dGVuc2libGUtY3JlYXRlZCBvYmplY3RzIGtlZXAgcmVmZXJlbmNlcyB0byB0aGUgZXh0ZW5zaW9ucyB0aGF0IHdlcmVcbiAqIGFwcGxpZWQgdG8gY3JlYXRlIHRoZW0uIFdoZW4gYSAqbmFtZWQqIGV4dGVuc2lvbiBpcyBhcHBsaWVkIHRvIHRoZSBwcm90b3R5cGVcbiAqIGNoYWluLCB0aGUgcmVzdWx0aW5nIG9iamVjdCAob3IsIGZvciBhIGNsYXNzLCB0aGUgY2xhc3MnIHByb3RvdHlwZSkgd2lsbFxuICogaGF2ZSBhIG5ldyBtZW1iZXIgd2l0aCB0aGF0IG5hbWUgdGhhdCBwb2ludHMgYmFjayB0byB0aGUgc2FtZSBvYmplY3QuXG4gKiBUaGF0IGZhY2lsaXR5IGlzIHVzZWZ1bCB3aGVuIGRlYWxpbmcgd2l0aCBjaGFpbnMgdGhhdCBoYXZlIGJlZW4gZXh0ZW5kZWRcbiAqIG1vcmUgdGhhbiBvbmNlLCBhcyBhbiBleHRlbnNpb24ncyBuYW1lIGlzIHN1ZmZpY2llbnQgdG8gcmV0cmlldmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoYXQgcG9pbnQgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBBIHNpbmdsZSBleHRlbnNpb24gY2FuIGJlIGFwcGxpZWQgdG8gbXVsdGlwbGUgcHJvdG90eXBlIGNoYWlucyAtLSB0aGUgbmFtZVxuICogcmVmZXJzIHRvIHRoZSBwcm90b3R5cGUgb24gKnRoaXMgcGFydGljdWxhciBwcm90b3R5cGUgY2hhaW4qIHRoYXQgd2FzIGFkZGVkXG4gKiBmb3IgdGhhdCBleHRlbnNpb24uIFRoaXMgbGV0cyBleHRlbnNpb24vbWl4aW4gY29kZSBnZXQgYmFjayB0byBpdHMgb3duXG4gKiBwcm90b3R5cGUsIG1vc3Qgb2Z0ZW4gaW4gY29tYmluYXRpb24gd2l0aCBcInN1cGVyXCIgKHNlZSBiZWxvdykgaW4gb3JkZXIgdG9cbiAqIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLlxuICovXG5FeHRlbnNpYmxlLnByb3RvdHlwZS5FeHRlbnNpYmxlID0gRXh0ZW5zaWJsZS5wcm90b3R5cGU7XG5cbi8qXG4gKiBBbGwgRXh0ZW5zaWJsZS1jcmVhdGVkIG9iamVjdHMgaGF2ZSBhIFwic3VwZXJcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlXG4gKiBwcm90b3R5cGUgYWJvdmUgdGhlbSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIFRoaXMgXCJzdXBlclwiIHJlZmVyZW5jZSBpcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIEVTNidzIFwic3VwZXJcIiBrZXl3b3JkIGluXG4gKiBpbiBFUzUgKG9yIHRyYW5zcGlsZWQgRVM2KSBleHRlbnNpb25zL21peGluc1xuICogdGhhdCB3YW50IHRvIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLCB3aGVyZSB0aGUgc3BlY2lmaWMgc3VwZXJjbGFzcyB3aWxsXG4gKiBkZXBlbmQgdXBvbiB3aGljaCBleHRlbnNpb25zIGhhdmUgYmVlbiBhcHBsaWVkIHRvIGEgZ2l2ZW4gcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEUuZy46XG4gKiAgIGNsYXNzIE1peGluIHtcbiAqICAgICBmb28oKSB7XG4gKiAgICAgICBpZiAodGhpcy5NaXhpbi5zdXBlci5mb28pIHtcbiAqICAgICAgICAgdGhpcy5NaXhpbi5zdXBlci5mb28uY2FsbCh0aGlzKTsgLy8gSW52b2tlIHN1cGVyY2xhc3MnIGZvbygpXG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBEbyBNaXhpbi1zcGVjaWZpYyB3b3JrIGhlcmUuLi5cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBGb3IgY29uc2lzdGVuY3ksIEV4dGVuc2libGUgaXRzZWxmIHJlY29yZHMgaXRzIG93biBzdXBlcmNsYXNzIGFzIE9iamVjdC5cbiAqL1xuRXh0ZW5zaWJsZS5wcm90b3R5cGUuc3VwZXIgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBwcm9wZXJ0aWVzL21ldGhvZHMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIGlnbm9yZVByb3BlcnR5TmFtZXMgPSBbXSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKGlnbm9yZVByb3BlcnR5TmFtZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzL29iamVjdCB0aGF0IGV4dGVuZHMgdGhlIGdpdmVuIGJhc2UgY2xhc3Mvb2JqZWN0IHdpdGhcbiAqIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICovXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgZXh0ZW5zaW9uKSB7XG5cbiAgLy8gQ2hlY2sgd2hldGhlciB0aGUgYmFzZSBhbmQgZXh0ZW5zaW9uIGFyZSBjbGFzc2VzIG9yIHBsYWluIG9iamVjdHMuXG4gIGxldCBiYXNlSXNDbGFzcyA9IGlzQ2xhc3MoYmFzZSk7XG4gIGxldCBleHRlbnNpb25Jc0NsYXNzID0gaXNDbGFzcyhleHRlbnNpb24pO1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgKmV4dGVuc2lvbiogaGFzIGEgYmFzZSBjbGFzcy9wcm90b3R5cGUgb2YgaXRzIG93bi5cbiAgbGV0IGV4dGVuc2lvbkJhc2UgPSBleHRlbnNpb25Jc0NsYXNzID9cbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZW5zaW9uLnByb3RvdHlwZSkuY29uc3RydWN0b3IgOlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlbnNpb24pO1xuICBpZiAoZXh0ZW5zaW9uQmFzZSAmJlxuICAgICAgZXh0ZW5zaW9uQmFzZSAhPT0gRnVuY3Rpb24gJiZcbiAgICAgIGV4dGVuc2lvbkJhc2UgIT09IE9iamVjdCkge1xuICAgIC8vIFRoZSBleHRlbnNpb24gaXRzZWxmIGRlcml2ZXMgZnJvbSBhbm90aGVyIGNsYXNzL29iamVjdC5cbiAgICAvLyBSZWN1cnNlLCBhbmQgZXh0ZW5kIHdpdGggdGhlIGV4dGVuc2lvbidzIGJhc2UgZmlyc3QuXG4gICAgYmFzZSA9IGV4dGVuZChiYXNlLCBleHRlbnNpb25CYXNlKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgZXh0ZW5kZWQgb2JqZWN0IHdlJ3JlIGdvaW5nIHRvIHJldHVybiBhcyBhIHJlc3VsdC5cbiAgbGV0IHJlc3VsdDtcbiAgaWYgKGJhc2VJc0NsYXNzKSB7XG4gICAgLy8gQ3JlYXRlIGEgc3ViY2xhc3Mgb2YgYmFzZS4gT25jZSBXZWJLaXQgc3VwcG9ydHMgSFRNTEVsZW1lbnQgYXMgYSByZWFsXG4gICAgLy8gY2xhc3MsIHdlIGNhbiBqdXN0IHNheTpcbiAgICAvL1xuICAgIC8vICAgY2xhc3Mgc3ViY2xhc3MgZXh0ZW5kcyBiYXNlIHt9XG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCB1bnRpbCB0aGF0J3MgcmVzb2x2ZWQsIHdlIGhhdmUgdG8gY29uc3RydWN0IHRoZSBjbGFzcyBvdXJzZWx2ZXMuXG4gICAgcmVzdWx0ID0gZnVuY3Rpb24gc3ViY2xhc3MoKSB7fTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LCBiYXNlKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVzdWx0LnByb3RvdHlwZSwgYmFzZS5wcm90b3R5cGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIENyZWF0ZSBhIHBsYWluIG9iamVjdCB0aGF0IHNpbXBseSB1c2VzIHRoZSBiYXNlIGFzIGEgcHJvdG90eXBlLlxuICAgIHJlc3VsdCA9IE9iamVjdC5jcmVhdGUoYmFzZSk7XG4gIH1cblxuICBsZXQgc291cmNlO1xuICBsZXQgdGFyZ2V0O1xuICBpZiAoYmFzZUlzQ2xhc3MgJiYgZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIFByb3BlcnRpZXMgZGVmaW5lZCBieSBGdW5jdGlvbi5cbiAgICAvLyBXZSdkIHByZWZlciB0byBnZXQgYnkgaW50ZXJyb2dhdGluZyBGdW5jdGlvbiBpdHNlbGYsIGJ1dCBXZWJLaXQgZnVuY3Rpb25zXG4gICAgLy8gaGF2ZSBzb21lIHByb3BlcnRpZXMgKGFyZ3VtZW50cyBhbmQgY2FsbGVyKSB3aGljaCBhcmUgbm90IHJldHVybmVkIGJ5XG4gICAgLy8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pLlxuICAgIGNvbnN0IEZVTkNUSU9OX1BST1BFUlRJRVMgPSBbXG4gICAgICAnYXJndW1lbnRzJyxcbiAgICAgICdjYWxsZXInLFxuICAgICAgJ2xlbmd0aCcsXG4gICAgICAnbmFtZScsXG4gICAgICAncHJvdG90eXBlJ1xuICAgIF07XG4gICAgLy8gRXh0ZW5kaW5nIGEgY2xhc3Mgd2l0aCBhIGNsYXNzLlxuICAgIC8vIFdlJ2xsIGNvcHkgaW5zdGFuY2UgbWVtYmVycyBpbiBhIG1vbWVudCwgYnV0IGZpcnN0IGNvcHkgc3RhdGljIG1lbWJlcnMuXG4gICAgY29weU93blByb3BlcnRpZXMoZXh0ZW5zaW9uLCByZXN1bHQsIEZVTkNUSU9OX1BST1BFUlRJRVMpO1xuICAgIHNvdXJjZSA9IGV4dGVuc2lvbi5wcm90b3R5cGU7XG4gICAgdGFyZ2V0ID0gcmVzdWx0LnByb3RvdHlwZTtcbiAgfSBlbHNlIGlmICghYmFzZUlzQ2xhc3MgJiYgZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgY2xhc3MuXG4gICAgLy8gQ29weSBwcm90b3R5cGUgbWV0aG9kcyBkaXJlY3RseSB0byByZXN1bHQuXG4gICAgc291cmNlID0gZXh0ZW5zaW9uLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH0gZWxzZSBpZiAoYmFzZUlzQ2xhc3MgJiYgIWV4dGVuc2lvbklzQ2xhc3MpIHtcbiAgICAvLyBFeHRlbmRpbmcgY2xhc3Mgd2l0aCBwbGFpbiBvYmplY3QuXG4gICAgLy8gQ29weSBleHRlbnNpb24gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICBzb3VyY2UgPSBleHRlbnNpb247XG4gICAgdGFyZ2V0ID0gcmVzdWx0LnByb3RvdHlwZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBFeHRlbmRpbmcgYSBwbGFpbiBvYmplY3Qgd2l0aCBhIHBsYWluIG9iamVjdC5cbiAgICBzb3VyY2UgPSBleHRlbnNpb247XG4gICAgdGFyZ2V0ID0gcmVzdWx0O1xuICB9XG4gIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBbJ2NvbnN0cnVjdG9yJ10pO1xuXG4gIGlmIChleHRlbnNpb24ubmFtZSkge1xuICAgIC8vIFVzZSB0aGUgZXh0ZW5zaW9uJ3MgbmFtZSAodXN1YWxseSB0aGUgbmFtZSBvZiBhIGNsYXNzJyBjb25zdHJ1Y3RvcikgdG9cbiAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIGJhY2sgdG8gdGhlIG5ld2x5LWNyZWF0ZWQgb2JqZWN0IGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgdGFyZ2V0W2V4dGVuc2lvbi5uYW1lXSA9IHRhcmdldDtcblxuICAgIC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHN1cGVyY2xhc3Mvc3VwZXItb2JqZWN0LiBTZWUgdGhlIGNvbW1lbnRzIG9uXG4gICAgLy8gRXh0ZW5zaWJsZSdzIFwic3VwZXJcIiBwcm9wZXJ0eS5cbiAgICB0YXJnZXQuc3VwZXIgPSBiYXNlSXNDbGFzcyA/IGJhc2UucHJvdG90eXBlIDogYmFzZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIFJldHVybiB0cnVlIGlmIGMgaXMgYSBKYXZhU2NyaXB0IGNsYXNzLlxuLy8gV2UgdXNlIHRoaXMgdGVzdCBiZWNhdXNlLCBvbiBXZWJLaXQsIGNsYXNzZXMgbGlrZSBIVE1MRWxlbWVudCBhcmUgc3BlY2lhbCxcbi8vIGFuZCBhcmUgbm90IGluc3RhbmNlcyBvZiBGdW5jdGlvbi4gVG8gaGFuZGxlIHRoYXQgY2FzZSwgd2UgdXNlIGEgbG9vc2VyXG4vLyBkZWZpbml0aW9uOiBhbiBvYmplY3QgaXMgYSBjbGFzcyBpZiBpdCBoYXMgYSBwcm90b3R5cGUsIGFuZCB0aGF0IHByb3RvdHlwZVxuLy8gaGFzIGEgY29uc3RydWN0b3IgdGhhdCBpcyB0aGUgb3JpZ2luYWwgb2JqZWN0LiBUaGlzIGNvbmRpdGlvbiBob2xkcyB0cnVlIGV2ZW5cbi8vIGZvciBIVE1MRWxlbWVudCBvbiBXZWJLaXQuXG5mdW5jdGlvbiBpc0NsYXNzKGMpIHtcbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nIHx8ICAgICAgICAgICAgICAgICAgIC8vIFN0YW5kYXJkXG4gICAgICAoYy5wcm90b3R5cGUgJiYgYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09IGMpOyAvLyBIVE1MRWxlbWVudCBpbiBXZWJLaXRcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlO1xuIiwiLypcbiAqIE1hcnNoYWxsIGF0dHJpYnV0ZXMgdG8gcHJvcGVydGllcyAoYW5kIGV2ZW50dWFsbHkgdmljZSB2ZXJzYSkuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0cmlidXRlTWFyc2hhbGxpbmcge1xuXG4gIC8qXG4gICAqIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqL1xuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLkF0dHJpYnV0ZU1hcnNoYWxsaW5nLnN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuIElnbm9yZSBjaGFuZ2VzIGluIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gdGhpcyAmJiAhKHByb3BlcnR5TmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgbGV0IGJhc2UgPSB0aGlzLkF0dHJpYnV0ZU1hcnNoYWxsaW5nLnN1cGVyLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGUgPT4ge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgbSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCBnID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cbiIsIi8qXG4gKiBQb2x5bWVyLXN0eWxlIGF1dG9tYXRpYyBub2RlIGZpbmRpbmcuXG4gKiBTZWUgaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b21hdGljTm9kZUZpbmRpbmcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuQXV0b21hdGljTm9kZUZpbmRpbmcuc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNoYWRvd1Jvb3QpIHtcbiAgICAgIHRoaXMuJCA9IHt9O1xuICAgICAgdmFyIG5vZGVzV2l0aElkcyA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbaWRdJyk7XG4gICAgICBbXS5mb3JFYWNoLmNhbGwobm9kZXNXaXRoSWRzLCBub2RlID0+IHtcbiAgICAgICAgdmFyIGlkID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIHRoaXMuJFtpZF0gPSBub2RlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn1cbiIsIi8qXG4gKiBBIHNhbXBsZSBnZW5lcmFsLXB1cnBvc2UgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzIHRoYXQgbWl4ZXNcbiAqIGluIHNvbWUgY29tbW9uIGZlYXR1cmVzOiB0ZW1wbGF0ZSBzdGFtcGluZyBpbnRvIGEgc2hhZG93IHJvb3QsIGF1dG9tYXRpYyBub2RlXG4gKiBmaW5kaW5nLCBhbmQgbWFyc2hhbGxpbmcgYmV0d2VlbiBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlRWxlbWVudCBmcm9tICcuL0V4dGVuc2libGVFbGVtZW50JztcbmltcG9ydCBUZW1wbGF0ZVN0YW1waW5nIGZyb20gJy4vVGVtcGxhdGVTdGFtcGluZyc7XG5pbXBvcnQgQXV0b21hdGljTm9kZUZpbmRpbmcgZnJvbSAnLi9BdXRvbWF0aWNOb2RlRmluZGluZyc7XG5pbXBvcnQgQXR0cmlidXRlTWFyc2hhbGxpbmcgZnJvbSAnLi9BdHRyaWJ1dGVNYXJzaGFsbGluZyc7XG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgRXh0ZW5zaWJsZUVsZW1lbnQge1xuXG4gIC8qIEZvciBkZWJ1Z2dpbmcgKi9cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cbkVsZW1lbnRCYXNlID0gRWxlbWVudEJhc2UuZXh0ZW5kKFxuICBUZW1wbGF0ZVN0YW1waW5nLCAvLyBiZWZvcmUgbm9kZSBmaW5kaW5nLCBzbyBzaGFkb3cgcm9vdCBpcyBwb3B1bGF0ZWRcbiAgQXV0b21hdGljTm9kZUZpbmRpbmcsIC8vIGJlZm9yZSBtYXJzaGFsbGluZywgc28gbWFyc2hhbGxlZCBwcm9wZXJ0aWVzIGNhbiB1c2UgaXRcbiAgQXR0cmlidXRlTWFyc2hhbGxpbmdcbik7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiIsIi8qXG4gKiBBbiBleHRlbnNpYmxlIEhUTUwgZWxlbWVudC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHByb3ZpZGVkIGp1c3QgYXMgYSBjb252ZW5pZW5jZS4gT25lIGNvdWxkIGFsc28gc3RhcnQgd2l0aFxuICogSFRNTEVsZW1lbnQgYXQgdGhlIHRvcCBsZXZlbCwgYW5kIGFkZCBleHRlbnNpYmlsaXR5IGJ5IG1peGluZyBpbiBFeHRlbnNpYmxlLlxuICovXG5cbmltcG9ydCBFeHRlbnNpYmxlIGZyb20gJy4uL2V4dGVuc2libGUvRXh0ZW5zaWJsZSc7XG5cbi8vIFdlIHVzZSBFeHRlbnNpYmxlIHRvIGFkZCBpdHMgb3duIG1lbWJlcnMgdG8gYSBIVE1MRWxlbWVudCBzdWJjbGFzcy5cbi8vIFRoZSByZXN1bHQgaXMgYW4gSFRNTEVsZW1lbnQgd2l0aCAuZXh0ZW5kKCkgYW5kIHN1cGVyKCkgc3VwcG9ydC5cbmxldCBFeHRlbnNpYmxlRWxlbWVudCA9IEV4dGVuc2libGUuZXh0ZW5kLmNhbGwoSFRNTEVsZW1lbnQsIEV4dGVuc2libGUpO1xuXG5leHBvcnQgZGVmYXVsdCBFeHRlbnNpYmxlRWxlbWVudDtcbiIsIi8qXG4gKiBFbGVtZW50IGV4dGVuc2lvbiBmb3IgdGVtcGxhdGUgc3RhbXBpbmcuIElmIGEgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZVxuICogcHJvcGVydHkgKGFzIGEgc3RyaW5nIG9yIHJlZmVyZW5jaW5nIGEgSFRNTCB0ZW1wbGF0ZSksIHdoZW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3MgaXMgaW5zdGFudGlhdGVkLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGUgaW5zdGFuY2UsIGFuZFxuICogdGhlIGNvbnRlbnRzIG9mIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGNsb25lZCBpbnRvIHRoZSBzaGFkb3cgcm9vdC5cbiAqXG4gKiBGb3IgdGhlIHRpbWUgYmVpbmcsIHRoaXMgZXh0ZW5zaW9uIHJldGFpbnMgc3VwcG9ydCBmb3IgU2hhZG93IERPTSB2MC5cbiAqIFRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVN0YW1waW5nIHtcblxuICAvKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgLy8gdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIGxldCBiYXNlID0gdGhpcy5UZW1wbGF0ZVN0YW1waW5nLnN1cGVyLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZSgpO1xuICAgIH1cbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGUgJiYgVVNJTkdfU0hBRE9XX0RPTV9WMCkge1xuICAgICAgcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlNoYWRvd0RPTVBvbHlmaWxsKSB7XG4gICAgICBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRoaXMubG9jYWxOYW1lKTtcbiAgICB9XG4gICAgLy8gVE9ETzogU2F2ZSB0aGUgcHJvY2Vzc2VkIHRlbXBsYXRlIHdpdGggdGhlIGNvbXBvbmVudCdzIGNsYXNzIHByb3RvdHlwZVxuICAgIC8vIHNvIGl0IGRvZXNuJ3QgbmVlZCB0byBiZSBwcm9jZXNzZWQgd2l0aCBldmVyeSBpbnN0YW50aWF0aW9uLlxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcy5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gICAgICBsZXQgcm9vdCA9IFVTSU5HX1NIQURPV19ET01fVjAgP1xuICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKSA6ICAgICAgICAgICAgIC8vIFNoYWRvdyBET00gdjBcbiAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7ICAvLyBTaGFkb3cgRE9NIHYxXG4gICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG4vLyBGZWF0dXJlIGRldGVjdGlvbiBmb3Igb2xkIFNoYWRvdyBET00gdjAuXG5jb25zdCBVU0lOR19TSEFET1dfRE9NX1YwID0gKHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdCAhPT0gJ3VuZGVmaW5lZCcpO1xuXG5cbi8vIENvbnZlcnQgYSBwbGFpbiBzdHJpbmcgb2YgSFRNTCBpbnRvIGEgcmVhbCB0ZW1wbGF0ZSBlbGVtZW50LlxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuLy8gUmVwbGFjZSBvY2N1cmVuY2VzIG9mIHYxIHNsb3QgZWxlbWVudHMgd2l0aCB2MCBjb250ZW50IGVsZW1lbnRzLlxuLy8gVGhpcyBkb2VzIG5vdCB5ZXQgbWFwIG5hbWVkIHNsb3RzIHRvIGNvbnRlbnQgc2VsZWN0IGNsYXVzZXMuXG5mdW5jdGlvbiBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSkge1xuICBbXS5mb3JFYWNoLmNhbGwodGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzbG90JyksIHNsb3RFbGVtZW50ID0+IHtcbiAgICBsZXQgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50Jyk7XG4gICAgc2xvdEVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY29udGVudEVsZW1lbnQsIHNsb3RFbGVtZW50KTtcbiAgfSk7XG59XG5cbi8vIEludm9rZSBiYXNpYyBzdHlsZSBzaGltbWluZyB3aXRoIFNoYWRvd0NTUy5cbmZ1bmN0aW9uIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGFnKSB7XG4gIFdlYkNvbXBvbmVudHMuU2hhZG93Q1NTLnNoaW1TdHlsaW5nKHRlbXBsYXRlLmNvbnRlbnQsIHRhZyk7XG59XG4iXX0=
