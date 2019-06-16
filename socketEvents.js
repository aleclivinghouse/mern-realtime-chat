const Room = require('./modelHelpers/roomHelper');
const RoomModel = require('./models/Room');

exports = module.exports = function(io) {
  //Set Listeners
    io.on('connection', function(socket) {

		// Create a new room
		socket.on('createRoom', function(title, userId) {
      console.log('this is the title on the server', title);
			Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
				if(err) throw err;
				if(room){
					socket.emit('updateRoomsList', { error: 'Room title already exists.' });
				} else {
					Room.create({
						title: title,
            admin:userId
					}, function(err, newRoom){
						if(err) throw err;
						socket.broadcast.emit('updateRoomsList', newRoom);
            socket.emit('updateRoomsList', newRoom);
					});
				}
			});
		});


    socket.on('deleteRoom', function(roomId) {
          RoomModel.findByIdAndRemove(roomId);
          socket.emit('removeRoom', roomId);
      });

    socket.on('newMessage', function(roomId, message) {

      // No need to emit 'addMessage' to the current socket
      // As the new message will be added manually in 'main.js' file
      // socket.emit('addMessage', message);

      socket.broadcast.to(roomId).emit('addMessage', message);
    });

    socket.on('sendNotification', function(recipientId, notification) {
        console.log('send notification is firing');
      //find the room where the title is the recipient
      Room.findOne({'title':  recipientId}, function(err, room){
        if(err) throw err;
        console.log('this is the notification room found', room.id);
        socket.to(room.id).emit('addNotification', notification);
      });
      // socket.join(theRoom.id);
    });

//    // //thiss should be on the client
   socket.on('joinYourNotificationRoom', function(userId){
    Room.findOne({'title' :userId}, function(err, room){
      	if(err) throw 'thisd is the error to join your notifiaction room' + err;
        if(room){
          console.log('about to join a your notification room ');
        socket.join(room.id);
      }else{
        Room.create({
          title: userId
        }, function(err, newRoom){
         socket.join(newRoom.id);
         console.log('new notifaction room created');
       });
     };
   });
});
   //
   //

    ///
    socket.on('join', function(roomId, userId) {
			Room.findById(roomId, function(err, room){
				if(err) throw err;
				if(!room){
					// Assuming that you already checked in router that chatroom exists
					// Then, if a room doesn't exist here, return an error to inform the client-side.
					socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
				} else {
					// Check if user exists in the session

					Room.addUser(room, userId, socket,  function(err, newRoom){

            console.log('this is the userId in the new room', userId);
						// Join the room channel
						socket.join(newRoom.id);

						Room.getUsers(newRoom, userId, socket, function(err, users, cuntUserInRoom){
							if(err) throw err;

							// Return list of all user connected to the room to the current user
							socket.emit('updateUsersList', users, true);

							// Return the current user to other connecting sockets in the room
							// ONLY if the user wasn't connected already to the current room
							if(cuntUserInRoom === 1){
								socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
							}
						});
					});
				}
			});
	});



  socket.on('disconnect', function() {

			// Check if user exists in the session

			// Find the room to which the socket is connected to,
			// and remove the current user + socket from this room
			Room.removeUser(socket, function(err, room, userId, cuntUserInRoom){
				if(err) throw err;

				// Leave the room channel
				socket.leave(room.id);

				// Return the user id ONLY if the user was connected to the current room using one socket
				// The user id will be then used to remove the user from users list on chatroom page
				if(cuntUserInRoom === 1){
					socket.broadcast.to(room.id).emit('removeUser', userId);
				}
			});
		});

		// When a new message arrives
	});
}
