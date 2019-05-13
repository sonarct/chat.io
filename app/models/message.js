const MessageModel = require('../database').models.message;

const create = function(data, callback) {
  const message = new MessageModel(data);
  message.save(callback);
};

const find = function(data, callback) {
  MessageModel.find(data, callback);
};

const findById = function(id, callback) {
  MessageModel.findById(id, callback);
};

// /**
//  * Add a user along with the corresponding socket to the passed room
//  *
//  */
// const addUser = function(room, socket, callback) {
//   // Get current user's id
//   const userId = socket.request.session.passport.user;

//   // Push a new connection object(i.e. {userId + socketId})
//   const conn = { userId, socketId: socket.id };
//   room.connections.push(conn);
//   room.save(callback);
// };

// /**
//  * Get all users in a room
//  *
//  */
// const getUsers = function(room, socket, callback) {
//   const users = [];
//   const vis = {};
//   let count = 0;
//   const userId = socket.request.session.passport.user;

//   // Loop on room's connections, Then:
//   room.connections.forEach(function(conn) {
//     // 1. Count the number of connections of the current user(using one or more sockets) to the passed room.
//     if (conn.userId === userId) {
//       count += 1;
//     }

//     // 2. Create an array(i.e. users) contains unique users' ids
//     if (!vis[conn.userId]) {
//       users.push(conn.userId);
//     }
//     vis[conn.userId] = true;
//   });

//   // Loop on each user id, Then:
//   // Get the user object by id, and assign it to users array.
//   // So, users array will hold users' objects instead of ids.
//   let loadedUsers = 0;
//   users.forEach(function(userId, i) {
//     User.findById(userId, function(err, user) {
//       if (err) {
//         return callback(err);
//       }
//       users[i] = user;

//       // fire callback when all users are loaded (async) from database
//       if (++loadedUsers === users.length) {
//         return callback(null, users, count);
//       }
//     });
//   });
// };

module.exports = {
  create,
  find,
  findById,
};
