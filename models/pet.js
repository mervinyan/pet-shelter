const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PetSchema = new Schema(
  {
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
    breed: {
      type: Number,
      required: true,
      ref: 'Breed'
    },
    latitude: {
      type: Number,
      required: true
    }, 
    longitude: {
      type: Number,
      required: true
    },   
  },
  {
     timestamps: true
  }
);


module.exports = mongoose.model('Pet', PetSchema);