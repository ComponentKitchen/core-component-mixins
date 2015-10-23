/*
 * Demonstrate some hypothetical XTag-like sugar for component development.
 *
 */

class XTagExtensions {

  /*
   * Demonstrate a very basic XTag-style system for defining event handlers in
   * a JavaScript dictionary called "events" that maps event names to handlers.
   */
  createdCallback() {
    let base = this.super(XTagExtensions).createdCallback;
    if (base) {
      base.call(this);
    }
    let events = this.events || [];
    for (let name in events) {
      this.addEventListener(name, events[name]);
    }
  }

  /*
   * Make "content" and "template" synonymous.
   */
  get template() {
    return this.content;
  }
  set template(value) {
    this.content = value;
  }

}

export default XTagExtensions;
