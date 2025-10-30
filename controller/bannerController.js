const Banner = require("../model/Banner");
const path = require("path");

module.exports = {
  getAll: async (req, res) => {
    try {
      const banners = await Banner.find().sort({ createdAt: 1 });

      if (!banners || banners.length === 0) {
        return res.status(404).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: [],
        });
      }

      const result = banners.map((banner) => {
        let banner_image = null;

        if (banner.banner_image?.data && banner.banner_image?.contentType) {
          const extension =
            banner.banner_image.contentType === "image/png" ? "png" : "jpg";

          const filename = encodeURIComponent(
            banner.banner_name.toLowerCase().replace(/\s+/g, "_")
          );

          banner_image = `${process.env.BASE_URL}/banner/image/${filename}.${extension}`;
        }

        return {
          banner_name: banner.banner_name,
          banner_image,
          description: banner.description,
        };
      });

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: result,
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
      const normalized_name = basename.replace(/_/g, " ").toLowerCase();

      const banner = await Banner.findOne({
        banner_name: { $regex: new RegExp(`^${normalized_name}$`, "i") },
      });

      if (!banner || !banner.banner_image?.data) {
        return res.status(404).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      res.set("Content-Type", banner.banner_image.contentType);
      return res.send(banner.banner_image.data);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { banner_name, description } = req.body;

      if (!banner_name || !description) {
        return res.status(400).json({
          status: 102,
          message: "Name dan Description wajib diisi",
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

      const existingBanner = await Banner.findOne({
        banner_name: banner_name.trim(),
      });
      if (existingBanner) {
        return res.status(400).json({
          status: 102,
          message: "Nama banner sudah digunakan",
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

      const banner_image = {
        data: file.buffer,
        contentType: file.mimetype,
      };

      const result = new Banner({
        banner_name,
        description,
        banner_image,
      });

      await result.save();

      return res.status(201).json({
        status: 0,
        message: "Banner berhasil dibuat",
        data: {
          banner_name: result.banner_name,
          description: result.description,
          banner_image: `${
            process.env.BASE_URL
          }/banner/image/${encodeURIComponent(
            result.banner_name.toLowerCase().replace(/\s+/g, "_")
          )}.${
            result.banner_image.contentType === "image/png" ? "png" : "jpg"
          }`,
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
