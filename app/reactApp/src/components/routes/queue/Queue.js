
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import QueueContainer from './containers/QueueContainer'

class Queue extends Component {
    render() {
        return (
            <QueueContainer curr_id={this.props.match.params.curr_id}/>
        );
    }
}

export default Queue;
