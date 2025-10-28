const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { NotFoundError } = require("../error");
const { response } = require("../helper/bcrypt");

const blacklist = [];

module.exports = {
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) throw new NotFoundError("Token tidak valid atau kadaluwarsa");

      if (blacklist.includes(token)) {
        throw new NotFoundError("Token tidak valid atau kadaluwarsa");
      }

      jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
        if (err) {
          throw new NotFoundError("Token tidak valid atau kadaluwarsa");
        }

        req.user = user;
        res.locals.token = token;
        next();
      });
    } catch (error) {
      if (error.name === "NotFoundError") {
        return response(res, {
          status: 108,
          message: error.message,
          data: null,
        });
      }

      return response(res, {
        status: 500,
        message: "Terjadi kesalahan.",
        data: null,
      });
    }
  },

  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },

  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_JWT_SECRET, { expiresIn: "3h" });
  },

  blacklistToken: (token) => {
    blacklist.push(token);
  },
};
