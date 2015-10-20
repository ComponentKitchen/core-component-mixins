/* Base class for defining custom elements. */

class ElementBase extends HTMLElement {

  // Handle a change to the attribute with the given name.
  attributeChangedCallback(name, oldValue, newValue) {
    this.log(`attribute ${name} changed to ${newValue}`);
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
    this.log("created");
    if (this.template) {
      createShadowRootWithTemplate(this, this.template);
    }
    marshallAttributesToProperties(this);
  }

  /*
   * Create a subclass with the given members on its prototype.
   *
   * This .extend() facility is provided solely as a means to create component
   * classes in ES5. ES6 users should use "class ... extends ElementBase".
   */
  static extend(properties) {
    class newClass extends ElementBase {}
    let prototype = Object.getPrototypeOf(newClass);
    Object.getOwnPropertyNames(properties).forEach((name) => {
      let descriptor = Object.getOwnPropertyDescriptor(properties, name);
      Object.defineProperty(prototype, name, descriptor);
    });
    newClass.prototype = prototype;
    return newClass;
  }

  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

}


// Convert camel case fooBar name to hyphenated foo-bar.
function attributeToPropertyName(attributeName) {
  let propertyName = attributeName.replace(/-([a-z])/g, (m) => m[1].toUpperCase());
  return propertyName;
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  let attributeName = propertyName.replace(/([a-z][A-Z])/g, (g) => g[0] + '-' + g[1].toLowerCase());
  return attributeName;
}

function createShadowRootWithTemplate(element, template) {
  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    template = createTemplateWithInnerHTML(template);
  }
  element.log("cloning template into shadow root");
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

document.registerElement('element-base', ElementBase);

export default ElementBase;
