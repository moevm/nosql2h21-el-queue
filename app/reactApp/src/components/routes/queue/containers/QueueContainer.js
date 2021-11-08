import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap'
import QueueInfoContainer from './QueueInfoContainer'
import StudentsListContainer from './StudentsListContainer'
import 'bootstrap/dist/css/bootstrap.min.css'


class QueueContainer extends Component {
    render() {
        return (
            <Container className="p-3 col-12">
                <Row>
                    <QueueInfoContainer curr_id={this.props.curr_id} />
                    <StudentsListContainer curr_id={this.props.curr_id} />
                </Row>
            </Container>
        );
    }
}


export default QueueContainer;
