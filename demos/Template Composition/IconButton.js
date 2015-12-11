/* A demonstration of template composition. */


import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import composeTemplates from '../../src/composeTemplates';


export default class IconButton extends SimpleButton {

  get src() {
    return this.$.icon.src;
  }
  set src(value) {
    if ('src' in SimpleButton.prototype) { super.src = value; }
    this.$.icon.src = value;
  }

  get template() {
    return composeTemplates(super.template, `
       <style>
       #icon {
         height: 0.8em;
         width: 0.8em;
       }
       </style>

       <img id='icon' src='arrow.svg'>
       <slot></slot>
    `);
  }

}


document.registerElement('icon-button', IconButton);
