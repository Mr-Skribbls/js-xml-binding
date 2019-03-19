# js-xml-binding

> two way binding for xml and js

## Install

```sh
$ npm install --save js-xml-binding
```

## Usage
```js
const xmlBinding = require('js-xml-binding');

const binding = xmlBinding.bind('path_to_file.xml');

binding.then(root => {
  const person = new xmlBinding.Tag('person');
  const name = new xmlBinding.Tag('name');
  const age = new xmlBinding.Attribute('age', 23);

  name.addContent('Fred');

  person
    .addAttribute(age)
    .addChild(name);

  root.addChild(person);
});
```

```xml
<person age="23">
  <name>Fred</name>
</person>
```

## License

MIT