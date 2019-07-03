'use strict';

var utils = require('../utils/writer.js');
var Dog = require('../service/DogService');

module.exports.deleteDog = function deleteDog (req, res, next) {
  var dogId = req.swagger.params['dogId'].value;
  var api_key = req.swagger.params['api_key'].value;
  Dog.deleteDog(dogId,api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getDogById = function getDogById (req, res, next) {
  var dogId = req.swagger.params['dogId'].value;
  Dog.getDogById(dogId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateDogWithForm = function updateDogWithForm (req, res, next) {
  var dogId = req.swagger.params['dogId'].value;
  var name = req.swagger.params['name'].value;
  var status = req.swagger.params['status'].value;
  Dog.updateDogWithForm(dogId,name,status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
