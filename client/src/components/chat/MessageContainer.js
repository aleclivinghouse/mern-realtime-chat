import React from 'react';
import axios from 'axios';
import {Button, Icon, Row, Col, Card} from 'react-materialize';
import { connect } from 'react-redux';

class MessageContainer extends React.Component{
  render(){
      let content;
      if(this.props.message.user.picture === null || this.props.message.user.picture === undefined){
        content = <h4>Loading</h4>
      } else{
        content = (
          <div class="card-panel grey lighten-5">
            <div class="row valign-wrapper">
              <div class="col s2">
                   <img src={this.props.message.user.picture} height="80px"/>
                  <p>{this.props.message.user.username}</p>
              </div>
              <h4 class="col s10 text-center offset-l3">
                      {this.props.message.text}
              </h4>

            </div>
          </div>
        )
      }
    return(
      <div className="container">
      <div class="col s12 m8 offset-m2 l6 offset-l3">
      {content}
    </div>
  </div>
    );
  }
}

export default MessageContainer;
