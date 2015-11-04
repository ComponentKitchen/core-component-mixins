/*
 * Marshall attributes to properties (and eventually vice versa).
 */

export default class AttributeMarshalling {

  /*
   * Handle a change to the attribute with the given name.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    let base = this.AttributeMarshalling.super.attributeChangedCallback;
    if (base) {
      base.call(this);
    }
    // If the attribute name corresponds to a property name, then set that
    // property. Ignore changes in standard HTMLElement properties.
    let propertyName = attributeToPropertyName(name);
    if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
      this[propertyName] = newValue;
    }
  }

  createdCallback() {
    let base = this.AttributeMarshalling.super.createdCallback;
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

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  let attributeName = propertyName.replace(/([a-z][A-Z])/g, g => g[0] + '-' + g[1].toLowerCase());
  return attributeName;
}
