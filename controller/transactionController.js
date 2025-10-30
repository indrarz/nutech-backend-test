const User = require("../model/User");
const Transaction = require("../model/Transaction");
const Service = require("../model/Service");
const { connectDb } = require("../config/db");

module.exports = {
  balance: async (req, res) => {
    try {
      await connectDb();
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

      // Hitung balance
      const transactions = await Transaction.find({ user: user._id });
      let balance = 0;
      transactions.forEach((t) => {
        if (t.transaction_type === "TOPUP") balance += t.total_amount;
        if (t.transaction_type === "PAYMENT") balance -= t.total_amount;
      });

      return res.status(200).json({
        status: 0,
        message: "Get Balance berhasil",
        data: { balance },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  },

  history: async (req, res) => {
    try {
      await connectDb();
      const { email } = req.user;
      const { limit, offset } = req.query;

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

      // Konversi limit dan offset
      const konversi_limit = limit ? parseInt(limit) : 0;
      const konversi_offset = offset ? parseInt(offset) : 0;

      let query = Transaction.find({ user: user._id }).sort({ createdAt: -1 });

      if (konversi_limit > 0) {
        query = query.skip(konversi_offset).limit(konversi_limit);
      }

      const transactions = await query.exec();

      const records = transactions.map((t) => {
        const data = t.toJSON();
        return {
          invoice_number: data.invoice_number,
          transaction_type: data.transaction_type,
          description: data.description,
          total_amount: data.total_amount,
          created_on: data.created_on,
        };
      });

      return res.status(200).json({
        status: 0,
        message: "Get History Berhasil",
        data: {
          offset: konversi_offset,
          limit: konversi_limit > 0 ? konversi_limit : transactions.length,
          records,
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

  topup: async (req, res) => {
    try {
      await connectDb();
      const { email } = req.user;
      let { top_up_amount } = req.body;

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

      const amount = Number(top_up_amount);
      if (isNaN(amount) || amount < 0) {
        return res.status(400).json({
          status: 102,
          message:
            "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
          data: null,
        });
      }

      const invoice_number = await Transaction.generateInvoiceNumber(user._id);

      const transaction = new Transaction({
        user: user._id,
        invoice_number,
        transaction_type: "TOPUP",
        description: "Top Up balance",
        total_amount: amount,
      });

      await transaction.save();

      // Hitung balance
      const transactions = await Transaction.find({ user: user._id });
      let balance = 0;
      transactions.forEach((t) => {
        if (t.transaction_type === "TOPUP") balance += t.total_amount;
        if (t.transaction_type === "PAYMENT") balance -= t.total_amount;
      });

      return res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          balance,
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

  create: async (req, res) => {
    try {
      await connectDb();
      const { email } = req.user;
      const { service_code } = req.body;

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

      const service = await Service.findOne({
        service_code: service_code.toUpperCase(),
      });
      if (!service) {
        return res.status(400).json({
          status: 102,
          message: "Service atau Layanan tidak ditemukan",
          data: null,
        });
      }

      // Hitung balance
      const transactions = await Transaction.find({ user: user._id });
      let balance = 0;
      transactions.forEach((t) => {
        if (t.transaction_type === "TOPUP") balance += t.total_amount;
        if (t.transaction_type === "PAYMENT") balance -= t.total_amount;
      });

      if (balance < service.service_tariff) {
        return res.status(400).json({
          status: 102,
          message: "Saldo tidak mencukupi",
          data: null,
        });
      }

      const invoice_number = await Transaction.generateInvoiceNumber(user._id);

      const transaction = new Transaction({
        user: user._id,
        invoice_number,
        transaction_type: "PAYMENT",
        description: service.service_name,
        total_amount: service.service_tariff,
      });

      await transaction.save();
      const transaction_data = transaction.toJSON();

      return res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number: transaction_data.invoice_number,
          service_code: service.service_code,
          service_name: service.service_name,
          transaction_type: transaction_data.transaction_type,
          total_amount: transaction_data.total_amount,
          created_on: transaction_data.created_on,
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
