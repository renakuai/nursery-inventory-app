const Plant = require('../models/plant');
const async = require('async');
const Zone = require('../models/zone');

const { body,validationResult } = require('express-validator');

//display list of all plants GET
exports.zone_list = function (req, res) {
  res.render('zone_list', {
    title: 'All zones',
    content: 'Not implemented yet'
  })
}