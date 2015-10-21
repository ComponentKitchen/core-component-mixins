/*
 * A class which can be extended with other classes.
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


class ExtensibleClass {

  /*
   * Call a superclass implementation of a method if it exists.
   *
   * This walks up the object's class hierarchy in search of the class that
   * implemented the given extension. Then it goes up one level, and looks up
   * the hierarchy from that point to see if any superclass implements the
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
   */
  static extend(...extensions) {
    return extensions.reduce(extendClass, this);
  }

}


/*
 * Copy the given members to the target.
 */
function copyMembers(members, target, ignoreMembers) {
  Object.getOwnPropertyNames(members).forEach((name) => {
    if (!ignoreMembers || ignoreMembers.indexOf(name) < 0) {
      let descriptor = Object.getOwnPropertyDescriptor(members, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

/*
 * Return a new subclass of the given baseclass. The new class' prototype will
 * include the members of the indicated extension.
 */
function extendClass(baseClass, extension) {

  class subclass extends baseClass {}

  if (typeof extension === 'function') {
    // Extending with a class.
    // Copy both static and instance methods.
    copyMembers(extension, subclass, Object.getOwnPropertyNames(Function));
    copyMembers(extension.prototype, subclass.prototype, ['constructor']);
  } else {
    // Extending with a plain object.
    copyMembers(extension, subclass.prototype);
  }

  // Remember which extension was used to create this new class so that extended
  // methods can call implementations in the super (base) class.
  extensionForPrototype.set(subclass.prototype, extension);

  return subclass;
}

/*
 * Return the prototype for the class that implemented the indicated extension
 * for the given object.
 *
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
 * Return a descriptor for the named property, looking up the class hierarchy.
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


export default ExtensibleClass;
