const Service = require("../model/Service");
const path = require("path");

module.exports = {
  getAll: async (req, res) => {
    try {
      const { email } = req.user;

      if (!email) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      const services = await Service.find().sort({ createdAt: 1 });

      if (!services || services.length === 0) {
        return res.status(404).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: [],
        });
      }

      const result = services.map((service) => {
        let service_icon = null;

        if (service.service_icon?.data && service.service_icon?.contentType) {
          const extension =
            service.service_icon.contentType === "image/png" ? "png" : "jpg";

          const filename = encodeURIComponent(
            service.service_code.toLowerCase().replace(/\s+/g, "_")
          );

          service_icon = `${process.env.BASE_URL}/services/image/${filename}.${extension}`;
        }

        return {
          service_code: service.service_code,
          service_name: service.service_name,
          service_icon,
          service_tariff: service.service_tariff,
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
      const { email } = req.user;

      if (!email) {
        return res.status(400).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      if (!filename) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const basename = path.parse(filename).name;
      const normalized_name = basename.replace(/_/g, " ").toLowerCase();

      const service = await Service.findOne({
        service_code: { $regex: new RegExp(`^${normalized_name}$`, "i") },
      });

      if (!service || !service.service_icon?.data) {
        return res.status(404).json({
          status: 102,
          message: "Data tidak ditemukan",
          data: null,
        });
      }

      res.set("Content-Type", service.service_icon.contentType);
      return res.send(service.service_icon.data);
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
      let { service_code, service_name, service_tariff } = req.body;

      if (!service_code || !service_name || service_tariff == null) {
        return res.status(400).json({
          status: 102,
          message: "Semua field wajib diisi",
          data: null,
        });
      }

      if (isNaN(Number(service_tariff)) || Number(service_tariff) < 0) {
        return res.status(400).json({
          status: 102,
          message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
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

      service_code = service_code.trim().toUpperCase().replace(/\s+/g, "_");

      const existingService = await Service.findOne({ service_code });
      if (existingService) {
        return res.status(400).json({
          status: 102,
          message: "Service code sudah digunakan",
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

      const service_icon = {
        data: file.buffer,
        contentType: file.mimetype,
      };

      const result = new Service({
        service_code,
        service_name,
        service_icon,
        service_tariff,
      });

      await result.save();

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
          service_code: result.service_code,
          service_name: result.service_name,
          service_icon: `${
            process.env.BASE_URL
          }/services/image/${encodeURIComponent(
            result.service_code.toLowerCase().replace(/\s+/g, "_")
          )}.${
            result.service_icon.contentType === "image/png" ? "png" : "jpg"
          }`,
          service_tariff: result.service_tariff,
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
