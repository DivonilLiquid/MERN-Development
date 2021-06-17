const mongoose = require('mongoose');
//have made tourSchema
//update your schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour should have a name'], //A validator
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour should have a price'],
  },
});
//extracting model from tourSchema

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
