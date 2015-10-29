/*
 * Polymer-style automatic node finding.
 * See https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding.
 */

class AutomaticNodeFinding {

  createdCallback() {
    let base = this.AutomaticNodeFinding._super.createdCallback;
    if (base) {
      base.call(this);
    }
    if (this.shadowRoot) {
      this.$ = {};
      var nodesWithIds = this.shadowRoot.querySelectorAll('[id]');
      [].forEach.call(nodesWithIds, node => {
        var id = node.getAttribute('id');
        this.$[id] = node;
      });
    }
  }

}

export default AutomaticNodeFinding;
