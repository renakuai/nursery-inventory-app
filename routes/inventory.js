var express = require('express');
var router = express.Router();

//require all controllers
const plant_controller = require('../controllers/plantController');
const category_controller = require('../controllers/categoryController');
const zone_controller = require('../controllers/zoneController');
const seasonality_controller = require('../controllers/seasonalityController');
const { route } = require('.');

//GET plant index
router.get('/', plant_controller.index);  

//GET plant type list
router.get('/plant/create', plant_controller.plant_create_get);
router.post('/plant/create', plant_controller.plant_create_post);
router.get('/plant/:id', plant_controller.plant_detail);
router.get('/plant/:id/edit', plant_controller.plant_edit_get);
router.post('/plant/:id/edit', plant_controller.plant_edit_post);
router.get('/plant/:id/delete', plant_controller.plant_delete_get);
router.post('/plant/:id/delete', plant_controller.plant_delete_post);

module.exports = router;

