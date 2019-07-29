const assert = require('chai').assert;
const aTest = require('../bin/helpers').aTest;

describe('#aTest', function() {
  it(`Expect to receive the string 'aTest'`, function() {
    const output = 'aTest';
    assert.strictEqual(aTest(),output);
  });
});
