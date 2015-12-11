export default (base) => class Composable extends base {

  static compose(...mixins) {
    // We create a new subclass for each mixin in turn. The result becomes
    // the base class extended by any subsequent mixins. It turns out that
    // we can use Array.reduce() to concisely express this, using the current
    // object as the seed for reduce().
    return mixins.reduce(composeClass, this);
  }

};


// Properties defined by Object that we don't want to mixin.
const NON_MIXABLE_OBJECT_PROPERTIES = [
  'constructor'
];

/*
 * Apply the mixin to the given base class to return a new class.
 * The mixin can either be a function that returns the modified class, or a
 * plain object whose members will be copied to the new class' prototype.
 */
function composeClass(base, mixin) {
  if (typeof mixin === 'function') {
    // Mixin function
    return mixin(base);
  } else {
    // Mixin object
    class Subclass extends base {}
    copyOwnProperties(mixin, Subclass.prototype, NON_MIXABLE_OBJECT_PROPERTIES);
    return Subclass;
  }
}


/*
 * Copy the given properties/methods to the target.
 * Return the updated target.
 */
function copyOwnProperties(source, target, ignorePropertyNames = []) {
  Object.getOwnPropertyNames(source).forEach(name => {
    if (ignorePropertyNames.indexOf(name) < 0) {
      let descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}
