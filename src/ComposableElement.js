/*
 * A composable HTML element.
 *
 * This class is provided just as a convenience. One could also start with
 * HTMLElement at the top level, and add extensibility by mixing in Composable.
 */

// import Composable from 'Composable/src/Composable';
import Composable from './Composable';


// Extend HTMLElement to create an HTMLElement with .compose() support.
export default Composable(HTMLElement);
