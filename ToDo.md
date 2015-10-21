extendClass can try:
  let subclass = function() {};
  subclass.prototype = Object.create(baseClass.prototype, members);
  subclass.prototype.constructor = subclass;
.extend() copies static members too
let result = this.super(MethodExtension).method()
.extend(args) introduces as few classes as possible?
extensions can inherit -- need to get all properties
events/listeners a la X-Tag
memoize camelCase/hyphenated name conversions
override setAttribute to avoid recursively setting property
template folding
lazy automatic node finding
