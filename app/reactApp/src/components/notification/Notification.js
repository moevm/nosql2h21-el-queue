import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Toast, Image} from 'react-bootstrap'

import "../styles/styles.css"


function Notification(props) {
    const [show, setShow] = useState(true);
    return (
        <Row>
            <Col xs={6}>
                <Toast onClose={() => {
                    setShow(false)
                }}
                       className="custom-paper m-3"
                       show={show}
                       delay={3000}
                       autohide
                >
                    <Toast.Header>
                        <img
                            className="rounded mr-2"
                            alt=""
                        />
                        <strong className="mr-auto">{props.head}</strong>
                        <small>{props.type}</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Col>
                            {props.message}
                            <Row>
                                {props.tags && props.tags.map((elem, index) =>
                                        <span
                                            key={"nottag_" + index}
                                            className="badge badge-secondary custom-badge mr-1 mb-1"
                                        >
                    {elem}
                  </span>
                                )}
                                {props.link &&
                                < a href={props.link} className="btn custom-btn icon-btn mr-3">
                                    <Image src="static/img/arrowRight.svg" width="28"/>
                                </a>
                                }
                            </Row>
                        </Col>
                    </Toast.Body>
                </Toast>
            </Col>
        </Row>
    );
}

export default Notification