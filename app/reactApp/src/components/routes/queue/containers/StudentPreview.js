import React, { Component, useState } from 'react';
import {
    Row,
    Col,
    Container,
    Image,
    Button,
    DropdownButton,
    Dropdown,
    Popover,
    OverlayTrigger,
    Form
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux'
import StudentModalActionsContainer from './StudentModalActionsContainer'
import StudentActionsContainer from './StudentActionsContainer'
import headersDefault from "../../../../fetchDefault";
import socket from "../../../../WebSocket";
import { sign_out } from "../../../../actions/user";


class StudentPreview extends Component {
    constructor(props) {
        super(props)
        this.action = this.action.bind(this)
        this.updateCommentList = this.updateCommentList.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.state = {
            commentValue: "",
            comments: []
        }
        console.log("constr")
    }

    updateCommentList() {
        fetch('/comments', {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({
                queue_id: window.location.hash.split('/')[2],
                record_id: this.props.id,
            })
        })
            .then(data => data.json())
            .then(data => {
                this.setState({ comments: data })
                console.log(this.state.comments)
            })
    }

    action() {
        fetch('/queue/comment',
            {
                method: "POST",
                headers: headersDefault(),

                body: JSON.stringify({
                    queue_id: window.location.hash.split('/')[2],
                    record_id: this.props.id,
                    value: this.state.commentValue,
                    author: this.props.user.id
                })
            })
            .then(data => data.json())
            .then(this.updateCommentList)
    }


    componentDidMount() {
        this.updateCommentList()
    }

    handleOnChange(event) {
        const value = event.target.value
        this.setState({ commentValue: value })
    }

    render() {
        console.log("0-----------0")
        return (
            <Container className="bg-white col-12 custom-block queue-element p-2 mb-2">
                <Row>
                    <Col className="col-12 col-lg-4 d-flex align-items-center">
                        <div>
                            <span className="badge custom-badge badge-primary mr-1 mr-lg-3 ml-0 ml-lg-2">
                                <big className="font-weight-bold">{this.props.index || "0"}</big>
                            </span>
                            {this.props.group && <>
                                <span className="badge custom-badge badge-info mr-1 mr-lg-2">
                                    <big className="font-weight-lighter">{this.props.group}</big>
                                </span>
                            </>}
                            <big className="align-middle">
                                {this.props.name} {this.props.surname}
                            </big>

                        </div>
                    </Col>
                    <Col className="col-auto mt-2 mb-2 mt-lg-0 mb-lg-0 col-lg-4 d-flex align-items-center">
                        <big className="ml-2"><b>{this.props.task}</b></big>
                    </Col>
                    <Col className="col-12 col-lg-3 d-flex justify-content-start align-items-center">
                        <Dropdown className="mr-1 mr-lg-2">
                            <Dropdown.Toggle variant="success" id="dropdown-down"
                                className="btn btn-light custom-btn icon-btn drop" as="Button">
                                <Image src="static/img/dots.svg" className="big-icon" width="26" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="drop-menu">
                                <Container>
                                    <div>
                                        <span className="text-muted">Дата:</span> {this.props.date}
                                    </div>
                                    <div>
                                        <span className="text-muted">Кол-во записей:</span> {this.props.count}
                                    </div>
                                    <div>
                                        <span className="text-muted">Логин:</span> {this.props.login}
                                    </div>
                                </Container>
                            </Dropdown.Menu>
                        </Dropdown>
                        {
                            (this.props.user.role !== 'student' || this.props.user.id === this.props.author) &&
                            <Dropdown className="mr-1 mr-lg-2">
                                <Dropdown.Toggle variant="success" id="dropdown-down"
                                    className="btn btn-light custom-btn icon-btn drop" as="Button">
                                    <Image src="static/img/comments.svg" className="big-icon" width="26" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="comments">
                                    <Container className="mt-2">
                                        {
                                            this.state.comments && this.state.comments.map(comment =>
                                                <div className="mb-1 custom-card border bg-light p-2">
                                                    <div className="text-info m-0 p-0">{comment.author}</div>
                                                    <div>{comment.text}</div>
                                                    <small className="text-muted">{comment.date}</small>
                                                </div>
                                            )
                                        }

                                        <hr />
                                        <Form.Group controlId="formGridDescription"
                                            className="d-flex align-items-center">
                                            <Form.Control
                                                name={"description"}
                                                as="textarea"
                                                className="custom-form locked-height form-control-sm"
                                                rows="2"
                                                placeholder="Оставьте комментарий..."
                                                value={this.state.taskValue}
                                                onChange={this.handleOnChange}
                                            />
                                            <Button className="ml-2 btn btn-light custom-btn icon-btn"
                                                onClick={this.action}>
                                                <Image src="static/img/send.svg" className="big-icon" width="28" />
                                            </Button>
                                        </Form.Group>
                                    </Container>
                                </Dropdown.Menu>
                            </Dropdown>
                        }

                        {
                            <StudentActionsContainer
                                record_id={this.props.id}
                                updateStudentList={this.props.updateStudentList}
                                allowDelete={this.props.user.role !== 'student' || this.props.user.id === this.props.author}
                                allowMove={this.props.user.role !== 'student'}
                            />
                        }
                        {/* <Dropdown className={"mr-2"}>
                        <Dropdown.Toggle variant="success" id="dropdown-down"
                            className="btn btn-light custom-btn icon-btn drop" as="Button">
                            <Image src="static/img/arrowBoth.svg" width="28" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="drop-menu">
                            <Dropdown.Item className="drop-item">
                                В начало <Image src="/static/img/arrowTop.svg" width="25" />
                            </Dropdown.Item>
                            <Dropdown.Item className="drop-item">
                                Выше на 1 <Image src="/static/img/arrowUp.svg" width="20" />
                            </Dropdown.Item>
                            <Dropdown.Item className="drop-item">
                                Ниже на 1 <Image src="/static/img/arrowDown.svg" width="20" />
                            </Dropdown.Item>
                            <Dropdown.Item className="drop-item">
                                В конец <Image src="/static/img/arrowLast.svg" width="23" />
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    */}
                        {
                            /*
                            <Button
                            className="btn custom-btn icon-btn mr-2"
                            variant="link"
                            onClick={() => setModalShow(true)}>
                            <Image src="static/img/caretRight.svg"/>
                        </Button>
                        <StudentModalActionsContainer
                            login={props.login}
                            show={modalShow}
                            onHide={() => {
                                setModalShow(false)
                            }}
                            />
                            */
                        }

                    </Col>

                    {/*<Col>
                    {props.tags && props.tags.map(elem =>
                        <span
                            className="badge custom-badge badge-primary"
                            key={"spanStudentTag_" + elem}
                        >
                            {elem}
                        </span>
                    )}
                </Col>*/}
                </Row>
            </Container >
        );
    }
}


// export default StudentPreview;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(StudentPreview)
