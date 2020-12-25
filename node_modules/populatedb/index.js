"use strict";
var populateElastic = require("./elasticsearch");
var populateMongo = require("./mongo");


module.exports = {
    populateElastic: populateElastic.populateElastic,
    populateMongo: populateMongo.populateMongo
};
