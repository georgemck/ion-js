//PRETTY PRINT
//http://amzn.github.io/ion-docs/guides/cookbook.html
//https://amzn.github.io/ion-js/api/

let ion = require('ion-js');

let unformatted = '{level1: {level2: {level3: "foo"}, x: 2}, y: [a,b,c]}';

let reader = ion.makeReader(unformatted);
let writer = ion.makePrettyWriter();
writer.writeValues(reader);
writer.close();
console.log(String.fromCharCode.apply(null, writer.getBytes()));