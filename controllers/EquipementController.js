const { Equipement } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");



exports.equipement_list = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement list");
  };

exports.equipement_create_get = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement create GET");
  };
  // Handle equipement update on POST.
  exports.equipement_create_post = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement create POST");
  };

exports.equipement_update_get = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement update GET");
  };
  // Handle equipement update on POST.
  exports.equipement_update_post = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement update POST");
  };

  exports.equipement_delete_get = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement delete GET");
  };
  // Handle equipement update on POST.
  exports.equipement_delete_post = function (req, res) {
    res.send("NOT IMPLEMENTED: equipement delete POST");
  };