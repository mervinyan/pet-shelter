const PetType = require('../models/pettype');

exports.getPetTypes = function (req, res, next) {
  PetType
    .find({})
    .exec((err, types) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ types: types });
    });
};

exports.getPetTypeById = function (req, res, next) {
  const typeId = req.params.petTypeId;

  PetType
    .findById(typeId)
    .exec((err, pet) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      return res.status(200).json({ type: type });
    });
};


exports.newPetType = function (req, res, next) {

  const _id = req.body._id;
  const name = req.body.name;
  if (!_id) {
    return res.status(422).send({ error: '_id is required.' });
  }

  if (!name) {
    return res.status(422).send({ error: 'Name is required.' });
  }

  PetType
    .findOne({ name: name }, (err, petType) => {
      if (err) { return next(err); }
      if (petType) {
        return res.status(422).send({ error: 'Pet Type with name ' + name + ' already exists.' });
      }
      if (!petType) {
        const petType = new PetType({
          _id: _id,
          name: name
        });

        petType.save((err, petType) => {
          if (err) { return next(err); }

          res.status(200).json({
            message: 'Pet Type ' + name + ' has been added successfully.',
            id: petType._id
          });
        });
      }
    });
};
