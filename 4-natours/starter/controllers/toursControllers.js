const Tour = require('../models/tourModels');

console.log(Tour);
// exports.mymiddleware = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };
exports.getTours = async (req, res) => {
  //http method get used to get the infromation
  try {
    const allTours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: { allTours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.getTour = async (req, res) => {
  //:id is used to declare a parameter, if you want to declare a set of parameters out of which some are optional then we use ? with that argument
  try {
    console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    // console.log(id);
    // const id = req.params.id * 1;
    // const tour = tours.find((el) => el.id === id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    //const newTour = new Tour({obj})
    // newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'deleted',
  });
};
