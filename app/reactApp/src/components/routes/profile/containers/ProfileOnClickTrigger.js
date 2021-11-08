import React from 'react';
import { Col, Container, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfileOnClickTrigger(props) {


    return (
        <Container
            className="d-flex flex-row align-items-center justify-content-between custom-drop"
            onClick={props.onClick}
        >
            <Col>
                <Col>
                    <h5 className="mb-0">
                        {
                            props.queueFlag ?
                                "Свернуть "
                                :
                                "Развернуть "
                        }
                        список активных очередей
                        </h5>
                </Col>
            </Col>
            <div className="icon-btn mr-3" >
                {
                    props.queueFlag ?
                        <Image src="static/img/upArrow.svg" />
                        :
                        <Image src="static/img/downArrow.svg" />
                }
            </div>
        </Container >
    )

}


export default ProfileOnClickTrigger;
