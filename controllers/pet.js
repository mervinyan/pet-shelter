const Pet = require('../models/pet');
const request = require('request');

const GOOGLE_MAP_API_KEY = 'AIzaSyBrmIWy8nAs_VoR4E5vqRsSzjPuIPJjqdM';

exports.getPets = function (req, res, next) {
  Pet
    .find({})
    .populate({
      path: 'type',
      select: 'name'
    })
    .populate({
      path: 'breed',
      select: 'name'
    })
    .exec((err, pets) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ pets: pets });
    });
};

exports.getPetById = function (req, res, next) {
  const petId = req.params.id;

  Pet
    .findById(petId)
    .populate({
      path: 'type',
      select: 'name'
    })
    .populate({
      path: 'breed',
      select: 'name'
    })
    .exec((err, pet) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ pet: pet });
    });
};

exports.getProfile = function (req, res, next) {
  const petId = req.params.id;

  Pet
    .findById(petId)
    .populate({
      path: 'type',
      select: 'name'
    })
    .populate({
      path: 'breed',
      select: 'name'
    })
    .exec((err, pet) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      var name = pet.name;
      const location_api_url = `https://maps.googleapis.com/maps/api/geocode/json?address=` + pet.latitude + ',' + pet.longitude + '&key=' + GOOGLE_MAP_API_KEY
      request(location_api_url, function (error, response, body) {
        var location = JSON.parse(body).results[0].formatted_address;
        return res.status(200).json({ name: name, type: pet.type.name, breed: pet.breed.name, location: location, latitude: pet.latitude, longitude: pet.longitude});
      })
    });
};

exports.newPet = function (req, res, next) {

  const name = req.body.name;
  const type = req.body.type;
  const breed = req.body.breed;
  const location = req.body.location;

  if (!name) {
    return res.status(422).send({ error: 'Name is required.' });
  }

  if (!type) {
    return res.status(422).send({ error: 'Type is required.' });
  }

  if (!breed) {
    return res.status(422).send({ error: 'Breed is required.' });
  }

  if (!location) {
    return res.status(422).send({ error: 'Location is required.' });
  }

  Pet
    .findOne({ name: name, breed: breed }, (err, pet) => {
      if (err) { return next(err); }
      if (pet) {
        return res.status(422).send({ error: 'Pet with name ' + name + ' and breed ' + breed + ' already exists.' });
      }
      if (!pet) {

        const location_api_url = `https://maps.googleapis.com/maps/api/geocode/json?address=` + location + '&key=' + GOOGLE_MAP_API_KEY
        request(location_api_url, function (error, response, body) {
          var geometry = JSON.parse(body).results[0].geometry;
          const pet = new Pet({
            name: name,
            type: parseInt(type),
            breed: parseInt(breed),
            latitude: geometry.location.lat,
            longitude: geometry.location.lng
          });

          pet.save((err, pet) => {
            if (err) { return next(err); }

            res.status(200).json({
              message: 'Pet has been added successfully.',
              id: pet._id
            });
          });
        });

      }
    });
};
