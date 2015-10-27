/*
 * Demonstration of creation of a base class for a hypothetical version of the
 * X-Tag framework.
 */

import Extensible from '../../extensible/Extensible';
import TemplateStamping from '../../src/TemplateStamping';
import AttributeMarshalling from '../../src/AttributeMarshalling';
import XTagExtensions from './XTagExtensions';

/*
 * A framework base class can start with HTMLElement, add in extensibility,
 * plus any other features it wants to bake in. (Alternatively, it could start
 * a common extensible HTML element class like src/ExtensibleElement.js.)
 *
  * Here, the hypothetical framework uses two standard extension classes
 * for template stamping and attribute marshalling, and adds a custom extension
 * for some XTag-style features. By design, this omits automatic node finding,
 * just to show that it's possible to leave out extensions if that's desired.
 */
export let Element = Extensible.extend(
  HTMLElement,            // the base functionality
  Extensible,             // add extensibility
  TemplateStamping,       // add shadow root creation and template support
  AttributeMarshalling,   // add marshaling of attributes to properties
  XTagExtensions          // add some X-Tag specific features like "events"
);

/*
 * The framework can simply let people extend its base class, or provide a
 * custom constructor that extends that base class.
 */
export function register(tag, prototype) {
  let mixins = prototype.mixins || []; // Support a declarative "mixins" key.
  let Subclass = Element.extend(prototype, ...mixins);
  document.registerElement(tag, Subclass);
  return Subclass;
}
