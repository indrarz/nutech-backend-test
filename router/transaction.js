const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const transactionController = require("../controller/transactionController");

const router = Router();

router.get("/history", authenticateToken, transactionController.history);
router.post("/", authenticateToken, transactionController.create);

module.exports = router;
