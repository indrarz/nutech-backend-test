const User = require("../model/User");
const { hashPassword } = require("../helper/bcrypt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    try {
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          status: 102,
          message: "Parameter email tidak sesuai format",
          data: null,
        });
      }

      // Validasi panjang password
      if (!password || password.length < 8) {
        return res.status(400).json({
          status: 102,
          message: "Password minimal 8 karakter",
          data: null,
        });
      }

      // Cek email terdaftar
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 102,
          message: "Email sudah terdaftar",
          data: null,
        });
      }

      const hashedPassword = await hashPassword(password);

      await User.create({
        email,
        first_name,
        last_name,
        password: hashedPassword,
      });

      return res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          status: 102,
          message: "Parameter email tidak sesuai format",
          data: null,
        });
      }

      // Validasi panjang password
      if (!password || password.length < 8) {
        return res.status(400).json({
          status: 102,
          message: "Password minimal 8 karakter",
          data: null,
        });
      }

      // Cek user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: 103,
          message: "Username atau password salah",
          data: null,
        });
      }

      // Verifikasi password
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({
          status: 103,
          message: "Username atau password salah",
          data: null,
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      res.cookie("token", token, { httpOnly: true });

      return res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: {
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },
};
