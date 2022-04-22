const Plant = require('../models/plant');
const async = require('async');

const { body,validationResult } = require('express-validator');

//display list of all plants GET
exports.category_list = function (req, res) {
  res.render('category_list', {
    title: 'All categories',
    content: 'Not implemented yet'
  })
}