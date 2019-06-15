const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient:{
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  text:{
    type: String,
    required: true
  },
});

module.exports = Notification = mongoose.model('notifications', NotificationSchema);
