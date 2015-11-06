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

var Composable = (function () {
  function Composable() {
    _classCallCheck(this, Composable);
  }

  _createClass(Composable, [{
    key: 'decorate',
    value: function decorate(decorators) {
      Composable.decorate.call(this, decorators);
    }

    // Decorate for annotating how a class member should be composed later.
    // This takes a decorator that will be run at *composition* time.
    // For now, this can only be applied to methods.

  }], [{
    key: 'compose',

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
     *   MyBaseClass.compose(Mixin1, Mixin2, Mixin3)
     *
     * will return a new class of MyBaseClass that implements all the methods in
     * the three mixins given. The above is equivalent to
     *
     *   MyBaseClass.compose(Mixin1).compose(Mixin2).compose(Mixin3)
     *
     * This method can be statically invoked to extend plain objects:
     *
     *   let extended = Composable.extend.call(obj1, obj2);
     *
     */
    value: function compose() {
      for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
        mixins[_key] = arguments[_key];
      }

      // We create a new subclass for each mixin in turn. The result becomes
      // the base class extended by any subsequent mixins. It turns out that
      // we can use Array.reduce() to concisely express this, using the current
      // (original) class as the seed for reduce().
      return mixins.reduce(_compose, this);
    }
  }, {
    key: 'composeWithBase',
    value: function composeWithBase(target, key, descriptor) {
      var mixinImplementation = descriptor.value;
      var mixinName = target.constructor.name;
      descriptor.value = function () {
        var baseImplementation = this[mixinName].super[key];

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (baseImplementation) {
          baseImplementation.apply(this, args);
        }
        return mixinImplementation.apply(this, args);
      };
    }
  }, {
    key: 'decorate',
    value: function decorate(decorators) {
      for (var key in decorators) {
        var decorator = decorators[key];
        var descriptor = Object.getOwnPropertyDescriptor(this, key);
        decorator(this, key, descriptor);
        Object.defineProperty(this, key, descriptor);
      }
    }
  }, {
    key: 'rule',
    value: function rule(decorator) {
      // We return a decorator that just adds the decorator given above to the
      // member.
      return function (target, key, descriptor) {
        descriptor.value.rule = decorator;
      };
    }
  }]);

  return Composable;
})();

/*
 * All Composable-created objects keep references to the mixins that were
 * applied to create them. When a *named* mixin is applied to the prototype
 * chain, the resulting object (or, for a class, the class' prototype) will
 * have a new member with that name that points back to the same object.
 * That facility is useful when dealing with chains that have been extended
 * more than once, as an mixin's name is sufficient to retrieve a reference
 * to that point in the prototype chain.
 *
 * A single mixin can be applied to multiple prototype chains -- the name
 * refers to the prototype on *this particular prototype chain* that was added
 * for that mixin. This lets mixin/mixin code get back to its own
 * prototype, most often in combination with "super" (see below) in order to
 * invoke superclass behavior.
 */

Composable.prototype.Composable = Composable.prototype;

/*
 * All Composable-created objects have a "super" property that references the
 * prototype above them in the prototype chain.
 *
 * This "super" reference is used as a replacement for ES6's "super" keyword in
 * in ES5 (or transpiled ES6) mixins that want to invoke superclass behavior,
 * where the specific superclass will depend upon which mixins have been applied
 * to a given prototype chain.
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
 * For consistency, Composable itself records its own superclass as Object.
 */
Composable.prototype.super = Object.prototype;

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
 * the members of the indicated mixin.
 */
function _compose(base, mixin) {

  // Check whether the base and mixin are classes or plain objects.
  var baseIsClass = isClass(base);
  var mixinIsClass = isClass(mixin);

  // Check to see if the *mixin* has a base class/prototype of its own.
  var mixinBase = mixinIsClass ? Object.getPrototypeOf(mixin.prototype).constructor : Object.getPrototypeOf(mixin);
  if (mixinBase && mixinBase !== Function && mixinBase !== Object) {
    // The mixin itself derives from another class/object.
    // Recurse, and extend with the mixin's base first.
    base = _compose(base, mixinBase);
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
  if (baseIsClass && mixinIsClass) {
    // Properties defined by Function.
    // We'd prefer to get by interrogating Function itself, but WebKit functions
    // have some properties (arguments and caller) which are not returned by
    // Object.getOwnPropertyNames(Function).
    var FUNCTION_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];
    // Extending a class with a class.
    // We'll copy instance members in a moment, but first copy static members.
    copyOwnProperties(mixin, result, FUNCTION_PROPERTIES);
    source = mixin.prototype;
    target = result.prototype;
  } else if (!baseIsClass && mixinIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    source = mixin.prototype;
    target = result;
  } else if (baseIsClass && !mixinIsClass) {
    // Extending class with plain object.
    // Copy mixin to result prototype.
    source = mixin;
    target = result.prototype;
  } else {
    // Extending a plain object with a plain object.
    source = mixin;
    target = result;
  }
  copyOwnProperties(source, target, ['constructor']);

  if (mixin.name) {
    // Use the mixin's name (usually the name of a class' constructor) to
    // save a reference back to the newly-created object in the prototype chain.
    target[mixin.name] = target;

    // Save a reference to the superclass/super-object. See the comments on
    // Composable's "super" property.
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

exports.default = Composable;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./AttributeMarshalling":3,"./AutomaticNodeFinding":4,"./ExtensibleElement":6,"./TemplateStamping":7}],6:[function(require,module,exports){
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

},{"../extensible/Extensible":2}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Composable5 = require('../extensible/Composable');

var _Composable6 = _interopRequireDefault(_Composable5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Sample classes used by the test suite */

/* A simple base class */

var ExampleBase = (function (_Composable) {
  _inherits(ExampleBase, _Composable);

  function ExampleBase() {
    _classCallCheck(this, ExampleBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExampleBase).apply(this, arguments));
  }

  _createClass(ExampleBase, [{
    key: 'method',
    value: function method() {
      this.baseMethodInvoked = true;
      return 'ExampleBase';
    }
  }]);

  return ExampleBase;
})(_Composable6.default);

/* Mixin that defines a property */

var PropertyMixin = (function () {
  function PropertyMixin() {
    _classCallCheck(this, PropertyMixin);
  }

  _createClass(PropertyMixin, [{
    key: 'property',
    get: function get() {
      return 'value';
    }
  }]);

  return PropertyMixin;
})();

/* Mixin that defines a method */

var MethodMixin = (function () {
  function MethodMixin() {
    _classCallCheck(this, MethodMixin);
  }

  _createClass(MethodMixin, [{
    key: 'method',
    value: function method() {
      this.mixinMethodInvoked = true;
      return 'MethodMixin';
    }
  }]);

  return MethodMixin;
})();

/* Mixin with method that invokes and return base implementation if present */

var MethodMixinCallsSuper = (function () {
  function MethodMixinCallsSuper() {
    _classCallCheck(this, MethodMixinCallsSuper);
  }

  _createClass(MethodMixinCallsSuper, [{
    key: 'method',
    value: function method() {
      var base = this.MethodMixinCallsSuper.super.method;
      var result = base ? base.call(this) : 'MethodMixin';
      this.mixinMethodInvoked = true;
      return result;
    }
  }]);

  return MethodMixinCallsSuper;
})();

/* Mixin that uses decorator to request composition with base implementation */

var MethodMixinComposed = (function () {
  function MethodMixinComposed() {
    _classCallCheck(this, MethodMixinComposed);
  }

  _createClass(MethodMixinComposed, [{
    key: 'method',
    value: function method() {
      this.mixinMethodInvoked = true;
      return 'MethodMixinComposed';
    }
  }]);

  return MethodMixinComposed;
})();

_Composable6.default.decorate.call(MethodMixinComposed.prototype, {
  method: _Composable6.default.composeWithBase
});

suite("Composable", function () {

  test("can extend class with ES6 class syntax", function () {
    var Subclass = (function (_ExampleBase) {
      _inherits(Subclass, _ExampleBase);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'bar',
        get: function get() {
          return true;
        }
      }]);

      return Subclass;
    })(ExampleBase);

    var instance = new Subclass();
    assert.equal(instance.method(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("can extend class with ES5-compatible .compose() syntax", function () {
    var Subclass = ExampleBase.compose({
      bar: true
    });
    var instance = new Subclass();
    assert.equal(instance.method(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("class decorators applied to indicated members", function () {
    var Base = (function (_Composable2) {
      _inherits(Base, _Composable2);

      function Base() {
        _classCallCheck(this, Base);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Base).apply(this, arguments));
      }

      _createClass(Base, [{
        key: 'method',
        value: function method() {}
      }]);

      return Base;
    })(_Composable6.default);

    function decorator(target, key, descriptor) {
      descriptor.value.decorated = true;
    }
    Base.prototype.decorate({
      method: decorator
    });
    assert(Base.prototype.method.decorated);
  });

  test("class mixin can define a property", function () {
    var Subclass = ExampleBase.compose(PropertyMixin);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
  });

  test("class mixin can define a method", function () {
    var Subclass = ExampleBase.compose(MethodMixin);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'MethodMixin');
    assert(instance.mixinMethodInvoked);
  });

  test("mixin method can use super() to invoke base class implementation", function () {
    var Subclass = ExampleBase.compose(MethodMixinCallsSuper);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'ExampleBase');
    assert(instance.mixinMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("rule() decorator just records a decorator for later use", function () {
    var Subclass = (function (_Composable3) {
      _inherits(Subclass, _Composable3);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'method',
        value: function method() {}
      }]);

      return Subclass;
    })(_Composable6.default);

    function decorator(target, key, descriptor) {}
    Subclass.prototype.decorate({
      method: _Composable6.default.rule(decorator)
    });
    assert.equal(Subclass.prototype.method.rule, decorator);
  });

  test("mixin can use decorator to invoke base class implementation", function () {
    var Subclass = ExampleBase.compose(MethodMixinComposed);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'MethodMixinComposed');
    assert(instance.mixinMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple mixins can be applied in one call", function () {
    var Subclass = ExampleBase.compose(PropertyMixin, MethodMixin);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
    var result = instance.method();
    assert.equal(result, 'MethodMixin');
    assert(instance.mixinMethodInvoked);
  });

  test("can extend a plain object", function () {
    var obj = {
      method: function method() {
        return 'result';
      }
    };
    var mixin = {
      property: 'value'
    };
    var composed = _Composable6.default.compose.call(obj, mixin);
    assert.equal(composed.method(), 'result');
    assert.equal(composed.property, 'value');
  });

  test("mixin can has multiple levels of inheritance", function () {
    var MixinSubclass = (function (_MethodMixin) {
      _inherits(MixinSubclass, _MethodMixin);

      function MixinSubclass() {
        _classCallCheck(this, MixinSubclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinSubclass).apply(this, arguments));
      }

      _createClass(MixinSubclass, [{
        key: 'method',
        value: function method() {
          var superMethod = this.MixinSubclass.super.method;
          if (superMethod) {
            superMethod.call(this);
          }
          this.mixinSubclassMethodInvoked = true;
        }
      }]);

      return MixinSubclass;
    })(MethodMixin);

    var Subclass = _Composable6.default.compose(MixinSubclass);
    var instance = new Subclass();
    instance.method();
    assert(instance.mixinMethodInvoked);
    assert(instance.mixinSubclassMethodInvoked);
  });

  test("mixin property can reference superclass' property", function () {
    var PropertyMixin = (function () {
      function PropertyMixin() {
        _classCallCheck(this, PropertyMixin);
      }

      _createClass(PropertyMixin, [{
        key: 'property',
        get: function get() {
          var superPrototype = this.PropertyMixin.super;
          var descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
          return descriptor ? descriptor.get.call(this) : 'PropertyMixin';
        }
      }]);

      return PropertyMixin;
    })();

    var Subclass = (function (_Composable4) {
      _inherits(Subclass, _Composable4);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'property',
        get: function get() {
          return 'Subclass';
        }
      }]);

      return Subclass;
    })(_Composable6.default);

    Subclass = Subclass.compose(PropertyMixin);
    var instance = new Subclass();
    assert.equal(instance.property, 'Subclass');
  });
});

},{"../extensible/Composable":1}],9:[function(require,module,exports){
"use strict";

var _testElements = require("./testElements");

var testElements = _interopRequireWildcard(_testElements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

suite("ElementBase", function () {

  test("component stamps string template into root", function () {
    var element = document.createElement('element-with-string-template');
    assert(element.shadowRoot);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });

  test("component stamps real template into root", function () {
    var element = document.createElement('element-with-real-template');
    assert(element.shadowRoot);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });

  test("can create component class with ES5-compatible .extend()", function () {
    var element = document.createElement('es5-class-via-extend');
    assert.equal(element.customProperty, 'property');
    assert.equal(element.method(), 'method');
    assert.equal(element.value, 'value');
  });

  test("hyphenated attribute marshalled to corresponding camelCase property", function () {
    var element = document.createElement('element-with-camel-case-property');
    assert.isUndefined(element.customProperty);
    element.setAttribute('custom-property', "Hello");
    assert.equal(element.customProperty, "Hello");
  });

  test("extension can define createdCallback", function () {
    var element = document.createElement('element-with-created-extension');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.shadowRoot.textContent.trim(), "Hello");
  });
});

},{"./testElements":11}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Extensible3 = require('../extensible/Extensible');

var _Extensible4 = _interopRequireDefault(_Extensible3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Sample classes used by the test suite */

/* A simple base class */

var ExampleBase = (function (_Extensible) {
  _inherits(ExampleBase, _Extensible);

  function ExampleBase() {
    _classCallCheck(this, ExampleBase);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExampleBase).apply(this, arguments));
  }

  _createClass(ExampleBase, [{
    key: 'foo',
    value: function foo() {
      return 'ExampleBase';
    }
  }]);

  return ExampleBase;
})(_Extensible4.default);

/* Extension that defines a property */

var PropertyExtension = (function () {
  function PropertyExtension() {
    _classCallCheck(this, PropertyExtension);
  }

  _createClass(PropertyExtension, [{
    key: 'property',
    get: function get() {
      return 'value';
    }
  }]);

  return PropertyExtension;
})();

/* Extension that defines a method */

var MethodExtension = (function () {
  function MethodExtension() {
    _classCallCheck(this, MethodExtension);
  }

  _createClass(MethodExtension, [{
    key: 'method',
    value: function method() {
      var superMethod = this.MethodExtension.super.method;
      var result = superMethod ? superMethod.call(this) : 'extension result';
      this.extensionMethodInvoked = true;
      return result;
    }
  }]);

  return MethodExtension;
})();

suite("Extensible", function () {

  test("can extend class with ES6 class syntax", function () {
    var Subclass = (function (_ExampleBase) {
      _inherits(Subclass, _ExampleBase);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'bar',
        get: function get() {
          return true;
        }
      }]);

      return Subclass;
    })(ExampleBase);

    var instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("can extend class with ES5-compatible .extend() syntax", function () {
    var Subclass = ExampleBase.extend({
      bar: true
    });
    var instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("class extension can define a property", function () {
    var Subclass = ExampleBase.extend(PropertyExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
  });

  test("class extension can define a method", function () {
    var Subclass = ExampleBase.extend(MethodExtension);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

  test("extension method can use super() to invoke base class implementation", function () {
    var Subclass = (function (_ExampleBase2) {
      _inherits(Subclass, _ExampleBase2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'method',
        value: function method() {
          this.baseMethodInvoked = true;
          return 'base result';
        }
      }]);

      return Subclass;
    })(ExampleBase);

    Subclass = Subclass.extend(MethodExtension);
    var instance = new Subclass();
    var result = instance.method();
    assert.equal(result, 'base result');
    assert(instance.extensionMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple extensions can be applied in one call", function () {
    var Subclass = ExampleBase.extend(PropertyExtension, MethodExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'value');
    var result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

  test("can extend a plain object", function () {
    var obj = {
      method: function method() {
        return 'result';
      }
    };
    var extension = {
      property: 'value'
    };
    var extended = _Extensible4.default.extend.call(obj, extension);
    assert.equal(extended.method(), 'result');
    assert.equal(extended.property, 'value');
  });

  test("extension can has multiple levels of inheritance", function () {
    var ExtensionSubclass = (function (_MethodExtension) {
      _inherits(ExtensionSubclass, _MethodExtension);

      function ExtensionSubclass() {
        _classCallCheck(this, ExtensionSubclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ExtensionSubclass).apply(this, arguments));
      }

      _createClass(ExtensionSubclass, [{
        key: 'method',
        value: function method() {
          var superMethod = this.ExtensionSubclass.super.method;
          if (superMethod) {
            superMethod.call(this);
          }
          this.extensionSubclassMethodInvoked = true;
        }
      }]);

      return ExtensionSubclass;
    })(MethodExtension);

    var Subclass = _Extensible4.default.extend(ExtensionSubclass);
    var instance = new Subclass();
    instance.method();
    assert(instance.extensionMethodInvoked);
    assert(instance.extensionSubclassMethodInvoked);
  });

  test("extension property can reference superclass' property", function () {
    var PropertyExtension = (function () {
      function PropertyExtension() {
        _classCallCheck(this, PropertyExtension);
      }

      _createClass(PropertyExtension, [{
        key: 'property',
        get: function get() {
          var superPrototype = this.PropertyExtension.super;
          var descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
          return descriptor ? descriptor.get.call(this) : 'extension value';
        }
      }]);

      return PropertyExtension;
    })();

    var Subclass = (function (_Extensible2) {
      _inherits(Subclass, _Extensible2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Subclass).apply(this, arguments));
      }

      _createClass(Subclass, [{
        key: 'property',
        get: function get() {
          return 'base value';
        }
      }]);

      return Subclass;
    })(_Extensible4.default);

    Subclass = Subclass.extend(PropertyExtension);
    var instance = new Subclass();
    assert.equal(instance.property, 'base value');
  });
});

},{"../extensible/Extensible":2}],11:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ElementBase5 = require('../src/ElementBase');

var _ElementBase6 = _interopRequireDefault(_ElementBase5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Element with a simple template */

var ElementWithStringTemplate = (function (_ElementBase) {
  _inherits(ElementWithStringTemplate, _ElementBase);

  function ElementWithStringTemplate() {
    _classCallCheck(this, ElementWithStringTemplate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithStringTemplate).apply(this, arguments));
  }

  _createClass(ElementWithStringTemplate, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithStringTemplate;
})(_ElementBase6.default);

document.registerElement('element-with-string-template', ElementWithStringTemplate);

/* Element with a real template */
var template = document.createElement('template');
template.content.textContent = "Hello";

var ElementWithRealTemplate = (function (_ElementBase2) {
  _inherits(ElementWithRealTemplate, _ElementBase2);

  function ElementWithRealTemplate() {
    _classCallCheck(this, ElementWithRealTemplate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithRealTemplate).apply(this, arguments));
  }

  _createClass(ElementWithRealTemplate, [{
    key: 'template',
    get: function get() {
      return template;
    }
  }]);

  return ElementWithRealTemplate;
})(_ElementBase6.default);

document.registerElement('element-with-real-template', ElementWithRealTemplate);

/* Element created via ES5-compatible .extend() */
var Es5ClassViaExtend = _ElementBase6.default.extend({
  get customProperty() {
    return 'property';
  },
  method: function method() {
    return 'method';
  },
  value: 'value'
});
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);

/* Element with camelCase property name */

var ElementWithCamelCaseProperty = (function (_ElementBase3) {
  _inherits(ElementWithCamelCaseProperty, _ElementBase3);

  function ElementWithCamelCaseProperty() {
    _classCallCheck(this, ElementWithCamelCaseProperty);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithCamelCaseProperty).apply(this, arguments));
  }

  _createClass(ElementWithCamelCaseProperty, [{
    key: 'customProperty',
    get: function get() {
      return this._customProperty;
    },
    set: function set(value) {
      this._customProperty = value;
    }
  }]);

  return ElementWithCamelCaseProperty;
})(_ElementBase6.default);

document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);

/* Extension that defines a createdCallback method. */

var CreatedExtension = (function () {
  function CreatedExtension() {
    _classCallCheck(this, CreatedExtension);
  }

  _createClass(CreatedExtension, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var base = this.CreatedExtension.super.createdCallback;
      if (base) {
        base.call(this);
      }
      this.extensionCreatedCallbackInvoked = true;
    }
  }]);

  return CreatedExtension;
})();

var ElementWithCreatedExtension = (function (_ElementBase4) {
  _inherits(ElementWithCreatedExtension, _ElementBase4);

  function ElementWithCreatedExtension() {
    _classCallCheck(this, ElementWithCreatedExtension);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ElementWithCreatedExtension).apply(this, arguments));
  }

  _createClass(ElementWithCreatedExtension, [{
    key: 'template',
    get: function get() {
      return "Hello";
    }
  }]);

  return ElementWithCreatedExtension;
})(_ElementBase6.default);

ElementWithCreatedExtension = ElementWithCreatedExtension.extend(CreatedExtension);
document.registerElement('element-with-created-extension', ElementWithCreatedExtension);

},{"../src/ElementBase":5}]},{},[8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleHRlbnNpYmxlL0NvbXBvc2FibGUuanMiLCJleHRlbnNpYmxlL0V4dGVuc2libGUuanMiLCJzcmMvQXR0cmlidXRlTWFyc2hhbGxpbmcuanMiLCJzcmMvQXV0b21hdGljTm9kZUZpbmRpbmcuanMiLCJzcmMvRWxlbWVudEJhc2UuanMiLCJzcmMvRXh0ZW5zaWJsZUVsZW1lbnQuanMiLCJzcmMvVGVtcGxhdGVTdGFtcGluZy5qcyIsInRlc3QvQ29tcG9zYWJsZS50ZXN0cy5qcyIsInRlc3QvRWxlbWVudEJhc2UudGVzdHMuanMiLCJ0ZXN0L0V4dGVuc2libGUudGVzdHMuanMiLCJ0ZXN0L3Rlc3RFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDS00sVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7NkJBc0RMLFVBQVUsRUFBRTtBQUNuQixnQkFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkEvQnlCO3dDQUFSLE1BQU07QUFBTixjQUFNOzs7Ozs7O0FBS3RCLGFBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDckM7OztvQ0FFc0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDOUMsVUFBSSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0FBQzNDLFVBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ3hDLGdCQUFVLENBQUMsS0FBSyxHQUFHLFlBQWtCO0FBQ25DLFlBQUksa0JBQWtCLEdBQUcs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QUssQ0FBQztLQUM5Qjs7O1NBTkcsNEJBQTRCOzs7QUFRbEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQ0FBa0MsRUFBRSw0QkFBNEIsQ0FBQzs7O0FBQUM7SUFJckYsZ0JBQWdCO1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzs7ZUFBaEIsZ0JBQWdCOztzQ0FDRjtBQUNoQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztBQUN2RCxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7QUFDRCxVQUFJLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDO0tBQzdDOzs7U0FQRyxnQkFBZ0I7OztJQVNoQiwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7a0VBQTNCLDJCQUEyQjs7O2VBQTNCLDJCQUEyQjs7d0JBQ2hCO0FBQ2IsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQUhHLDJCQUEyQjs7O0FBS2pDLDJCQUEyQixHQUFHLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ25GLFFBQVEsQ0FBQyxlQUFlLENBQUMsZ0NBQWdDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogRXh0ZW5kIGNsYXNzZXMvb2JqZWN0cyB3aXRoIG90aGVyIGNsYXNzZXMvb2JqZWN0cy5cbiAqL1xuXG5cbmNsYXNzIENvbXBvc2FibGUge1xuXG4gIC8qXG4gICAqIFJldHVybiBhIHN1YmNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIHRoYXQgaW5jbHVkZXMgdGhlIG1lbWJlcnMgaW5kaWNhdGVkXG4gICAqIGluIHRoZSBhcmd1bWVudC4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0LCBvciBhIGNsYXNzXG4gICAqIHdob3NlIHByb3RvdHlwZSBjb250YWlucyB0aGUgbWVtYmVycyB0aGF0IHdpbGwgYmUgY29waWVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciBhIGNvdXBsZSBvZiBwdXJwb3NlczpcbiAgICogMS4gRXh0ZW5kIGEgY2xhc3Mgd2l0aCBtaXhpbnMvYmVoYXZpb3JzLlxuICAgKiAyLiBDcmVhdGUgYSBjb21wb25lbnQgY2xhc3MgaW4gRVM1LlxuICAgKlxuICAgKiBUaGUgY2FsbFxuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xLCBNaXhpbjIsIE1peGluMylcbiAgICpcbiAgICogd2lsbCByZXR1cm4gYSBuZXcgY2xhc3Mgb2YgTXlCYXNlQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIGFsbCB0aGUgbWV0aG9kcyBpblxuICAgKiB0aGUgdGhyZWUgbWl4aW5zIGdpdmVuLiBUaGUgYWJvdmUgaXMgZXF1aXZhbGVudCB0b1xuICAgKlxuICAgKiAgIE15QmFzZUNsYXNzLmNvbXBvc2UoTWl4aW4xKS5jb21wb3NlKE1peGluMikuY29tcG9zZShNaXhpbjMpXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBzdGF0aWNhbGx5IGludm9rZWQgdG8gZXh0ZW5kIHBsYWluIG9iamVjdHM6XG4gICAqXG4gICAqICAgbGV0IGV4dGVuZGVkID0gQ29tcG9zYWJsZS5leHRlbmQuY2FsbChvYmoxLCBvYmoyKTtcbiAgICpcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKC4uLm1peGlucykge1xuICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcyBmb3IgZWFjaCBtaXhpbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAvLyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBtaXhpbnMuIEl0IHR1cm5zIG91dCB0aGF0XG4gICAgLy8gd2UgY2FuIHVzZSBBcnJheS5yZWR1Y2UoKSB0byBjb25jaXNlbHkgZXhwcmVzcyB0aGlzLCB1c2luZyB0aGUgY3VycmVudFxuICAgIC8vIChvcmlnaW5hbCkgY2xhc3MgYXMgdGhlIHNlZWQgZm9yIHJlZHVjZSgpLlxuICAgIHJldHVybiBtaXhpbnMucmVkdWNlKGNvbXBvc2UsIHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGNvbXBvc2VXaXRoQmFzZSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBtaXhpbkltcGxlbWVudGF0aW9uID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICBsZXQgbWl4aW5OYW1lID0gdGFyZ2V0LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGxldCBiYXNlSW1wbGVtZW50YXRpb24gPSB0aGlzW21peGluTmFtZV0uc3VwZXJba2V5XTtcbiAgICAgIGlmIChiYXNlSW1wbGVtZW50YXRpb24pIHtcbiAgICAgICAgYmFzZUltcGxlbWVudGF0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1peGluSW1wbGVtZW50YXRpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGRlY29yYXRlKGRlY29yYXRvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVjb3JhdG9ycykge1xuICAgICAgbGV0IGRlY29yYXRvciA9IGRlY29yYXRvcnNba2V5XTtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLCBrZXkpO1xuICAgICAgZGVjb3JhdG9yKHRoaXMsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICBkZWNvcmF0ZShkZWNvcmF0b3JzKSB7XG4gICAgQ29tcG9zYWJsZS5kZWNvcmF0ZS5jYWxsKHRoaXMsIGRlY29yYXRvcnMpO1xuICB9XG5cbiAgLy8gRGVjb3JhdGUgZm9yIGFubm90YXRpbmcgaG93IGEgY2xhc3MgbWVtYmVyIHNob3VsZCBiZSBjb21wb3NlZCBsYXRlci5cbiAgLy8gVGhpcyB0YWtlcyBhIGRlY29yYXRvciB0aGF0IHdpbGwgYmUgcnVuIGF0ICpjb21wb3NpdGlvbiogdGltZS5cbiAgLy8gRm9yIG5vdywgdGhpcyBjYW4gb25seSBiZSBhcHBsaWVkIHRvIG1ldGhvZHMuXG4gIHN0YXRpYyBydWxlKGRlY29yYXRvcikge1xuICAgIC8vIFdlIHJldHVybiBhIGRlY29yYXRvciB0aGF0IGp1c3QgYWRkcyB0aGUgZGVjb3JhdG9yIGdpdmVuIGFib3ZlIHRvIHRoZVxuICAgIC8vIG1lbWJlci5cbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUucnVsZSA9IGRlY29yYXRvcjtcbiAgICB9XG4gIH1cblxufVxuXG4vKlxuICogQWxsIENvbXBvc2FibGUtY3JlYXRlZCBvYmplY3RzIGtlZXAgcmVmZXJlbmNlcyB0byB0aGUgbWl4aW5zIHRoYXQgd2VyZVxuICogYXBwbGllZCB0byBjcmVhdGUgdGhlbS4gV2hlbiBhICpuYW1lZCogbWl4aW4gaXMgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlXG4gKiBjaGFpbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgKG9yLCBmb3IgYSBjbGFzcywgdGhlIGNsYXNzJyBwcm90b3R5cGUpIHdpbGxcbiAqIGhhdmUgYSBuZXcgbWVtYmVyIHdpdGggdGhhdCBuYW1lIHRoYXQgcG9pbnRzIGJhY2sgdG8gdGhlIHNhbWUgb2JqZWN0LlxuICogVGhhdCBmYWNpbGl0eSBpcyB1c2VmdWwgd2hlbiBkZWFsaW5nIHdpdGggY2hhaW5zIHRoYXQgaGF2ZSBiZWVuIGV4dGVuZGVkXG4gKiBtb3JlIHRoYW4gb25jZSwgYXMgYW4gbWl4aW4ncyBuYW1lIGlzIHN1ZmZpY2llbnQgdG8gcmV0cmlldmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoYXQgcG9pbnQgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBBIHNpbmdsZSBtaXhpbiBjYW4gYmUgYXBwbGllZCB0byBtdWx0aXBsZSBwcm90b3R5cGUgY2hhaW5zIC0tIHRoZSBuYW1lXG4gKiByZWZlcnMgdG8gdGhlIHByb3RvdHlwZSBvbiAqdGhpcyBwYXJ0aWN1bGFyIHByb3RvdHlwZSBjaGFpbiogdGhhdCB3YXMgYWRkZWRcbiAqIGZvciB0aGF0IG1peGluLiBUaGlzIGxldHMgbWl4aW4vbWl4aW4gY29kZSBnZXQgYmFjayB0byBpdHMgb3duXG4gKiBwcm90b3R5cGUsIG1vc3Qgb2Z0ZW4gaW4gY29tYmluYXRpb24gd2l0aCBcInN1cGVyXCIgKHNlZSBiZWxvdykgaW4gb3JkZXIgdG9cbiAqIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLlxuICovXG5Db21wb3NhYmxlLnByb3RvdHlwZS5Db21wb3NhYmxlID0gQ29tcG9zYWJsZS5wcm90b3R5cGU7XG5cbi8qXG4gKiBBbGwgQ29tcG9zYWJsZS1jcmVhdGVkIG9iamVjdHMgaGF2ZSBhIFwic3VwZXJcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlXG4gKiBwcm90b3R5cGUgYWJvdmUgdGhlbSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIFRoaXMgXCJzdXBlclwiIHJlZmVyZW5jZSBpcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIEVTNidzIFwic3VwZXJcIiBrZXl3b3JkIGluXG4gKiBpbiBFUzUgKG9yIHRyYW5zcGlsZWQgRVM2KSBtaXhpbnMgdGhhdCB3YW50IHRvIGludm9rZSBzdXBlcmNsYXNzIGJlaGF2aW9yLFxuICogd2hlcmUgdGhlIHNwZWNpZmljIHN1cGVyY2xhc3Mgd2lsbCBkZXBlbmQgdXBvbiB3aGljaCBtaXhpbnMgaGF2ZSBiZWVuIGFwcGxpZWRcbiAqIHRvIGEgZ2l2ZW4gcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEUuZy46XG4gKiAgIGNsYXNzIE1peGluIHtcbiAqICAgICBmb28oKSB7XG4gKiAgICAgICBpZiAodGhpcy5NaXhpbi5zdXBlci5mb28pIHtcbiAqICAgICAgICAgdGhpcy5NaXhpbi5zdXBlci5mb28uY2FsbCh0aGlzKTsgLy8gSW52b2tlIHN1cGVyY2xhc3MnIGZvbygpXG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBEbyBNaXhpbi1zcGVjaWZpYyB3b3JrIGhlcmUuLi5cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBGb3IgY29uc2lzdGVuY3ksIENvbXBvc2FibGUgaXRzZWxmIHJlY29yZHMgaXRzIG93biBzdXBlcmNsYXNzIGFzIE9iamVjdC5cbiAqL1xuQ29tcG9zYWJsZS5wcm90b3R5cGUuc3VwZXIgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBwcm9wZXJ0aWVzL21ldGhvZHMgdG8gdGhlIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIGlnbm9yZVByb3BlcnR5TmFtZXMgPSBbXSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKGlnbm9yZVByb3BlcnR5TmFtZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG4vKlxuICogUmV0dXJuIGEgbmV3IHN1YmNsYXNzL29iamVjdCB0aGF0IGV4dGVuZHMgdGhlIGdpdmVuIGJhc2UgY2xhc3Mvb2JqZWN0IHdpdGhcbiAqIHRoZSBtZW1iZXJzIG9mIHRoZSBpbmRpY2F0ZWQgbWl4aW4uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoYmFzZSwgbWl4aW4pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBtaXhpbiBhcmUgY2xhc3NlcyBvciBwbGFpbiBvYmplY3RzLlxuICBsZXQgYmFzZUlzQ2xhc3MgPSBpc0NsYXNzKGJhc2UpO1xuICBsZXQgbWl4aW5Jc0NsYXNzID0gaXNDbGFzcyhtaXhpbik7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqbWl4aW4qIGhhcyBhIGJhc2UgY2xhc3MvcHJvdG90eXBlIG9mIGl0cyBvd24uXG4gIGxldCBtaXhpbkJhc2UgPSBtaXhpbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihtaXhpbi5wcm90b3R5cGUpLmNvbnN0cnVjdG9yIDpcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YobWl4aW4pO1xuICBpZiAobWl4aW5CYXNlICYmXG4gICAgICBtaXhpbkJhc2UgIT09IEZ1bmN0aW9uICYmXG4gICAgICBtaXhpbkJhc2UgIT09IE9iamVjdCkge1xuICAgIC8vIFRoZSBtaXhpbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgbWl4aW4ncyBiYXNlIGZpcnN0LlxuICAgIGJhc2UgPSBjb21wb3NlKGJhc2UsIG1peGluQmFzZSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGV4dGVuZGVkIG9iamVjdCB3ZSdyZSBnb2luZyB0byByZXR1cm4gYXMgYSByZXN1bHQuXG4gIGxldCByZXN1bHQ7XG4gIGlmIChiYXNlSXNDbGFzcykge1xuICAgIC8vIENyZWF0ZSBhIHN1YmNsYXNzIG9mIGJhc2UuIE9uY2UgV2ViS2l0IHN1cHBvcnRzIEhUTUxFbGVtZW50IGFzIGEgcmVhbFxuICAgIC8vIGNsYXNzLCB3ZSBjYW4ganVzdCBzYXk6XG4gICAgLy9cbiAgICAvLyAgIGNsYXNzIHN1YmNsYXNzIGV4dGVuZHMgYmFzZSB7fVxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdW50aWwgdGhhdCdzIHJlc29sdmVkLCB3ZSBoYXZlIHRvIGNvbnN0cnVjdCB0aGUgY2xhc3Mgb3Vyc2VsdmVzLlxuICAgIHJlc3VsdCA9IGZ1bmN0aW9uIHN1YmNsYXNzKCkge307XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdCwgYmFzZSk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHJlc3VsdC5wcm90b3R5cGUsIGJhc2UucHJvdG90eXBlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDcmVhdGUgYSBwbGFpbiBvYmplY3QgdGhhdCBzaW1wbHkgdXNlcyB0aGUgYmFzZSBhcyBhIHByb3RvdHlwZS5cbiAgICByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICB9XG5cbiAgbGV0IHNvdXJjZTtcbiAgbGV0IHRhcmdldDtcbiAgaWYgKGJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIFByb3BlcnRpZXMgZGVmaW5lZCBieSBGdW5jdGlvbi5cbiAgICAvLyBXZSdkIHByZWZlciB0byBnZXQgYnkgaW50ZXJyb2dhdGluZyBGdW5jdGlvbiBpdHNlbGYsIGJ1dCBXZWJLaXQgZnVuY3Rpb25zXG4gICAgLy8gaGF2ZSBzb21lIHByb3BlcnRpZXMgKGFyZ3VtZW50cyBhbmQgY2FsbGVyKSB3aGljaCBhcmUgbm90IHJldHVybmVkIGJ5XG4gICAgLy8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRnVuY3Rpb24pLlxuICAgIGNvbnN0IEZVTkNUSU9OX1BST1BFUlRJRVMgPSBbXG4gICAgICAnYXJndW1lbnRzJyxcbiAgICAgICdjYWxsZXInLFxuICAgICAgJ2xlbmd0aCcsXG4gICAgICAnbmFtZScsXG4gICAgICAncHJvdG90eXBlJ1xuICAgIF07XG4gICAgLy8gRXh0ZW5kaW5nIGEgY2xhc3Mgd2l0aCBhIGNsYXNzLlxuICAgIC8vIFdlJ2xsIGNvcHkgaW5zdGFuY2UgbWVtYmVycyBpbiBhIG1vbWVudCwgYnV0IGZpcnN0IGNvcHkgc3RhdGljIG1lbWJlcnMuXG4gICAgY29weU93blByb3BlcnRpZXMobWl4aW4sIHJlc3VsdCwgRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgc291cmNlID0gbWl4aW4ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdC5wcm90b3R5cGU7XG4gIH0gZWxzZSBpZiAoIWJhc2VJc0NsYXNzICYmIG1peGluSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgY2xhc3MuXG4gICAgLy8gQ29weSBwcm90b3R5cGUgbWV0aG9kcyBkaXJlY3RseSB0byByZXN1bHQuXG4gICAgc291cmNlID0gbWl4aW4ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhbWl4aW5Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGNsYXNzIHdpdGggcGxhaW4gb2JqZWN0LlxuICAgIC8vIENvcHkgbWl4aW4gdG8gcmVzdWx0IHByb3RvdHlwZS5cbiAgICBzb3VyY2UgPSBtaXhpbjtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIHNvdXJjZSA9IG1peGluO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfVxuICBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgWydjb25zdHJ1Y3RvciddKTtcblxuICBpZiAobWl4aW4ubmFtZSkge1xuICAgIC8vIFVzZSB0aGUgbWl4aW4ncyBuYW1lICh1c3VhbGx5IHRoZSBuYW1lIG9mIGEgY2xhc3MnIGNvbnN0cnVjdG9yKSB0b1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgYmFjayB0byB0aGUgbmV3bHktY3JlYXRlZCBvYmplY3QgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICB0YXJnZXRbbWl4aW4ubmFtZV0gPSB0YXJnZXQ7XG5cbiAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlcmNsYXNzL3N1cGVyLW9iamVjdC4gU2VlIHRoZSBjb21tZW50cyBvblxuICAgIC8vIENvbXBvc2FibGUncyBcInN1cGVyXCIgcHJvcGVydHkuXG4gICAgdGFyZ2V0LnN1cGVyID0gYmFzZUlzQ2xhc3MgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2U7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBSZXR1cm4gdHJ1ZSBpZiBjIGlzIGEgSmF2YVNjcmlwdCBjbGFzcy5cbi8vIFdlIHVzZSB0aGlzIHRlc3QgYmVjYXVzZSwgb24gV2ViS2l0LCBjbGFzc2VzIGxpa2UgSFRNTEVsZW1lbnQgYXJlIHNwZWNpYWwsXG4vLyBhbmQgYXJlIG5vdCBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRvIGhhbmRsZSB0aGF0IGNhc2UsIHdlIHVzZSBhIGxvb3NlclxuLy8gZGVmaW5pdGlvbjogYW4gb2JqZWN0IGlzIGEgY2xhc3MgaWYgaXQgaGFzIGEgcHJvdG90eXBlLCBhbmQgdGhhdCBwcm90b3R5cGVcbi8vIGhhcyBhIGNvbnN0cnVjdG9yIHRoYXQgaXMgdGhlIG9yaWdpbmFsIG9iamVjdC4gVGhpcyBjb25kaXRpb24gaG9sZHMgdHJ1ZSBldmVuXG4vLyBmb3IgSFRNTEVsZW1lbnQgb24gV2ViS2l0LlxuZnVuY3Rpb24gaXNDbGFzcyhjKSB7XG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyB8fCAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBjKTsgLy8gSFRNTEVsZW1lbnQgaW4gV2ViS2l0XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zYWJsZTtcbiIsIi8qXG4gKiBFeHRlbmQgY2xhc3Nlcy9vYmplY3RzIHdpdGggb3RoZXIgY2xhc3Nlcy9vYmplY3RzLlxuICovXG5cblxuY2xhc3MgRXh0ZW5zaWJsZSB7XG5cbiAgLypcbiAgICogUmV0dXJuIGEgc3ViY2xhc3Mgb2YgdGhlIGN1cnJlbnQgY2xhc3MgdGhhdCBpbmNsdWRlcyB0aGUgbWVtYmVycyBpbmRpY2F0ZWRcbiAgICogaW4gdGhlIGFyZ3VtZW50LiBUaGUgYXJndW1lbnQgY2FuIGJlIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QsIG9yIGEgY2xhc3NcbiAgICogd2hvc2UgcHJvdG90eXBlIGNvbnRhaW5zIHRoZSBtZW1iZXJzIHRoYXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGEgY291cGxlIG9mIHB1cnBvc2VzOlxuICAgKiAxLiBFeHRlbmQgYSBjbGFzcyB3aXRoIG1peGlucy9iZWhhdmlvcnMuXG4gICAqIDIuIENyZWF0ZSBhIGNvbXBvbmVudCBjbGFzcyBpbiBFUzUuXG4gICAqXG4gICAqIFRoZSBjYWxsXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEsIEV4dGVuc2lvbjIsIEV4dGVuc2lvbjMpXG4gICAqXG4gICAqIHdpbGwgcmV0dXJuIGEgbmV3IGNsYXNzIG9mIE15QmFzZUNsYXNzIHRoYXQgaW1wbGVtZW50cyBhbGwgdGhlIG1ldGhvZHMgaW5cbiAgICogdGhlIHRocmVlIGV4dGVuc2lvbnMgZ2l2ZW4uIFRoZSBhYm92ZSBpcyBlcXVpdmFsZW50IHRvXG4gICAqXG4gICAqICAgTXlCYXNlQ2xhc3MuZXh0ZW5kKEV4dGVuc2lvbjEpLmV4dGVuZChFeHRlbnNpb24yKS5leHRlbmQoRXh0ZW5zaW9uMylcbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIHN0YXRpY2FsbHkgaW52b2tlZCB0byBleHRlbmQgcGxhaW4gb2JqZWN0czpcbiAgICpcbiAgICogICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iajEsIG9iajIpO1xuICAgKlxuICAgKi9cbiAgc3RhdGljIGV4dGVuZCguLi5leHRlbnNpb25zKSB7XG4gICAgLy8gV2UgY3JlYXRlIGEgbmV3IHN1YmNsYXNzIGZvciBlYWNoIGV4dGVuc2lvbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAvLyB0aGUgYmFzZSBjbGFzcyBleHRlbmRlZCBieSBhbnkgc3Vic2VxdWVudCBleHRlbnNpb25zLiBJdCB0dXJucyBvdXQgdGhhdFxuICAgIC8vIHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlIGN1cnJlbnRcbiAgICAvLyAob3JpZ2luYWwpIGNsYXNzIGFzIHRoZSBzZWVkIGZvciByZWR1Y2UoKS5cbiAgICByZXR1cm4gZXh0ZW5zaW9ucy5yZWR1Y2UoZXh0ZW5kLCB0aGlzKTtcbiAgfVxuXG59XG5cbi8qXG4gKiBBbGwgRXh0ZW5zaWJsZS1jcmVhdGVkIG9iamVjdHMga2VlcCByZWZlcmVuY2VzIHRvIHRoZSBleHRlbnNpb25zIHRoYXQgd2VyZVxuICogYXBwbGllZCB0byBjcmVhdGUgdGhlbS4gV2hlbiBhICpuYW1lZCogZXh0ZW5zaW9uIGlzIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZVxuICogY2hhaW4sIHRoZSByZXN1bHRpbmcgb2JqZWN0IChvciwgZm9yIGEgY2xhc3MsIHRoZSBjbGFzcycgcHJvdG90eXBlKSB3aWxsXG4gKiBoYXZlIGEgbmV3IG1lbWJlciB3aXRoIHRoYXQgbmFtZSB0aGF0IHBvaW50cyBiYWNrIHRvIHRoZSBzYW1lIG9iamVjdC5cbiAqIFRoYXQgZmFjaWxpdHkgaXMgdXNlZnVsIHdoZW4gZGVhbGluZyB3aXRoIGNoYWlucyB0aGF0IGhhdmUgYmVlbiBleHRlbmRlZFxuICogbW9yZSB0aGFuIG9uY2UsIGFzIGFuIGV4dGVuc2lvbidzIG5hbWUgaXMgc3VmZmljaWVudCB0byByZXRyaWV2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhhdCBwb2ludCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEEgc2luZ2xlIGV4dGVuc2lvbiBjYW4gYmUgYXBwbGllZCB0byBtdWx0aXBsZSBwcm90b3R5cGUgY2hhaW5zIC0tIHRoZSBuYW1lXG4gKiByZWZlcnMgdG8gdGhlIHByb3RvdHlwZSBvbiAqdGhpcyBwYXJ0aWN1bGFyIHByb3RvdHlwZSBjaGFpbiogdGhhdCB3YXMgYWRkZWRcbiAqIGZvciB0aGF0IGV4dGVuc2lvbi4gVGhpcyBsZXRzIGV4dGVuc2lvbi9taXhpbiBjb2RlIGdldCBiYWNrIHRvIGl0cyBvd25cbiAqIHByb3RvdHlwZSwgbW9zdCBvZnRlbiBpbiBjb21iaW5hdGlvbiB3aXRoIFwic3VwZXJcIiAoc2VlIGJlbG93KSBpbiBvcmRlciB0b1xuICogaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IuXG4gKi9cbkV4dGVuc2libGUucHJvdG90eXBlLkV4dGVuc2libGUgPSBFeHRlbnNpYmxlLnByb3RvdHlwZTtcblxuLypcbiAqIEFsbCBFeHRlbnNpYmxlLWNyZWF0ZWQgb2JqZWN0cyBoYXZlIGEgXCJzdXBlclwiIHByb3BlcnR5IHRoYXQgcmVmZXJlbmNlcyB0aGVcbiAqIHByb3RvdHlwZSBhYm92ZSB0aGVtIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogVGhpcyBcInN1cGVyXCIgcmVmZXJlbmNlIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgRVM2J3MgXCJzdXBlclwiIGtleXdvcmQgaW5cbiAqIGluIEVTNSAob3IgdHJhbnNwaWxlZCBFUzYpIGV4dGVuc2lvbnMvbWl4aW5zXG4gKiB0aGF0IHdhbnQgdG8gaW52b2tlIHN1cGVyY2xhc3MgYmVoYXZpb3IsIHdoZXJlIHRoZSBzcGVjaWZpYyBzdXBlcmNsYXNzIHdpbGxcbiAqIGRlcGVuZCB1cG9uIHdoaWNoIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGFwcGxpZWQgdG8gYSBnaXZlbiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogRS5nLjpcbiAqICAgY2xhc3MgTWl4aW4ge1xuICogICAgIGZvbygpIHtcbiAqICAgICAgIGlmICh0aGlzLk1peGluLnN1cGVyLmZvbykge1xuICogICAgICAgICB0aGlzLk1peGluLnN1cGVyLmZvby5jYWxsKHRoaXMpOyAvLyBJbnZva2Ugc3VwZXJjbGFzcycgZm9vKClcbiAqICAgICAgIH1cbiAqICAgICAgIC8vIERvIE1peGluLXNwZWNpZmljIHdvcmsgaGVyZS4uLlxuICogICAgIH1cbiAqICAgfVxuICpcbiAqIEZvciBjb25zaXN0ZW5jeSwgRXh0ZW5zaWJsZSBpdHNlbGYgcmVjb3JkcyBpdHMgb3duIHN1cGVyY2xhc3MgYXMgT2JqZWN0LlxuICovXG5FeHRlbnNpYmxlLnByb3RvdHlwZS5zdXBlciA9IE9iamVjdC5wcm90b3R5cGU7XG5cblxuLypcbiAqIENvcHkgdGhlIGdpdmVuIHByb3BlcnRpZXMvbWV0aG9kcyB0byB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBjb3B5T3duUHJvcGVydGllcyhzb3VyY2UsIHRhcmdldCwgaWdub3JlUHJvcGVydHlOYW1lcyA9IFtdKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaWdub3JlUHJvcGVydHlOYW1lcy5pbmRleE9mKG5hbWUpIDwgMCkge1xuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbi8qXG4gKiBSZXR1cm4gYSBuZXcgc3ViY2xhc3Mvb2JqZWN0IHRoYXQgZXh0ZW5kcyB0aGUgZ2l2ZW4gYmFzZSBjbGFzcy9vYmplY3Qgd2l0aFxuICogdGhlIG1lbWJlcnMgb2YgdGhlIGluZGljYXRlZCBleHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCBleHRlbnNpb24pIHtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBiYXNlIGFuZCBleHRlbnNpb24gYXJlIGNsYXNzZXMgb3IgcGxhaW4gb2JqZWN0cy5cbiAgbGV0IGJhc2VJc0NsYXNzID0gaXNDbGFzcyhiYXNlKTtcbiAgbGV0IGV4dGVuc2lvbklzQ2xhc3MgPSBpc0NsYXNzKGV4dGVuc2lvbik7XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSAqZXh0ZW5zaW9uKiBoYXMgYSBiYXNlIGNsYXNzL3Byb3RvdHlwZSBvZiBpdHMgb3duLlxuICBsZXQgZXh0ZW5zaW9uQmFzZSA9IGV4dGVuc2lvbklzQ2xhc3MgP1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlbnNpb24ucHJvdG90eXBlKS5jb25zdHJ1Y3RvciA6XG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVuc2lvbik7XG4gIGlmIChleHRlbnNpb25CYXNlICYmXG4gICAgICBleHRlbnNpb25CYXNlICE9PSBGdW5jdGlvbiAmJlxuICAgICAgZXh0ZW5zaW9uQmFzZSAhPT0gT2JqZWN0KSB7XG4gICAgLy8gVGhlIGV4dGVuc2lvbiBpdHNlbGYgZGVyaXZlcyBmcm9tIGFub3RoZXIgY2xhc3Mvb2JqZWN0LlxuICAgIC8vIFJlY3Vyc2UsIGFuZCBleHRlbmQgd2l0aCB0aGUgZXh0ZW5zaW9uJ3MgYmFzZSBmaXJzdC5cbiAgICBiYXNlID0gZXh0ZW5kKGJhc2UsIGV4dGVuc2lvbkJhc2UpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBleHRlbmRlZCBvYmplY3Qgd2UncmUgZ29pbmcgdG8gcmV0dXJuIGFzIGEgcmVzdWx0LlxuICBsZXQgcmVzdWx0O1xuICBpZiAoYmFzZUlzQ2xhc3MpIHtcbiAgICAvLyBDcmVhdGUgYSBzdWJjbGFzcyBvZiBiYXNlLiBPbmNlIFdlYktpdCBzdXBwb3J0cyBIVE1MRWxlbWVudCBhcyBhIHJlYWxcbiAgICAvLyBjbGFzcywgd2UgY2FuIGp1c3Qgc2F5OlxuICAgIC8vXG4gICAgLy8gICBjbGFzcyBzdWJjbGFzcyBleHRlbmRzIGJhc2Uge31cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHVudGlsIHRoYXQncyByZXNvbHZlZCwgd2UgaGF2ZSB0byBjb25zdHJ1Y3QgdGhlIGNsYXNzIG91cnNlbHZlcy5cbiAgICByZXN1bHQgPSBmdW5jdGlvbiBzdWJjbGFzcygpIHt9O1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQsIGJhc2UpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZXN1bHQucHJvdG90eXBlLCBiYXNlLnByb3RvdHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ3JlYXRlIGEgcGxhaW4gb2JqZWN0IHRoYXQgc2ltcGx5IHVzZXMgdGhlIGJhc2UgYXMgYSBwcm90b3R5cGUuXG4gICAgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcbiAgfVxuXG4gIGxldCBzb3VyY2U7XG4gIGxldCB0YXJnZXQ7XG4gIGlmIChiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gUHJvcGVydGllcyBkZWZpbmVkIGJ5IEZ1bmN0aW9uLlxuICAgIC8vIFdlJ2QgcHJlZmVyIHRvIGdldCBieSBpbnRlcnJvZ2F0aW5nIEZ1bmN0aW9uIGl0c2VsZiwgYnV0IFdlYktpdCBmdW5jdGlvbnNcbiAgICAvLyBoYXZlIHNvbWUgcHJvcGVydGllcyAoYXJndW1lbnRzIGFuZCBjYWxsZXIpIHdoaWNoIGFyZSBub3QgcmV0dXJuZWQgYnlcbiAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhGdW5jdGlvbikuXG4gICAgY29uc3QgRlVOQ1RJT05fUFJPUEVSVElFUyA9IFtcbiAgICAgICdhcmd1bWVudHMnLFxuICAgICAgJ2NhbGxlcicsXG4gICAgICAnbGVuZ3RoJyxcbiAgICAgICduYW1lJyxcbiAgICAgICdwcm90b3R5cGUnXG4gICAgXTtcbiAgICAvLyBFeHRlbmRpbmcgYSBjbGFzcyB3aXRoIGEgY2xhc3MuXG4gICAgLy8gV2UnbGwgY29weSBpbnN0YW5jZSBtZW1iZXJzIGluIGEgbW9tZW50LCBidXQgZmlyc3QgY29weSBzdGF0aWMgbWVtYmVycy5cbiAgICBjb3B5T3duUHJvcGVydGllcyhleHRlbnNpb24sIHJlc3VsdCwgRlVOQ1RJT05fUFJPUEVSVElFUyk7XG4gICAgc291cmNlID0gZXh0ZW5zaW9uLnByb3RvdHlwZTtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2UgaWYgKCFiYXNlSXNDbGFzcyAmJiBleHRlbnNpb25Jc0NsYXNzKSB7XG4gICAgLy8gRXh0ZW5kaW5nIGEgcGxhaW4gb2JqZWN0IHdpdGggYSBjbGFzcy5cbiAgICAvLyBDb3B5IHByb3RvdHlwZSBtZXRob2RzIGRpcmVjdGx5IHRvIHJlc3VsdC5cbiAgICBzb3VyY2UgPSBleHRlbnNpb24ucHJvdG90eXBlO1xuICAgIHRhcmdldCA9IHJlc3VsdDtcbiAgfSBlbHNlIGlmIChiYXNlSXNDbGFzcyAmJiAhZXh0ZW5zaW9uSXNDbGFzcykge1xuICAgIC8vIEV4dGVuZGluZyBjbGFzcyB3aXRoIHBsYWluIG9iamVjdC5cbiAgICAvLyBDb3B5IGV4dGVuc2lvbiB0byByZXN1bHQgcHJvdG90eXBlLlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbjtcbiAgICB0YXJnZXQgPSByZXN1bHQucHJvdG90eXBlO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4dGVuZGluZyBhIHBsYWluIG9iamVjdCB3aXRoIGEgcGxhaW4gb2JqZWN0LlxuICAgIHNvdXJjZSA9IGV4dGVuc2lvbjtcbiAgICB0YXJnZXQgPSByZXN1bHQ7XG4gIH1cbiAgY29weU93blByb3BlcnRpZXMoc291cmNlLCB0YXJnZXQsIFsnY29uc3RydWN0b3InXSk7XG5cbiAgaWYgKGV4dGVuc2lvbi5uYW1lKSB7XG4gICAgLy8gVXNlIHRoZSBleHRlbnNpb24ncyBuYW1lICh1c3VhbGx5IHRoZSBuYW1lIG9mIGEgY2xhc3MnIGNvbnN0cnVjdG9yKSB0b1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgYmFjayB0byB0aGUgbmV3bHktY3JlYXRlZCBvYmplY3QgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICB0YXJnZXRbZXh0ZW5zaW9uLm5hbWVdID0gdGFyZ2V0O1xuXG4gICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXJjbGFzcy9zdXBlci1vYmplY3QuIFNlZSB0aGUgY29tbWVudHMgb25cbiAgICAvLyBFeHRlbnNpYmxlJ3MgXCJzdXBlclwiIHByb3BlcnR5LlxuICAgIHRhcmdldC5zdXBlciA9IGJhc2VJc0NsYXNzID8gYmFzZS5wcm90b3R5cGUgOiBiYXNlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gUmV0dXJuIHRydWUgaWYgYyBpcyBhIEphdmFTY3JpcHQgY2xhc3MuXG4vLyBXZSB1c2UgdGhpcyB0ZXN0IGJlY2F1c2UsIG9uIFdlYktpdCwgY2xhc3NlcyBsaWtlIEhUTUxFbGVtZW50IGFyZSBzcGVjaWFsLFxuLy8gYW5kIGFyZSBub3QgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUbyBoYW5kbGUgdGhhdCBjYXNlLCB3ZSB1c2UgYSBsb29zZXJcbi8vIGRlZmluaXRpb246IGFuIG9iamVjdCBpcyBhIGNsYXNzIGlmIGl0IGhhcyBhIHByb3RvdHlwZSwgYW5kIHRoYXQgcHJvdG90eXBlXG4vLyBoYXMgYSBjb25zdHJ1Y3RvciB0aGF0IGlzIHRoZSBvcmlnaW5hbCBvYmplY3QuIFRoaXMgY29uZGl0aW9uIGhvbGRzIHRydWUgZXZlblxuLy8gZm9yIEhUTUxFbGVtZW50IG9uIFdlYktpdC5cbmZ1bmN0aW9uIGlzQ2xhc3MoYykge1xuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgfHwgICAgICAgICAgICAgICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIChjLnByb3RvdHlwZSAmJiBjLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gYyk7IC8vIEhUTUxFbGVtZW50IGluIFdlYktpdFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGU7XG4iLCIvKlxuICogTWFyc2hhbGwgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIChhbmQgZXZlbnR1YWxseSB2aWNlIHZlcnNhKS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNYXJzaGFsbGluZyB7XG5cbiAgLypcbiAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuQXR0cmlidXRlTWFyc2hhbGxpbmcuc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHRoZW4gc2V0IHRoYXRcbiAgICAvLyBwcm9wZXJ0eS4gSWdub3JlIGNoYW5nZXMgaW4gc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcy5cbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKHByb3BlcnR5TmFtZSBpbiB0aGlzICYmICEocHJvcGVydHlOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICBsZXQgYmFzZSA9IHRoaXMuQXR0cmlidXRlTWFyc2hhbGxpbmcuc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZSA9PiB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUubmFtZSwgdW5kZWZpbmVkLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuXG4vLyBDb252ZXJ0IGNhbWVsIGNhc2UgZm9vQmFyIG5hbWUgdG8gaHlwaGVuYXRlZCBmb28tYmFyLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBtID0+IG1bMV0udG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbi8vIENvbnZlcnQgaHlwaGVuYXRlZCBmb28tYmFyIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIuXG5mdW5jdGlvbiBwcm9wZXJ0eVRvQXR0cmlidXRlTmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvKFthLXpdW0EtWl0pL2csIGcgPT4gZ1swXSArICctJyArIGdbMV0udG9Mb3dlckNhc2UoKSk7XG4gIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xufVxuIiwiLypcbiAqIFBvbHltZXItc3R5bGUgYXV0b21hdGljIG5vZGUgZmluZGluZy5cbiAqIFNlZSBodHRwczovL3d3dy5wb2x5bWVyLXByb2plY3Qub3JnLzEuMC9kb2NzL2Rldmd1aWRlL2xvY2FsLWRvbS5odG1sI25vZGUtZmluZGluZy5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvbWF0aWNOb2RlRmluZGluZyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5BdXRvbWF0aWNOb2RlRmluZGluZy5zdXBlci5jcmVhdGVkQ2FsbGJhY2s7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGJhc2UuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgdGhpcy4kID0ge307XG4gICAgICB2YXIgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChub2Rlc1dpdGhJZHMsIG5vZGUgPT4ge1xuICAgICAgICB2YXIgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgdGhpcy4kW2lkXSA9IG5vZGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIiwiLypcbiAqIEEgc2FtcGxlIGdlbmVyYWwtcHVycG9zZSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBjdXN0b20gZWxlbWVudHMgdGhhdCBtaXhlc1xuICogaW4gc29tZSBjb21tb24gZmVhdHVyZXM6IHRlbXBsYXRlIHN0YW1waW5nIGludG8gYSBzaGFkb3cgcm9vdCwgYXV0b21hdGljIG5vZGVcbiAqIGZpbmRpbmcsIGFuZCBtYXJzaGFsbGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgYW5kIHByb3BlcnRpZXMuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGVFbGVtZW50IGZyb20gJy4vRXh0ZW5zaWJsZUVsZW1lbnQnO1xuaW1wb3J0IFRlbXBsYXRlU3RhbXBpbmcgZnJvbSAnLi9UZW1wbGF0ZVN0YW1waW5nJztcbmltcG9ydCBBdXRvbWF0aWNOb2RlRmluZGluZyBmcm9tICcuL0F1dG9tYXRpY05vZGVGaW5kaW5nJztcbmltcG9ydCBBdHRyaWJ1dGVNYXJzaGFsbGluZyBmcm9tICcuL0F0dHJpYnV0ZU1hcnNoYWxsaW5nJztcblxuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBFeHRlbnNpYmxlRWxlbWVudCB7XG5cbiAgLyogRm9yIGRlYnVnZ2luZyAqL1xuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbn1cblxuRWxlbWVudEJhc2UgPSBFbGVtZW50QmFzZS5leHRlbmQoXG4gIFRlbXBsYXRlU3RhbXBpbmcsIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBBdXRvbWF0aWNOb2RlRmluZGluZywgLy8gYmVmb3JlIG1hcnNoYWxsaW5nLCBzbyBtYXJzaGFsbGVkIHByb3BlcnRpZXMgY2FuIHVzZSBpdFxuICBBdHRyaWJ1dGVNYXJzaGFsbGluZ1xuKTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LWJhc2UnLCBFbGVtZW50QmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVsZW1lbnRCYXNlO1xuIiwiLypcbiAqIEFuIGV4dGVuc2libGUgSFRNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgcHJvdmlkZWQganVzdCBhcyBhIGNvbnZlbmllbmNlLiBPbmUgY291bGQgYWxzbyBzdGFydCB3aXRoXG4gKiBIVE1MRWxlbWVudCBhdCB0aGUgdG9wIGxldmVsLCBhbmQgYWRkIGV4dGVuc2liaWxpdHkgYnkgbWl4aW5nIGluIEV4dGVuc2libGUuXG4gKi9cblxuaW1wb3J0IEV4dGVuc2libGUgZnJvbSAnLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlJztcblxuLy8gV2UgdXNlIEV4dGVuc2libGUgdG8gYWRkIGl0cyBvd24gbWVtYmVycyB0byBhIEhUTUxFbGVtZW50IHN1YmNsYXNzLlxuLy8gVGhlIHJlc3VsdCBpcyBhbiBIVE1MRWxlbWVudCB3aXRoIC5leHRlbmQoKSBhbmQgc3VwZXIoKSBzdXBwb3J0LlxubGV0IEV4dGVuc2libGVFbGVtZW50ID0gRXh0ZW5zaWJsZS5leHRlbmQuY2FsbChIVE1MRWxlbWVudCwgRXh0ZW5zaWJsZSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuc2libGVFbGVtZW50O1xuIiwiLypcbiAqIEVsZW1lbnQgZXh0ZW5zaW9uIGZvciB0ZW1wbGF0ZSBzdGFtcGluZy4gSWYgYSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlXG4gKiBwcm9wZXJ0eSAoYXMgYSBzdHJpbmcgb3IgcmVmZXJlbmNpbmcgYSBIVE1MIHRlbXBsYXRlKSwgd2hlbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uIHRoZSBpbnN0YW5jZSwgYW5kXG4gKiB0aGUgY29udGVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgY2xvbmVkIGludG8gdGhlIHNoYWRvdyByb290LlxuICpcbiAqIEZvciB0aGUgdGltZSBiZWluZywgdGhpcyBleHRlbnNpb24gcmV0YWlucyBzdXBwb3J0IGZvciBTaGFkb3cgRE9NIHYwLlxuICogVGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgZGVwcmVjYXRlZCBhcyBicm93c2VycyBpbXBsZW1lbnQgU2hhZG93IERPTSB2MS5cbiAqL1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlU3RhbXBpbmcge1xuXG4gIC8qXG4gICAqIElmIHRoZSBjb21wb25lbnQgZGVmaW5lcyBhIHRlbXBsYXRlLCBhIHNoYWRvdyByb290IHdpbGwgYmUgY3JlYXRlZCBvbiB0aGVcbiAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICovXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAvLyB0aGlzLmxvZyhcImNyZWF0ZWRcIik7XG4gICAgbGV0IGJhc2UgPSB0aGlzLlRlbXBsYXRlU3RhbXBpbmcuc3VwZXIuY3JlYXRlZENhbGxiYWNrO1xuICAgIGlmIChiYXNlKSB7XG4gICAgICBiYXNlKCk7XG4gICAgfVxuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSAmJiBVU0lOR19TSEFET1dfRE9NX1YwKSB7XG4gICAgICBwb2x5ZmlsbFNsb3RXaXRoQ29udGVudCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwpIHtcbiAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIHRoaXMubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICAgICAgbGV0IHJvb3QgPSBVU0lOR19TSEFET1dfRE9NX1YwID9cbiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCkgOiAgICAgICAgICAgICAvLyBTaGFkb3cgRE9NIHYwXG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pOyAgLy8gU2hhZG93IERPTSB2MVxuICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH1cbiAgfVxuXG59XG5cblxuLy8gRmVhdHVyZSBkZXRlY3Rpb24gZm9yIG9sZCBTaGFkb3cgRE9NIHYwLlxuY29uc3QgVVNJTkdfU0hBRE9XX0RPTV9WMCA9ICh0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNyZWF0ZVNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnKTtcblxuXG4vLyBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgLy8gUkVWSUVXOiBJcyB0aGVyZSBhbiBlYXNpZXIgd2F5IHRvIGRvIHRoaXM/XG4gIC8vIFdlJ2QgbGlrZSB0byBqdXN0IHNldCBpbm5lckhUTUwgb24gdGhlIHRlbXBsYXRlIGNvbnRlbnQsIGJ1dCBzaW5jZSBpdCdzXG4gIC8vIGEgRG9jdW1lbnRGcmFnbWVudCwgdGhhdCBkb2Vzbid0IHdvcmsuXG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cbi8vIFJlcGxhY2Ugb2NjdXJlbmNlcyBvZiB2MSBzbG90IGVsZW1lbnRzIHdpdGggdjAgY29udGVudCBlbGVtZW50cy5cbi8vIFRoaXMgZG9lcyBub3QgeWV0IG1hcCBuYW1lZCBzbG90cyB0byBjb250ZW50IHNlbGVjdCBjbGF1c2VzLlxuZnVuY3Rpb24gcG9seWZpbGxTbG90V2l0aENvbnRlbnQodGVtcGxhdGUpIHtcbiAgW10uZm9yRWFjaC5jYWxsKHRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2xvdCcpLCBzbG90RWxlbWVudCA9PiB7XG4gICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpO1xuICAgIHNsb3RFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNvbnRlbnRFbGVtZW50LCBzbG90RWxlbWVudCk7XG4gIH0pO1xufVxuXG4vLyBJbnZva2UgYmFzaWMgc3R5bGUgc2hpbW1pbmcgd2l0aCBTaGFkb3dDU1MuXG5mdW5jdGlvbiBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRhZykge1xuICBXZWJDb21wb25lbnRzLlNoYWRvd0NTUy5zaGltU3R5bGluZyh0ZW1wbGF0ZS5jb250ZW50LCB0YWcpO1xufVxuIiwiaW1wb3J0IENvbXBvc2FibGUgZnJvbSBcIi4uL2V4dGVuc2libGUvQ29tcG9zYWJsZVwiO1xuXG5cbi8qIFNhbXBsZSBjbGFzc2VzIHVzZWQgYnkgdGhlIHRlc3Qgc3VpdGUgKi9cblxuLyogQSBzaW1wbGUgYmFzZSBjbGFzcyAqL1xuY2xhc3MgRXhhbXBsZUJhc2UgZXh0ZW5kcyBDb21wb3NhYmxlIHtcbiAgbWV0aG9kKCkge1xuICAgIHRoaXMuYmFzZU1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiAnRXhhbXBsZUJhc2UnO1xuICB9XG59XG5cbi8qIE1peGluIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5ICovXG5jbGFzcyBQcm9wZXJ0eU1peGluIHtcbiAgZ2V0IHByb3BlcnR5KCkge1xuICAgIHJldHVybiAndmFsdWUnO1xuICB9XG59XG5cbi8qIE1peGluIHRoYXQgZGVmaW5lcyBhIG1ldGhvZCAqL1xuY2xhc3MgTWV0aG9kTWl4aW4ge1xuICBtZXRob2QoKSB7XG4gICAgdGhpcy5taXhpbk1ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgIHJldHVybiAnTWV0aG9kTWl4aW4nO1xuICB9XG59XG5cbi8qIE1peGluIHdpdGggbWV0aG9kIHRoYXQgaW52b2tlcyBhbmQgcmV0dXJuIGJhc2UgaW1wbGVtZW50YXRpb24gaWYgcHJlc2VudCAqL1xuY2xhc3MgTWV0aG9kTWl4aW5DYWxsc1N1cGVyIHtcbiAgbWV0aG9kKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5NZXRob2RNaXhpbkNhbGxzU3VwZXIuc3VwZXIubWV0aG9kO1xuICAgIGxldCByZXN1bHQgPSBiYXNlID8gYmFzZS5jYWxsKHRoaXMpIDogJ01ldGhvZE1peGluJztcbiAgICB0aGlzLm1peGluTWV0aG9kSW52b2tlZCA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKiBNaXhpbiB0aGF0IHVzZXMgZGVjb3JhdG9yIHRvIHJlcXVlc3QgY29tcG9zaXRpb24gd2l0aCBiYXNlIGltcGxlbWVudGF0aW9uICovXG5jbGFzcyBNZXRob2RNaXhpbkNvbXBvc2VkIHtcbiAgbWV0aG9kKCkge1xuICAgIHRoaXMubWl4aW5NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gJ01ldGhvZE1peGluQ29tcG9zZWQnO1xuICB9XG59XG5Db21wb3NhYmxlLmRlY29yYXRlLmNhbGwoTWV0aG9kTWl4aW5Db21wb3NlZC5wcm90b3R5cGUsIHtcbiAgbWV0aG9kOiBDb21wb3NhYmxlLmNvbXBvc2VXaXRoQmFzZVxufSk7XG5cblxuc3VpdGUoXCJDb21wb3NhYmxlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBjbGFzcyB3aXRoIEVTNiBjbGFzcyBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgZ2V0IGJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5tZXRob2QoKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmNvbXBvc2UoKSBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2Uoe1xuICAgICAgYmFyOiB0cnVlXG4gICAgfSk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLm1ldGhvZCgpLCAnRXhhbXBsZUJhc2UnKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuYmFyLCB0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIGRlY29yYXRvcnMgYXBwbGllZCB0byBpbmRpY2F0ZWQgbWVtYmVyc1wiLCAoKSA9PiB7XG4gICAgY2xhc3MgQmFzZSBleHRlbmRzIENvbXBvc2FibGUge1xuICAgICAgbWV0aG9kKCkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRlZCA9IHRydWU7XG4gICAgfVxuICAgIEJhc2UucHJvdG90eXBlLmRlY29yYXRlKHtcbiAgICAgIG1ldGhvZDogZGVjb3JhdG9yXG4gICAgfSk7XG4gICAgYXNzZXJ0KEJhc2UucHJvdG90eXBlLm1ldGhvZC5kZWNvcmF0ZWQpO1xuICB9KVxuXG4gIHRlc3QoXCJjbGFzcyBtaXhpbiBjYW4gZGVmaW5lIGEgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoUHJvcGVydHlNaXhpbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcImNsYXNzIG1peGluIGNhbiBkZWZpbmUgYSBtZXRob2RcIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoTWV0aG9kTWl4aW4pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGxldCByZXN1bHQgPSBpbnN0YW5jZS5tZXRob2QoKTtcbiAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWV0aG9kTWl4aW4nKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UubWl4aW5NZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIG1ldGhvZCBjYW4gdXNlIHN1cGVyKCkgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoTWV0aG9kTWl4aW5DYWxsc1N1cGVyKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmJhc2VNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcInJ1bGUoKSBkZWNvcmF0b3IganVzdCByZWNvcmRzIGEgZGVjb3JhdG9yIGZvciBsYXRlciB1c2VcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgQ29tcG9zYWJsZSB7XG4gICAgICBtZXRob2QoKSB7fVxuICAgIH1cbiAgICBmdW5jdGlvbiBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHt9XG4gICAgU3ViY2xhc3MucHJvdG90eXBlLmRlY29yYXRlKHtcbiAgICAgIG1ldGhvZDogQ29tcG9zYWJsZS5ydWxlKGRlY29yYXRvcilcbiAgICB9KTtcbiAgICBhc3NlcnQuZXF1YWwoU3ViY2xhc3MucHJvdG90eXBlLm1ldGhvZC5ydWxlLCBkZWNvcmF0b3IpO1xuICB9KTtcblxuICB0ZXN0KFwibWl4aW4gY2FuIHVzZSBkZWNvcmF0b3IgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBTdWJjbGFzcyA9IEV4YW1wbGVCYXNlLmNvbXBvc2UoTWV0aG9kTWl4aW5Db21wb3NlZCk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNZXRob2RNaXhpbkNvbXBvc2VkJyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmJhc2VNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcIm11bHRpcGxlIG1peGlucyBjYW4gYmUgYXBwbGllZCBpbiBvbmUgY2FsbFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuY29tcG9zZShcbiAgICAgIFByb3BlcnR5TWl4aW4sXG4gICAgICBNZXRob2RNaXhpblxuICAgICk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgICBsZXQgcmVzdWx0ID0gaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01ldGhvZE1peGluJyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGEgcGxhaW4gb2JqZWN0XCIsICgpID0+IHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICByZXR1cm4gJ3Jlc3VsdCc7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgbWl4aW4gPSB7XG4gICAgICBwcm9wZXJ0eTogJ3ZhbHVlJ1xuICAgIH07XG4gICAgbGV0IGNvbXBvc2VkID0gQ29tcG9zYWJsZS5jb21wb3NlLmNhbGwob2JqLCBtaXhpbik7XG4gICAgYXNzZXJ0LmVxdWFsKGNvbXBvc2VkLm1ldGhvZCgpLCAncmVzdWx0Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGNvbXBvc2VkLnByb3BlcnR5LCAndmFsdWUnKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIGNhbiBoYXMgbXVsdGlwbGUgbGV2ZWxzIG9mIGluaGVyaXRhbmNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBNaXhpblN1YmNsYXNzIGV4dGVuZHMgTWV0aG9kTWl4aW4ge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICBsZXQgc3VwZXJNZXRob2QgPSB0aGlzLk1peGluU3ViY2xhc3Muc3VwZXIubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWl4aW5TdWJjbGFzc01ldGhvZEludm9rZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgU3ViY2xhc3MgPSBDb21wb3NhYmxlLmNvbXBvc2UoTWl4aW5TdWJjbGFzcyk7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgaW5zdGFuY2UubWV0aG9kKCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluTWV0aG9kSW52b2tlZCk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLm1peGluU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcIm1peGluIHByb3BlcnR5IGNhbiByZWZlcmVuY2Ugc3VwZXJjbGFzcycgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFByb3BlcnR5TWl4aW4ge1xuICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICBsZXQgc3VwZXJQcm90b3R5cGUgPSB0aGlzLlByb3BlcnR5TWl4aW4uc3VwZXI7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gc3VwZXJQcm90b3R5cGUgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvdHlwZSwgJ3Byb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZGVzY3JpcHRvcikgP1xuICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOlxuICAgICAgICAgICdQcm9wZXJ0eU1peGluJztcbiAgICAgIH1cbiAgICB9XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBDb21wb3NhYmxlIHtcbiAgICAgIGdldCBwcm9wZXJ0eSgpIHtcbiAgICAgICAgcmV0dXJuICdTdWJjbGFzcyc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuY29tcG9zZShQcm9wZXJ0eU1peGluKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBuZXcgU3ViY2xhc3MoKTtcbiAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UucHJvcGVydHksICdTdWJjbGFzcycpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgKiBhcyB0ZXN0RWxlbWVudHMgZnJvbSBcIi4vdGVzdEVsZW1lbnRzXCI7XG5cbnN1aXRlKFwiRWxlbWVudEJhc2VcIiwgKCkgPT4ge1xuXG4gIHRlc3QoXCJjb21wb25lbnQgc3RhbXBzIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIHJvb3RcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZWxlbWVudC13aXRoLXN0cmluZy10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY29tcG9uZW50IHN0YW1wcyByZWFsIHRlbXBsYXRlIGludG8gcm9vdFwiLCAoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdlbGVtZW50LXdpdGgtcmVhbC10ZW1wbGF0ZScpO1xuICAgIGFzc2VydChlbGVtZW50LnNoYWRvd1Jvb3QpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGNyZWF0ZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBFUzUtY29tcGF0aWJsZSAuZXh0ZW5kKClcIiwgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXM1LWNsYXNzLXZpYS1leHRlbmQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC5jdXN0b21Qcm9wZXJ0eSwgJ3Byb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsZW1lbnQubWV0aG9kKCksICdtZXRob2QnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxlbWVudC52YWx1ZSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJoeXBoZW5hdGVkIGF0dHJpYnV0ZSBtYXJzaGFsbGVkIHRvIGNvcnJlc3BvbmRpbmcgY2FtZWxDYXNlIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5Jyk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGVsZW1lbnQuY3VzdG9tUHJvcGVydHkpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjdXN0b20tcHJvcGVydHknLCBcIkhlbGxvXCIpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LmN1c3RvbVByb3BlcnR5LCBcIkhlbGxvXCIpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBkZWZpbmUgY3JlYXRlZENhbGxiYWNrXCIsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jcmVhdGVkLWV4dGVuc2lvbicpO1xuICAgIGFzc2VydChlbGVtZW50LmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQpO1xuICAgIGFzc2VydC5lcXVhbChlbGVtZW50LnNoYWRvd1Jvb3QudGV4dENvbnRlbnQudHJpbSgpLCBcIkhlbGxvXCIpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRXh0ZW5zaWJsZSBmcm9tIFwiLi4vZXh0ZW5zaWJsZS9FeHRlbnNpYmxlXCI7XG5cblxuLyogU2FtcGxlIGNsYXNzZXMgdXNlZCBieSB0aGUgdGVzdCBzdWl0ZSAqL1xuXG4vKiBBIHNpbXBsZSBiYXNlIGNsYXNzICovXG5jbGFzcyBFeGFtcGxlQmFzZSBleHRlbmRzIEV4dGVuc2libGUge1xuICBmb28oKSB7XG4gICAgcmV0dXJuICdFeGFtcGxlQmFzZSc7XG4gIH1cbn1cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIHByb3BlcnR5ICovXG5jbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gIGdldCBwcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxufVxuXG4vKiBFeHRlbnNpb24gdGhhdCBkZWZpbmVzIGEgbWV0aG9kICovXG5jbGFzcyBNZXRob2RFeHRlbnNpb24ge1xuICBtZXRob2QoKSB7XG4gICAgbGV0IHN1cGVyTWV0aG9kID0gdGhpcy5NZXRob2RFeHRlbnNpb24uc3VwZXIubWV0aG9kO1xuICAgIGxldCByZXN1bHQgPSBzdXBlck1ldGhvZCA/IHN1cGVyTWV0aG9kLmNhbGwodGhpcykgOiAnZXh0ZW5zaW9uIHJlc3VsdCc7XG4gICAgdGhpcy5leHRlbnNpb25NZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cblxuc3VpdGUoXCJFeHRlbnNpYmxlXCIsICgpID0+IHtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBjbGFzcyB3aXRoIEVTNiBjbGFzcyBzeW50YXhcIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgZ2V0IGJhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjYW4gZXh0ZW5kIGNsYXNzIHdpdGggRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpIHN5bnRheFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKHtcbiAgICAgIGJhcjogdHJ1ZVxuICAgIH0pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5mb28oKSwgJ0V4YW1wbGVCYXNlJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmJhciwgdHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBsZXQgU3ViY2xhc3MgPSBFeGFtcGxlQmFzZS5leHRlbmQoUHJvcGVydHlFeHRlbnNpb24pO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjbGFzcyBleHRlbnNpb24gY2FuIGRlZmluZSBhIG1ldGhvZFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIG1ldGhvZCBjYW4gdXNlIHN1cGVyKCkgdG8gaW52b2tlIGJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb25cIiwgKCkgPT4ge1xuICAgIGNsYXNzIFN1YmNsYXNzIGV4dGVuZHMgRXhhbXBsZUJhc2Uge1xuICAgICAgbWV0aG9kKCkge1xuICAgICAgICB0aGlzLmJhc2VNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICdiYXNlIHJlc3VsdCc7XG4gICAgICB9XG4gICAgfVxuICAgIFN1YmNsYXNzID0gU3ViY2xhc3MuZXh0ZW5kKE1ldGhvZEV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXNlIHJlc3VsdCcpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuYmFzZU1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwibXVsdGlwbGUgZXh0ZW5zaW9ucyBjYW4gYmUgYXBwbGllZCBpbiBvbmUgY2FsbFwiLCAoKSA9PiB7XG4gICAgbGV0IFN1YmNsYXNzID0gRXhhbXBsZUJhc2UuZXh0ZW5kKFxuICAgICAgUHJvcGVydHlFeHRlbnNpb24sXG4gICAgICBNZXRob2RFeHRlbnNpb25cbiAgICApO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5wcm9wZXJ0eSwgJ3ZhbHVlJyk7XG4gICAgbGV0IHJlc3VsdCA9IGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdleHRlbnNpb24gcmVzdWx0Jyk7XG4gICAgYXNzZXJ0KGluc3RhbmNlLmV4dGVuc2lvbk1ldGhvZEludm9rZWQpO1xuICB9KTtcblxuICB0ZXN0KFwiY2FuIGV4dGVuZCBhIHBsYWluIG9iamVjdFwiLCAoKSA9PiB7XG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIG1ldGhvZCgpIHtcbiAgICAgICAgcmV0dXJuICdyZXN1bHQnO1xuICAgICAgfVxuICAgIH07XG4gICAgbGV0IGV4dGVuc2lvbiA9IHtcbiAgICAgIHByb3BlcnR5OiAndmFsdWUnXG4gICAgfTtcbiAgICBsZXQgZXh0ZW5kZWQgPSBFeHRlbnNpYmxlLmV4dGVuZC5jYWxsKG9iaiwgZXh0ZW5zaW9uKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQubWV0aG9kKCksICdyZXN1bHQnKTtcbiAgICBhc3NlcnQuZXF1YWwoZXh0ZW5kZWQucHJvcGVydHksICd2YWx1ZScpO1xuICB9KTtcblxuICB0ZXN0KFwiZXh0ZW5zaW9uIGNhbiBoYXMgbXVsdGlwbGUgbGV2ZWxzIG9mIGluaGVyaXRhbmNlXCIsICgpID0+IHtcbiAgICBjbGFzcyBFeHRlbnNpb25TdWJjbGFzcyBleHRlbmRzIE1ldGhvZEV4dGVuc2lvbiB7XG4gICAgICBtZXRob2QoKSB7XG4gICAgICAgIGxldCBzdXBlck1ldGhvZCA9IHRoaXMuRXh0ZW5zaW9uU3ViY2xhc3Muc3VwZXIubWV0aG9kO1xuICAgICAgICBpZiAoc3VwZXJNZXRob2QpIHtcbiAgICAgICAgICBzdXBlck1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IFN1YmNsYXNzID0gRXh0ZW5zaWJsZS5leHRlbmQoRXh0ZW5zaW9uU3ViY2xhc3MpO1xuICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdWJjbGFzcygpO1xuICAgIGluc3RhbmNlLm1ldGhvZCgpO1xuICAgIGFzc2VydChpbnN0YW5jZS5leHRlbnNpb25NZXRob2RJbnZva2VkKTtcbiAgICBhc3NlcnQoaW5zdGFuY2UuZXh0ZW5zaW9uU3ViY2xhc3NNZXRob2RJbnZva2VkKTtcbiAgfSk7XG5cbiAgdGVzdChcImV4dGVuc2lvbiBwcm9wZXJ0eSBjYW4gcmVmZXJlbmNlIHN1cGVyY2xhc3MnIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBjbGFzcyBQcm9wZXJ0eUV4dGVuc2lvbiB7XG4gICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIGxldCBzdXBlclByb3RvdHlwZSA9IHRoaXMuUHJvcGVydHlFeHRlbnNpb24uc3VwZXI7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gc3VwZXJQcm90b3R5cGUgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdXBlclByb3RvdHlwZSwgJ3Byb3BlcnR5Jyk7XG4gICAgICAgIHJldHVybiAoZGVzY3JpcHRvcikgP1xuICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOlxuICAgICAgICAgICdleHRlbnNpb24gdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBTdWJjbGFzcyBleHRlbmRzIEV4dGVuc2libGUge1xuICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICByZXR1cm4gJ2Jhc2UgdmFsdWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBTdWJjbGFzcyA9IFN1YmNsYXNzLmV4dGVuZChQcm9wZXJ0eUV4dGVuc2lvbik7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IFN1YmNsYXNzKCk7XG4gICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnByb3BlcnR5LCAnYmFzZSB2YWx1ZScpO1xuICB9KTtcblxufSk7XG4iLCJpbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vc3JjL0VsZW1lbnRCYXNlJztcblxuXG4vKiBFbGVtZW50IHdpdGggYSBzaW1wbGUgdGVtcGxhdGUgKi9cbmNsYXNzIEVsZW1lbnRXaXRoU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1zdHJpbmctdGVtcGxhdGUnLCBFbGVtZW50V2l0aFN0cmluZ1RlbXBsYXRlKTtcblxuXG4vKiBFbGVtZW50IHdpdGggYSByZWFsIHRlbXBsYXRlICovXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudGVtcGxhdGUuY29udGVudC50ZXh0Q29udGVudCA9IFwiSGVsbG9cIjtcbmNsYXNzIEVsZW1lbnRXaXRoUmVhbFRlbXBsYXRlIGV4dGVuZHMgRWxlbWVudEJhc2Uge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1yZWFsLXRlbXBsYXRlJywgRWxlbWVudFdpdGhSZWFsVGVtcGxhdGUpO1xuXG5cbi8qIEVsZW1lbnQgY3JlYXRlZCB2aWEgRVM1LWNvbXBhdGlibGUgLmV4dGVuZCgpICovXG5sZXQgRXM1Q2xhc3NWaWFFeHRlbmQgPSBFbGVtZW50QmFzZS5leHRlbmQoe1xuICBnZXQgY3VzdG9tUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuICdwcm9wZXJ0eSc7XG4gIH0sXG4gIG1ldGhvZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdtZXRob2QnO1xuICB9LFxuICB2YWx1ZTogJ3ZhbHVlJ1xufSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VzNS1jbGFzcy12aWEtZXh0ZW5kJywgRXM1Q2xhc3NWaWFFeHRlbmQpO1xuXG5cbi8qIEVsZW1lbnQgd2l0aCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAqL1xuY2xhc3MgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSBleHRlbmRzIEVsZW1lbnRCYXNlIHtcbiAgZ2V0IGN1c3RvbVByb3BlcnR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jdXN0b21Qcm9wZXJ0eTtcbiAgfVxuICBzZXQgY3VzdG9tUHJvcGVydHkodmFsdWUpIHtcbiAgICB0aGlzLl9jdXN0b21Qcm9wZXJ0eSA9IHZhbHVlO1xuICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VsZW1lbnQtd2l0aC1jYW1lbC1jYXNlLXByb3BlcnR5JywgRWxlbWVudFdpdGhDYW1lbENhc2VQcm9wZXJ0eSk7XG5cblxuLyogRXh0ZW5zaW9uIHRoYXQgZGVmaW5lcyBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QuICovXG5jbGFzcyBDcmVhdGVkRXh0ZW5zaW9uIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIGxldCBiYXNlID0gdGhpcy5DcmVhdGVkRXh0ZW5zaW9uLnN1cGVyLmNyZWF0ZWRDYWxsYmFjaztcbiAgICBpZiAoYmFzZSkge1xuICAgICAgYmFzZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmV4dGVuc2lvbkNyZWF0ZWRDYWxsYmFja0ludm9rZWQgPSB0cnVlO1xuICB9XG59XG5jbGFzcyBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24gZXh0ZW5kcyBFbGVtZW50QmFzZSB7XG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJIZWxsb1wiO1xuICB9XG59XG5FbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24gPSBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24uZXh0ZW5kKENyZWF0ZWRFeHRlbnNpb24pO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdlbGVtZW50LXdpdGgtY3JlYXRlZC1leHRlbnNpb24nLCBFbGVtZW50V2l0aENyZWF0ZWRFeHRlbnNpb24pO1xuIl19
