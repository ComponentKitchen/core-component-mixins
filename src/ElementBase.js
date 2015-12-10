/*
 * A sample general-purpose base class for defining custom elements that mixes
 * in some common features: template stamping into a shadow root, automatic node
 * finding, and marshalling between attributes and properties.
 */


import ComposableElement from './ComposableElement';
import TemplateStamping from './TemplateStamping';
import AutomaticNodeFinding from './AutomaticNodeFinding';
import AttributeMarshalling from './AttributeMarshalling';


let ElementBase = ComposableElement.compose(
  TemplateStamping,     // before node finding, so shadow root is populated
  AutomaticNodeFinding, // before marshalling, so marshalled properties can use it
  AttributeMarshalling
);

// let ElementBase = AttributeMarshalling(AutomaticNodeFinding(TemplateStamping(HTMLElement)));

// {
//
//   /*
//    * Debugging utility: logs a message, prefixed by the component's tag.
//    */
//   log(text) {
//     console.log(`${this.localName}: ${text}`);
//   }
//
// }

export default ElementBase;
