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
  }, {
    key: 'callBase',
    value: function callBase(target, name) {
      var superProto = this['super'](target);
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

    // Return the *prototype* for the class directly above the one that
    // implemented the indicated extension.
  }, {
    key: 'super',
    value: function _super(target) {
      var members = getMembersForExtension(target);
      for (var c = this.constructor; c !== null; c = Object.getPrototypeOf(c.prototype).constructor) {
        if (c._implements === members) {
          return Object.getPrototypeOf(c.prototype);
        }
      }
      return null;
    }
  }], [{
    key: 'extend',
    value: function extend() {
      var subclass = undefined;
      var baseClass = this;

      for (var _len2 = arguments.length, extensions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extensions[_key2] = arguments[_key2];
      }

      extensions.forEach(function (extension) {
        subclass = extendClass(baseClass, extension);
        baseClass = subclass;
      });
      return subclass;
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
  // subclass.prototype.superPrototype = baseClass.prototype;
  // Remember which class was extended to create this new class so that
  // extended methods can call implementations in the super (base) class.
  subclass._implements = members;
  return subclass;
}

function getMembersForExtension(extension) {
  return typeof extension === 'function' ? extension.prototype : extension;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0VNLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7O1dBR1Msa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7Ozs7Ozs7O0FBUWpELFVBQUksWUFBWSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQy9CO0tBQ0Y7OztXQUVjLDJCQUFHOztBQUVoQixVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFVBQUksUUFBUSxFQUFFO0FBQ1osb0NBQTRCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzlDO0FBQ0Qsb0NBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7Ozs7Ozs7O1dBc0JFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsYUFBTyxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsU0FBUyxVQUFLLElBQUksQ0FBRyxDQUFDO0tBQzNDOzs7V0FFTyxrQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFXO0FBQzlCLFVBQUksVUFBVSxHQUFHLElBQUksU0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFVBQUksVUFBVSxFQUFFO0FBQ2QsWUFBSSxVQUFVLEdBQUcscUJBQXFCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxD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UyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzlFLENBQUMsQ0FBQztDQUNKOzs7QUFHRCxTQUFTLHVCQUF1QixDQUFDLFlBQVksRUFBRTtBQUM3QyxNQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxVQUFDLENBQUM7V0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7R0FBQSxDQUFDLENBQUM7QUFDbEcsU0FBTyxhQUFhLENBQUM7Q0FDdEI7O0FBR0QsU0FBUyxxQkFBcUI7Ozs4QkFBa0I7UUFBakIsU0FBUztRQUFFLElBQUk7QUFJeEMsY0FBVSxHQUlWLFVBQVU7OztBQVBkLFFBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQztLQUNiO0FBQ0QsUUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsRSxRQUFJLFVBQVUsRUFBRTtBQUNkLGFBQU8sVUFBVSxDQUFDO0tBQ25CO0FBQ0QsUUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztVQUNyQixVQUFVO1VBQUUsSUFBSTs7O0dBQzlDO0NBQUE7O0FBR0QsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7O3FCQUV2QyxXQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cy4gKi9cblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgLy8gSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIC8vIHRoaXMubG9nKGBhdHRyaWJ1dGUgJHtuYW1lfSBjaGFuZ2VkIHRvICR7bmV3VmFsdWV9YCk7XG4gICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgdGhlbiBzZXQgdGhhdFxuICAgIC8vIHByb3BlcnR5LlxuICAgIC8vIFRPRE86IFRoaXMgbG9va3MgdXAgdGhlIGV4aXN0ZW5jZSBvZiB0aGUgcHJvcGVydHkgZWFjaCB0aW1lLiBJdCB3b3VsZFxuICAgIC8vIGJlIG1vcmUgZWZmaWNpZW50IHRvLCBlLmcuLCBkbyBhIG9uZS10aW1lIGNvbXB1dGF0aW9uIG9mIGFsbCBwcm9wZXJ0aWVzXG4gICAgLy8gZGVmaW5lZCBieSB0aGUgZWxlbWVudCAoaW5jbHVkaW5nIGJhc2UgY2xhc3NlcykuXG4gICAgLy8gVE9ETzogSWdub3JlIHN0YW5kYXJkIGF0dHJpYnV0ZSBuYW1lLlxuICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcbiAgICBpZiAoaGFzUHJvcGVydHkodGhpcywgcHJvcGVydHlOYW1lKSkge1xuICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIC8vIHRoaXMubG9nKFwiY3JlYXRlZFwiKTtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgY3JlYXRlU2hhZG93Um9vdFdpdGhUZW1wbGF0ZSh0aGlzLCB0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyh0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBhIG1peGluL2JlaGF2aW9yLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgbGV0IHN1YmNsYXNzO1xuICAgIGxldCBiYXNlQ2xhc3MgPSB0aGlzO1xuICAgIGV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICBzdWJjbGFzcyA9IGV4dGVuZENsYXNzKGJhc2VDbGFzcywgZXh0ZW5zaW9uKTtcbiAgICAgIGJhc2VDbGFzcyA9IHN1YmNsYXNzO1xuICAgIH0pO1xuICAgIHJldHVybiBzdWJjbGFzcztcbiAgfVxuXG4gIGxvZyh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coYCR7dGhpcy5sb2NhbE5hbWV9OiAke3RleHR9YCk7XG4gIH1cblxuICBjYWxsQmFzZSh0YXJnZXQsIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgc3VwZXJQcm90byA9IHRoaXMuc3VwZXIodGFyZ2V0KTtcbiAgICBpZiAoc3VwZXJQcm90bykge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3VwZXJQcm90bywgbmFtZSk7XG4gICAgICBpZiAoZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlICpwcm90b3R5cGUqIGZvciB0aGUgY2xhc3MgZGlyZWN0bHkgYWJvdmUgdGhlIG9uZSB0aGF0XG4gIC8vIGltcGxlbWVudGVkIHRoZSBpbmRpY2F0ZWQgZXh0ZW5zaW9uLlxuICBzdXBlcih0YXJnZXQpIHtcbiAgICBsZXQgbWVtYmVycyA9IGdldE1lbWJlcnNGb3JFeHRlbnNpb24odGFyZ2V0KTtcbiAgICBmb3IgKGxldCBjID0gdGhpcy5jb25zdHJ1Y3RvcjsgYyAhPT0gbnVsbDsgYyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjLnByb3RvdHlwZSkuY29uc3RydWN0b3IpIHtcbiAgICAgIGlmIChjLl9pbXBsZW1lbnRzID09PSBtZW1iZXJzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYy5wcm90b3R5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG59XG5cblxuLy8gQ29udmVydCBjYW1lbCBjYXNlIGZvb0JhciBuYW1lIHRvIGh5cGhlbmF0ZWQgZm9vLWJhci5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvLShbYS16XSkvZywgKG0pID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGNvcHlNZW1iZXJzKG1lbWJlcnMsIHRhcmdldCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtZW1iZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZW1iZXJzLCBuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd1Jvb3RXaXRoVGVtcGxhdGUoZWxlbWVudCwgdGVtcGxhdGUpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcGdyYWRlIHBsYWluIHN0cmluZyB0byByZWFsIHRlbXBsYXRlLlxuICAgIHRlbXBsYXRlID0gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgfVxuICAvLyBlbGVtZW50LmxvZyhcImNsb25pbmcgdGVtcGxhdGUgaW50byBzaGFkb3cgcm9vdFwiKTtcbiAgZWxlbWVudC5yb290ID0gZWxlbWVudC5jcmVhdGVTaGFkb3dSb290KCk7XG4gIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gIGVsZW1lbnQucm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZENsYXNzKGJhc2VDbGFzcywgZXh0ZW5zaW9uKSB7XG4gIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHt9XG4gIGxldCBtZW1iZXJzID0gZ2V0TWVtYmVyc0ZvckV4dGVuc2lvbihleHRlbnNpb24pO1xuICBjb3B5TWVtYmVycyhtZW1iZXJzLCBzdWJjbGFzcy5wcm90b3R5cGUpO1xuICAvLyBzdWJjbGFzcy5wcm90b3R5cGUuc3VwZXJQcm90b3R5cGUgPSBiYXNlQ2xhc3MucHJvdG90eXBlO1xuICAvLyBSZW1lbWJlciB3aGljaCBjbGFzcyB3YXMgZXh0ZW5kZWQgdG8gY3JlYXRlIHRoaXMgbmV3IGNsYXNzIHNvIHRoYXRcbiAgLy8gZXh0ZW5kZWQgbWV0aG9kcyBjYW4gY2FsbCBpbXBsZW1lbnRhdGlvbnMgaW4gdGhlIHN1cGVyIChiYXNlKSBjbGFzcy5cbiAgc3ViY2xhc3MuX2ltcGxlbWVudHMgPSBtZW1iZXJzO1xuICByZXR1cm4gc3ViY2xhc3M7XG59XG5cbmZ1bmN0aW9uIGdldE1lbWJlcnNGb3JFeHRlbnNpb24oZXh0ZW5zaW9uKSB7XG4gIHJldHVybiB0eXBlb2YgZXh0ZW5zaW9uID09PSAnZnVuY3Rpb24nID9cbiAgICBleHRlbnNpb24ucHJvdG90eXBlIDpcbiAgICBleHRlbnNpb247XG59XG5cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iaiwgbmFtZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaGFzUHJvcGVydHkoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIG5hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcnNoYWxsQXR0cmlidXRlc1RvUHJvcGVydGllcyhlbGVtZW50KSB7XG4gIFtdLmZvckVhY2guY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIChhdHRyaWJ1dGUpID0+IHtcbiAgICBlbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICB9KTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgKGcpID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKSB7XG4gIGlmICghcHJvdG90eXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgbGV0IHN1cGVyUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvLCBuYW1lKTtcbn1cblxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtYmFzZScsIEVsZW1lbnRCYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgRWxlbWVudEJhc2U7XG4iXX0=
