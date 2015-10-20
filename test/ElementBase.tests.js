import * as testElements from "./testElements";

suite("ElementBase", () => {

  test("component stamps string template into root", () => {
    var element = document.createElement('element-with-string-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("component stamps real template into root", () => {
    var element = document.createElement('element-with-real-template');
    assert(element.root);
    assert.equal(element.root.textContent.trim(), "Hello");
  });

  test("can create component class with ES5-compatible .extend()", () => {
    var element = document.createElement('es5-class-via-extend');
    assert.equal(element.foo, "Hello");
  });

  test("hyphenated attribute marshalled to corresponding camelCase property", () => {
    var element = document.createElement('element-with-camel-case-property');
    assert.isUndefined(element.fooBar);
    element.setAttribute('foo-bar', "Hello");
    assert.equal(element.fooBar, "Hello");
  });

});
