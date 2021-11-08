import React, { Component } from 'react';
import { Row, Col, Container, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'


class ProfileInfoContainer extends Component {
    render() {
        return (
            <Container className="mb-3 p-0 col-12">
                <Container className="custom-paper p-3 bg-light">
                    <Row>
                        <Col className="col-10 col-lg-8">
                            <Row>
                                <Col className="col-12">
                                    <div className="mt-2 mb-2">
                                        <h3 className="mb-0">{this.props.userInfo.name} {this.props.userInfo.surname}</h3>
                                        <div className="text-muted">{this.props.userInfo.login}</div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col className="col-12 d-flex">
                                    <div className="text-muted mr-2">Роль:</div>
                                    {this.props.userInfo.role}
                                </Col>
                                {
                                    this.props.user.role === "student" &&
                                    < Col className="col-12  d-flex">
                                        <div className="text-muted mr-2">Группа:</div>
                                        {this.props.userInfo.group}
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col className="col-12  d-flex mb-1">
                                    <Image src="static/img/profile/github.png" width="20" height="20" />
                                    <div className="text-muted mr-2 ml-1">Github:</div>
                                    {this.props.userInfo.GitID}
                                </Col>
                                <Col className="col-12 d-flex">
                                    <Image src="static/img/profile/moodle.png" className="" width="24" height="24" />
                                    <div className="text-muted mr-2">oodle:</div>
                                    {this.props.userInfo.moodleID}
                                </Col>
                            </Row>
                        </Col>
                        <Col className="col-2 col-lg-4">
                            <Image className="mt-2" src="static/img/profile/avatar.png" width="90%" />
                        </Col>
                    </Row>
                </Container>
            </Container >
        );
    }
}


// export default ProfileInfoContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
    })
)(ProfileInfoContainer)



