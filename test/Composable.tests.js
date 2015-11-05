import Composable from "../extensible/Composable";


/* Sample classes used by the test suite */

/* A simple base class */
class ExampleBase extends Composable {
  foo() {
    return 'ExampleBase';
  }
}

/* Mixin that defines a property */
class PropertyMixin {
  get property() {
    return 'value';
  }
}

/* Mixin that defines a method */
class MethodMixin {
  method() {
    let superMethod = this.MethodMixin.super.method;
    let result = superMethod ? superMethod.call(this) : 'extension result';
    this.extensionMethodInvoked = true;
    return result;
  }
}


suite("Composable", () => {

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

  test("can extend class with ES5-compatible .compose() syntax", () => {
    let Subclass = ExampleBase.compose({
      bar: true
    });
    let instance = new Subclass();
    assert.equal(instance.foo(), 'ExampleBase');
    assert.equal(instance.bar, true);
  });

  test("class extension can define a property", () => {
    let Subclass = ExampleBase.compose(PropertyMixin);
    let instance = new Subclass();
    assert.equal(instance.property, 'value');
  });

  test("class extension can define a method", () => {
    let Subclass = ExampleBase.compose(MethodMixin);
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
    Subclass = Subclass.compose(MethodMixin);
    let instance = new Subclass();
    let result = instance.method();
    assert.equal(result, 'base result');
    assert(instance.extensionMethodInvoked);
    assert(instance.baseMethodInvoked);
  });

  test("multiple extensions can be applied in one call", () => {
    let Subclass = ExampleBase.compose(
      PropertyMixin,
      MethodMixin
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
    let composed = Composable.compose.call(obj, extension);
    assert.equal(composed.method(), 'result');
    assert.equal(composed.property, 'value');
  });

  test("extension can has multiple levels of inheritance", () => {
    class MixinSubclass extends MethodMixin {
      method() {
        let superMethod = this.MixinSubclass.super.method;
        if (superMethod) {
          superMethod.call(this);
        }
        this.extensionSubclassMethodInvoked = true;
      }
    }
    let Subclass = Composable.compose(MixinSubclass);
    let instance = new Subclass();
    instance.method();
    assert(instance.extensionMethodInvoked);
    assert(instance.extensionSubclassMethodInvoked);
  });

  test("extension property can reference superclass' property", () => {
    class PropertyMixin {
      get property() {
        let superPrototype = this.PropertyMixin.super;
        let descriptor = superPrototype && Object.getOwnPropertyDescriptor(superPrototype, 'property');
        return (descriptor) ?
          descriptor.get.call(this) :
          'extension value';
      }
    }
    class Subclass extends Composable {
      get property() {
        return 'base value';
      }
    }
    Subclass = Subclass.compose(PropertyMixin);
    let instance = new Subclass();
    assert.equal(instance.property, 'base value');
  });

});
