import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import { foldIntoBaseTemplate } from '../../src/TemplateComposition';

export default class IconButton {

  // @Composable.rule(foldIntoBaseTemplate)
  get template() {
    return `
       [Icon]
       <slot></slot>
    `;
  }

}
Composable.decorate.call(IconButton.prototype, {
  template: Composable.rule(foldIntoBaseTemplate)
});

IconButton = SimpleButton.compose(IconButton);

document.registerElement('icon-button', IconButton);
