import { Col, Container, Form, Button } from 'react-bootstrap'
import headersDefault from '../../../../fetchDefault'
import { sign_in } from '../../../../actions/user';
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

// import socket from '../../../WebSocket'


class SignInForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFullVerify = this.handleFullVerify.bind(this)
        this.handleVerify = this.handleVerify.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.state = {
            values: {
                login: '',
                password: '',
            },
            errors: {
                login: false,
                password: false,

            },
            rules: {
                login: [
                    v => !!v || "Введите логин.",
                ],
                password: [
                    v => !!v || "Введите пароль.",
                ],

            }
        }
    }
    handleOnChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState(prevState => {
            prevState.values[name] = value
            return prevState
        })
        this.handleVerify(name, value)
    }
    async handleFullVerify() {

        await Object.entries(this.state.values).forEach(([key, value]) => {
            if (key === "secretKey")
                if (this.state.values.role === "Студент")
                    return
            if (key === "group")
                if (this.state.values.role !== "Студент")
                    return

            this.handleVerify(key, value)
        })
        console.log(JSON.stringify(this.state.errors))
        return Object.values(this.state.errors).every(e => !e)
    }

    handleVerify(name, value) {
        this.setState(prevState => {
            const errors = prevState.rules[name].map(e => {
                let err = e(value)
                return err !== true ? err : null
            })
                .filter(function (e) {
                    return e !== null
                })
                .map(e => <p className="p-0 m-0">{e}</p>)
            prevState.errors[name] = errors.length === 0 ? false : errors
            return prevState
        })
    }


    handleSubmit(event) {
        this.handleFullVerify()
            .then((data) => {
                if (data) {
                    fetch('/signin', {
                        method: 'POST',
                        headers: {
                            Authorization:"JWT " + localStorage.getItem("accesstoken"),
                            'Content-Type':'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(this.state.values)
                    })
                        .then(data => data.json())
                        .then(data => {
                            console.log(data)
                            if (data.isAuth) {
                                this.props.onSignIn(data)
                                window.location.hash = "#/"
                            }
                            else {
                                alert("Неверный логин или пароль")
                            }

                        })
                    event.preventDefault();
                }
            })
        event.preventDefault();
    }

    render() {
        return (
            <Container className="col-12 col-lg-6 p-3 ">
                <Container className="custom-paper bg-light p-3">
                    <p className="h5 mb-3 text-center">Авторизация</p>
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicLogin">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    isInvalid={!!this.state.errors.login}
                                    name={"login"}
                                    value={this.state.values.login}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Введите логин"
                                    className="custom-textform"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.login}
                                </Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                    Ваш логин не будет передан третьим лицам.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    isInvalid={!!this.state.errors.password}
                                    name={"password"}
                                    value={this.state.values.password}
                                    onChange={this.handleOnChange}
                                    type="password"
                                    placeholder="Введите пароль"
                                    className="custom-textform"
                                    ref={(input) => this.passwordInput = input}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="custom-btn mr-3 mb-2">
                                Войти
                            </Button>
                            <Link className="btn custom-btn icon-btn mr-3" to="/auth/signup">
                                <Button variant="secondary" className="custom-btn mr-3 mb-2">
                                    Регистрация
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Container>
            </Container>

        );
    }
}


// export default SignInForm;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignIn: (data) => {
            dispatch(sign_in(data))
        }
    })
)(SignInForm)
