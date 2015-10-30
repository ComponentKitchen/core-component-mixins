/*
 * Element extension for template stamping. If a component defines a template
 * property (as a string or referencing a HTML template), when the component
 * class is instantiated, a shadow root will be created on the instance, and
 * the contents of the template will be cloned into the shadow root.
 */


class TemplateStamping {

  /*
   * If the component defines a template, a shadow root will be created on the
   * component instance, and the template stamped into it.
   */
  createdCallback() {
    // this.log("created");
    let base = this.TemplateStamping.super.createdCallback;
    if (base) {
      base();
    }
    let template = this.template;
    if (typeof template === 'string') {
      // Upgrade plain string to real template.
      template = createTemplateWithInnerHTML(template);
    }
    if (template) {
      // this.log("cloning template into shadow root");
      let root = this.createShadowRoot();
      let clone = document.importNode(template.content, true);
      root.appendChild(clone);
    }
  }

}


/*
 * Convert a plain string of HTML into a real template element.
 */
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

export default TemplateStamping;
