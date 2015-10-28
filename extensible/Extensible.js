/*
 * Extend classes/objects with other classes/objects.
 */


/*
 * A mapping of class prototypes to the corresponding extension that was used
 * to implement the extension. This is used by the super(extension, method)
 * facility that lets extension invoke superclass methods.
 *
 * NOTE: This map uses class prototypes, not classes themselves, as the keys.
 * This is done to support web components as extensible HTMLElement classes.
 * The document.createElement('custom-element') function can return an element
 * whose constructor is *not* the function passed to document.registerElement().
 * That is, element classes have a special munged constructor, and that
 * constructor can't get included in our map. We use prototypes instead, which
 * are left alone by document.registerElement().
 */
let extensionForPrototype = new Map();


class Extensible {

  /*
   * Return the prototype that's above the one that implemented the given
   * extension in the prototype chain.
   *
   * This is used in ES5-compatible extensions to invoke base property/method
   * implementations, regardless of where the extension ended up in the
   * prototype chain. This can be used by ES5 extensions or transpiled
   * ES6-to-ES5 extensions. Pure ES6 extensions can make simple use of the
   * "super" keyword instead, but that won't work in transpiled ES6-to-ES5
   * (e.g., via Babel).
   */
  // super(extension) {
  //   // TODO: Maintain this lookup in a Map instead of having to walk up the
  //   // prototype chain each time.
  //   let prototype = getPrototypeImplementingExtension(this, extension);
  //   return prototype && Object.getPrototypeOf(prototype);
  // }

  /*
   * Return a subclass of the current class that includes the members indicated
   * in the argument. The argument can be a plain JavaScript object, or a class
   * whose prototype contains the members that will be copied.
   *
   * This can be used for a couple of purposes:
   * 1. Extend a class with mixins/behaviors.
   * 2. Create a component class in ES5.
   *
   * The call
   *
   *   MyBaseClass.extend(Extension1, Extension2, Extension3)
   *
   * will return a new class of MyBaseClass that implements all the methods in
   * the three extensions given. The above is equivalent to
   *
   *   MyBaseClass.extend(Extension1).extend(Extension2).extend(Extension3)
   *
   * This method can be statically invoked to extend plain objects:
   *
   *   let extended = Extensible.extend.call(obj1, obj2);
   *
   */
  static extend(...extensions) {
    // We create a new subclass for each extension in turn. The result becomes
    // the base class extended by any subsequent extensions. It turns out that
    // we can use Array.reduce() to concisely express this, using the current
    // (original) class as the seed for reduce().
    return extensions.reduce(extend, this);
  }

}

// By default, Extensible objects inherit from Object.
Extensible.prototype.super = Object.prototype;


/*
 * Copy the given properties/methods to the target.
 */
function copyOwnProperties(source, target, ignorePropertyNames = []) {
  Object.getOwnPropertyNames(source).forEach(name => {
    if (ignorePropertyNames.indexOf(name) < 0) {
      let descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

/*
 * Return a new subclass/object that extends the given base class/object with
 * the members of the indicated extension.
 */
function extend(base, extension) {

  // Check whether the base and extension are classes or plain objects.
  let baseIsClass = (typeof base === 'function');
  let extensionIsClass = (typeof extension === 'function');

  // Check to see if the *extension* has a base class/prototype of its own.
  let extensionBase = extensionIsClass ?
    Object.getPrototypeOf(extension.prototype).constructor :
    Object.getPrototypeOf(extension);
  if (extensionBase &&
      extensionBase !== Function &&
      extensionBase !== Object) {
    // The extension itself derives from another class/object.
    // Recurse, and extend with the extension's base first.
    base = extend(base, extensionBase);
  }

  let result = baseIsClass ?
    // Extend a real class by creating a subclass.
    class subclass extends base {} :
    // Extend a plain object by creating another plain object.
    Object.create(base);

  if (baseIsClass && extensionIsClass) {
    // Extending a class with a class.
    // Copy both static and instance methods.
    copyOwnProperties(extension, result, Object.getOwnPropertyNames(Function));
    copyOwnProperties(extension.prototype, result.prototype, ['constructor']);
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    copyOwnProperties(extension.prototype, result, ['constructor']);
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    copyOwnProperties(extension, result.prototype);
  } else {
    // Extending a plain object with a plain object.
    copyOwnProperties(extension, result);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  // extensionForPrototype.set(result.prototype, extension);
  
  if (extension.name && baseIsClass) {
    result.prototype[extension.name] = result.prototype;
    result.prototype.super = base.prototype;
  }

  return result;
}

/*
 * Return the prototype for the class/object that implemented the indicated
 * extension for the given object.
 */
function getPrototypeImplementingExtension(obj, extension) {
  for (let prototype = obj; prototype !== null; prototype = Object.getPrototypeOf(prototype)) {
    if (extensionForPrototype.get(prototype) === extension) {
      return prototype;
    }
  }
  return null;
}


export default Extensible;
