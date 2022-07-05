//* STREAMS

const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  //   fs.readFile('test-file.txt', (err, data) => {
  //* Solution 1
  //     if (err) console.log(err);
  //     res.end(data);
  //   });

  //* Solution 2: Streams  Con reads faster than browser can receive sent data
  //   const readable = fs.createReadStream('test-file.txt');
  //   readable.on('data', (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end('file not found');
  //   });

  //* Solution 3
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
  // readable source to pipe that can write to destination (in this ex (res))
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on Port 8000');
});
