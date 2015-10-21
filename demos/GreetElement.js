import ElementBase from '../src/ElementBase';

/* Define a custom element. */
class GreetElement extends ElementBase {

  /* Define a "punctuation" attribute. */
  get punctuation() {
    return this.$.punctuation.textContent;
  }
  set punctuation(value) {
    this.$.punctuation.textContent = value;
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
