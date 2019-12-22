'use strict';

var utils = require('../utils/writer.js');
var Pet = require('../services/PetService');

module.exports.addPet = function addPet (req, res, next) {
    var body = req.body;
    Pet.addPet(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};


module.exports.findPetsByStatus = function findPetsByStatus (req, res, next) {
    var status = req.query.status[0];
    var sessionid = req.cookies.sessionId;

    Pet.findPetsByStatus(status,sessionid)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getPetById = function getPetById (req, res, next) {

    var petId = req.openapi.pathParams['petId'];
    Pet.getPetById(petId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

