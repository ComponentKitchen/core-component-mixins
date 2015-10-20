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

  test("component can use extension to define a property", () => {
    let element = document.createElement('element-with-property-extension');
    assert.equal(element.property, 'value');
  });

  test("extension method invokes both extension's and component's implementation", () => {
    let element = document.createElement('element-with-method-extension');
    element.method();
    assert(element.extensionMethodInvoked);
    assert(element.componentMethodInvoked);
  });

  test("extension can define createdCallback", () => {
    let element = document.createElement('element-with-created-extension');
    assert(element.extensionCreatedCallbackInvoked);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  // test("component can have multiple extensions", () => {
  //   let element = document.createElement('element-with-multiple-extensions');
  //   assert(element.extensionCreatedCallbackInvoked);
  //   assert.equal(element.property, 'value');
  //   element.method();
  //   assert(element.extensionMethodInvoked);
  // });

});
