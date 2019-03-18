const fs = require('fs');

/**
 * procrastinate running a function
 * @param {Function} fn function to run when time runs out
 * @param {Function} triggerFn if returns true fn will run
 * @param {Number} time time before fn execution
 * @param {Boolean} repeat should repeat
 */
function doWhen(fn, triggerFn, time, repeat) {
  repeat = repeat || false;
  let loop = repeat ? setInterval : setTimeout;
  let clear = repeat ? clearInterval: clearTimeout;

  let l = loop(() => {
    if(triggerFn()) fn();
    else {
      clear(l);
      doWhen(fn, triggerFn, time, triggerFn);
    }
  }, time);
};

/**
 * the xml root element
 */
let Root = null;
exports.Root = Root;

/**
 * xml file this is bound to
 */
let boundFile = null;

/**
 * has a change happened
 */
let change = false;

/**
 * xml version
 */
let version = null;
let encoding = 'utf-8';

let namespaces = [];

function Namespace(name, prefix, value) {
  this.name = name;
  this.prefix = prefix;
  this.value = value;
}

/**
 * xml tag in js form
 */
exports.Tag = Tag;

function Tag(name) {
  this.name = name;
  this.attributes = [];
  this.childTags = [];
  this.content = null;
};

Tag.prototype = {
  /**
   * adds a child element
   * @param {Tag} tag the tag to add
   */
  addChild: function addChild(tag) {
    this.childTags.push(tag);
    //isPartOfRoot.call(this);
    change = true;
    return this;
  },

  /**
   * removes a child element
   * @param {Tag} tag the tag to remove
   */
  removeChild: function removeChild(tag) {
    let idx = this.childTags.indexOf(tag);
    this.childTags.splice(idx, 1);
    //isPartOfRoot.call(this);
    change = true;
    return this;
  },

  /**
   * adds an attribute to the element
   * @param {Attribute} attribute the attribute to add
   */
  addAttribute: function addAttribute(attribute) {
    this.attributes.push(attribute);

    change = true;
    return this;
  },

  /**
   * removes an attribute from the element
   * @param {Attribute} attribute attribute to remove
   */
  removeAttribute: function removeAttribute(attribute) {
    let idx = this.attributes.indexOf(attribute);
    this.attributes.splice(idx, 1);
    change = true;
    return this;
  },

  setContent: function setContent(content) {
    this.content = content;
    change = true;
    return this;
  },

  findChild: function findChild(name, value) {
    return this.childTags.find(t => {
      return t.name === name && ((value) ? t.content === value : true);
    });
  },

  isRoot: function isRoot() {
    return this === Root;
  },

  build: function build(formatLvl) {
    formatLvl = formatLvl || 0;
    let t = '\n'; // this represents the tag
    indent();
    let openT = '<' + this.name;
    let closeT = '</' + this.name + '>';

    // add namespace if root
    if(this.isRoot()) {
      openT += namespaceStrings();
    }

    // add attributes
    this.attributes.forEach(a => openT += ' ' + a.name + '="' + a.value + '"');

    // close opening tag
    openT += '>';

    t += openT;

    // add content
    t += (this.content) ? this.content : '';

    // add child tags
    if(this.childTags.length > 0) {
      this.childTags.forEach(ct => {
        t += ct.build(formatLvl + 1);
      });
      t += '\n';
      indent();
    }
    

    t += closeT;

    return t;

    function indent() {
      for(let i = 0; i < formatLvl; i++) { // create indent for each format level
        t += '\t';
      }
    }
  }
};

/**
 * xml attribute in js form
 */
exports.Attribute = Attribute;

function Attribute(name, value) {
  this.name = name;
  this.value = value;
};

/**
 * set the root element
 */
exports.setRoot = function(tag) {
  Root = tag;
};

/**
 * bind a file
 */
exports.bind = function(file) {
  boundFile = file;

  doWhen(() => {
    xml();
    change = false;
  }, () => {
    return change;
  }, 1000, true);

  return parse();
};

function isPartOfRoot(root) {
  root = root || Root;
  if(root === this) return true;
  for(let i = 0; i < root.childTags.length; i++) {
    if(isPartOfRoot(root.childTags[i])) {
      return true;
    }
  }
}

/**
 * parses bound xml file to js
 */
function parse() {
  if(!boundFile) return;

  namespaces = [];

  let p = new Promise((res, rej) => {
    fs.readFile(boundFile, encoding.replace('-', ''), (err, data) => {
      if(err) {
        rej(err);
      } 
  
      let parts = data.replace(/<\//gi, '></').split('>').map(p => p.trim()).filter(p => p.length > 0);
  
      if(parts[0].startsWith('<?xml')) {
        parseXmlTag(parts[0].split(' '));
        parseRoot(parts.slice(1));
      } else {
        parseRoot(parts);
      }

      res(Root);
    });
  });
  
  return p;
};

function parseXmlTag(xmlTag) {
  // get the version
  version = getStrBetween(xmlTag.find(a => a.startsWith('version')), '"');

  // get the encoding
  encoding = getStrBetween(xmlTag.find(a => a.startsWith('encoding')), '"');
}

function parseRoot(parts) {
  
  Root = splitPart(parts[0]);
  removePartsLayer(parts);
  parseContent(parts, Root);

  function parseContent(parts, tag) {
    if(!parts || parts.length < 1) return;
    if(parts[0].startsWith('<')) { // first part is a tag
      let t = splitPart(parts[0], tag);
      let rest = removePartsLayer(parts);
      if(tag) {
        tag.childTags.push(t);
        parseContent(parts, t);
        if(rest.length > 0) {
          parseContent(rest, tag);
        }
      }
    } else {
      tag.content = parts[0];
    }
  }


  function removePartsLayer(parts) {
    let tagname = parts[0].split(' ')[0].replace('<', '');
    let closeIdx = findCloseIndex(tagname, parts);

    let rest = parts.splice(-(parts.length-closeIdx), parts.length-closeIdx);

    parts.shift();
    rest.shift();
    
    return rest;
  }

  function findCloseIndex(tagname, parts) {
    return parts.indexOf(parts.find(p => {
      return p.startsWith('</' + tagname);
    }));
  }

  /**
   * returns a tag from the xml part
   * if the part is content will add the content to the Tag passed
   * @param {string} part xml part
   * @param {Tag} tag 
   */
  function splitPart(part, tag) {
    if(part.startsWith('<')) { // this is a tag level item
      let a = part.split(' '); // split the part in to tag name namespaces and attributes

      let t = new Tag(a[0].replace('<', '')); // create the Tag
      a = a.slice(1); // remove the tag name from a

      a.forEach(b => { // for namespaces and attributes
        let name, prefix, value;
        if(b.startsWith('xmlns')) { // if its a namespace
          // add the namespace to the namespace
          let c = b.split('=');
          name = c[0].split(':')[0];
          prefix = c[0].split(':')[1];
          value = getStrBetween(c[1], '"');

          namespaces.push(new Namespace(name, prefix, value));
        } else {
          // add the attribute to the Tag attributes
          let c = b.split('=');
          t.attributes.push(new Attribute(c[0], getStrBetween(c[1], '"')));
        }
      });
      return t;
    }
  }
}

/**
 * parse js to xml
 */
function xml() {
  if(!Root || !boundFile) return;

  const v = versionTag();

  let xml = v + Root.build();

  //write to file
  fs.writeFile(boundFile, xml, 'utf8', err => {
    if(err) return console.log(err);
  });
};

/**
 * returns xml version tag
 */
function versionTag() {
  return '<?xml version="' + version + '" encoding="utf-8"?>';
}

/**
 * creates namespace for the xml
 */
function namespaceStrings() {
  return namespaces.map(ns => {
    let p = ns.prefix ? ':' + ns.prefix : null;
    return ' ' + ns.name + p + '="' + ns.value + '"';
  });

  // prefix = namespacePrefix ? ':' + namespacePrefix : null;
  // return 'xmlns' + prefix + '="' + namespace + '"';
}

/**
 * extract the value between "..."
 * @param {string} str 
 */
function getStrBetween(str, between) {
  let idx = str.indexOf(between);
  str = str.slice(idx+1);
  idx = str.indexOf(between);
  str = str.slice(0, -(str.length - idx));

  return str;
}