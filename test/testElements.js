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


/* Element created via ES5-compatible .extend(). */
let Es5ClassViaExtend = ElementBase.extend({
  get foo() {
    return "Hello";
  }
});
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);


/* Element with camelCase property name. */
class ElementWithCamelCaseProperty extends ElementBase {
  get fooBar() {
    return this._fooBar;
  }
  set fooBar(value) {
    this._fooBar = value;
  }
}
document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);


// export { ElementWithStringTemplate, ElementWithRealTemplate };
