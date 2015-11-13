import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import { foldIntoBaseTemplate } from '../../src/TemplateComposition';

class IconButton {

  get src() {
    return this.$.icon.src;
  }
  set src(value) {
    this.$.icon.src = value;
  }

  // @Composable.rule(foldIntoBaseTemplate)
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
Composable.decorate.call(IconButton.prototype, {
  template: Composable.rule(foldIntoBaseTemplate)
});

export default IconButton = SimpleButton.compose(IconButton);

document.registerElement('icon-button', IconButton);
