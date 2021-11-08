import React, { Component } from 'react';
import { Container, OverlayTrigger, Tooltip, Image } from 'react-bootstrap'
import headersDefault from '../../../../fetchDefault'
import QueuesFilterContainer from "../../../containers/QueuesFilterContainer"
import ListQueues from "../../../containers/ListQueues"
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'
import socket from '../../../../WebSocket'
import { sign_out } from "../../../../actions/user";
import { Link } from "react-router-dom";


class AllQueuesContainer extends Component {

    constructor(props) {
        super(props);
        this.updateQueuesList = this.updateQueuesList.bind(this)
        this.deleteQueue = this.deleteQueue.bind(this)
        this.state = {
            queuesList: [{}],
            filterConfig: {}
        }
    }

    updateQueuesList(data) {
        this.setState({
            filterConfig: data
        })
        fetch('/allqueues', {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({
                discipline: '',
                user_id: this.props.user.id,
                ...data,
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
            .then(this.updateQueuesList)
    }

    componentDidMount() {
        socket.on("allqueue updated", (data) => {
            console.log("run")
            this.updateQueuesList(this.state.filterConfig)
        })
        this.updateQueuesList(this.state.filterConfig)
    }

    componentWillUnmount() {
        socket.off("allqueue updated")

    }

    render() {
        return (
            <Container className="p-3 mt-1 mt-lg-2 col-12">
                <Container className="p-2 p-lg-3 custom-paper bg-light col-12">
                    <div className="h5 ml-2 mb-3 d-flex justify-content-between">
                        <div>Очереди</div>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Очереди, в которые уже можно записаться, имеют фиолетовую тень</Tooltip>}>
                            <div className="mr-0 mr-lg-3">
                                <Image src="static/img/info.svg" width="24" />
                            </div>
                        </OverlayTrigger>
                    </div>
                    <QueuesFilterContainer
                        discipline={true}
                        teacher={this.props.user.role === "admin"}
                        sendConfig={this.updateQueuesList}
                    />
                    <ListQueues
                        queuesList={this.state.queuesList} user={this.props.user}
                        deleteQueue={this.deleteQueue}
                    />
                </Container>
            </Container>
        );
    }
}


// export default AllQueuesContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(AllQueuesContainer)