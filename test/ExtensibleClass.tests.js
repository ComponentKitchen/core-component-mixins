import ExtensibleClass from "../extensible/ExtensibleClass";


/* Sample classes used by the test suite */

/* A simple base class */
class ExampleBase extends ExtensibleClass {
  foo() {
    return 'ExampleBase';
  }
}

/* Extension that defines a property */
class PropertyExtension {
  get property() {
    return 'value';
  }
}

/* Extension that defines a method */
class MethodExtension {
  method() {
    let result = this.super(MethodExtension, 'method') || 'extension result';
    this.extensionMethodInvoked = true;
    return result;
  }
}


suite("ExtensibleClass", () => {

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

  test("class extension can define a property", () => {
    let Subclass = ExampleBase.extend(PropertyExtension);
    let instance = new Subclass();
    assert.equal(instance.property, 'value');
  });

  test("class extension can define a method", () => {
    let Subclass = ExampleBase.extend(MethodExtension);
    let instance = new Subclass();
    let result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

  test("extension method can use super() to invoke base class implementation", () => {
    class Subclass extends ExampleBase {
      method() {
        this.baseMethodInvoked = true;
        return 'base result';
      }
    }
    Subclass = Subclass.extend(MethodExtension);
    let instance = new Subclass();
    let result = instance.method();
    assert.equal(result, 'base result');
    assert(instance.extensionMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple extensions can be applied in one call", () => {
    let Subclass = ExampleBase.extend(
      PropertyExtension,
      MethodExtension
    );
    let instance = new Subclass();
    assert.equal(instance.property, 'value');
    let result = instance.method();
    assert.equal(result, 'extension result');
    assert(instance.extensionMethodInvoked);
  });

});
