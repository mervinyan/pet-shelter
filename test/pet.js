process.env.NODE_ENV = 'test';

let Pet = require('../models/pet');
let Breed = require('../models/breed');
let PetType = require('../models/pettype');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Pets', () => {
  beforeEach((done) => {
    Pet.remove({}, (err) => {
      Breed.remove({}, (err) => {
        PetType.remove({}, (err) => {
          done();
        })
      })

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

      let pet_type = {
        "_id": 2,
        "name": "Cat"
      };

      let breed = {
        "_id": 12,
        "type": 2,
        "name": "Sphynx"
      };

      let pet = {
        "name": "My Lovely Cat",
        "type": 2,
        "breed": 12,
        "location": "Regina, SK"
      };

      chai.request(server)
        .post('/api/admin/types/new')
        .send(pet_type)
        .end((err, res) => {
          res.should.have.status(200);
          chai.request(server)
            .post('/api/admin/breeds/new')
            .send(breed)
            .end((err, res) => {
              res.should.have.status(200);
              chai.request(server)
                .post('/api/pets')
                .send(pet)
                .end((err, res) => {
                  console.log(res.body);

                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Pet has been added successfully.');
                  res.body.should.have.property('id');
                  done();
                });
            });
        });
    });
  });

  describe('/GET/:id pet', () => {
    it('it should GET a pet by the given id', (done) => {
      let pet_type = {
        "_id": 2,
        "name": "Cat"
      };

      let breed = {
        "_id": 12,
        "type": 2,
        "name": "Sphynx"
      };

      let pet = {
        "name": "My Lovely Cat",
        "type": 2,
        "breed": 12,
        "location": "Regina, SK"
      };

      chai.request(server)
        .post('/api/admin/types/new')
        .send(pet_type)
        .end((err, res) => {
          res.should.have.status(200);
          chai.request(server)
            .post('/api/admin/breeds/new')
            .send(breed)
            .end((err, res) => {
              res.should.have.status(200);

              chai.request(server)
                .post('/api/pets')
                .send(pet)
                .end((err, res) => {
                  res.should.have.status(200);
                  let pet_id = res.body.id;
                  chai.request(server)
                    .get('/api/pets/' + pet_id)
                    .send(pet)
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('name').eql('My Lovely Cat');
                      res.body.should.have.property('type').eql('Cat');
                      res.body.should.have.property('breed').eql('Sphynx');
                      res.body.should.have.property('location');
                      res.body.should.have.property('latitude');
                      res.body.should.have.property('longitude');
                      done();
                    });

                });
            });
        });

    });
  });

});