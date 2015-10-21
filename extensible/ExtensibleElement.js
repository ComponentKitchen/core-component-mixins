/*
 * An extensible HTML element
 */

import ExtensibleClass from './ExtensibleClass';

// We use ExtensibleClass to add its own members to a HTMLElement subclass.
// The result is an HTMLElement that with .extend() and super() support.
let ExtensibleElement = ExtensibleClass.extend.call(HTMLElement, ExtensibleClass);

export default ExtensibleElement;
