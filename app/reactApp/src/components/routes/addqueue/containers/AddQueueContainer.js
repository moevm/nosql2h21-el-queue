
import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import AddQueueForm from './AddQueueForm'

class AddQueue extends Component {
    render() {
        return (
            <Container className="p-3 mt-1 mt-lg-2">
                <AddQueueForm />
            </Container>
        );
    }
}


export default AddQueue;
