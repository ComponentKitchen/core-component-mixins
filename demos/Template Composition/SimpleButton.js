/* A simple base class that defines a template with a <content> slot. */


import ElementBase from '../../src/ElementBase';


export default class SimpleButton extends ElementBase {

  get template() {
    return `
      <style>
      button {
        font-size: inherit;
        padding: 0.25em;
      }
      </style>
      
      <button>
        <slot></slot>
      </button>
    `;
  }

}


document.registerElement('simple-button', SimpleButton);
