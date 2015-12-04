This example shows how a web component framework such as
[X-Tag](http://x-tag.github.io/) could *hypothetically* be constructed by
creating an extensible HTMLElement and incorporating a mixture of standard and
framework-specific extensions. That's not to say X-Tag or any framework will
actually do this, just that the extensible architecture here makes that
possible.

In this example, the hypothetical X-Tag variant adds an X-Tag specific approach
to wiring up event handlers declaratively. The resulting syntax is almost
exactly the same as what X-Tag currently supports, with the added benefit that
the core component mixins involved are shared by other frameworks, and hence
supported by a broader community.

[Live demo](http://componentkitchen.github.io/core-component-mixins/demos/X-Tag/)
