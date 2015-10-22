/*
 * Demonstration of creation of a base class for a particular framework.
 */

import ExtensibleElement from '../../src/ExtensibleElement';
import TemplateStamping from '../../src/TemplateStamping';
import AttributeMarshalling from '../../src/AttributeMarshalling';
import XTagExtensions from './XTagExtensions';

/*
 * A framework base class can start with ExtensibleElement, and extend it with
 * just the features it wants. Here it uses two standard extension classes
 * for template stamping and attribute marshalling, and adds a custom extension
 * for some XTag-style features. By design, this omits automatic node finding,
 * just to show that it's possible to leave out extensions if that's desired.
 */
export let Element = ExtensibleElement.extend(
  TemplateStamping,
  AttributeMarshalling,
  XTagExtensions
);

/*
 * The framework can simply let people extend its base class, or provide a
 * custom constructor that extends that base class.
 */
export function register(tag, prototype) {
  let Subclass = Element.extend(prototype);
  document.registerElement(tag, Subclass);
  return Subclass;
}
