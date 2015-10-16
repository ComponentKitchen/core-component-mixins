import ElementBase from "../dist/ElementBase";

/* Element with a simple template */
class ElementWithStringTemplate extends ElementBase {

  get template() {
    return "Hello";
  }

}

document.registerElement('element-with-string-template', ElementWithStringTemplate);

export default ElementWithStringTemplate;
