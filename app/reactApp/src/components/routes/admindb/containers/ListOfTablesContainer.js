import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import ListOfTables from './ListOfTables'
import { Container } from 'react-bootstrap';


class ListOfTablesContainer extends Component {
    render() {
        return (
        <Container className="p-3 col-12">
            <ListOfTables />
        </Container>
        );
    }
}


export default ListOfTablesContainer;
