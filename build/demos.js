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
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      // this.log("created");
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
    key: 'log',
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }

    /*
     * Mix the indicated properties into the class' prototype.
     * This is a destructive operation.
     * TODO: If only .extend() needs this, fold into that method.
     */
  }], [{
    key: 'extend',
    value: function extend(properties) {
      var newClass = (function (_ElementBase) {
        _inherits(newClass, _ElementBase);

        function newClass() {
          _classCallCheck(this, newClass);

          _get(Object.getPrototypeOf(newClass.prototype), 'constructor', this).apply(this, arguments);
        }

        return newClass;
      })(ElementBase);

      newClass.mixin(properties);
      return newClass;
    }
  }, {
    key: 'mixin',
    value: function mixin(properties) {
      var _this = this;

      Object.getOwnPropertyNames(properties).forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(properties, name);
        Object.defineProperty(_this.prototype, name, descriptor);
      });
      return this;
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

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

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

ElementBase.Behavior = (function () {
  function ElementBehavior() {
    _classCallCheck(this, ElementBehavior);
  }

  _createClass(ElementBehavior, null, [{
    key: 'applyBehavior',
    value: function applyBehavior(target) {
      var _this2 = this;

      var prototype = target.prototype;
      Object.getOwnPropertyNames(this.prototype).forEach(function (name) {
        if (name !== 'constructor') {
          var sourceDescriptor = Object.getOwnPropertyDescriptor(_this2.prototype, name);
          var targetDescriptor = Object.getOwnPropertyDescriptor(prototype, name);
          var newDescriptor = undefined;
          if (targetDescriptor && typeof targetDescriptor.value === 'function' && typeof sourceDescriptor.value === 'function') {
            // Compose method.
            var composed = compose(sourceDescriptor.value, targetDescriptor.value);
            newDescriptor = {
              configurable: true,
              enumerable: true,
              value: composed
            };
          } else {
            // Can use as is.
            newDescriptor = sourceDescriptor;
          }
          Object.defineProperty(prototype, name, newDescriptor);
        }
      });
    }
  }]);

  return ElementBehavior;
})();

function compose(f, g) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    f.apply(this, args);
    g.apply(this, args);
  };
}

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2UvZGVtb3MvR3JlZXRFbGVtZW50LmpzIiwiL0RldmVsb3Blci9Tb3VyY2UvZWxlbWVudC1iYXNlL3NyYy9FbGVtZW50QmFzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDQXdCLG9CQUFvQjs7Ozs7O0lBR3RDLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7OztTQUdELGVBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUM7S0FDNUQ7U0FDYyxhQUFDLEtBQUssRUFBRTtBQUNyQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQzdEOzs7U0FFVyxlQUFHO0FBQ2IsOEZBR0U7S0FDSDs7O1NBZkcsWUFBWTs7O0FBbUJsQixRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7cUJBRXpDLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDdEJyQixXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7Ozs7O2VBQVgsV0FBVzs7OztXQUdTLGtDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFOzs7Ozs7OztBQVFqRCxVQUFJLFlBQVksR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUU7QUFDbkMsWUFBSSxDQUFDLFlBQVks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QWdCLENBQUMsS0FBSyxLQUFLLFVBQVUsSUFDNUMsT0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFOztBQUVsRCxnQkFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RSx5QkFBYSxHQUFHO0FBQ2QsMEJBQVksRUFBRSxJQUFJO0FBQ2xCLHdCQUFVLEVBQUUsSUFBSTtBQUNoQixtQkFBSyxFQUFFLFFBQVE7YUFDaEIsQ0FBQztXQUNILE1BQU07O0FBRUwseUJBQWEsR0FBRyxnQkFBZ0IsQ0FBQztXQUNsQztBQUNELGdCQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDdkQ7T0FDRixDQUFDLENBQUM7S0FDSjs7O1NBMUIwQixlQUFlO0lBNEIzQyxDQUFDOztBQUVGLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckIsU0FBTyxZQUFrQjtzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ3JCLEtBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BCLEtBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ3JCLENBQUM7Q0FDSDs7QUFHRCxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRXZDLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEVsZW1lbnRCYXNlIGZyb20gXCIuLi9zcmMvRWxlbWVudEJhc2VcIjtcblxuLyogRGVmaW5lIGEgY3VzdG9tIGVsZW1lbnQuICovXG5jbGFzcyBHcmVldEVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG5cbiAgLyogRGVmaW5lIGEgXCJwdW5jdHVhdGlvblwiIGF0dHJpYnV0ZS4gKi9cbiAgZ2V0IHB1bmN0dWF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3QucXVlcnlTZWxlY3RvcignI3B1bmN0dWF0aW9uJykudGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IHB1bmN0dWF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3IoJyNwdW5jdHVhdGlvbicpLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIEhlbGxvLFxuICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PjxzcGFuIGlkPVwicHVuY3R1YXRpb25cIj4uPC9zcGFuPlxuICAgIGA7XG4gIH1cblxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2dyZWV0LWVsZW1lbnQnLCBHcmVldEVsZW1lbnQpO1xuXG5leHBvcnQgZGVmYXVsdCBHcmVldEVsZW1lbnQ7XG4iLCIvKiBCYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMuICovXG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gIC8vIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyB0aGlzLmxvZyhgYXR0cmlidXRlICR7bmFtZX0gY2hhbmdlZCB0byAke25ld1ZhbHVlfWApO1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS5cbiAgICAvLyBUT0RPOiBUaGlzIGxvb2tzIHVwIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHByb3BlcnR5IGVhY2ggdGltZS4gSXQgd291bGRcbiAgICAvLyBiZSBtb3JlIGVmZmljaWVudCB0bywgZS5nLiwgZG8gYSBvbmUtdGltZSBjb21wdXRhdGlvbiBvZiBhbGwgcHJvcGVydGllc1xuICAgIC8vIGRlZmluZWQgYnkgdGhlIGVsZW1lbnQgKGluY2x1ZGluZyBiYXNlIGNsYXNzZXMpLlxuICAgIC8vIFRPRE86IElnbm9yZSBzdGFuZGFyZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGhhc1Byb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgaWYgKHRoaXMudGVtcGxhdGUpIHtcbiAgICAgIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUodGhpcywgdGhpcy50ZW1wbGF0ZSk7XG4gICAgfVxuICAgIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyh0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIHN1YmNsYXNzIHdpdGggdGhlIGdpdmVuIG1lbWJlcnMgb24gaXRzIHByb3RvdHlwZS5cbiAgICpcbiAgICogVGhpcyAuZXh0ZW5kKCkgZmFjaWxpdHkgaXMgcHJvdmlkZWQgc29sZWx5IGFzIGEgbWVhbnMgdG8gY3JlYXRlIGNvbXBvbmVudFxuICAgKiBjbGFzc2VzIGluIEVTNS4gRVM2IHVzZXJzIHNob3VsZCB1c2UgXCJjbGFzcyAuLi4gZXh0ZW5kcyBFbGVtZW50QmFzZVwiLlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZChwcm9wZXJ0aWVzKSB7XG4gICAgY2xhc3MgbmV3Q2xhc3MgZXh0ZW5kcyBFbGVtZW50QmFzZSB7fVxuICAgIG5ld0NsYXNzLm1peGluKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiBuZXdDbGFzcztcbiAgfVxuXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxuICAvKlxuICAgKiBNaXggdGhlIGluZGljYXRlZCBwcm9wZXJ0aWVzIGludG8gdGhlIGNsYXNzJyBwcm90b3R5cGUuXG4gICAqIFRoaXMgaXMgYSBkZXN0cnVjdGl2ZSBvcGVyYXRpb24uXG4gICAqIFRPRE86IElmIG9ubHkgLmV4dGVuZCgpIG5lZWRzIHRoaXMsIGZvbGQgaW50byB0aGF0IG1ldGhvZC5cbiAgICovXG4gIHN0YXRpYyBtaXhpbihwcm9wZXJ0aWVzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvcGVydGllcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3BlcnRpZXMsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMucHJvdG90eXBlLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIChnKSA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyhlbGVtZW50KSB7XG4gIFtdLmZvckVhY2guY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICBlbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICB9KTtcbn1cblxuXG5FbGVtZW50QmFzZS5CZWhhdmlvciA9IGNsYXNzIEVsZW1lbnRCZWhhdmlvciB7XG5cbiAgc3RhdGljIGFwcGx5QmVoYXZpb3IodGFyZ2V0KSB7XG4gICAgbGV0IHByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5wcm90b3R5cGUpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChuYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgIGxldCBzb3VyY2VEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnByb3RvdHlwZSwgbmFtZSk7XG4gICAgICAgIGxldCB0YXJnZXREZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICAgICAgICBsZXQgbmV3RGVzY3JpcHRvcjtcbiAgICAgICAgaWYgKHRhcmdldERlc2NyaXB0b3IgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIHRhcmdldERlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIHNvdXJjZURlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBDb21wb3NlIG1ldGhvZC5cbiAgICAgICAgICBsZXQgY29tcG9zZWQgPSBjb21wb3NlKHNvdXJjZURlc2NyaXB0b3IudmFsdWUsIHRhcmdldERlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IGNvbXBvc2VkXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYW4gdXNlIGFzIGlzLlxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IgPSBzb3VyY2VEZXNjcmlwdG9yO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsIG5hbWUsIG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbmZ1bmN0aW9uIGNvbXBvc2UoZiwgZykge1xuICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGYuYXBwbHkodGhpcywgYXJncyk7XG4gICAgZy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cblxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iXX0=
