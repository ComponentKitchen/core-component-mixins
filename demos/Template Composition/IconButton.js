/* A demonstration of the TemplateComposition mixin. */


import Composable from 'Composable/src/Composable';
import SimpleButton from './SimpleButton';
import { foldIntoBaseSlots } from '../../src/TemplateComposition';


export default class IconButton extends SimpleButton {

  get src() {
    return this.$.icon.src;
  }
  set src(value) {
    if ('src' in SimpleButton.prototype) { super.src = value; }
    this.$.icon.src = value;
  }

  // @Composable.rule(foldIntoBaseSlots)
  get template() {
    return foldTemplate(super.template, `
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
// Indicate that IconButton should have its template folded into the template
// defined by the SimpleButton base class. This effectively inserts IconButtons'
// template into the <content> slot defined by SimpleButton.
// Composable.decorate.call(IconButton.prototype, {
//   template: Composable.rule(foldIntoBaseSlots)
// });


// export default IconButton = SimpleButton.compose(IconButton);

document.registerElement('icon-button', IconButton);



function foldTemplate(baseTemplate, mixinTemplate) {

  mixinTemplate = makeTemplate(mixinTemplate);
  if (!baseTemplate) {
    // No folding necessary.
    return mixinTemplate;
  }

  baseTemplate = makeTemplate(baseTemplate);

  let mixinElement = mixinTemplate && mixinTemplate.content.cloneNode(true);
  let baseElement = baseTemplate && baseTemplate.content.cloneNode(true);

  let folded = document.createElement('template');

  // Fold mixin template into first slot element in base template.
  // TODO: Support named slots.
  let slotNode = baseElement.querySelector('slot');
  if (slotNode) {
    slotNode.parentNode.replaceChild(mixinElement, slotNode);
    folded.content.appendChild(baseElement);
  } else {
    // No place in base for mixin template -- throw mixin template away.
    folded.content.appendChild(baseElement);
  }

  return folded;

}


function makeTemplate(htmlOrTemplate) {
  return typeof htmlOrTemplate === 'string' ?
    createTemplateWithInnerHTML(htmlOrTemplate) :
    htmlOrTemplate;
}


// TODO: Share with TemplateStamping.
// Convert a plain string of HTML into a real template element.
function createTemplateWithInnerHTML(innerHTML) {
  let template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  let div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}
