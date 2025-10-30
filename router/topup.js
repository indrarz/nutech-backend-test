const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const transactionController = require("../controller/transactionController");

const router = Router();

router.post("/", authenticateToken, transactionController.topup);

module.exports = router;
