//READER
//http://amzn.github.io/ion-docs/guides/cookbook.html
//https://amzn.github.io/ion-js/api/

let ion = require('ion-js');
let reader = ion.makeReader('{hello: "world"}');
reader.next();                         // position the reader at the first value, a struct
reader.stepIn();                       // step into the struct
reader.next();                         // position the reader at the first value in the struct
let fieldName = reader.fieldName();    // retrieve the current value's field name
let value = reader.stringValue();      // retrieve the current value's string value
reader.stepOut();                      // step out of the struct
console.log(fieldName + ' ' + value);  // prints:  hello world
