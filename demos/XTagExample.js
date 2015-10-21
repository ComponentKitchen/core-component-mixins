/*
 * Demonstrate the use of a hypothetical XTag base class.
 */

import XTagElement from './XTagElement';

let XTagExample = XTagElement.extend({

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

});

document.registerElement('xtag-example', XTagExample);

export default XTagExample;
