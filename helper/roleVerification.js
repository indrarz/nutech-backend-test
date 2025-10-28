const User = require('../model/User');
const { NotFoundError, WrongIdentityError } = require('../error');
const { response } = require('./bcrypt');
const { parseJwtPayload } = require('./jwt');

module.exports = {
  // middleware to verify user by its role
  verifyRole: (role) => {
    return async (req, res, next) => {
      try {
        // use locals variable from previous middleware
        const username = parseJwtPayload(res.locals.token).username;
        const tokenrole = parseJwtPayload(res.locals.token).role;
        const user = await User.findOne({ username });
        if (username === null || user === null)
          throw new NotFoundError('Username tidak ditemukan!');

        if (tokenrole === role) next();
        else throw new WrongIdentityError(`User ini bukan ${role}`);
      } catch (error) {
        if (error.name === 'NotFoundError')
          return response(res, {
            code: 401,
            success: false,
            message: error.message,
          });

        if (error.name === 'WrongIdentityError')
          return response(res, {
            code: 403,
            success: false,
            message: error.message,
          });
      }
    };
  },
};
