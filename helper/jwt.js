const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

module.exports = {
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak tidak valid atau kadaluwarsa",
          data: null,
        });
      }

      // Verifikasi token
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null,
          });
        }

        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(403).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }
  },

  // Decode payload JWT untuk ambil data user
  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },

  // Generate JWT dengan expired 12 jam
  generateAccessToken: (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
  },
};
