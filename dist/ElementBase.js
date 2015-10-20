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
     * 1. Extend a class with a mixin/behavior.
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
    value: function extend(extension) {
      var newClass = (function (_ref) {
        _inherits(newClass, _ref);

        function newClass() {
          _classCallCheck(this, newClass);

          _get(Object.getPrototypeOf(newClass.prototype), 'constructor', this).apply(this, arguments);
        }

        return newClass;
      })(this);

      var members = typeof extension === 'function' ? extension.prototype : extension;
      copyMembers(members, newClass.prototype);
      newClass.prototype.superPrototype = this.prototype;
      return newClass;
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

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

function getPropertyDescriptor(_x6, _x7) {
  var _again3 = true;

  _function3: while (_again3) {
    var prototype = _x6,
        name = _x7;
    descriptor = superProto = undefined;
    _again3 = false;

    if (!prototype) {
      return null;
    }
    var descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor) {
      return descriptor;
    }
    var superProto = Object.getPrototypeOf(prototype);
    _x6 = superProto;
    _x7 = name;
    _again3 = true;
    continue _function3;
  }
}

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0VNLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7O1dBR1Msa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7Ozs7Ozs7O0FBUWpELFVBQUksWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQy9CO0tBQ0Y7OztXQUVjLDJCQUFHOztBQUVoQixVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFVBQUksUUFBUSxFQUFFO0FBQ1osb0NBQTRCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzlDO0FBQ0Qsb0NBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7Ozs7Ozs7O1dBc0JFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsYUFBTyxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsU0FBUyxVQUFLLElBQUksQ0FBRyxDQUFDO0tBQzNDOzs7V0FaWSxnQkFBQyxTQUFTLEVBQUU7VUFDakIsUUFBUTtrQkFBUixRQUFROztpQkFBUixRQUFRO2dDQUFSLFFBQVE7O3FDQUFSLFFBQVE7OztlQUFSLFFBQVE7U0FBUyxJQUFJOztBQUMzQixVQUFJLE9BQU8sR0FBRyxPQUFPLFNBQVMsS0FBSyxVQUFVLEdBQzNDLFNBQVMsQ0FB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QUFZLEVBQUU7QUFDN0MsTUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsVUFBQyxDQUFDO1dBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO0dBQUEsQ0FBQyxDQUFDO0FBQ2xHLFNBQU8sYUFBYSxDQUFDO0NBQ3RCOztBQUdELFNBQVMscUJBQXFCOzs7OEJBQWtCO1FBQWpCLFNBQVM7UUFBRSxJQUFJO0FBSXhDLGNBQVUsR0FJVixVQUFVOzs7QUFQZCxRQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsYUFBTyxJQUFJLENBQUM7S0FDYjtBQUNELFFBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEUsUUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFPLFVBQVUsQ0FBQztLQUNuQjtBQUNELFFBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7VUFDckIsVUFBVTtVQUFFLElBQUk7OztHQUM5QztDQUFBOztBQUdELFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztxQkFFdkMsV0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBCYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMuICovXG5cbmNsYXNzIEVsZW1lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gIC8vIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAvLyB0aGlzLmxvZyhgYXR0cmlidXRlICR7bmFtZX0gY2hhbmdlZCB0byAke25ld1ZhbHVlfWApO1xuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS5cbiAgICAvLyBUT0RPOiBUaGlzIGxvb2tzIHVwIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHByb3BlcnR5IGVhY2ggdGltZS4gSXQgd291bGRcbiAgICAvLyBiZSBtb3JlIGVmZmljaWVudCB0bywgZS5nLiwgZG8gYSBvbmUtdGltZSBjb21wdXRhdGlvbiBvZiBhbGwgcHJvcGVydGllc1xuICAgIC8vIGRlZmluZWQgYnkgdGhlIGVsZW1lbnQgKGluY2x1ZGluZyBiYXNlIGNsYXNzZXMpLlxuICAgIC8vIFRPRE86IElnbm9yZSBzdGFuZGFyZCBhdHRyaWJ1dGUgbmFtZS5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGhhc1Byb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUodGhpcywgdGVtcGxhdGUpO1xuICAgIH1cbiAgICBtYXJzaGFsbEF0dHJpYnV0ZXNUb1Byb3BlcnRpZXModGhpcyk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBzdWJjbGFzcyBvZiB0aGUgY3VycmVudCBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSBtZW1iZXJzIGluZGljYXRlZFxuICAgKiBpbiB0aGUgYXJndW1lbnQuIFRoZSBhcmd1bWVudCBjYW4gYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCwgb3IgYSBjbGFzc1xuICAgKiB3aG9zZSBwcm90b3R5cGUgY29udGFpbnMgdGhlIG1lbWJlcnMgdGhhdCB3aWxsIGJlIGNvcGllZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgYSBjb3VwbGUgb2YgcHVycG9zZXM6XG4gICAqIDEuIEV4dGVuZCBhIGNsYXNzIHdpdGggYSBtaXhpbi9iZWhhdmlvci5cbiAgICogMi4gQ3JlYXRlIGEgY29tcG9uZW50IGNsYXNzIGluIEVTNS5cbiAgICpcbiAgICovXG4gIHN0YXRpYyBleHRlbmQoZXh0ZW5zaW9uKSB7XG4gICAgY2xhc3MgbmV3Q2xhc3MgZXh0ZW5kcyB0aGlzIHt9XG4gICAgbGV0IG1lbWJlcnMgPSB0eXBlb2YgZXh0ZW5zaW9uID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGV4dGVuc2lvbi5wcm90b3R5cGUgOlxuICAgICAgZXh0ZW5zaW9uO1xuICAgIGNvcHlNZW1iZXJzKG1lbWJlcnMsIG5ld0NsYXNzLnByb3RvdHlwZSk7XG4gICAgbmV3Q2xhc3MucHJvdG90eXBlLnN1cGVyUHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG4gICAgcmV0dXJuIG5ld0NsYXNzO1xuICB9XG5cbiAgbG9nKHRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmxvY2FsTmFtZX06ICR7dGV4dH1gKTtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICAvLyBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyhlbGVtZW50KSB7XG4gIFtdLmZvckVhY2guY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICBlbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICB9KTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgKGcpID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iXX0=
