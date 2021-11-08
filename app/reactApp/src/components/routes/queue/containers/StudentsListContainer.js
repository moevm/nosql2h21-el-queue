
import React, { Component } from 'react';
import { Row, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import ListStudentsDND from './ListStudentsDND'
import ListStudents from './ListStudents'
import headersDefault from '../../../../fetchDefault'
import JoinQueueContainer from './JoinQueueContainer'
import socket from '../../../../WebSocket'
import { sign_out } from "../../../../actions/user";
import { connect } from "react-redux";

class StudentsListContainer extends Component {
    constructor(props) {
        super(props)
        this.updateStudentList = this.updateStudentList.bind(this)
        this.joinQueue = this.joinQueue.bind(this)
        this.state = {
            studentList: [],
            started: false
        }
    }

    joinQueue(user_id, task) {
        fetch('/joinqueue', {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({
                user_id,
                task,
                queue_id: this.props.curr_id,
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                if (data.success === "false")
                    alert(data.causeOfError)
            })
            .then(this.updateStudentList)
    }

    updateStudentList() {
        fetch('/queuestudents', {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({ id: this.props.curr_id })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({ studentList: data.list, started: data.started })
            })
    }


    componentDidMount() {
        socket.emit("join", { room: this.props.curr_id })
        socket.on("queue updated", (data) => {
            this.updateStudentList()
        })
        this.updateStudentList()
    }
    componentDidUpdate(prevProps) {
        socket.emit("leave", { room: this.props.curr_id })
        socket.off("queue updated")
        if (prevProps.curr_id !== this.props.curr_id)
            this.updateStudentList()
    }

    render() {
        return (
            <>
                <JoinQueueContainer joinQueue={this.joinQueue} started={this.state.started} />
                <Container className="p-2 p-lg-4 col-12">
                    <Container className="p-3 custom-paper bg-light col-12">
                        <Row>
                            {this.props.user.role === "student" &&
                                < ListStudents
                                    studentList={this.state.studentList}
                                    updateStudentList={this.updateStudentList}
                                />}
                            {(this.props.user.role === "admin" || this.props.user.role === "teacher") &&
                                < ListStudentsDND
                                    studentList={this.state.studentList}
                                    updateStudentList={this.updateStudentList}
                                />}
                        </Row>

                    </Container>
                </Container>
            </>
        );
    }
}


export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(StudentsListContainer);
