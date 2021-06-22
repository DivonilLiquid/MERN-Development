const mongoose = require('mongoose');
//have made tourSchema
//update your schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour should have a name'], //A validator
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour should have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour should have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulty'],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour should have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, //Remove all the white space in begining and end
      required: [true, 'A tour should have a summary'],
    },
    description: {
      type: String,
      trim: true, //Remove all the white space in
    },
    imageCover: {
      type: String,
      required: [true, 'A tour should a cover image'],
    },
    images: [String], //array of string
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date], //array of dates
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//extracting model from tourSchema

//virtual properties on tourSchema
tourSchema.virtual('durationWeeks').get(function () {
  //arrow function doesn't have access to this keyword
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
