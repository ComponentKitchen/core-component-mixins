/* A demonstration of the TemplateComposition mixin. */


import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import { foldIntoBaseSlots } from '../../src/TemplateComposition';


class IconButton {

  get src() {
    return this.$.icon.src;
  }
  set src(value) {
    this.$.icon.src = value;
  }

  // @Composable.rule(foldIntoBaseSlots)
  get template() {
    return `
       <style>
       #icon {
         height: 0.8em;
         width: 0.8em;
       }
       </style>

       <img id='icon' src='arrow.svg'>
       <slot></slot>
    `;
  }

}
// Indicate that IconButton should have its template folded into the template
// defined by the SimpleButton base class. This effectively inserts IconButtons'
// template into the <content> slot defined by SimpleButton.
Composable.decorate.call(IconButton.prototype, {
  template: Composable.rule(foldIntoBaseSlots)
});


export default IconButton = SimpleButton.compose(IconButton);

document.registerElement('icon-button', IconButton);
