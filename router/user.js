const { Router } = require("express");
const { authenticateToken } = require("../helper/jwt");
const { upload } = require("../helper/multer");
const usersController = require("../controller/userController");

const router = Router();

router.get("/", authenticateToken, usersController.getOne);
router.get("/image/:filename", authenticateToken, usersController.getImage);
router.put("/update", authenticateToken, usersController.update);
router.put("/image", authenticateToken, upload, usersController.image);

module.exports = router;
