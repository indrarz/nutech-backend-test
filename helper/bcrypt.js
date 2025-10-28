const crypto = require("crypto");

module.exports = {
  response: (res, data) => {
    return res.status(data.status).json({
      status: data.status,
      message: data.message,
      data: data.content || data.data || null,
    });
  },

  isEmpty: (data) => Object.keys(data).length === 0,

  hashPassword: async (data) => {
    const pengacak = "QWERTYUIOP";
    const innerHash = crypto.createHash("md5").update(data).digest("hex");
    const password = crypto
      .createHash("md5")
      .update(pengacak + innerHash + pengacak)
      .digest("hex");
    return password;
  },

  comparePassword: async (inputPassword, hashedPassword) => {
    const pengacak = "QWERTYUIOP";
    const innerHash = crypto
      .createHash("md5")
      .update(inputPassword)
      .digest("hex");
    const finalHash = crypto
      .createHash("md5")
      .update(pengacak + innerHash + pengacak)
      .digest("hex");
    return finalHash === hashedPassword;
  },
};
