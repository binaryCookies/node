//* 38 Modules

// Usages:
// module.exports: to export a single variable such as a class or function ex module.exports = Calculator
// exports: Multiple named variables like multiple functions then create as properties to the export object
// exports ex. for a calculator app. exports.add, exports.divide etc.

//* 39
// console.log(arguments);
// console.log(require('module').wrapper);

const C = require('./test-module-1');
//* test-moudle-1: import from test-module-1, demonstrated 2 different methods of how to export
//* module.exports example
//* Create new instance of Class Calculator and save as calc1
const calc1 = new C();
console.log(calc1.add(5, 5));

//* test-module-2 exports example file
// const calc2 = require('./test-module-2');
// console.log(calc2.add(4, 5));
//* OR import as such - must be same name as named variable in test-module-2
const { add, multiply, divide } = require('./test-module-2');
const testModule3 = require('./test-module-3');
// console.log(add(7, 30));

//* Caching, test-module-3, importing an anonymous function
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
