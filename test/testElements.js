import ElementBase from "../src/ElementBase.js";

/* Element with a simple template */
class ElementWithStringTemplate extends ElementBase {

  get template() {
    return "Hello";
  }

}

document.registerElement('element-with-string-template', ElementWithStringTemplate);

export { ElementWithStringTemplate };
