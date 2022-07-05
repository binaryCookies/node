const fs = require('fs');
const express = require('express');
const app = express();

//* Can modify incoming req object - middleware, data from body is added to it hence req.body
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server',
//     app: 'Natours ',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can POST to this Endpoint');
// });

//* read JSON file - top level code, the readFileSync only runs once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

//* GET REQUEST (index, all)
//* tours is resource, v1 is version #
//* GET tours resource wrap in object object name is data (convention), send status code, send in json format
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // get the length of the array (amount of tours)
    data: {
      tours: tours,
    },
  });
});

//* GET REQUEST W/ OPTIONAL PARAM
app.get('/api/v1/tours/:id/:x?', (req, res) => {
  console.log(req.params);

  //* Convert a string that looks like a number to a number
  const id = req.params.id * 1;

  //* lookup based on the id param return empty obj if no id exists
  const tour = tours.find((el) => el.id === id);

  // or check if tour exists:
  // if (!tour){
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: tour,
    },
  });
});

//* POST REQUEST
app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  //* create new Id - take old id number and add 1
  const newId = tours[tours.length - 1].id + 1;

  //* merge 2 object together Object.assign
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  //* convert tours from JS OBJ to JSON OBJ
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,

    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        // status 201 = created
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    //* the return is important to exit the function on an error
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid ID',
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid ID',
      },
    });
  }

  //* status 204 = no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
