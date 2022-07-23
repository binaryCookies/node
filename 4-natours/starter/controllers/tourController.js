/* eslint-disable no-console */
const fs = require('fs');
const app = require('../app');
const Tour = require('../model/tourModel');

//* read JSON file - top level code, the readFileSync only runs once
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

module.exports.getAllTours = async (req, res) => {
  try {
    //* Filtering
    //* 1a) - Build the query - saving a hard copy of req.query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //* delete from the queryObj the elements of the array in excluded fields
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    //* 1b)  Advanced FIletering
    // to use replace() stringify queryObj
    let queryStr = JSON.stringify(queryObj);
    // use callback to pass the matched string and add the operartor $ for mongoDB
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // (await the query below. Why? in order to chain other methods to the query.
    // If we await the query it is not possible to chain methods )
    let query = Tour.find(JSON.parse(queryStr));

    //* 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      //? SORT mongoose docs: If a string is passed, it must be a space delimited list of path names.
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      //set default descending order
      query = query.sort('-createdAt');
    }

    //*- Execute the query
    const tours = await query;

    //* MongoDB filter
    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    //* Mongoose Filter
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //* Send the response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length, // get the length of the array (amount of tours)
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// todo add this error handling Found in video 89 comments/notes
// const handleDuplicateFields = (err) => {
//   const value = Object.values(err.keyValue)[0];
//   const message = `Duplicate field value: ${value}. Use another value.`;
//   return new AppError(message, 400);
// };

module.exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      // status 201 = created
      status: 'success',

      //* data is the envelope for our data
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { ...err, errmsg: err.errmsg },
    });
  }
};

module.exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { ...err, errmsg: err.errmsg },
    });
  }
};

module.exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: `Tour ${req.params.id} was successfully deleted`,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { ...err, errmsg: err.errmsg },
    });
  }
};

module.exports.getTour = async (req, res) => {
  try {
    console.log(req.params);

    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: { ...err, errmsg: err.errmsg },
    });
  }
};
