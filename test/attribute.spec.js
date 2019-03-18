const assert = require('assert');
const binding = require('../index');

describe('creating an attribute', function() {

  it('should have a name', function() {
    const age = new binding.Attribute('age', 25);

    assert.ok(!!age.name);
    assert.strictEqual(age.name, 'age');
  });

  it('should have a value', function() {
    const age = new binding.Attribute('age', 25);

    assert.ok(!!age.value);
    assert.strictEqual(age.value, 25);
  });

});