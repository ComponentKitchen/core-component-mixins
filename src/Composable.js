export default (base) => class Composable extends base {

  static compose(...functions) {
    let result = this;
    functions.forEach(fn => result = fn(result));
    return result;
  }

};
