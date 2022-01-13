const express = require('express');
const catController = require('../controllers/category');
const router = express.Router();

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/cats/new', use(catController.createCat));
router.get('/cats/all', use(catController.getCats));


module.exports = router;