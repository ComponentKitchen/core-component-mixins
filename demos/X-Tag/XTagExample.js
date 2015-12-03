/*
 * Demonstrate the use of a hypothetical XTag registration function.
 *
 * Note that this syntax tried to comply with the existing X-Tag syntax as much
 * as possible.
 */


import * as xtag from './xtag';


xtag.register('xtag-example', {

  content: `
    <button>
      <content></content>
    </button>
  `,

  events: {
    click: function() {
      alert('Clicked');
    }
  }

});
