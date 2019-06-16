import React from 'react';
import axios from 'axios';
import {Button, Icon, Row, Col, Card} from 'react-materialize';
import { connect } from 'react-redux';
import {deleteNotification} from '../../actions';

class NotificationContainer extends React.Component{
  //pass to paarent that the notification has been deleted
  onDelete(id){
    console.log('this is the id on delele', id);
    this.props.deleteNotification(id);
  }
  render(){
    console.log('this is the notification', this.props.notification);
    let theId = this.props.notification._id;
    console.log('these are the props in the niftification room', this.props);
    return(
      <div className="container">
      <div class="col s12 m8 offset-m2 l6 offset-l3">
          <span>{this.props.notification.text}</span>
         <span><Button onClick={this.onDelete.bind(this, theId)}>Delete</Button></span>
    </div>
  </div>
    );
  }
}

export default connect(null, {deleteNotification})(NotificationContainer);
