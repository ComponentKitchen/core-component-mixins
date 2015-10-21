import ExtensibleClass from "../extensible/ExtensibleClass";

suite("ExtensibleClass", () => {

  class ExampleBase extends ExtensibleClass {
    foo() {
      return 'ExampleBase';
    }
  }

  test("can extend class with ES6 class syntax", () => {
    class Subclass extends ExampleBase {
      get bar() {
        return true;
      }
    }
    let instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("can extend class with ES5-compatible .extend() syntax", () => {
    let Subclass = ExampleBase.extend({
      bar: true
    });
    let instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

});
