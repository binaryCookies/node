const fs = require('fs');
const { log } = require('console');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

// BLOCKING, sychronous way
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is wahat we know about the avocado ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./starter/txt/output.txt", textOut);
// console.log("File Written");

//* NON-BLOCKING, asynhcronous way
// use data1 as data for the fileName which is readFile data2
// data1 readFile data is interpolated in the path which is needed to reade data2
// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR🤮");
//   fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./starter/txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./starter/txt/myFinal.txt",
//         `${data2} \n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("Your file has been writtern");
//         }
//       );
//     });
//   });
// });
// console.log("this gets read first because readFile works in background");

//* /////////////////////////
//* HTTP (WEB SERVER)
//* read file once instead of each time route is hit = more effecient
// const data = fs.readFileSync(
//   `${__dirname}/starter/dev-data/data.json`,
//   "utf-8"
// );
// const dataObj = JSON.parse(data);

// const server = http.createServer((req, res) => {
//   //   console.log(req.url);
//   const pathName = req.url;
//   if (pathName === "/" || pathName === "/overview") {
//     res.end("This is OVERVIEW ROUTE");
//   } else if (pathName === "/product") {
//     res.end("This is PRODUCT ROUTE");
//   } else if (pathName === "/api") {
//     // fs.readFile( //* muted to keep code as a reference but not needed because this way the file is read everytime the route is hit
//     //   `${__dirname}/starter/dev-data/data.json`,
//     //   "utf-8",
//     //   (err, data) => {
//     //     const productData = JSON.parse(data);
//     //     console.log(productData);
//     res.writeHead(200, { "Content-type": "application/json" }); //let browser know were sending JSON content type
//     res.end(data);
//     //   }
//     // );
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html", // type html - we can use html in our response
//       "my-own-header": "hello-world",
//     });
//     res.end(
//       "<body style='background-color:powderblue;'>'<h1>PAGE NOT FOUND</h1>'</body>"
//       //
//     );
//   }
// });

//* --------------------------------- 15 HTML TEMPLATING ---------------------------------------

const overview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const card = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

//* 20 Slugify
const slugs = dataObj.map((e) =>
  slugify(e.productName, { lower: true, replacement: '_' })
);
console.log(slugs);

const server = http.createServer((req, res) => {
  // console.log(req.url);

  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj.map((e) => replaceTemplate(card, e)).join('');
    const output = overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    console.log(cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    // console.log(product);
    // console.log(query);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end('PAGE NOT FOUND');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('LISTENING TO REQUESTS ON PORT 8000');
});
