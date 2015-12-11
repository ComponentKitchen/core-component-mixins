export default (base) => class Composable extends base {

  static compose(...mixins) {
    // We create a new subclass for each mixin in turn. The result becomes
    // the base class extended by any subsequent mixins. It turns out that
    // we can use Array.reduce() to concisely express this, using the current
    // object as the seed for reduce().
    return mixins.reduce(composeClass, this);
  }

};


function composeClass(base, mixin) {
  if (typeof mixin === 'function') {
    // Mixin function
    return mixin(base);
  } else {
    // Mixin object
    class Subclass extends base {}
    Object.assign(Subclass.prototype, mixin);
    return Subclass;
  }
}
