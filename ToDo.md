ExtensibleClass unit tests don't depend on elements
extendClass can try:
  let subclass = function() {};
  subclass.prototype = Object.create(baseClass.prototype, members);
  subclass.prototype.constructor = subclass;
cache super prototype lookups
  let result = this.super(MethodExtension).method()
.extend(args) introduces as few classes as possible?
extensions can inherit -- need to get all properties
memoize camelCase/hyphenated name conversions
override setAttribute to avoid recursively setting property
template folding
lazy automatic node finding
XTag() constructor
move ExtensibleElement to /src
