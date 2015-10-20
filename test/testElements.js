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


/* Element behavior that defines a property. */
class PropertyBehavior extends ElementBase.Behavior {
  get property() {
    return 'value';
  }
}
class ElementWithPropertyBehavior extends ElementBase {}
PropertyBehavior.applyBehavior(ElementWithPropertyBehavior);
document.registerElement('element-with-property-behavior', ElementWithPropertyBehavior);


/* Behavior that defines a method. */
class MethodBehavior extends ElementBase.Behavior {
  method() {
    this.behaviorMethodInvoked = true;
  }
}
class ElementWithMethodBehavior extends ElementBase {
  method() {
    this.componentMethodInvoked = true;
  }
}
MethodBehavior.applyBehavior(ElementWithMethodBehavior);
document.registerElement('element-with-method-behavior', ElementWithMethodBehavior);


/* Behavior that defines a createdCallback method. */
class CreatedBehavior extends ElementBase.Behavior {
  createdCallback() {
    this.behaviorCreatedCallbackInvoked = true;
  }
}
class ElementWithCreatedBehavior extends ElementBase {
  get template() {
    return "Hello";
  }
}
CreatedBehavior.applyBehavior(ElementWithCreatedBehavior);
document.registerElement('element-with-created-behavior', ElementWithCreatedBehavior);
