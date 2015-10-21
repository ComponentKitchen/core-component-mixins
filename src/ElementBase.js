/*
 * General-purpose base class for defining custom elements.
 *
 * This ElementBase class implements template stamping into a shadow root,
 * and marshalling between attributes and properties.
 */

import ExtensibleElement from './ExtensibleElement';
import AutomaticNodeFinding from './AutomaticNodeFinding';
import AttributeMarshalling from './AttributeMarshalling';

class ElementBase extends ExtensibleElement {

  /*
   * Base createdCallback implementation.
   *
   * If the component defines a template, a shadow root will be created on the
   * component instance, and the template stamped into it.
   */
  createdCallback() {
    // this.log("created");
    let template = this.template;
    if (template) {
      createShadowRootWithTemplate(this, template);
    }
  }

  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

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


ElementBase = ElementBase.extend(
  AutomaticNodeFinding,
  AttributeMarshalling
);
document.registerElement('element-base', ElementBase);

export default ElementBase;
