const { Router } = require("express");
const Auth = require("../controller/auth");

const router = Router();

router.post("/registration", Auth.register);
router.post("/login", Auth.login);

module.exports = router;
