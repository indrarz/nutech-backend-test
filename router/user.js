const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const { upload } = require("../helper/multer");
const userController = require("../controller/userController");

const router = Router();

router.get("/", authenticateToken, userController.getOne);
router.get("/image/:filename", authenticateToken, userController.getImage);
router.put("/update", authenticateToken, userController.update);
router.put("/image", authenticateToken, upload, userController.image);

module.exports = router;
