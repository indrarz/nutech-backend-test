const { Router } = require("express");
const { upload } = require("../helper/multer");
const bannerController = require("../controller/bannerController");

const router = Router();

router.get("/", bannerController.getAll);
router.get("/image/:filename", bannerController.getImage);
router.post("/image", upload, bannerController.create);

module.exports = router;
