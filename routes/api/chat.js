const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const router = express.Router();
const  Room = require('../../models/Room');
const  Message = require('../../models/Message');
const  Notification = require('../../models/Notification');

router.get('/rooms', (req, res)=>{
  Room.find({forNotify: false})
  .then(rooms => res.json(rooms))
  .catch(err => console.log(err));
});

//{title: {$regex: "(?i)^(?!.*[a-z])[a-z0-9]{8,20}$"}}
router.get('/messages/:id', (req, res)=>{
  console.log('message firing here')
  console.log(req.params.id);
  Message.find({room : req.params.id}).populate('user')
  .then(messages => res.json(messages))
  .catch(err => console.log(err));
});

router.post('/messages', (req, res)=>{
  console.log('backend fired');
 const newMessage = new Message({
   user: req.body.user,
   text: req.body.text,
   room: req.body.room
 });
 console.log('this is new message', newMessage);
 newMessage.save().then(message => res.json(message));
});

router.delete('delete/:roomId', (req, res)=>{
  console.log('here is the room id on the server', req.params.roomId);
  Room.findById(req.params.roomId)
  .then(room => {
     room.remove().then(() => res.json({ success: true }));
  }).catch(err => console.log(err));
});

router.post('/sendNotification', (req, res)=> {
  console.log('you are the oneeeee')
  const newNotification = new Notification({
    recipient: req.body.recipient,
    text: req.body.text
  });
  newNotification.save().then(() => res.json({success: true}))
})

router.get('/getNotifications/:userId', (req, res)=>{
  Notification.find({recipient: req.params.userId})
  .then(notifications => res.json(notifications))
  .catch(err => console.log(err));
})

router.delete('/deleteNotification/:id', (req, res)=> {
  Notification.findOne({_id: req.params.id})
  .then((notification)=>{
    notification.remove().then(()=>res.json({success:true}))
  })
  .catch(err => console.log('notification delete error', err));
})

router.get('/getCurrentRoom/:roomId', (req, res) => {
  Room.findOne({_id: req.params.roomId})
  .then(room => res.json(room))
  .catch(err => console.log(err));
})



module.exports = router;
