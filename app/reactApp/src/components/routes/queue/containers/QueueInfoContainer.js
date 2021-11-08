import React, {Component} from 'react';
import {Container, Row, Col, Image, Button, Dropdown, Popover} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import headersDefault from '../../../../fetchDefault'
import {sign_out} from "../../../../actions/user";
import {connect} from "react-redux";


class QueueInfoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs:{
                discipline:"",
                groups:[""],
                date:"",
                time:"",
                teacher:"",
                description:"",
                custom_start:false,
                start_date:"",
                start_time:""
            }
        }

        this.updateInfo = this.updateInfo.bind(this)
        this.redirectWithConfigs = this.redirectWithConfigs.bind(this)
    }

    updateInfo() {
        fetch('/queueInfo', {
            method:'POST',
            headers:headersDefault(),

            body:JSON.stringify({id:this.props.curr_id})
        })
            .then(data => data.json())
            .then(data => {
                this.setState({configs:data})
            })
    }

    redirectWithConfigs() {
        let configs = this.state.configs
        configs.prevQueueId = this.props.curr_id
        let queryParams = Object.entries(configs).map(([key, value]) => `${key}=${value}`).join('&')
        let a = window.location.hash = '/addqueue?' + queryParams

    }


    componentDidMount() {
        this.updateInfo()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.curr_id !== this.props.curr_id)
            this.updateInfo()
    }

    render() {
        return (
            <Dropdown as="Container" className="col-12 col-lg-6 p-0 m-0">
                <Dropdown.Toggle as="div"  className="p-2 p-lg-4 col-12 drop">
                    <Container className="custom-paper p-3 bg-light click-reaction">
                        <Row>
                            <Col className="col-2 col-lg-2 d-flex justify-content-end align-items-start">
                                <Image className="mt-2 custom-queue-icon" src="static/img/queue.svg" width="90%"/>
                            </Col>
                            <Col className="col-10 col-lg-5">
                                <Row>
                                    <Col className="col-12">
                                        <div className="mt-2">
                                            <div
                                                className="mb-2 text-secondary font-weight-bold">{this.state.configs.date} {this.state.configs.time}</div>
                                            <h5 className="mb-0 d-flex align-items-center">
                                                <span
                                                    className="badge custom-badge badge-primary mr-2 mb-1">{this.state.configs.discipline}</span>
                                                <b className="mb-1">{this.state.configs.description}</b>
                                            </h5>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="col-10 col-lg-5 d-flex flex-column justify-content-center">
                                <Row>
                                    <Col className="col-12 d-flex">
                                        <div className="text-muted mr-2">Преподаватель:</div>
                                        {this.state.configs.teacher}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="col-12  d-flex">
                                        <div className="text-muted mr-2">Группы:</div>
                                        {this.state.configs.groups.join(', ')}
                                    </Col>
                                </Row>
                                {
                                    this.state.configs.custom_start &&
                                    <Row>
                                        <Col className="col-12  d-flex">
                                            <div className="text-muted mr-2">Открытие:</div>
                                            <b className="text-info">{this.state.configs.start_date} {this.state.configs.start_time}</b>
                                        </Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    </Container>
                </Dropdown.Toggle>
                {this.props.user.role !== 'student' &&
                <Dropdown.Menu className="drop-menu ml-4">
                    <Popover.Title as="h4"><b>Опции</b></Popover.Title>
                    <Dropdown.Item className="drop-item mt-2" onClick={this.redirectWithConfigs}>
                        Создать копию <Image src="/static/img/copy.svg" className="big-icon ml-1" width="24"/>
                    </Dropdown.Item>
                </Dropdown.Menu>}

            </Dropdown>
        );
    }
}


export default connect(
    state => ({
        user:state.user
    }),
    dispatch => ({
        onSignOut:(data) => {
            dispatch(sign_out(data))
        }
    })
)(QueueInfoContainer);
