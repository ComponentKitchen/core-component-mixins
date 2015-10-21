/*
 * Demonstrate a very basic XTag-style system for defining event handlers in
 * a JavaScript dictionary called "events" that maps event names to handlers.
 */

class XTagListeners {

  createdCallback() {
    this.super(XTagListeners, 'createdCallback');
    let events = this.events || [];
    for (let name in events) {
      this.addEventListener(name, events[name]);
    }
  }

}

export default XTagListeners;
