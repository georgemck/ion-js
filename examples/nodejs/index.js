//INDEX
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


//WRITER
//let ion = require('ion-js');
let IonTypes = require('ion-js').IonTypes;

let writer = ion.makeTextWriter();
writer.stepIn(IonTypes.STRUCT);      // step into a struct
writer.writeFieldName("hello");      // set the field name for the next value to be written
writer.writeString("world");         // write the next value
writer.stepOut();                    // step out of the struct
writer.close();                      // close the writer
console.log(String.fromCharCode.apply(null, writer.getBytes()));  // prints:  {hello:"world"}


