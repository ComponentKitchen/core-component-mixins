/*
 * Demonstration of creation of a base class for a particular framework.
 */

import ExtensibleElement from '../src/ExtensibleElement';
import TemplateStamping from '../src/TemplateStamping';
import AttributeMarshalling from '../src/AttributeMarshalling';
import XTagEvents from './XTagEvents';

/*
 * A framework base class can start with ExtensibleElement, and extend it with
 * just the features it wants. Here it uses two standard extension classes
 * for template stamping and attribute marshalling, and adds an XTag-specific
 * extension for its handling of the "events" key.
 */
let XTagElement = ExtensibleElement.extend(
  TemplateStamping,
  AttributeMarshalling,
  XTagEvents
);

export default XTagElement;
