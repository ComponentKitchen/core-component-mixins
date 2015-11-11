import ElementBase from '../../src/ElementBase';

export default class SimpleButton extends ElementBase {

  get template() {
    return `
      <button>
        <slot></slot>
      </button>
    `;
  }

}

document.registerElement('simple-button', SimpleButton);
