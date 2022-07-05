//* Asynchornous JS

//* What?  3 steps: Read txt file, get image from web of dog breed using HTTP request, write to file (3 callbacks)

const { rejects } = require("assert");
const { log } = require("console");
const fs = require("fs");
const { resolve } = require("path");
//* NPM package to do HTTP requests
const superagent = require("superagent");
// const log = console.log;

//* Callbacks
//* Reads file, gets url endpoint of the API, log res (result) from res.body.message
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   log(`Breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       log(res.body.message);
//       if (err) return log(err.message);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return log(err.message);
//         log("writing a random dog image to file");
//       });
//     });
// });

//* Using Promises
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   log(`Breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       if (err) return log(err.message);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return log(err.message);
//         log("writing a random dog image to file");
//       });
//     })
//     .catch((err) => {
//       log(err.message);
//     });
// });

//* Building Promises
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject("File not found 😒");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write to file 😢");
      resolve("writing a random dog image to file");
    });
  });
};

//* Consuming the promise
/* readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    log(res.body.message);
    return writeFilePro("dog-img.txt", res.body.message);
  })
  .then(() => {
    log("writing a random dog image to file");
  })
  .catch((err) => {
    log(err);
  });
*/

//* Refactored to promise above (Compare the differences),
// readFilePro(`${__dirname}/dog.txt`).then((data) => {
//   log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return log(err.message);
//         log("writing a random dog image to file");
//       });
//     })
//     .catch((err) => {
//       log(err.message);
//     });
// });

//* Async Await

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    log(res.body.message);
    writeFilePro("dog-img.txt", res.body.message);
    log("writing a random dog image to file");
  } catch (error) {
    log(error);
  }
  //   return "2: when logging x, this will show up as promise pending";
};
// log("1 Get dog pic");
// const x = getDogPic();
// log("Log x:", x);
// log("3 Done gettin dog pic, this logs before the async function getDogPic()");

//* Using the .then() so we can log the return string in the async function
/*
const getDogPic2 = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    log(res.body.message);
    writeFilePro("dog-img.txt", res.body.message);
    log("writing a random dog image to file");
  } catch (error) {
    log(error);

    throw error; // THIS WILL MARK ENTIRE FUNCTION AS REJECTED IF ERROR
  }
  return "2: ready 😁";
};

//* PATTERN 3, IIFE. Call function with another async function
(async () => {
  try {
    log("1 Will Get dog pic2");
    const x = await getDogPic2(); // getDogPic2 returns a promise, by awaiting the promise we get the return string value of  2: ready 😁
    log(x);
    log("3 Done gettin dog pic2");
  } catch (err) {
    log("ERROR: 💥");
  }
})(getDogPic2);
*/

//* Async returns a promise - getDogPic2 returns in order of how script is written whereas getDogPic() runs last, afteer the console.log()
//* Attach .then() to the function instead of using a variable like above, to return the future value of the promise

//* PATTERN 2 MIXING ASYNC WITH PROMISES .THEN() .CATCH(). getDogPic() returns a promise, chain on .then() to have access to getDogPic() future value it eventually will return
/*
log("1 Will Get dog pic2");
getDogPic2()
  .then((x) => {
    log(x);
    log("3 Done gettin dog pic2");
  })
  .catch((err) => {
    log("ERROR: 💥"); // BECAUSE OF THE THROW ERROR ABOVE THIS LOGS OTHERWISE THE ERROR IS NOT HANDLED CORRECTLY
  });
*/

//* AWAIT ALL PROMISES AT ONCE TO INSTEAD OF AWAITING MULTIPLE PROMISES - VERY NICE
//* Remove the await preceeding the superagent.get() and saved all to variable
const getDogPic2 = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);

    const imgs = all.map((e) => e.body.message);

    log("As array", imgs);

    writeFilePro("dog-img.txt", imgs.join("\n")); //* 2nd arg must be a string otherwise this error pops: TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer
    log("writing as A STRING a random dog image to file");
  } catch (error) {
    log(error);

    throw error; // THIS WILL MARK ENTIRE FUNCTION AS REJECTED IF ERROR
  }
  return "2: ready 😁";
};
getDogPic2();
