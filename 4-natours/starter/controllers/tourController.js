/* eslint-disable no-console */
const fs = require('fs');
// const express = require('express');

//* read JSON file - top level code, the readFileSync only runs once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

//* PARAM middleware, if fails it returns otherwise next is called
exports.checkID = (req, res, next) => {
  // eslint-disable-next-line no-undef
  console.log(`Tour id is ${val}`);
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      data: {
        status: 'Invalid ID',
        message: `Tour ID ${id} not found`,
      },
    });
  }
  next();
};

exports.checkBody = (req, res, next, val) => {
  console.log(`${val}`);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      data: {
        status: 'fail',
        message: 'No name or price in the request body',
      },
    });
  }
  next();
};

module.exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length, // get the length of the array (amount of tours)
    data: {
      tours: tours,
    },
  });
};

module.exports.createTour = (req, res) => {
  // console.log(req.body.name);
  //* create new Id - take old id number and add 1
  const newId = tours[tours.length - 1].id + 1;

  //* merge 2 object together Object.assign
  // ES LINT MSG: Use an object spread instead of `Object.assign` eg: `{ ...foo }`.
  const newTour = Object.assign(...{ id: newId }, req.body);

  //* Add newly created tour to tours
  tours.push(newTour);

  //* Path to write file to
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,

    //* convert tours from JS OBJ to JSON OBJ
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
    (err) => {
      res.status(201).json({
        // status 201 = created
        status: 'success',

        //* data is the envelope for our data
        data: {
          tour: newTour,
        },
      });
    }
  );
};

module.exports.updateTour = (req, res) => {
  // if (req.params.id * 1 >= tours.length) {
  //* the return is important to exit the function on an error
  //   return res.status(404).json({
  //     status: 'fail',
  //     data: {
  //       tour: 'Invalid ID',
  //     },
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour',
    },
  });
};

module.exports.deleteTour = (req, res) => {
  // const typeOf = req.params.id;
  // console.log('typeOf:', typeof typeOf);
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((t) => t.id === id);

  console.log('PARAMS:', req.params.id);
  const fileteredTour = tours.filter((t) => t.id !== tour.id);
  console.log(fileteredTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(fileteredTour),
    (err) => {
      if (err) throw err;
      //* status 204 = no content
      res.status(204).json({
        status: 'success',
        message: `Tour ${id} was successfully deleted`,
        data: null,
      });
      console.log('file has been saved');
    }
  );
  //todo delete tour, filter tours, delete selected in array, rewrite file
};

module.exports.getTour = (req, res) => {
  console.log(req.params);

  //* Convert a string that looks like a number to a number
  const id = req.params.id * 1;

  //* lookup based on the id param return empty obj if no id exists
  const tour = tours.find((el) => el.id === id);

  // or check if tour exists:
  // if (!tour){
  // replaced by checkID middleware
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: tour,
    },
  });
};
