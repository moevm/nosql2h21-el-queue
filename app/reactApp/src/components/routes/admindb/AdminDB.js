import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import ListOfTablesContainer from './containers/ListOfTablesContainer'
import TableContainer from './containers/TableContainer'
import KeysContainer from './containers/KeysContainer'



class AdminDB extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <Router basename='/admindb'  >
                <Switch>
                    <Route exact path="/" component={ListOfTablesContainer} />
                    <Route path="/:table_name" component={TableContainer} />
                    <Redirect strict to="/" />
                </Switch >
            </Router >
        );


    }
}


export default AdminDB;


