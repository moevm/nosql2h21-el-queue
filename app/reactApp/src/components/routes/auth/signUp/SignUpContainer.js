import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Container, Alert } from 'react-bootstrap'
import headersDefault from '../../../../fetchDefault'
import { sign_in } from '../../../../actions/user';
import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import SignUpGitForm from './SignUpGitForm'
import OAuthContainer from '../oauth/OAuthContainer'


// import socket from '../../../WebSocket'


class SignUpContainer extends Component {

    constructor(props) {
        super(props);
        this.handleGitChecker = this.handleGitChecker.bind(this)
        this.state = {
            currForm:
                <>
                    <SignUpForm curr_key={this.props.curr_key} />
                    <OAuthContainer />
                </>
        }
    }

    handleGitChecker() {

        let queryString = window.location.search
        let urlParams = new URLSearchParams(queryString);
        let code = urlParams.get("code")
        if (code) {
            this.setState({
                currForm:
                    <Container className="d-flex justify-content-center m-5 p-5">
                        <Spinner animation="border" />
                    </Container>
            })
            window.history.pushState({}, null, '/' + window.location.hash)
            fetch('/authenticate', {
                method: "POST",
                headers: headersDefault(),

                body: JSON.stringify({ code })
            })
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        console.error(data.error)
                        this.setState({
                            currForm:
                                <Container className="col-12 col-lg-6 p-3 ">
                                    <Alert variant="danger">
                                        Ошибка: {data.error}. Нажмите
                                        <Alert.Link href="#/auth/signin"> тут </Alert.Link>
                                        чтобы перейти на страницу авторизации.
                                    </Alert>
                                </Container>
                        })
                    }
                    else if (data.needReg)
                        this.setState({
                            currForm: <SignUpGitForm
                                email={data.email}
                                gitLogin={data.gitLogin}
                                gitId={data.gitId}
                            />
                        })
                    else if (data.isAuth) {
                        delete data.needReg
                        fetch('/signin', {
                            method: 'POST',
                            headers: {
                                Authorization:"JWT " + localStorage.getItem("accesstoken"),
                                'Content-Type':'application/json;charset=utf-8'
                            },
                            body: JSON.stringify({
                                login:data.login,
                                password:"github"
                            })
                        })
                            .then(data => data.json())
                            .then(data => {
                                console.log("SSS" + data)
                                if (data.isAuth) {
                                    this.props.onSignIn(data)
                                    window.location.hash = "#/"
                                }
                                else {
                                    alert(data.causeOfError)
                                }
                            })
                    }
                })
        }
    }

    componentDidMount() {
        this.handleGitChecker();
    }
    render() {
        return this.state.currForm
    }
}
// export default SignUpContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignIn: (data) => {
            dispatch(sign_in(data))
        }
    })
)(SignUpContainer)

