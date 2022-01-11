const express = require("express");
var router = express.Router();
const auth = require("../../../src/middlewares/auth");
const userController = require("../../../src/controllers/userController");
const categoryController = require("../../../src/controllers/categoryController");
const productController = require("../../../src/controllers/productController");
const orderController = require("../../../src/controllers/orderController");

router.post("/user/login", userController.login);
router.post("/user/signup", userController.signup);
router.post("/user/details", auth, userController.getUserDetails);
router.post("/user/edit", auth, userController.updateUserDetails);
router.post("/category/all", auth, categoryController.listCategories);
router.post("/product/all", auth, productController.listProducts);
router.post("/product/details", auth, productController.getProductDetails);
router.post("/order/add", auth, orderController.createOrder);
router.post("/order/details", auth, orderController.getOrderDetails);
router.post("/order/edit", auth, orderController.editOrder);

module.exports = router;
