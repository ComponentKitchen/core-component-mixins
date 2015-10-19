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

var _srcElementBase = require("../src/ElementBase");

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
      return this.root.querySelector('#punctuation').textContent;
    },
    set: function set(value) {
      this.root.querySelector('#punctuation').textContent = value;
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

},{"../src/ElementBase":2}],2:[function(require,module,exports){
/* Base class for defining custom elements. */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElementBase = (function (_HTMLElement) {
  _inherits(ElementBase, _HTMLElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    _get(Object.getPrototypeOf(ElementBase.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ElementBase, [{
    key: "attributeChangedCallback",

    // Handle a change to the attribute with the given name.
    value: function attributeChangedCallback(name, oldValue, newValue) {
      this.log("attribute " + name + " changed to " + newValue);
      // If the attribute name corresponds to a property name, then set that
      // property.
      // TODO: This looks up the existence of the property each time. It would
      // be more efficient to, e.g., do a one-time computation of all properties
      // defined by the element (including base classes).
      // TODO: Ignore standard attribute name.
      // TODO: Map hyphenated foo-bar attribute names to camel case fooBar names.
      if (hasProperty(this, name)) {
        this[name] = newValue;
      }
    }
  }, {
    key: "createdCallback",
    value: function createdCallback() {
      this.log("created");
      if (this.template) {
        createShadowRootWithTemplate(this, this.template);
      }
      marshallAttributesToProperties(this);
    }

    /*
     * Create a subclass with the given members on its prototype.
     *
     * This .extend() facility is provided solely as a means to create component
     * classes in ES5. ES6 users should use "class ... extends ElementBase".
     */
  }, {
    key: "log",
    value: function log(text) {
      console.log(this.localName + ": " + text);
    }
  }], [{
    key: "extend",
    value: function extend(properties) {
      var newClass = (function (_ElementBase) {
        _inherits(newClass, _ElementBase);

        function newClass() {
          _classCallCheck(this, newClass);

          _get(Object.getPrototypeOf(newClass.prototype), "constructor", this).apply(this, arguments);
        }

        return newClass;
      })(ElementBase);

      var prototype = Object.getPrototypeOf(newClass);
      Object.getOwnPropertyNames(properties).forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(properties, name);
        Object.defineProperty(prototype, name, descriptor);
      });
      newClass.prototype = prototype;
      return newClass;
    }
  }]);

  return ElementBase;
})(HTMLElement);

function createShadowRootWithTemplate(element, template) {
  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    template = createTemplateWithInnerHTML(template);
  }
  element.log("cloning template into shadow root");
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

document.registerElement('element-base', ElementBase);

exports["default"] = ElementBase;
module.exports = exports["default"];

},{}]},{},[1]);
