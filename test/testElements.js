import ElementBase from "../src/ElementBase";


/* Element with a simple template */
class ElementWithStringTemplate extends ElementBase {
  get template() {
    return "Hello";
  }
}
document.registerElement('element-with-string-template', ElementWithStringTemplate);


/* Element with a real template */
let template = document.createElement('template');
template.content.textContent = "Hello";
class ElementWithRealTemplate extends ElementBase {
  get template() {
    return template;
  }
}
document.registerElement('element-with-real-template', ElementWithRealTemplate);


/* Element created via ES5-compatible .extend() */
let Es5ClassViaExtend = ElementBase.extend({
  get customProperty() {
    return 'property';
  },
  method: function() {
    return 'method';
  },
  value: 'value'
});
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);


/* Element with camelCase property name */
class ElementWithCamelCaseProperty extends ElementBase {
  get customProperty() {
    return this._customProperty;
  }
  set customProperty(value) {
    this._customProperty = value;
  }
}
document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);


/* Element extension that defines a property. */
class PropertyExtension {
  get property() {
    return 'value';
  }
}
class ElementWithPropertyExtension extends ElementBase {}
ElementWithPropertyExtension = ElementWithPropertyExtension.extend(PropertyExtension);
document.registerElement('element-with-property-extension', ElementWithPropertyExtension);


/* Extension that defines a method. */
class MethodExtension {
  method() {
    this.superPrototype.method.call(this);
    this.extensionMethodInvoked = true;
  }
}
class ElementWithMethodExtension extends ElementBase {
  method() {
    this.componentMethodInvoked = true;
  }
}
ElementWithMethodExtension = ElementWithMethodExtension.extend(MethodExtension);
document.registerElement('element-with-method-extension', ElementWithMethodExtension);


/* Extension that defines a createdCallback method. */
class CreatedExtension {
  createdCallback() {
    this.superPrototype.createdCallback.call(this);
    this.extensionCreatedCallbackInvoked = true;
  }
}
class ElementWithCreatedExtension extends ElementBase {
  get template() {
    return "Hello";
  }
}
ElementWithCreatedExtension = ElementWithCreatedExtension.extend(CreatedExtension);
document.registerElement('element-with-created-extension', ElementWithCreatedExtension);


class ElementWithMultipleExtensions extends ElementBase {}
ElementWithMultipleExtensions = ElementWithMultipleExtensions.extend(
  PropertyExtension,
  MethodExtension,
  CreatedExtension
);
document.registerElement('element-with-multiple-extensions', ElementWithMultipleExtensions);
