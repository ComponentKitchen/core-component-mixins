import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import { foldIntoBaseTemplate } from '../../src/TemplateComposition';

export default class IconButton extends SimpleButton {

  get template() {
    return `
       [Icon]
       <slot></slot>
    `;
  }

}
IconButton.prototype.decorate({
  template: Composable.rule(foldIntoBaseTemplate)
});

document.registerElement('icon-button', IconButton);
