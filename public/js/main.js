const app = {
  rooms() {
    const socket = window.io('/rooms', { transports: ['websocket'] });

    // When socket connects, get a list of chatrooms
    socket.on('connect', function() {
      // Update rooms list upon emitting updateRoomsList event
      socket.on('updateRoomsList', function(room) {
        // Display an error message upon a user error(i.e. creating a room with an existing title)
        const msg = document.querySelector('.room-create p.message');
        if (msg) {
          msg.remove();
        }

        if (room.error != null) {
          const roomCreate = document.querySelector('.room-create');
          roomCreate.innerHTML += `<p class="message error">${room.error}</p>`;
        } else {
          app.helpers.updateRoomsList(room);
        }
      });

      // Whenever the user hits the create button, emit createRoom event.
      const createRoomBtn = document.querySelector('.room-create button');

      createRoomBtn.addEventListener('click', function() {
        const input = document.querySelector("input[name='title']");
        const roomTitle = input.value.trim();
        if (roomTitle !== '') {
          socket.emit('createRoom', roomTitle);
          input.value = '';
        }
      });
    });
  },

  chat(roomId, username) {
    const socket = window.io('/chatroom', { transports: ['websocket'] });

    // When socket connects, join the current chatroom
    socket.on('connect', function() {
      socket.emit('join', roomId);

      // Update users list upon emitting updateUsersList event
      socket.on('updateUsersList', function(users, clear) {
        const msg = document.querySelector('.container p.message');

        if (msg) {
          msg.remove();
        }

        if (users.error) {
          const container = document.querySelector('.container');
          container.innerHtml = `<p class="message error">${users.error}</p>`;
        } else {
          app.helpers.updateUsersList(users, clear);
        }
      });

      // Whenever the user hits the save button, emit newMessage event.
      const chatMessageButton = document.querySelector('.chat-message button');

      chatMessageButton.addEventListener('click', function() {
        const textarea = document.querySelector("textarea[name='message']");
        const messageContent = textarea.value.trim();

        if (messageContent) {
          const message = {
            content: messageContent,
            username,
            date: Date.now(),
          };

          socket.emit('newMessage', roomId, message);
          textarea.value = '';
          app.helpers.addMessage(message);
        }
      });

      // Whenever a user leaves the current room, remove the user from users list
      socket.on('removeUser', function(userId) {
        const user = document.querySelector(`li#user-${userId}`);
        user.remove();
        app.helpers.updateNumOfUsers();
      });

      // Append a new message
      socket.on('addMessage', function(message) {
        app.helpers.addMessage(message);
      });
    });
  },

  helpers: {
    // Update rooms list
    updateRoomsList(room) {
      const html = `<a href="/chat/${room._id}"><li class="room-item">${
        room.title
      }</li></a>`;

      const roomsList = document.querySelector('.room-list ul');
      const rooms = document.querySelectorAll('.room-list ul li');

      if (rooms.length > 0) {
        roomsList.innerHTML += html;
      } else {
        roomsList.innerHTML = html;
      }

      this.updateNumOfRooms();
    },

    // Update users list
    updateUsersList(users, clear) {
      if (users.constructor !== Array) {
        users = [users];
      }

      let html = '';

      for (const user of users) {
        html += ` <li class="clearfix" id="user-${user._id}">
                    <div class="about">
                      <div class="name">${user.username}</div>
                      <div class="status">online</div>
                    </div>
                  </li>`;
      }

      if (!html) {
        return;
      }

      const usersList = document.querySelector('.users-list ul');

      if (clear) {
        usersList.innerHTML = html;
      } else {
        const temp = usersList.innerHTML;
        usersList.innerHTML = html + temp;
      }

      this.updateNumOfUsers();
    },

    // Adding a new message to chat history
    addMessage(message) {
      message.date = new Date(message.date).toUTCString();

      const msg = `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.date}</span>
                    </div>
                    <div class="message my-message" dir="auto">${
                      message.content
                    }</div>
                  </li>`;

      const chatHistory = document.querySelector('.chat-history ul');
      chatHistory.innerHTML += msg;
    },

    // Update number of rooms
    // This method MUST be called after adding a new room
    updateNumOfRooms() {
      const roomsList = document.querySelectorAll('.room-list ul li');
      const rooms = document.querySelector('.room-num-rooms');
      rooms.innerText = `${roomsList.length} Room(s)`;
    },

    // Update number of online users in the current room
    // This method MUST be called after adding, or removing list element(s)
    updateNumOfUsers() {
      const usersList = document.querySelectorAll('.users-list ul li');
      const users = document.querySelector('.chat-num-users');
      users.innerText = `${usersList.length} User(s)`;
    },
  },
};
