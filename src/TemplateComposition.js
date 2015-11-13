import * as CompositionRules from 'Composable/src/CompositionRules';

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
export function foldIntoBaseSlots(target, key, descriptor) {

  let mixinGetter = descriptor.get;
  let mixinSetter = descriptor.set;
  let base = Object.getPrototypeOf(target);
  let baseDescriptor = CompositionRules.getPropertyDescriptor(base, key);
  let baseGetter = baseDescriptor.get;
  let baseSetter = baseDescriptor.set;

  descriptor.get = function() {

    let mixinTemplate = makeTemplate(mixinGetter.call(this));
    let baseTemplate = makeTemplate(baseGetter.call(this));
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
  };

  // TODO: Refactor wrt CompositionRules.propagateProperty().
  if (mixinGetter && !mixinSetter && baseSetter) {
    // Need to supply default setter.
    descriptor.set = function(value) {
      baseSetter.call(this, value);
    };
  } else if (mixinSetter) {
    if (!mixinGetter && baseGetter) {
      // Need to supply default getter.
      descriptor.get = function() {
        return baseGetter.call(this);
      };
    }
    // Compose setters.
    descriptor.set = composeFunction(baseSetter, mixinSetter);
  }
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
