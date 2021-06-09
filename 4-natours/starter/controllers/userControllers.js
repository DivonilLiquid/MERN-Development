const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// implement param middleware to checkid

exports.CheckID = (req, res, next, val) => {
  console.log(`user id is ${val}`);
  const id = req.params.id * 1;
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Error',
    });
  }
  next();
};

exports.getUsers = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.addUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
