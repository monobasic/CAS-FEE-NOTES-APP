describe("Basic test cases", function() {
  var a;

  it("True should be true", function() {
    a = true;
    expect(a).toBe(true);
  });

  it("False shouldn't be true", function() {
    a = false;
    expect(a).toBe(!true);
  });
});
