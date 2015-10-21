/*
 * An extensible HTML element
 */

import ExtensibleClass from './ExtensibleClass';

class ExtensibleElement extends HTMLElement {}

/*
 * It'd be nice to use ExtensibleClass itself here, but since it doesn't copy
 * over static methods yet, we extend by hand.
 */
ExtensibleElement.extend = ExtensibleClass.extend;
ExtensibleElement.prototype.super = ExtensibleClass.prototype.super;

export default ExtensibleElement;
