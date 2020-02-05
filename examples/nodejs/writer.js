//WRITER
//http://amzn.github.io/ion-docs/guides/cookbook.html
//https://amzn.github.io/ion-js/api/

let ion = require('ion-js');
let IonTypes = require('ion-js').IonTypes;

let writer = ion.makeTextWriter();
writer.stepIn(IonTypes.STRUCT);      // step into a struct
writer.writeFieldName("hello");      // set the field name for the next value to be written
writer.writeString("world");         // write the next value
writer.stepOut();                    // step out of the struct
writer.close();                      // close the writer
console.log(String.fromCharCode.apply(null, writer.getBytes()));  // prints:  {hello:"world"}


