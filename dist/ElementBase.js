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
     * Help an extension method call a base class implementation if it exists.
     *
     * This walks up the object's class hierarchy in search of the class that
     * implemented the given extension. That it goes up one level, and looks up
     * the hierarchy from that point to see if any base class implements the
     * named method. If a base method implementation is found, it is invoked with
     * the given arguments, and the result of that is return.
     */
  }, {
    key: 'callBase',
    value: function callBase(extension, name) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0VNLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7O1dBR1Msa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7Ozs7Ozs7O0FBUWpELFVBQUksWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQy9CO0tBQ0Y7Ozs7Ozs7Ozs7Ozs7V0FXTyxrQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFXO0FBQ2pDLFVBQUksT0FBTyxHQUFHLDZCQUE2QixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3RCxVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbEMsWUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxZQUFJLFVBQVUsRUFBRTtBQUNkLGNBQUksVUFBVSxHQUFHLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RCxjQUFJLFVBQVUsSUFBSSxPQUFPLFVBQVUsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFOzhDQVBuQyxJQUFJO0FBQUosa0JBQUk7OztBQVF6QixtQkFBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJ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QUFDUixhQUFPLEtBQUssQ0FBQztLQUNkLE1BQU0sSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDO0tBQ2IsTUFBTTtZQUNjLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSTs7O0tBQ3BEO0dBQ0Y7Q0FBQTs7QUFFRCxTQUFTLDhCQUE4QixDQUFDLE9BQU8sRUFBRTtBQUMvQyxJQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ2pELFdBQU8sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDOUUsQ0FBQyxDQUFDO0NBQ0o7OztBQUdELFNBQVMsdUJBQXVCLENBQUMsWUFBWSxFQUFFO0FBQzdDLE1BQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLFVBQUMsQ0FBQztXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtHQUFBLENBQUMsQ0FBQztBQUNsRyxTQUFPLGFBQWEsQ0FBQztDQUN0Qjs7QUFJRCxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRXZDLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLiAqL1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAvLyBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgLy8gdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBIZWxwIGFuIGV4dGVuc2lvbiBtZXRob2QgY2FsbCBhIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb24gaWYgaXQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIHdhbGtzIHVwIHRoZSBvYmplY3QncyBjbGFzcyBoaWVyYXJjaHkgaW4gc2VhcmNoIG9mIHRoZSBjbGFzcyB0aGF0XG4gICAqIGltcGxlbWVudGVkIHRoZSBnaXZlbiBleHRlbnNpb24uIFRoYXQgaXQgZ29lcyB1cCBvbmUgbGV2ZWwsIGFuZCBsb29rcyB1cFxuICAgKiB0aGUgaGllcmFyY2h5IGZyb20gdGhhdCBwb2ludCB0byBzZWUgaWYgYW55IGJhc2UgY2xhc3MgaW1wbGVtZW50cyB0aGVcbiAgICogbmFtZWQgbWV0aG9kLiBJZiBhIGJhc2UgbWV0aG9kIGltcGxlbWVudGF0aW9uIGlzIGZvdW5kLCBpdCBpcyBpbnZva2VkIHdpdGhcbiAgICogdGhlIGdpdmVuIGFyZ3VtZW50cywgYW5kIHRoZSByZXN1bHQgb2YgdGhhdCBpcyByZXR1cm4uXG4gICAqL1xuICBjYWxsQmFzZShleHRlbnNpb24sIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgY2xhc3NGbiA9IGdldENsYXNzSW1wbGVtZW50aW5nRXh0ZW5zaW9uKHRoaXMsIGV4dGVuc2lvbik7XG4gICAgaWYgKGNsYXNzRm4pIHtcbiAgICAgIGxldCBwcm90b3R5cGUgPSBjbGFzc0ZuLnByb3RvdHlwZTtcbiAgICAgIGxldCBzdXBlclByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgICBpZiAoc3VwZXJQcm90bykge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIEJhc2UgY3JlYXRlZENhbGxiYWNrIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW5jZSwgYW5kIHRoZSB0ZW1wbGF0ZSBzdGFtcGVkIGludG8gaXQuXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgLy8gdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBjcmVhdGVTaGFkb3dSb290V2l0aFRlbXBsYXRlKHRoaXMsIHRlbXBsYXRlKTtcbiAgICB9XG4gICAgbWFyc2hhbGxBdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKHRoaXMpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKC4uLmV4dGVuc2lvbnMpIHtcbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kQ2xhc3MsIHRoaXMpO1xuICB9XG5cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICAvLyBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbi8vIFJldHVybiBhIG5ldyBzdWJjbGFzcyBvZiB0aGUgZ2l2ZW4gYmFzZWNsYXNzLiBUaGUgbmV3IGNsYXNzJyBwcm90b3R5cGUgd2lsbFxuLy8gaW5jbHVkZSB0aGUgbWVtYmVycyBvZiB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbi5cbmZ1bmN0aW9uIGV4dGVuZENsYXNzKGJhc2VDbGFzcywgZXh0ZW5zaW9uKSB7XG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG4gIGxldCBtZW1iZXJzID0gZ2V0TWVtYmVyc0ZvckV4dGVuc2lvbihleHRlbnNpb24pO1xuICBjb3B5TWVtYmVycyhtZW1iZXJzLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICAvLyBSZW1lbWJlciB3aGljaCBjbGFzcyB3YXMgZXh0ZW5kZWQgdG8gY3JlYXRlIHRoaXMgbmV3IGNsYXNzIHNvIHRoYXRcbiAgLy8gZXh0ZW5kZWQgbWV0aG9kcyBjYW4gY2FsbCBpbXBsZW1lbnRhdGlvbnMgaW4gdGhlIHN1cGVyIChiYXNlKSBjbGFzcy5cbiAgc3ViY2xhc3MuX2ltcGxlbWVudHMgPSBtZW1iZXJzO1xuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cbi8vIFJldHVybiB0aGUgY2xhc3MgdGhhdCBpbXBsZW1lbnRlZCB0aGUgaW5kaWNhdGVkIGV4dGVuc2lvbiBmb3IgdGhlIGdpdmVuXG4vLyBvYmplY3QuXG5mdW5jdGlvbiBnZXRDbGFzc0ltcGxlbWVudGluZ0V4dGVuc2lvbihvYmosIGV4dGVuc2lvbikge1xuICBsZXQgbWVtYmVycyA9IGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgZm9yIChsZXQgY2xhc3NGbiA9IG9iai5jb25zdHJ1Y3RvcjsgY2xhc3NGbiAhPT0gbnVsbDsgY2xhc3NGbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjbGFzc0ZuLnByb3RvdHlwZSkuY29uc3RydWN0b3IpIHtcbiAgICBpZiAoY2xhc3NGbi5faW1wbGVtZW50cyA9PT0gbWVtYmVycykge1xuICAgICAgcmV0dXJuIGNsYXNzRm47XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRNZW1iZXJzRm9yRXh0ZW5zaW9uKGV4dGVuc2lvbikge1xuICByZXR1cm4gdHlwZW9mIGV4dGVuc2lvbiA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgZXh0ZW5zaW9uLnByb3RvdHlwZSA6XG4gICAgZXh0ZW5zaW9uO1xufVxuXG4vKlxuICogUmV0dXJuIGEgZGVzY3JpcHRvciBmb3IgdGhlIG5hbWVkIHByb3BlcnR5LCBsb29raW5nIHVwIHRoZSBjbGFzcyBoaWVyYXJjaHkuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpIHtcbiAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfVxuICBsZXQgc3VwZXJQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHN1cGVyUHJvdG8sIG5hbWUpO1xufVxuXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhc1Byb3BlcnR5KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopLCBuYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJzaGFsbEF0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoZWxlbWVudCkge1xuICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCAoYXR0cmlidXRlKSA9PiB7XG4gICAgZWxlbWVudC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLm5hbWUsIHVuZGVmaW5lZCwgYXR0cmlidXRlLnZhbHVlKTtcbiAgfSk7XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIChnKSA9PiBnWzBdICsgJy0nICsgZ1sxXS50b0xvd2VyQ2FzZSgpKTtcbiAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG59XG5cblxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iXX0=
