const UserModel = require('../database').models.user;

const create = function(data, callback) {
  const newUser = new UserModel(data);
  newUser.save(callback);
};

const findOne = function(data, callback) {
  UserModel.findOne(data, callback);
};

const findById = function(id, callback) {
  UserModel.findById(id, callback);
};

/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */
const findOrCreate = function(data, callback) {
  findOne({ socialId: data.id }, function(err, user) {
    if (err) {
      return callback(err);
    }
    if (user) {
      return callback(err, user);
    }
    const userData = {
      username: data.displayName,
      socialId: data.id,
      picture: data.photos[0].value || null,
    };

    create(userData, function(err, newUser) {
      callback(err, newUser);
    });
  });
};

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
const isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  create,
  findOne,
  findById,
  findOrCreate,
  isAuthenticated,
};
