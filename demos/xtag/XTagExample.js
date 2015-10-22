/*
 * Demonstrate the use of a hypothetical XTag registration function.
 */

import * as xtag from './xtag';

xtag.register('xtag-example', {

  content: `
    <button>
      <content></content>
    </button>
  `,

  events: {
    click: () => {
      alert('Clicked');
    }
  }

});
