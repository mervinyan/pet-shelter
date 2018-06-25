const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const BreedSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      min: 2,
      max: 50,
      required: true
    },
    type: {
      type: Number,
      required: true,
      ref: 'PetType'
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('Breed', BreedSchema);