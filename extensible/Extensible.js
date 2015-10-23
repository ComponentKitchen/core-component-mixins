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
 * are left along by document.registerElement().
 */
let extensionForPrototype = new Map();


class Extensible {

  /*
   * Call a superclass implementation of a method if it exists.
   *
   * This walks up the object's prototype chain in search of the given
   * extension. Then it goes up one level, and looks up the hierarchy from that
   * point to see if any superclass (object higher up the chain) implements the
   * named method. If a superclass method implementation is found, it is invoked
   * with the given arguments, and the result of that is returned.
   */
  super(extension, name, ...args) {
    let prototype = getPrototypeImplementingExtension(this, extension);
    if (prototype) {
      let superProto = Object.getPrototypeOf(prototype);
      if (superProto) {
        let descriptor = getPropertyDescriptor(superProto, name);
        if (descriptor && typeof descriptor.value === 'function') {
          return descriptor.value.apply(this, args);
        }
      }
    }
  }

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
    // We create a new subclass for each extension in turn. The result of
    // becomes the base class extended by any subsequent extensions. It turns
    // out that we can use Array.reduce() to concisely express this, using the
    // current (original) class as the seed for reduce().
    return extensions.reduce(extend, this);
  }

}


/*
 * Copy the given members to the target.
 */
function copyMembers(members, target, ignoreMembers) {
  Object.getOwnPropertyNames(members).forEach(name => {
    if (!ignoreMembers || ignoreMembers.indexOf(name) < 0) {
      let descriptor = Object.getOwnPropertyDescriptor(members, name);
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

  let result;
  if (typeof base === 'function') {
    // Extending a real class.
    class subclass extends base {}
    result = subclass;
  } else {
    // Extending a plain object.
    result = {};
    Object.setPrototypeOf(result, base);
  }

  let baseIsClass = (typeof base === 'function');
  let extensionIsClass = (typeof extension === 'function');
  if (baseIsClass && extensionIsClass) {
    // Extending a class with a class.
    // Copy both static and instance methods.
    copyMembers(extension, result, Object.getOwnPropertyNames(Function));
    copyMembers(extension.prototype, result.prototype, ['constructor']);
  } else if (!baseIsClass && extensionIsClass) {
    // Extending a plain object with a class.
    // Copy prototype methods directly to result.
    copyMembers(extension.prototype, result, ['constructor']);
  } else if (baseIsClass && !extensionIsClass) {
    // Extending class with plain object.
    // Copy extension to result prototype.
    copyMembers(extension, result.prototype);
  } else {
    // Extending a plain object with a plain object.
    copyMembers(extension, result);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(result.prototype, extension);

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

/*
 * Return a descriptor for the named property, looking up the prototype chain.
 */
function getPropertyDescriptor(prototype, name) {
  if (!prototype) {
    return null;
  }
  let descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  if (descriptor) {
    return descriptor;
  }
  let superProto = Object.getPrototypeOf(prototype);
  return getPropertyDescriptor(superProto, name);
}


export default Extensible;
