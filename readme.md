# js-xml-binding

> two way binding for xml and js

## Install

```sh
$ npm install --save js-xml-binding
```

## Usage

### Binding to a file
```js
const xmlBinding = require('js-xml-binding');
const binding = xmlBinding.bind('path_to_file.xml');
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
<person age="23">
  <name>Fred</name>
</person>
<person>
  <name>Frank</name>
</person>
```

### Finding an element

```js
function findPerson(property, value) {
  return usersBinding.then(r => {
    return r.childTags.find(user => {
      return !!user.findChild(property, value);
    });
  });
}

const frank = findPerson('name', 'Frank');
frank.addAttribute(new xmlBinding.Attribute('age', '12'));
```
```xml
<person age="23">
  <name>Fred</name>
</person>
<person age="12">
  <name>Frank</name>
</person>
```



## License

MIT