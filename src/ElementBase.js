/* Base class for defining custom elements. */

class ElementBase extends HTMLElement {

  // Handle a change to the attribute with the given name.
  attributeChangedCallback(name, oldValue, newValue) {
    // this.log(`attribute ${name} changed to ${newValue}`);
    // If the attribute name corresponds to a property name, then set that
    // property.
    // TODO: This looks up the existence of the property each time. It would
    // be more efficient to, e.g., do a one-time computation of all properties
    // defined by the element (including base classes).
    // TODO: Ignore standard attribute name.
    let propertyName = attributeToPropertyName(name);
    if (hasProperty(this, propertyName)) {
      this[propertyName] = newValue;
    }
  }

  createdCallback() {
    // this.log("created");
    let template = this.template;
    if (template) {
      createShadowRootWithTemplate(this, template);
    }
    marshallAttributesToProperties(this);
  }

  /*
   * Return a subclass of the current class that includes the members indicated
   * in the argument. The argument can be a plain JavaScript object, or a class
   * whose prototype contains the members that will be copied.
   *
   * This can be used for a couple of purposes:
   * 1. Extend a class with a mixin/behavior.
   * 2. Create a component class in ES5.
   *
   */
  static extend(...extensions) {
    let subclass;
    let baseClass = this;
    extensions.forEach((extension) => {
      subclass = extendClass(baseClass, extension);
      baseClass = subclass;
    });
    return subclass;
  }

  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

  callBase(target, name, ...args) {
    let superProto = this.super(target);
    if (superProto) {
      let descriptor = getPropertyDescriptor(superProto, name);
      if (descriptor && typeof descriptor.value === 'function') {
        return descriptor.value.apply(this, args);
      }
    }
  }

  // Return the *prototype* for the class directly above the one that
  // implemented the indicated extension.
  super(target) {
    let members = getMembersForExtension(target);
    for (let c = this.constructor; c !== null; c = Object.getPrototypeOf(c.prototype).constructor) {
      if (c._implements === members) {
        return Object.getPrototypeOf(c.prototype);
      }
    }
    return null;
  }

}


// Convert camel case fooBar name to hyphenated foo-bar.
function attributeToPropertyName(attributeName) {
  let propertyName = attributeName.replace(/-([a-z])/g, (m) => m[1].toUpperCase());
  return propertyName;
}

function copyMembers(members, target) {
  Object.getOwnPropertyNames(members).forEach((name) => {
    if (name !== 'constructor') {
      let descriptor = Object.getOwnPropertyDescriptor(members, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

function createShadowRootWithTemplate(element, template) {
  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    template = createTemplateWithInnerHTML(template);
  }
  // element.log("cloning template into shadow root");
  element.root = element.createShadowRoot();
  let clone = document.importNode(template.content, true);
  element.root.appendChild(clone);
}

function createTemplateWithInnerHTML(innerHTML) {
  let template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  let div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}

function extendClass(baseClass, extension) {
  class subclass extends baseClass {}
  let members = getMembersForExtension(extension);
  copyMembers(members, subclass.prototype);
  // subclass.prototype.superPrototype = baseClass.prototype;
  // Remember which class was extended to create this new class so that
  // extended methods can call implementations in the super (base) class.
  subclass._implements = members;
  return subclass;
}

function getMembersForExtension(extension) {
  return typeof extension === 'function' ?
    extension.prototype :
    extension;
}

function hasProperty(obj, name) {
  if (!obj) {
    return false;
  } else if (obj.hasOwnProperty(name)) {
    return true;
  } else {
    return hasProperty(Object.getPrototypeOf(obj), name);
  }
}

function marshallAttributesToProperties(element) {
  [].forEach.call(element.attributes, (attribute) => {
    element.attributeChangedCallback(attribute.name, undefined, attribute.value);
  });
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  let attributeName = propertyName.replace(/([a-z][A-Z])/g, (g) => g[0] + '-' + g[1].toLowerCase());
  return attributeName;
}


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


document.registerElement('element-base', ElementBase);

export default ElementBase;
