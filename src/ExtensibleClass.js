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
    let classFn = getClassImplementingExtension(this, extension);
    if (classFn) {
      let prototype = classFn.prototype;
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
function copyMembers(members, target) {
  Object.getOwnPropertyNames(members).forEach((name) => {
    if (name !== 'constructor') {
      let descriptor = Object.getOwnPropertyDescriptor(members, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

// Return a new subclass of the given baseclass. The new class' prototype will
// include the members of the indicated extension.
function extendClass(baseClass, extension) {
  class subclass extends baseClass {}
  let members = getMembersForExtension(extension);
  copyMembers(members, subclass.prototype);
  // Remember which class was extended to create this new class so that
  // extended methods can call implementations in the super (base) class.
  subclass._implements = members;
  return subclass;
}

// Return the class that implemented the indicated extension for the given
// object.
function getClassImplementingExtension(obj, extension) {
  let members = getMembersForExtension(extension);
  for (let classFn = obj.constructor; classFn !== null; classFn = Object.getPrototypeOf(classFn.prototype).constructor) {
    if (classFn._implements === members) {
      return classFn;
    }
  }
  return null;
}

// If the extension is a class (function), return its prototype. Otherwise,
// return the extension as is.
function getMembersForExtension(extension) {
  return typeof extension === 'function' ?
    extension.prototype :
    extension;
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
