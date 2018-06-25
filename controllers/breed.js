const Breed = require('../models/breed');
const PetType = require('../models/pettype');

exports.getBreeds = function (req, res, next) {
  Breed
    .find({})
    .exec((err, breeds) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ breeds: breeds });
    });
};

exports.getBreedsByPetTypeId = function (req, res, next) {
  const petTypeId = req.params.petTypeId;

  Breed
    .find({ type: petTypeId })
    .exec((err, breeds) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ breeds: breeds });
    });
};


exports.newBreed = function (req, res, next) {

  const _id = req.body._id;
  const name = req.body.name;
  const type = req.body.type;

  if (!_id) {
    return res.status(422).send({ error: '_id is required.' });
  }

  if (!name) {
    return res.status(422).send({ error: 'Name is required.' });
  }

  if (!type) {
    return res.status(422).send({ error: 'Type is required.' });
  }

  PetType
    .findById(type)
    .exec((err, pettype) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      Breed
        .findOne({ name: name, type: type }, (err, breed) => {
          if (err) { return next(err); }
          if (breed) {
            return res.status(422).send({ error: 'Breed with name ' + name + ' already exists.' });
          }
          if (!breed) {
            const breed = new Breed({
              _id: _id,
              name: name,
              type: type,
            });

            breed.save((err, breed) => {
              if (err) { return next(err); }

              res.status(200).json({
                message: 'Breed has been added successfully.',
                id: breed._id
              });
            });
          }
        });

    });


};
