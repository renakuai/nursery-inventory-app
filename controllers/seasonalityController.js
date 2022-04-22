const Plant = require('../models/plant');
const async = require('async');
const Seasonality = require('../models/seasonality');

const { body,validationResult } = require('express-validator');

//display list of all plants GET
exports.seasonality_list = function (req, res) {
  res.render('seasonality_list', {
    title: 'All seasonalities',
    content: 'Not implemented yet'
  })
}