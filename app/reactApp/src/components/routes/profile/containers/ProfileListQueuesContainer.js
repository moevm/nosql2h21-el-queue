import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap'
import headersDefault from '../../../../fetchDefault'
import QueuesFilterContainer from "../../../containers/QueuesFilterContainer"
import ListQueues from '../../../containers/ListQueues'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'
import { sign_out } from "../../../../actions/user";


class ProfileListQueuesContainer extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.sendConfig = this.sendConfig.bind(this)
        this.state = {
            queuesList: [],
            queuesFlag: false,
        }

    }
    handleClick() {
        this.setState(({ queuesFlag }) => ({ queuesFlag: !queuesFlag }))
    }

    sendConfig(data) {
        fetch('/profilequeues', {
            method: 'POST',
            headers: headersDefault(),

            body: JSON.stringify({
                ...data,
                login: this.props.curr_login,
                role: this.props.user.role,
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({ queuesList: data })
            })

    }

    deleteQueue(user_id, queue_id) {
        fetch('/deletequeue', {
            method: 'POST',
            headers: headersDefault(),

            body: JSON.stringify({
                queue_id: queue_id,
                user_id: user_id,
            })
        })
            .then(data => data.json())
            .then(this.componentDidMount)
    }

    componentDidMount() {
        this.sendConfig({ teacher: '' })

    }
    render() {
        return (
            <>
                <Container className="p-0">
                    <Container className="p-3 bg-light custom-paper" >
                        <Row>
                            <Col>
                                <h5 className="mb-1">
                                    Список активных очередей
                                </h5>
                            </Col>
                        </Row>
                        <Row className="p-1 p-lg-3">

                            <QueuesFilterContainer
                                discipline={true}
                                teacher={this.props.user.role === "admin"}
                                sendConfig={this.sendConfig} />

                            <ListQueues queuesList={this.state.queuesList} user={this.props.user} deleteQueue={this.deleteQueue} />
                        </Row>

                    </Container >
                </Container>
            </>
        );
    }
}


// export default ProfileListQueuesContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(ProfileListQueuesContainer)
