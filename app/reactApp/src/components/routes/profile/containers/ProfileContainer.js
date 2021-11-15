import React, { Component } from 'react';
import { Row, Container, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileInfoContainer from './ProfileInfoContainer'
import ProfileQueuesListContainer from './ProfileListQueuesContainer'
import ProfileActionsContainer from "./ProfileActionsContainer";
import headersDefault from "../../../../fetchDefault"
import { sign_out } from "../../../../actions/user";


class ProfileContainer extends Component {


    constructor(props) {
        super(props);

        this.getInfo = this.getInfo.bind(this)
        this.state = {
            userInfo: {
                login: "",
                role: "",
                name: "",
                patronymic: "",
                surname: "",
                GitID: "",
                moodleID: "",
                group: "",
            }
        }

    }

    getInfo() {
        this.setState({ URLlogin: this.props.curr_login })
        fetch("/profile", {
            method: 'POST',
            headers: headersDefault(),
            body: JSON.stringify({ login: this.props.curr_login })
        })
            .then(data => data.json())
            .then(res => {
                console.log(res)
                this.setState(prevState => {
                    prevState.userInfo = res
                    return prevState
                })
                if (res === "NotFounded") {
                }
            })
    }


    componentDidMount() {
        this.getInfo()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.curr_login !== this.props.curr_login)
            this.getInfo()
    }

    render() {
        return (
            <Container className="col-12 mt-3 mt-lg-0 p-lg-4">
                <Row>
                    <Col className="col-12 col-lg-4">
                        <ProfileInfoContainer
                            userInfo={this.state.userInfo}
                        />
                        {(this.props.curr_login === this.props.user.login) &&
                            <ProfileActionsContainer />}
                    </Col>
                    <Col className="col-12 col-lg-8">
                        {
                            (this.props.curr_login === this.props.user.login || this.props.user.role === "admin" || this.props.user.role === "student") &&
                            <ProfileQueuesListContainer curr_login={this.props.curr_login} />
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}


// export default ProfileContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(ProfileContainer)


