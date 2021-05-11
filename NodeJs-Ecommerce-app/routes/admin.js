const express = require('express');
const { body } = require('express-validator/check');

const adminControllers = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/add-product', isAuth, adminControllers.getAddProduct);


router.get('/admin-product-list', isAuth, adminControllers.getAdminProduct);

router.post('/add-product',
[
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
   isAuth, adminControllers.postAddProduct);


router.get('/edit-product/:productId', isAuth, adminControllers.getEditProduct);

router.post('/edit-product',
[
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat().trim(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
   isAuth, adminControllers.postEditProduct);

router.post('/delete-product', isAuth, adminControllers.postDeleteProduct)







module.exports = router;
