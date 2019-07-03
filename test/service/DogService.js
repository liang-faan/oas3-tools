'use strict';


/**
 * Deletes a dog
 *
 * dogId Long Dog id to delete
 * api_key String  (optional)
 * no response value expected for this operation
 **/
exports.deleteDog = function(dogId,api_key) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Find dog by ID
 * Returns a single dog
 *
 * dogId Long ID of dog to return
 * no response value expected for this operation
 **/
exports.getDogById = function(dogId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Updates a dog
 *
 * dogId Long ID of dog that needs to be updated
 * name String  (optional)
 * status String  (optional)
 * no response value expected for this operation
 **/
exports.updateDogWithForm = function(dogId,name,status) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

