const express = require('express');

const shopControllers = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopControllers.getIndex);

router.get('/product-list', shopControllers.getproducts);

router.get('/product-list/:productId', isAuth, shopControllers.getproduct);


router.get('/cart', isAuth, shopControllers.getCarts);

router.post('/cart', isAuth, shopControllers.postCarts);

router.post('/cart-delete-item', isAuth, shopControllers.postCartDeleteProduct);

router.get('/orders', isAuth, shopControllers.getOrders);
router.get('/orders/:orderId', isAuth, shopControllers.getInvoice);

router.post('/create-order', isAuth, shopControllers.postOrder);



// router.get('/checkout', shopControllers.getCheckout);



module.exports = router;