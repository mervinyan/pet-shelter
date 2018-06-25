const express = require('express');

const PetController = require('./controllers/pet');
const PetTypeController = require('./controllers/pettype');
const BreedController = require('./controllers/breed');

module.exports = function (app) {

  const apiRoutes = express.Router(),
  adminRoutes = express.Router(),
  petRoutes = express.Router();

  apiRoutes.use('/admin', adminRoutes);

  adminRoutes.get('/types', PetTypeController.getPetTypes);

  adminRoutes.get('/types/:id', PetTypeController.getPetTypeById);

  adminRoutes.post('/types/new', PetTypeController.newPetType);

  adminRoutes.get('/breeds', BreedController.getBreeds);

  adminRoutes.get('/breeds/:petTypeId', BreedController.getBreedsByPetTypeId);

  adminRoutes.post('/breeds/new', BreedController.newBreed);

  apiRoutes.use('/pets', petRoutes);

  petRoutes.get('/', PetController.getPets);
  petRoutes.get('/:id', PetController.getProfile);
  petRoutes.post('/', PetController.newPet);

  app.use('/api', apiRoutes);
};      
