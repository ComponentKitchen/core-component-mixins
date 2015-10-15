import ElementBase from "../src/ElementBase.js";

/* Define a custom element. */
class GreetElement extends ElementBase {

  /* Define a "punctuation" attribute. */
  get punctuation() {
    return this.root.querySelector('#punctuation').textContent;
  }
  set punctuation(value) {
    this.root.querySelector('#punctuation').textContent = value;
  }

  get template() {
    return `
      Hello,
      <content></content><span id="punctuation">.</span>
    `;
  }

}

document.registerElement('greet-element', GreetElement);

export default GreetElement;
