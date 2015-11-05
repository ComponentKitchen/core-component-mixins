/*
 * A component with a style element.
 */

import ElementBase from '../src/ElementBase';

/* Define a custom element. */
export default class ElementWithStyle extends ElementBase {

  // This template is picked up by the TemplateStamping mixin.
  get template() {
    return `
      <style>
      :host {
        color: red;
      }
      </style>
      <slot></slot>
    `;
  }

}

document.registerElement('element-with-style', ElementWithStyle);
