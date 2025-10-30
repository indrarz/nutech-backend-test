const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const transactionController = require("../controller/transactionController");

const router = Router();

router.get("/", authenticateToken, transactionController.balance);

module.exports = router;
