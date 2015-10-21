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
     * Call a superclass implementation of a method if it exists.
     *
     * This walks up the object's class hierarchy in search of the class that
     * implemented the given extension. Then it goes up one level, and looks up
     * the hierarchy from that point to see if any superclass implements the
     * named method. If a superclass method implementation is found, it is invoked
     * with the given arguments, and the result of that is returned.
     */
  }, {
    key: 'super',
    value: function _super(extension, name) {
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
     * 1. Extend a class with mixins/behaviors.
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
      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      return extensions.reduce(extendClass, this);
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

// Return a new subclass of the given baseclass. The new class' prototype will
// include the members of the indicated extension.
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0VNLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7O1dBR1Msa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7Ozs7Ozs7O0FBUWpELFVBQUksWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQy9CO0tBQ0Y7Ozs7Ozs7Ozs7Ozs7V0FXSSxnQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFXO0FBQzlCLFVBQUksT0FBTyxHQUFHLDZCQUE2QixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3RCxVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbEMsWUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxZQUFJLFVBQVUsRUFBRTtBQUNkLGNBQUksVUFBVSxHQUFHLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RCxjQUFJLFVBQVUsSUFBSSxPQUFPLFVBQVUsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFOzhDQVB0QyxJQUFJO0FBQUosa0JBQUk7OztBQVF0QixtQkFBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDM0M7U0FDRjtPQUNGO0tBQ0Y7Ozs7Ozs7Ozs7V0FRYywyQkFBRzs7QUFFaEIsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixVQUFJLFFBQVEsRUFBRTtBQUNaLG9DQUE0QixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztPQUM5QztBQUNELG9DQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RDOzs7Ozs7Ozs7Ozs7OztXQWdCRSxhQUFDLElBQUksRUFBRTtBQUNSLGFBQU8sQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLFNBQVMsVUFBSyxJQUFJLENBQUcsQ0FBQztLQUMzQzs7O1dBTlksa0JBQWdCO3lDQUFaLFVBQVU7QUFBVixrQkFBVTs7O0FBQ3pCLGFBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDN0M7OztTQW5FRyxXQUFXO0dBQVMsV0FBVzs7QUE2RXJDLFNBQVMsdUJBQXVCLENBQUMsYUFBYSxFQUFFO0FBQzlDLE1BQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQztXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7R0FBQSxDQUFDLENBQUM7QUFDakYsU0FBTyxZQUFZLENBQUM7Q0FDckI7O0FBRUQsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNwQyxRQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3BELFFBQUksSUFBSSxLQUFLLGFBQWEsRUFBRTtBQUMxQixVQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hFLFlBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNqRDtHQUNGLENBQUMsQ0FBQztBQUNILFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRUQsU0FBUyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3ZELE1BQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFOztBQUVoQyxZQUFRLEdBQUcsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDbEQ7O0FBRUQsU0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQyxNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEQsU0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDakM7O0FBRUQsU0FBUywyQkFBMkIsQ0FBQyxTQUFTLEVBQUU7QUFDOUMsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztBQUlsRCxNQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLEtBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFlBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNqRDtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCOzs7O0FBSUQsU0FBUyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtNQUNuQyxRQUFRO2NBQVIsUUFBUTs7YUFBUixRQUFROzRCQUFSLFFBQVE7O2lDQUFSLFFBQVE7OztXQUFSLFFBQVE7S0FBUyxTQUFTOztBQUNoQyxNQUFJLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxhQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBR3pDLFVBQVEsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQy9CLFNBQU8sUUFBUSxDQUFDO0NBQ2pCOzs7O0FBSUQsU0FBUyw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3JELE1BQUksT0FBTyxHQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELE9BQUssSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLEtBQUssSUFBSSxFQUFFLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDcEgsUUFBSSxPQUFPLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtBQUNuQyxhQUFPLE9BQU8sQ0FBQztLQUNoQjtHQUNGO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLHNCQUFzQixDQUFDLFNBQVMsRUFBRTtBQUN6QyxTQUFPLE9BQU8sU0FBUyxLQUFLLFVBQVUsR0FDcEMsU0FBUyxDQUFDLFNBQVMsR0FDbkIsU0FBUyxDQUFDO0NBQ2I7Ozs7O0FBS0QsU0FBUyxxQkFBcUI7Ozs4QkFBa0I7UUFBakIsU0FBUztRQUFFLElBQUk7QUFJeEMsY0FBVSxHQUlWLFVBQVU7OztBQVBkLFFBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQztLQUNiO0FBQ0QsUUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsRSxRQUFJLFVBQVUsRUFBRTtBQUNkLGFBQU8sVUFBVSxDQUFDO0tBQ25CO0FBQ0QsUUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztVQUNyQixVQUFVO1VBQUUsSUFBSTs7O0dBQzlDO0NBQUE7O0FBRUQsU0FBUyxXQUFXOzs7OEJBQVk7UUFBWCxHQUFHO1FBQUUsSUFBSTs7O0FBQzVCLFFBQUksQ0FBQyxHQUFHLEVBQUU7QUFDUixhQUFPLEtBQUssQ0FBQztLQUNkLE1BQU0sSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDO0tBQ2IsTUFBTTtZQUNjLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSTs7O0tBQ3BEO0dBQ0Y7Q0FBQTs7QUFFRCxTQUFTLDhCQUE4QixDQUFDLE9BQU8sRUFBRTtBQUMvQyxJQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ2pELFdBQU8sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDOUUsQ0FBQyxDQUFDO0NBQ0o7OztBQUdELFNBQVMsdUJBQXVCLENBQUMsWUFBWSxFQUFFO0FBQzdDLE1BQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLFVBQUMsQ0FBQztXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtHQUFBLENBQUMsQ0FBQztBQUNsRyxTQUFPLGFBQWEsQ0FBQztDQUN0Qjs7QUFJRCxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRXZDLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLiAqL1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAvLyBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBDYWxsIGEgc3VwZXJjbGFzcyBpbXBsZW1lbnRhdGlvbiBvZiBhIG1ldGhvZCBpZiBpdCBleGlzdHMuXG4gICAqXG4gICAqIFRoaXMgd2Fsa3MgdXAgdGhlIG9iamVjdCdzIGNsYXNzIGhpZXJhcmNoeSBpbiBzZWFyY2ggb2YgdGhlIGNsYXNzIHRoYXRcbiAgICogaW1wbGVtZW50ZWQgdGhlIGdpdmVuIGV4dGVuc2lvbi4gVGhlbiBpdCBnb2VzIHVwIG9uZSBsZXZlbCwgYW5kIGxvb2tzIHVwXG4gICAqIHRoZSBoaWVyYXJjaHkgZnJvbSB0aGF0IHBvaW50IHRvIHNlZSBpZiBhbnkgc3VwZXJjbGFzcyBpbXBsZW1lbnRzIHRoZVxuICAgKiBuYW1lZCBtZXRob2QuIElmIGEgc3VwZXJjbGFzcyBtZXRob2QgaW1wbGVtZW50YXRpb24gaXMgZm91bmQsIGl0IGlzIGludm9rZWRcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLCBhbmQgdGhlIHJlc3VsdCBvZiB0aGF0IGlzIHJldHVybmVkLlxuICAgKi9cbiAgc3VwZXIoZXh0ZW5zaW9uLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzRm4gPSBnZXRDbGFzc0ltcGxlbWVudGluZ0V4dGVuc2lvbih0aGlzLCBleHRlbnNpb24pO1xuICAgIGlmIChjbGFzc0ZuKSB7XG4gICAgICBsZXQgcHJvdG90eXBlID0gY2xhc3NGbi5wcm90b3R5cGU7XG4gICAgICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgICAgaWYgKHN1cGVyUHJvdG8pIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBCYXNlIGNyZWF0ZWRDYWxsYmFjayBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIGNvbXBvbmVudCBkZWZpbmVzIGEgdGVtcGxhdGUsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFuY2UsIGFuZCB0aGUgdGVtcGxhdGUgc3RhbXBlZCBpbnRvIGl0LlxuICAgKi9cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgY3JlYXRlU2hhZG93Um9vdFdpdGhUZW1wbGF0ZSh0aGlzLCB0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyh0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgcmV0dXJuIGV4dGVuc2lvbnMucmVkdWNlKGV4dGVuZENsYXNzLCB0aGlzKTtcbiAgfVxuXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxufVxuXG5cbi8vIENvbnZlcnQgY2FtZWwgY2FzZSBmb29CYXIgbmFtZSB0byBoeXBoZW5hdGVkIGZvby1iYXIuXG5mdW5jdGlvbiBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIChtKSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xuICByZXR1cm4gcHJvcGVydHlOYW1lO1xufVxuXG5mdW5jdGlvbiBjb3B5TWVtYmVycyhtZW1iZXJzLCB0YXJnZXQpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWVtYmVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGlmIChuYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWVtYmVycywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaGFkb3dSb290V2l0aFRlbXBsYXRlKGVsZW1lbnQsIHRlbXBsYXRlKSB7XG4gIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gVXBncmFkZSBwbGFpbiBzdHJpbmcgdG8gcmVhbCB0ZW1wbGF0ZS5cbiAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gIH1cbiAgLy8gZWxlbWVudC5sb2coXCJjbG9uaW5nIHRlbXBsYXRlIGludG8gc2hhZG93IHJvb3RcIik7XG4gIGVsZW1lbnQucm9vdCA9IGVsZW1lbnQuY3JlYXRlU2hhZG93Um9vdCgpO1xuICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICBlbGVtZW50LnJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIC8vIFJFVklFVzogSXMgdGhlcmUgYW4gZWFzaWVyIHdheSB0byBkbyB0aGlzP1xuICAvLyBXZSdkIGxpa2UgdG8ganVzdCBzZXQgaW5uZXJIVE1MIG9uIHRoZSB0ZW1wbGF0ZSBjb250ZW50LCBidXQgc2luY2UgaXQnc1xuICAvLyBhIERvY3VtZW50RnJhZ21lbnQsIHRoYXQgZG9lc24ndCB3b3JrLlxuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mgb2YgdGhlIGdpdmVuIGJhc2VjbGFzcy4gVGhlIG5ldyBjbGFzcycgcHJvdG90eXBlIHdpbGxcbi8vIGluY2x1ZGUgdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG5mdW5jdGlvbiBleHRlbmRDbGFzcyhiYXNlQ2xhc3MsIGV4dGVuc2lvbikge1xuICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2VDbGFzcyB7fVxuICBsZXQgbWVtYmVycyA9IGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgY29weU1lbWJlcnMobWVtYmVycywgc3ViY2xhc3MucHJvdG90eXBlKTtcbiAgLy8gUmVtZW1iZXIgd2hpY2ggY2xhc3Mgd2FzIGV4dGVuZGVkIHRvIGNyZWF0ZSB0aGlzIG5ldyBjbGFzcyBzbyB0aGF0XG4gIC8vIGV4dGVuZGVkIG1ldGhvZHMgY2FuIGNhbGwgaW1wbGVtZW50YXRpb25zIGluIHRoZSBzdXBlciAoYmFzZSkgY2xhc3MuXG4gIHN1YmNsYXNzLl9pbXBsZW1lbnRzID0gbWVtYmVycztcbiAgcmV0dXJuIHN1YmNsYXNzO1xufVxuXG4vLyBSZXR1cm4gdGhlIGNsYXNzIHRoYXQgaW1wbGVtZW50ZWQgdGhlIGluZGljYXRlZCBleHRlbnNpb24gZm9yIHRoZSBnaXZlblxuLy8gb2JqZWN0LlxuZnVuY3Rpb24gZ2V0Q2xhc3NJbXBsZW1lbnRpbmdFeHRlbnNpb24ob2JqLCBleHRlbnNpb24pIHtcbiAgbGV0IG1lbWJlcnMgPSBnZXRNZW1iZXJzRm9yRXh0ZW5zaW9uKGV4dGVuc2lvbik7XG4gIGZvciAobGV0IGNsYXNzRm4gPSBvYmouY29uc3RydWN0b3I7IGNsYXNzRm4gIT09IG51bGw7IGNsYXNzRm4gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xhc3NGbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yKSB7XG4gICAgaWYgKGNsYXNzRm4uX2ltcGxlbWVudHMgPT09IG1lbWJlcnMpIHtcbiAgICAgIHJldHVybiBjbGFzc0ZuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0TWVtYmVyc0ZvckV4dGVuc2lvbihleHRlbnNpb24pIHtcbiAgcmV0dXJuIHR5cGVvZiBleHRlbnNpb24gPT09ICdmdW5jdGlvbicgP1xuICAgIGV4dGVuc2lvbi5wcm90b3R5cGUgOlxuICAgIGV4dGVuc2lvbjtcbn1cblxuLypcbiAqIFJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoZSBuYW1lZCBwcm9wZXJ0eSwgbG9va2luZyB1cCB0aGUgY2xhc3MgaGllcmFyY2h5LlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuZnVuY3Rpb24gaGFzUHJvcGVydHkob2JqLCBuYW1lKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBoYXNQcm9wZXJ0eShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSwgbmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFyc2hhbGxBdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKGVsZW1lbnQpIHtcbiAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgKGF0dHJpYnV0ZSkgPT4ge1xuICAgIGVsZW1lbnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gIH0pO1xufVxuXG4vLyBDb252ZXJ0IGh5cGhlbmF0ZWQgZm9vLWJhciBuYW1lIHRvIGNhbWVsIGNhc2UgZm9vQmFyLlxuZnVuY3Rpb24gcHJvcGVydHlUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lKSB7XG4gIGxldCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoLyhbYS16XVtBLVpdKS9nLCAoZykgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuXG5cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIl19
