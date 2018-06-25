const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PetTypeSchema = new Schema(
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
    }
  },
  {
    _id: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('PetType', PetTypeSchema);