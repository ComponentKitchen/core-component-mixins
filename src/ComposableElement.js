/*
 * A composable HTML element.
 *
 * This class is provided just as a convenience. One could also start with
 * HTMLElement at the top level, and add extensibility by mixing in Composable.
 */

import Composable from 'Composable/src/Composable';

// We use Extensible to add its own members to a HTMLElement subclass.
// The result is an HTMLElement with .extend() and super() support.
let ComposableElement = Composable.compose.call(HTMLElement, Composable);

export default ComposableElement;
