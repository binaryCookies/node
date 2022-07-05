const { log } = require('console');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const start = Date.now();
//* Change thread pool size (default is 4)
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log('Time 1 finsished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('../starter/test-file.txt', () => {
  console.log('I/O finished');
  console.log('-----------------');
  setTimeout(() => console.log('Time 2 finsished'), 0);
  setTimeout(() => console.log('Time 3 finsished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('process.nextTick'));

  //* Synchronous version
  crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
  console.log(Date.now() - start, 'password encrypted');

  crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    console.log(
      derivedKey.toString('hex'),
      Date.now() - start,
      'password encrypted',
      'Node Docs:'
    );
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'password encrypted');
  });
});
console.log('hello from top level code');

const count = 5;
// console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout

console.log(util.inspect('%s:%s', 'foo', 1, true));
