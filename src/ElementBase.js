/*
 * General-purpose base class for defining custom elements.
 *
 * This ElementBase class implements template stamping into a shadow root,
 * and marshalling between attributes and properties.
 */

import ExtensibleElement from '../extensible/ExtensibleElement';
import TemplateStamping from './TemplateStamping';
import AutomaticNodeFinding from './AutomaticNodeFinding';
import AttributeMarshalling from './AttributeMarshalling';

class ElementBase extends ExtensibleElement {

  /* For debugging */
  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

}

ElementBase = ElementBase.extend(
  TemplateStamping,
  AutomaticNodeFinding, // before marshalling, so marshalled properties can use it
  AttributeMarshalling
);

document.registerElement('element-base', ElementBase);

export default ElementBase;
