/*
 * Marshall attributes to properties (and eventually vice versa).
 */

class AttributeMarshalling {

  /*
   * Handle a change to the attribute with the given name.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    let base = this.AttributeMarshalling._super.attributeChangedCallback;
    if (base) {
      base.call(this);
    }
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
    let base = this.AttributeMarshalling._super.createdCallback;
    if (base) {
      base.call(this);
    }
    [].forEach.call(this.attributes, attribute => {
      this.attributeChangedCallback(attribute.name, undefined, attribute.value);
    });
  }

}


// Convert camel case fooBar name to hyphenated foo-bar.
function attributeToPropertyName(attributeName) {
  let propertyName = attributeName.replace(/-([a-z])/g, m => m[1].toUpperCase());
  return propertyName;
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

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  let attributeName = propertyName.replace(/([a-z][A-Z])/g, g => g[0] + '-' + g[1].toLowerCase());
  return attributeName;
}


export default AttributeMarshalling;
