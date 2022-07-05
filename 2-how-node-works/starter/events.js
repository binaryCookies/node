//* 35 Events in Practice (such as event emitters...)

const EventEmitter = require('events');
const http = require('http');

//* create instance of event emitter
// const myEmitter = new EventEmitter();

// Event emitters can emit named events that we can subscribe to/ listen to them and then react (similar to addEventListener in DOM)

// myEmitter.on('newSale', () => console.log('there was a new sale'));

// myEmitter.on('newSale', () => console.log('Customer name Yanal'));

// myEmitter.on('newSale', (stock) => {
//   console.log(`There are ${stock} left in stock`);
// });

// myEmitter.emit('newSale', 9);

//* --------------------- CREATE A CLASS THAT WILL INHERIT FROM THE NODE EVENT EMITTER (BEST PRACTICE) -------------

// * Sales inherits from the EventEmitter class
class Sales extends EventEmitter {
  constructor() {
    // with super we get access to all the methods of super class (Sales = parent class, EventEmitter = super class)
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('there was a new sale');
});

myEmitter.on('newSale', () => {
  console.log('Customer name Yanal');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are ${stock} left in stock`);
});

myEmitter.emit('newSale', 9);

//* /////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('request received');
  console.log(req.url);
  res.end('request received response');
});

server.on('request', (req, res) => {
  console.log('another request 😁');
});

server.on('close', () => {
  console.log('server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to port 8000');
});

// Make a request in browser in port 8000 ip 127.0.0.1
