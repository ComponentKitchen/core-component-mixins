/*
 * An extensible HTML element.
 *
 * This class is provided just as a convenience. One could also start with
 * HTMLElement at the top level, and add extensibility by mixing in Extensible.
 */

import Extensible from '../extensible/Extensible';

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
let ExtensibleElement = Extensible.extend.call(HTMLElement, Extensible);

export default ExtensibleElement;
