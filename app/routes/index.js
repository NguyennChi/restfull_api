var express = require('express');
var router = express.Router();
const {protect,authouize} = require('./../middleware/auth')

router.use('/product', require('./product'))
router.use('/category', require('./category'))
router.use('/user',protect,authouize('admin'), require('./user'))
router.use('/auth', require('./auth'))
module.exports = router;
