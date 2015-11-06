/*
 * A sample general-purpose base class for defining custom elements that mixes
 * in some common features: template stamping into a shadow root, automatic node
 * finding, and marshalling between attributes and properties.
 */

import ComposableElement from './ComposableElement';
import TemplateStamping from './TemplateStamping';
import AutomaticNodeFinding from './AutomaticNodeFinding';
import AttributeMarshalling from './AttributeMarshalling';

class ElementBase extends ComposableElement {

  /* For debugging */
  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

}

export default ElementBase = ElementBase.compose(
  TemplateStamping, // before node finding, so shadow root is populated
  AutomaticNodeFinding, // before marshalling, so marshalled properties can use it
  AttributeMarshalling
);

document.registerElement('element-base', ElementBase);
