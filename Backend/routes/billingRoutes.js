const router = require("express").Router();
const controller = require("../controllers/billingController");

router.post("/", controller.createBill);

module.exports = router;