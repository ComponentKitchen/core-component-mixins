import CompositionRules from 'Composable/src/CompositionRules';

// Given two templates, "fold" one inside the other. For now, this just entails
// putting the first inside the location of the first <content> node in the
// second template.
//
// Example: if the first (sub) template is
//
//   <template>
//     Hello, <content></content>.
//   </template>
//
// and the second (base) template is
//
//   <template>
//     <b>
//       <content></content>
//     </b>
//   </template>
//
// Then the returned folded template is
//
//   <template>
//     <b>
//       Hello, <content></content>.
//     </b>
//   </template>
//
export function foldIntoBaseTemplate(target, key, descriptor) {

  let mixinTemplate = makeTemplate(descriptor.value);
  let base = Object.getPrototypeOf(target);
  let basePropertyDescriptor = CompositionRules.getPropertyDescriptor(base, key);
  let baseTemplate = makeTemplate(basePropertyDescriptor.value);

  var subClone = mixinTemplate && mixinTemplate.content.cloneNode(true);
  var baseClone = baseTemplate && baseTemplate.content.cloneNode(true);

  var folded = document.createElement('template');

  // HACK: fold mixin template into first slot element in base template.
  var slotNode = baseClone.querySelector('slot');
  if (slotNode) {
    slotNode.parentNode.replaceChild(subClone, slotNode);
    folded.content.appendChild(baseClone);
  } else {
    // No place in base for sub template -- throw sub template away.
    folded.content.appendChild(baseClone);
  }

  descriptor.value = folded;
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
