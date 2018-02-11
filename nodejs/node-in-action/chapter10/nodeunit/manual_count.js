exports.testPony = function (test) {
  var isPony = true;
  test.ok(isPony, 'This is not a pony');
  test.done();
  var count = 0;
  if (false) {
    test.ok(false, 'This should not have passed.');
    count++;
  }
  test.ok(true, 'This should hava passed')
  count++;
  test.equal(count, 1, 'Not all assertions triggered. ')
  test.done()
}