let Composable = (base) => class Composable extends base {

  static compose(fn, ...rest) {
    let result = fn(this);
    return (rest.length > 0) ?
      Composable.compose.call(result, ...rest) :
      result;
  }
  
};


export default Composable;
