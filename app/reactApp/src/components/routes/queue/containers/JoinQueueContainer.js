import React, {Component} from 'react';
import {Row, Col, Container, Image, Button, Form, Dropdown, Popover} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import {connect} from 'react-redux'

class JoinQueueContainer extends Component {
    constructor(props) {
        super(props)
        this.joinQueue = this.joinQueue.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.taskCheck = this.taskCheck.bind(this)
        this.state = {
            taskValue:"",
            taskError:false,
            taskRule:[
                v => !!v || "Введите значение.",
                v => v.length > 2 || "Миниальная длина: 2 символа",
            ]
        }

    }

    async joinQueue() {
        await this.taskCheck(this.state.taskValue)
        if (!this.state.taskError)
            this.props.joinQueue(this.props.user.id, this.state.taskValue)
    }

    handleOnChange(event) {
        const value = event.target.value
        this.taskCheck(value)
        this.setState({taskValue:value})
    }

    taskCheck(value) {
        this.setState(prevState => {
            const errors = prevState.taskRule.map(e => {
                let err = e(value)
                return err !== true ? err : null
            })
                .filter(function (e) {
                    return e !== null
                })
                .map(e => <p className="p-0 m-0">{e}</p>)
            prevState.taskError = errors.length === 0 ? false : errors
            return prevState
        })
    }

    render() {
        return (
            <Container className="p-2 p-lg-4 col-12 col-lg-6">
                <Container className="p-3 custom-paper bg-light">

                    {
                        this.props.started ?
                            <Row>
                                <Col className="d-flex align-items-end col-12 col-lg-3">
                                    <h5> Записаться </h5>
                                </Col>
                                <Col className="d-flex flex-row align-items-end col-12 col-lg-7">
                                    <Form.Label className="mr-3 d-none d-lg-block"> Работа: </Form.Label>
                                    <Form.Group controlId="exampleForm.ControlSelect2" className="p-0 m-0 w-100">
                                        <Form.Control
                                            isInvalid={!!this.state.taskError}
                                            placeholder="Введите значение"
                                            className="custom-textform"
                                            type="text"
                                            value={this.state.taskValue}
                                            onChange={this.handleOnChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.taskError}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mt-2 mt-lg-0">
                                    <Dropdown className={"mr-2 mr-lg-3"}>
                                        <Dropdown.Toggle variant="success" id="dropdown-down"
                                                         className="btn btn-light custom-btn icon-btn drop" as="Button">
                                            <Image src="static/img/plusBlack.svg" className="big-icon" width="28"/>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="drop-menu">
                                            <Popover.Title as="h4"><b>Подтвердите действие</b></Popover.Title>
                                            <Dropdown.Item className="drop-item mt-2" onClick={this.joinQueue}>
                                                Записаться <Image src="/static/img/accept.svg" width="24"/>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col className="d-flex align-items-end col-12">
                                    <h5> Запись в очередь еще не доступна </h5>
                                </Col>
                            </Row>
                    }
                </Container>
            </Container>
        );
    }
}


// export default JoinQueueContainer;
export default connect(
    state => ({
        user:state.user
    }),
    dispatch => ({})
)(JoinQueueContainer)

