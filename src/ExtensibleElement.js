/*
 * An extensible HTML element
 */

import Extensible from '../extensible/Extensible';

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
let ExtensibleElement = Extensible.extend.call(HTMLElement, Extensible);

export default ExtensibleElement;
