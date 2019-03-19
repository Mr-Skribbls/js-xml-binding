# js-xml-binding

> two way binding for xml and js

## Install

```sh
$ npm install --save js-xml-binding
```

## Usage

### Binding to a file
```xml
<!-- people.xml -->
<?xml version="1.0" encoding="utf-8"?>
<people xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance", xmlns:xsd="http://www.w3.org/2001/XMLSchema">
</people>
```

```js
const xmlBinding = require('js-xml-binding');
const binding = xmlBinding.bind('./people.xml');
```

### Creating elements

```js
binding.then(root => {
  const person1 = new xmlBinding.Tag('person');
  const name1 = new xmlBinding.Tag('name');
  const age1 = new xmlBinding.Attribute('age', 23);

  const person2 = new xmlBinding.Tag('person');
  const name2 = new xmlBinding.Tag('name');

  name1.setContent('Fred');
  name2.setContent('Frank');

  person1
    .addAttribute(age1)
    .addChild(name1);

  person2
    .addChild(name2);

  root
    .addChild(person1)
    .addChild(person2);
});
```
```xml
<!-- people.xml -->
<?xml version="1.0" encoding="utf-8"?>
<people xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance", xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <person age="23">
    <name>Fred</name>
  </person>
  <person>
    <name>Frank</name>
  </person>
</people>
```

### Finding an element

```js
function findPerson(tag, content) {
  return binding.then(r => {
    return r.childTags.find(person => {
      return !!person.findChild(tag, content);
    });
  });
}

findPerson('name', 'Frank').then(frank => {
  frank.addAttribute(new xmlBinding.Attribute('age', '12'));
});
```
```xml
<!-- people.xml -->
<?xml version="1.0" encoding="utf-8"?>
<people xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance", xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <person age="23">
    <name>Fred</name>
  </person>
  <person age="12">
    <name>Frank</name>
  </person>
</people>
```



## License

MIT