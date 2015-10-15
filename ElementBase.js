/* Base class for defining custom elements. */

class ElementBase extends HTMLElement {

  createdCallback() {
    this.log("created");
    let template = this.template;
    if (template) {
      if (typeof template === 'string') {
        // Upgrade plain string to real template.
        template = createTemplateWithInnerHTML(template);
      }
      this.log("cloning template into shadow root");
      this.root = this.createShadowRoot();
      let clone = document.importNode(template.content, true);
      this.root.appendChild(clone);
    }
  }

  log(text) {
    console.log(`${this.localName}: ${text}`);
  }

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

document.registerElement('element-base', ElementBase);

export default ElementBase;
