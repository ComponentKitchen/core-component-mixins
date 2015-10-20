import * as testElements from "./testElements";

suite("ElementBase", () => {

  test("component stamps string template into root", () => {
    let element = document.createElement('element-with-string-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("component stamps real template into root", () => {
    let element = document.createElement('element-with-real-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("can create component class with ES5-compatible .extend()", () => {
    let element = document.createElement('es5-class-via-extend');
    assert.equal(element.customProperty, 'property');
    assert.equal(element.method(), 'method');
    assert.equal(element.value, 'value');
  });

  test("hyphenated attribute marshalled to corresponding camelCase property", () => {
    let element = document.createElement('element-with-camel-case-property');
    assert.isUndefined(element.customProperty);
    element.setAttribute('custom-property', "Hello");
    assert.equal(element.customProperty, "Hello");
  });

  test("element can use mixin to define a property", () => {
    let element = document.createElement('element-with-property-mixin');
    assert.equal(element.property, 'value');
  });

  test("mixin method invokes both mixin and component's implementation", () => {
    let element = document.createElement('element-with-method-mixin');
    element.method();
    assert(element.mixinMethodInvoked);
    assert(element.componentMethodInvoked);
  });

});
