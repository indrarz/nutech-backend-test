const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const { upload } = require("../helper/multer");
const serviceController = require("../controller/serviceController");

const router = Router();

router.get("/", authenticateToken, serviceController.getAll);
router.get("/image/:filename", authenticateToken, serviceController.getImage);
router.post("/", upload, serviceController.create);

module.exports = router;
