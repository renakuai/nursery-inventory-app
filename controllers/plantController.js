const Plant = require('../models/plant');
const async = require('async');
const Category = require('../models/category');
const Seasonality = require('../models/seasonality');
const Zone = require('../models/zone');

const { body,validationResult } = require('express-validator');

//display plant index
exports.index = function (req, res) {
  async.parallel({
    plant_type_count: function (callback) {
      Plant.countDocuments({})
        .exec(callback)
    },
    select_all: function (callback) {
      Plant.find({})
        .exec(callback);
    },
    category: function (callback) {
      Plant.find({})
        .populate('category')
        .exec(callback)
    }
  }, function (err, results) {
    res.render('index', {
      title: 'Inventory Home',
      error: err,
      data: results
    });
  });
};

//display plant detail
exports.plant_detail = function (req, res, next) {
  Plant.findById(req.params.id)
    .populate('category')
    .populate('zone')
    .populate('seasonality')
    .exec(function (err, results) {
      if (err) {
        return next(err)
      }
      res.render('plant_detail', {
        title: results.name,
        data: results
      });
    })
}

//get all data points for the form
exports.plant_edit_get = function (req, res) {
  async.parallel({
    plant: function (callback) {
      Plant.findById(req.params.id)
        .populate('category')
        .populate('zone')
        .populate('seasonality')
        .exec(callback)
    },
    categories: function (callback) {
      Category.find(callback)
    },
    zones: function (callback) {
      Zone.find(callback)
    },
    seasonalities: function (callback) {
      Seasonality.find(callback)
    },
  }, function (err, results) {
    if (err) {
          return next(err)
    }
    res.render('plant_form', {
      title: 'Edit Plant',
      plant: results.plant,
      categories: results.categories,
      zones: results.zones,
      seasonalities: results.seasonalities
    })
  })
}

exports.plant_edit_post = [
  //validate and sanitize fields
  body('name', 'Please add a name').trim().isLength({ min: 1 }).escape(),
  body('image', 'Please add an image URL').trim().isLength({ min: 1 }).escape(),
  body('price', 'Please add a price').trim().isLength({ min: 1 }).escape(),
  body('count', 'Please add a count').trim().isLength({ min: 1 }).escape(),
  body('category').escape(),
  body('zone').escape(),
  body('seasonality').escape(),
  body('description', 'Please add a description').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {
    //extract errors
    const errors = validationResult(req);
    //create new plant object with old id + new data
    let plant = new Plant({
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      count: req.body.count,
      category: req.body.category,
      zone: req.body.zone,
      seasonality: req.body.seasonality,
      description: req.body.description,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      //if there are errors, then render egain
      async.parallel({
        plant: function (callback) {
          Plant.findById(req.params.id)
            .populate('category')
            .populate('zone')
            .populate('seasonality')
            .exec(callback)
        },
        categories: function (callback) {
          Category.find(callback)
        },
        zones: function (callback) {
          Zone.find(callback)
        },
        seasonalities: function (callback) {
          Seasonality.find(callback)
        },
      }, function (err, results) {
        if (err) {
          return next(err)
        }
        res.render('plant_form', {
          title: 'Edit Plant',
          image: results.image,
          price: results.price,
          plant: results.plant,
          categories: results.categories,
          zones: results.zones,
          errors: errors.array,
          seasonalities: results.seasonalities,
          description: results.description,
        });
      });
      return;
    }
    else {
      //data is valid
      Plant.findByIdAndUpdate(req.params.id, plant, {}, function (err, theplant) {
        if (err) { return next(err); }
        res.redirect(theplant.url);
      });
    }
  }
];

//display delete form on get
exports.plant_delete_get = function (req, res, next) {
  Plant.findById(req.params.id)
    .populate('category')
    .populate('zone')
    .populate('seasonality')
    .exec(function (err, results) {
      if (err) {
        return next(err)
      }
      res.render('plant_delete', {
        title: 'Delete Plant',
        plant: results
      })
    })
}

//post delete
exports.plant_delete_post = function (req, res, next) {
  Plant.findById(req.body.plantid)
    .populate('category')
    .populate('zone')
    .populate('seasonality')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      Plant.findByIdAndRemove(req.body.plantid, function deletePlant(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/inventory')
      })
    })
}

//create plant get
exports.plant_create_get = function (req, res, next) {
  async.parallel({
    categories: function (callback) {
      Category.find(callback)
    },
    zones: function (callback) {
      Zone.find(callback)
    },
    seasonalities: function (callback) {
      Seasonality.find(callback)
    },
  }, function (err, results) {
    if (err) {
      return next(err)
    }
    res.render('plant_form', {
      title: 'Add Plant',
      categories: results.categories,
      zones: results.zones,
      seasonalities: results.seasonalities
    });
  });
}

//create plant post
exports.plant_create_post = [
  //validate and sanitize fields
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Please add a name'),
  body('category').escape(),
  body('seasonality').escape(),
  body('zone').escape(),
  body('price').trim().isLength({ min: 1 }).escape().withMessage('Please add a price'),
  body('description').trim().isLength({ min: 1 }).escape().withMessage('Please add a description'),
  body('image').trim().isLength({ min: 1 }).escape().withMessage('Please add an image URL'),
  body('count').trim().isLength({ min: 1 }).escape().withMessage('Please add a count'),
  
  (req, res, next) => {
    //extract errors
    const errors = validationResult(req);
    console.log(req.body.name);
    //create new plant object with old id + new data
    var plant = new Plant(
      {
      name: req.body.name,
      category: req.body.category,
      seasonality: req.body.seasonality,
      zone: req.body.zone,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      count: req.body.count
    });

    if (!errors.isEmpty()) {
      //if there are errors, then render egain
      async.parallel({
        categories: function (callback) {
          Category.find(callback)
        },
        zones: function (callback) {
          Zone.find(callback)
        },
        seasonalities: function (callback) {
          Seasonality.find(callback)
        },
      }, function (err, results) {
        if (err) {
          return next(err)
        }
        res.render('plant_form', {
          title: 'Add Plant',
          categories: results.categories,
          seasonalities: results.seasonalities,
          zones: results.zones,
          errors: errors.array,
        });
      });
      return;
    }
    else {
      //data is valid
      plant.save(function (err) {
        if (err) { return next(err); }
        res.redirect(plant.url)
      });
    }
  }
];