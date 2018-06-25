process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Pet = require('../models/pet');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Pets', () => {
  beforeEach((done) => {
    Pet.remove({}, (err) => {
      done();
    })
  });

  describe('/GET pet', () => {
    it('it should GET all pets', (done) => {
      chai.request(server)
        .get('/api/pets')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pets');
          res.body.should.have.property('pets').which.is.a('array');
          res.body.should.have.property('pets').with.lengthOf(0);
          done();
        });
    });
  });

  describe('/POST pet', () => {
    it('it should not POST a pet without name', (done) => {
      let pet = {

      };

      chai.request(server)
        .post('/api/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Name is required.');
          done();
        });
    })
  });

  describe('/POST pet', () => {
    it('it should POST a pet', (done) => {

      let pet = {
        "name": "My Lovely Cat",
        "type": 2,
        "breed": 12,
        "latitude": 50.4209507,
        "longitude": -104.5358344
      };

      chai.request(server)
        .post('/api/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Pet has been added successfully.');
          res.body.should.have.property('id');
          done();
        });
    });
  });

  describe('/GET/:id pet', () => {
    it('it should GET a pet by the given id', (done) => {
      let pet = new Pet({
        "name": "My Lovely Cat",
        "type": 2,
        "breed": 12,
        "latitude": 50.4209507,
        "longitude": -104.5358344
      });

      pet.save((err, pet) => {
        chai.request(server)
          .get('/api/pets/' + pet.id)
          .send(pet)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.pet.should.have.property('name');
            res.body.pet.should.have.property('type');
            res.body.pet.should.have.property('breed');
            res.body.pet.should.have.property('latitude');
            res.body.pet.should.have.property('longitude');
            res.body.pet.should.have.property('_id').eql(pet.id);
            done();
          });
      });
    });
  });

});