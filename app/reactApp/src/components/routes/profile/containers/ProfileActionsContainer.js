import React from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { sign_out } from '../../../../actions/user';
import { connect } from "react-redux";


function ProfileActionsContainer(props) {

    return (
        <Container className="mb-3 p-0 col-12">
            <Container className="custom-paper p-3 bg-light">
                <p className="h5 mb-3 text-center">Панель управления</p>
                <Row>
                    <Col className="col-12 m-2 d-flex flex-column align-items-center">
                        <Link className="mr-3" to="/enqueue">
                            <div className="btn custom-btn  p-2">
                                Cписок очередей
                                <Image src="static/img/list.svg" width="26" className="ml-3 custom-icon" />
                            </div>
                        </Link>
                    </Col>
                    <Col className="col-12 m-2 d-flex flex-column align-items-center">
                        <Link className="mr-3" to="/profile/editor">
                            <div className="btn custom-btn p-2">
                                Редактировать профиль
                                <Image src="static/img/edit.svg" width="26" className="ml-3 custom-icon" />
                            </div>
                        </Link>
                    </Col>
                    <Col className="col-12 m-2 d-flex flex-column align-items-center">
                        <Link onClick={props.onSignOut} to="/auth/signin">
                            <div className="btn custom-btn  p-2">
                                Выйти
                                <Image src="static/img/logout.svg" width="26" className="ml-3 custom-icon" />
                            </div>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    );

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
)(ProfileActionsContainer);
