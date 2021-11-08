
import React, {Component} from 'react';
import {Row, Col, Container, Image, OverlayTrigger, Popover, Button, Dropdown, Tooltip} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

class QueuePreview extends Component {
    constructor(props) {
        super(props);
        this.deleteQueue = this.deleteQueue.bind(this)
    }

    deleteQueue() {
        this.props.deleteQueue(this.props.user.id, this.props.id)
    }

    containerClass = this.props.started ?
        "float-lg-right mb-2 p-3 d-flex flex-row align-items-center justify-content-between queue-active custom-block"
        :
        "float-lg-right mb-2 p-3 d-flex flex-row align-items-center justify-content-between bg-white custom-block"

    render() {
        return (
            <Container
                className={this.containerClass}>
                <Col>
                    <Row>
                        <h5 className="mb-0 mt-0 d-flex align-items-center">
                                    <span
                                        className="badge custom-badge badge-primary mr-2 mb-1">{this.props.discipline}</span>
                            <b className="mb-1">{this.props.description}</b>
                        </h5>
                    </Row>
                    <Row>
                        <div className="mb-1"><span
                            className="text-muted">Преподаватель: </span>{this.props.teacher}</div>
                    </Row>
                    <Row>
                        {this.props.custom_start && !this.props.started &&
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Запись будет открыта
                            с {this.props.start_date} &nbsp; {this.props.start_time}</Tooltip>}>
                            <div className="mr-1 mr-lg-2">
                                <Image src="static/img/important.svg" width="24"/>
                            </div>
                        </OverlayTrigger>
                        }
                        <Col className="col-12 col-md-auto m-0 p-0">
                            <span
                                className="badge custom-badge badge-info mr-1 mb-1">{this.props.date} &nbsp; {this.props.time}</span>

                        </Col>
                        {this.props.groups && this.props.groups.map((elem, index) =>
                                <span
                                    key={"group_" + index}
                                    className="badge badge-secondary custom-badge mr-1 mb-1"
                                >
                            {elem}
                        </span>
                        )}
                    </Row>
                    <Row className="ml-3">
                        {this.props.tags && this.props.tags.map(elem => <span
                            className="badge badge-pill badge-info"
                            key={`spanTag_${elem}`}
                        >
                            {elem}
                        </span>)}
                    </Row>
                </Col>

                {
                    ((this.props.user.id === this.props.author || this.props.user.role === 'admin')) && this.props.delete &&
                    <Dropdown className={"mr-2 mr-lg-3"}>
                        <Dropdown.Toggle variant="success" id="dropdown-down" className="btn btn-light custom-btn icon-btn drop" as="Button">
                            <Image src="static/img/delete.svg" className="big-icon" width="26" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="drop-menu">
                            <Popover.Title as="h4"><b>Подтвердите действие</b></Popover.Title>
                            <Dropdown.Item className="drop-item mt-2" onClick={this.deleteQueue}>
                                Удалить запись <Image src="/static/img/delete.svg" className="big-icon" width="20" />
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }

                {this.props.id === false ?
                    <Image src="static/img/arrowRight.svg" width="28"/>
                    :
                    < Link className="btn custom-btn icon-btn btn-light mr-0 mr-lg-3"
                           to={`/queue/${this.props.id}`}>
                        <Image src="static/img/arrowRight.svg" width="28"/>
                    </Link>
                }

            </Container>
        )
    }
}


export default QueuePreview;
