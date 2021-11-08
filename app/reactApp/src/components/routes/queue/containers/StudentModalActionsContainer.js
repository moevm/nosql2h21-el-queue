
import React from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

function StudentModalActionsContainer(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton >
                <Col>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Действия
                    </Modal.Title>
                </Col>

                <Col className="col-12 col-lg-6 d-flex flex-column align-items-end">
                    <Link className="float-lg-right mr-3" to={`/profile/${props.login}`}>
                        <Button className="custom-btn btn-info" onClick={props.onHide}>Перейти в профиль</Button>
                    </Link>

                </Col>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="col-12 col-lg-4 d-flex flex-column align-items-center mb-2">
                        <Button className="custom-btn" onClick={props.onHide}>Сдал</Button>
                    </Col>
                    <Col className="col-12 col-lg-4 d-flex flex-column align-items-center mb-2">
                        <Button className="custom-btn" onClick={props.onHide}>Необходимы исправления</Button>
                    </Col>
                    <Col className="col-12 col-lg-4 d-flex flex-column align-items-center">
                        <Button className="custom-btn" onClick={props.onHide}>Удалить</Button>
                    </Col>

                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button className="custom-btn btn-secondary" onClick={props.onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>

    );
}



export default StudentModalActionsContainer;
