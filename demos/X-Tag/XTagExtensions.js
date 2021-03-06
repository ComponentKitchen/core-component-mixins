/*
 * Demonstrate some hypothetical XTag-like sugar for component development.
 *
 */

export default (base) => class XTagExtensions extends base {

  /*
   * Demonstrate a very basic XTag-style system for defining event handlers in
   * a JavaScript dictionary called "events" that maps event names to handlers.
   */
  createdCallback() {
    if (super.createdCallback) { super.createdCallback(); }
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

};
