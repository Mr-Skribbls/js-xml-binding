const assert = require('assert');
const binding = require('../index');

describe('creating tag', function() {

  it('should have a name', function() {
    let person = new binding.Tag('person');
    assert.ok(person.name === 'person');
  });

  it('should have attribute array', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.attributes);
    assert.strictEqual(person.attributes.length, 0);
  });

  it('should have childTags array', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.childTags);
    assert.strictEqual(person.childTags.length, 0);
  });

  it('should have content property', function() {
    const person = new binding.Tag('person');
    assert.ok(person.hasOwnProperty('content'));
    assert.strictEqual(person.content, null);
  });

  it('should have addChild method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.addChild);
    assert.ok(typeof person.addChild === 'function');
  });

  it('should have removeChild method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.removeChild);
    assert.ok(typeof person.removeChild === 'function');
  });

  it('should have addAttribute method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.addAttribute);
    assert.ok(typeof person.addAttribute === 'function');
  });

  it('should have removeAttribute method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.removeAttribute);
    assert.ok(typeof person.removeAttribute === 'function');
  });

  it('should have setContent method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.setContent);
    assert.ok(typeof person.setContent === 'function');
  });

  it('should have findChild method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.findChild);
    assert.ok(typeof person.findChild === 'function');
  });

  it('should have isRoot method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.isRoot);
    assert.ok(typeof person.isRoot === 'function');
  });

  it('should have build method', function() {
    const person = new binding.Tag('person');
    assert.ok(!!person.build);
    assert.ok(typeof person.build === 'function');
  });

});

describe('adding child', function() {

  it('should add child', function() {
    const person = new binding.Tag('person');
    const name = new binding.Tag('name');
    person.addChild(name);

    // check name was added
    assert.ok(!!person.childTags);
    assert.strictEqual(person.childTags.length, 1);
    assert.ok(person.childTags.includes(name));
  });

});

describe('removing child', function() {

  it('should remove child', function() {
    const person = new binding.Tag('person');
    const name = new binding.Tag('name');
    person.addChild(name);

    // check name was added
    assert.ok(!!person.childTags);
    assert.strictEqual(person.childTags.length, 1);
    assert.ok(person.childTags.includes(name));

    // remove name
    person.removeChild(name);

    // check name was removed
    assert.ok(!!person.childTags);
    assert.strictEqual(person.childTags.length, 0);
    assert.ok(!person.childTags.includes(name));
  });

});

describe('adding attributes', function() {
  
  it('should add attribute', function() {
    const person = new binding.Tag('person');
    const age = new binding.Attribute('age', 23);
    person.addAttribute(age);
  
    // check attribute was added
    assert.ok(!!person.attributes);
    assert.strictEqual(person.attributes.length, 1);
    assert.ok(person.attributes.includes(age));
  });

});

describe('removing attributes', function() {
  it('should remove attributes', function() {
    const person = new binding.Tag('person');
    const age = new binding.Attribute('age', 23);
    person.addAttribute(age);
  
    // check attribute was added
    assert.ok(!!person.attributes);
    assert.strictEqual(person.attributes.length, 1);
    assert.ok(person.attributes.includes(age));

    person.removeAttribute(age);

    // check attribute was removed
    assert.ok(!!person.attributes);
    assert.strictEqual(person.attributes.length, 0);
    assert.ok(!person.attributes.includes(age));
  });
});

describe('setting content', function() {

  it('should set the content', function() {
    const person = new binding.Tag('person');
    person.setContent('Joe');

    assert.strictEqual(person.content, 'Joe');
  });

});

describe('finding a child', function() {

  it('should find the child', function() {
    const person = new binding.Tag('person');
    const name = new binding.Tag('name');
    const age = new binding.Tag('age');

    name.setContent('Ralph');
    age.setContent(6);

    person.addChild(name).addChild(age);

    const maybeName = person.findChild('name', 'Ralph');
    const maybeAge = person.findChild('age', 6);

    assert.strictEqual(name, maybeName);
    assert.strictEqual(age, maybeAge);
  });

});

describe('is it root', function() {

  it('should be root', function() {
    const person = new binding.Tag('person');
    binding.setRoot(person);
    
    assert.ok(person.isRoot());
  });

  it('should not be root', function() {
    const person = new binding.Tag('person');
    const name = new binding.Tag('name');
    binding.setRoot(person);

    name.setContent('Tina');

    person.addChild(name);

    assert.ok(!name.isRoot());
  });

});

describe('building xml', function() {

  it('should build tag', function() {
    const person = new binding.Tag('person');
    const build = person.build();

    assert.strictEqual(build, '\n<person></person>');
  });

  it('should build child tag', function() {
    const person = new binding.Tag('person');
    const name = new binding.Tag('name');

    person.addChild(name);

    const build = person.build();

    assert.strictEqual(build, '\n<person>\n\t<name></name>\n</person>');
  });

  it('should build with attribute', function() {
    const person = new binding.Tag('person');
    const age = new binding.Attribute('age', 10);

    person.addAttribute(age);

    const build = person.build();

    assert.strictEqual(build, '\n<person age="10"></person>');
  });

  it('should build content', function() {
    const person = new binding.Tag('person');
    
    person.setContent('Billy');

    const build = person.build();

    assert.strictEqual(build, '\n<person>Billy</person>');
  });

});
