/*
 * Demonstrate the use of XTag/Polymer style of defining event handlers in
 * a JavaScript dictionary mapping event names to handlers.
 */

import ElementBase from '../src/ElementBase';
import XTagListeners from './XTagListeners';

let ListenerTest = ElementBase.extend(
  XTagListeners,
  {
    events: {
      click: () => {
        alert('Clicked');
      }
    },

    template: `
      <button>
        <content></content>
      </button>
    `
  }
);

document.registerElement('listener-test', ListenerTest);

export default ListenerTest;
