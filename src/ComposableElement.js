/*
 * A composable HTML element.
 *
 * This class is provided just as a convenience. One could also start with
 * HTMLElement at the top level, and add extensibility by mixing in Composable.
 */

// import Composable from 'Composable/src/Composable';
import Composable from './Composable';


// We use Composable to add *itself* to a HTMLElement subclass.
// The result is an HTMLElement with .compose() support.
let ComposableElement = Composable(HTMLElement);

export default ComposableElement;
