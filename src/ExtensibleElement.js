import ExtensibleClass from './ExtensibleClass';

class ExtensibleElement extends HTMLElement {}
ExtensibleElement.extend = ExtensibleClass.extend;
ExtensibleElement.prototype.super = ExtensibleClass.prototype.super;

export default ExtensibleElement;
