const { contentSecurityPolicy } = require('helmet');
const mongoose = require('mongoose');
//have made tourSchema
//update your schema
const slugify = require('slugify');
// const User = require('./userModels');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour should have a name'], //A validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal than 40 char'],
      minlength: [10, 'A tour must have more or equal than 10 char'],
      //validate: [validator.isAlpha, 'A tour name must have alpha characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficult can be easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be more then 1'],
      max: [5, 'A rating must be less then 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour should have a price'],
    },
    priceDiscount: {
      type: Number,
      //custom validator
      validate: {
        validator: function (val) {
          //need access to this function
          //this only points to current doc on New documetn creation
          return val < this.price;
        },
        message: 'Discount should be less then price',
      },
    },
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //geoJson
      // embedded object
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      //schema type, Id works and not ID
      { type: mongoose.Schema.ObjectId, ref: 'userModel' },
      //A tour will reference all the users data
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//extracting model from tourSchema

//virtual properties on tourSchema
tourSchema.virtual('durationWeeks').get(function () {
  //arrow function doesn't have access to this keyword
  return this.duration / 7;
});
tourSchema.virtual('review', {
  ref: 'review',
  foreignField: 'tour',
  localField: '_id',
});

//Document middleware -> middleware which acts on the currently processed document
//before an event .save() and .create() but not on .insertMany() and update
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//query middleware -> middleware which acts on the currently processed query
//before an event .find()
tourSchema.pre(/^find/, function (next) {
  // this /^find/ will make sure that whatever query which start will find, will run this middleware
  //this will be pointing on the query
  this.find({ secretTour: { $ne: true } });
  //will send all the data where value of secretTour is false
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -email -_id -passwordChangedAt',
  });
  //populate will populate out guides key in tour schema, populate creates a new query
  next();
});

//Aggregation middleware -> middleware which acts on the currently processed Aggregation
//before an event .find()
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   //unshift is to add in the beginning of the pipeline function
//   //adding a match object in pipeline where secretTour should be equal to false
//   console.log(this.pipeline());
//   next();
// });

// //after all pre middleware functions are executed
// tourSchema.post('save', (doc, next) => {
//   //no access to this keyword, using doc as a finsih document here
//   console.log(doc);
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
