import ElementWithStringTemplate from "./testElements";

suite("ElementBase", () => {

  test("component stamps template into root", () => {
    var element = document.createElement('element-with-string-template');
    assert(element.root);
    assert(element.root.textContent.trim(), "Hello");
  });

  // test("template can be a string", function() {
  //   var element = document.createElement('test-template-string');
  //   assert(element.root);
  //   assert(element.root.textContent.trim(), "Hello");
  // });

});
