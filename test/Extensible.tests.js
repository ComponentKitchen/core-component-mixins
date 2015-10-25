import Extensible from "../extensible/Extensible";


/* Sample classes used by the test suite */

/* A simple base class */
class ExampleBase extends Extensible {
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
    let superMethod = this.super(MethodExtension).method;
    let result = superMethod ? superMethod.call(this) : 'extension result';
    this.extensionMethodInvoked = true;
    return result;
  }
}


suite("Extensible", () => {

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

  test("can extend a plain object", () => {
    let obj = {
      method() {
        return 'result';
      }
    };
    let extension = {
      property: 'value'
    };
    let extended = Extensible.extend.call(obj, extension);
    assert.equal(extended.method(), 'result');
    assert.equal(extended.property, 'value');
  });

  test("extension can has multiple levels of inheritance", () => {
    class ExtensionSubclass extends MethodExtension {
      method() {
        let superMethod = this.super(ExtensionSubclass).method;
        if (superMethod) {
          superMethod.call(this);
        }
        this.extensionSubclassMethodInvoked = true;
      }
    }
    let Subclass = Extensible.extend(ExtensionSubclass);
    let instance = new Subclass();
    instance.method();
    assert(instance.extensionMethodInvoked);
    assert(instance.extensionSubclassMethodInvoked);
  });

  test("extension property can reference superclass' property", () => {
    class PropertyExtension {
      get property() {
        let superPrototype = this.super(PropertyExtension);
        let descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
        return (descriptor) ?
          descriptor.get.call(this) :
          'extension value';
      }
    }
    class Subclass extends Extensible {
      get property() {
        return 'base value';
      }
    }
    Subclass = Subclass.extend(PropertyExtension);
    let instance = new Subclass();
    assert.equal(instance.property, 'base value');
  });

});
