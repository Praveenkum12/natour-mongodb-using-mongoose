const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      minlength: [10, 'A name must be greater than or equal to 10'],
      maxlength: [40, 'A name must be less than or equal to 40'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have druration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'The difficulty should be one of these: easy, medium or difficult',
      },
      required: [true, 'A tour must have a diffculty'],
    },
    ratingsAverage: {
      type: Number,
      min: [1.0, 'The rating must be above 1.0'],
      max: [5.0, 'The rating must be below 5.0'],
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, 'A tour must have pricing'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this doesnot not work on update
          return val < this.price;
        },
        message: 'The discount price should be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON -- gespatial data
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
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Embedded document
// tourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async function (val) {
//     return await User.findById(val);
//   });
//   const guide = await Promise.all(guidePromise);
//   this.guides = guide;
//   next();
// });

// document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

module.exports = mongoose.model('Tour', tourSchema);
