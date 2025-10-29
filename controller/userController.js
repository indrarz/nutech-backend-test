const User = require("../model/User");
const path = require("path");

module.exports = {
  getOne: async (req, res) => {
    try {
      const { email } = req.user;

      if (!email) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      let profile = null;

      if (user.profile_image?.data && user.profile_image?.contentType) {
        const extension =
          user.profile_image.contentType === "image/png" ? "png" : "jpg";

        const filename = user.email.split("@")[0];

        profile = `${process.env.BASE_URL}/profile/image/${encodeURIComponent(
          filename
        )}.${extension}`;
      }

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: profile,
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

  update: async (req, res) => {
    try {
      const { email } = req.user;
      const { first_name, last_name } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      await user.save();

      let profile = null;

      if (user.profile_image?.data && user.profile_image?.contentType) {
        const extension =
          user.profile_image.contentType === "image/png" ? "png" : "jpg";

        const filename = user.email.split("@")[0];

        profile = `${process.env.BASE_URL}/profile/image/${encodeURIComponent(
          filename
        )}.${extension}`;
      }

      return res.status(200).json({
        status: 0,
        message: "Update Profile berhasil",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: profile,
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

  image: async (req, res) => {
    try {
      const { email } = req.user;

      if (!email) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const file = req.files[0];

      // Validasi format
      if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const updated = await User.findOneAndUpdate(
        { email },
        {
          profile_image: {
            data: file.buffer,
            contentType: file.mimetype,
          },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      // Tentukan ekstensi
      const extension = file.mimetype === "image/png" ? "png" : "jpeg";
      const filename = updated.email.split("@")[0];
      const image = `${process.env.BASE_URL}/profile/image/${encodeURIComponent(
        filename
      )}.${extension}`;

      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: updated.email,
          first_name: updated.first_name,
          last_name: updated.last_name,
          profile_image: image,
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

  getImage: async (req, res) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const basename = path.parse(filename).name;

      const user = await User.findOne({
        email: { $regex: new RegExp(`^${basename}@`, "i") },
      });

      if (!user || !user.profile_image?.data) {
        return res.status(404).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      res.set("Content-Type", user.profile_image.contentType);
      return res.send(user.profile_image.data);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },
};
