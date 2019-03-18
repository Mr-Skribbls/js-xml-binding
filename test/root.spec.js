const assert = require('assert');
const binding = require('../index');

describe('setting root', function() {

  it('should set root', function() {
    const person = new binding.Tag('person');
    binding.setRoot(person);

    assert.ok(person.isRoot());
  });

});