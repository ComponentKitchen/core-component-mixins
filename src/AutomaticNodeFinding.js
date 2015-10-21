/*
 * Polymer-style automatic node finding.
 * See https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding.
 */

class AutomaticNodeFinding {

  createdCallback() {
    this.super(AutomaticNodeFinding, 'createdCallback');
    if (this.root) {
      this.log('woohoo!');
      this.$ = {};
      var nodesWithIds = this.root.querySelectorAll('[id]');
      [].forEach.call(nodesWithIds, (node) => {
        var id = node.getAttribute('id');
        this.$[id] = node;
      });
    }
  }

}

export default AutomaticNodeFinding;
