import React, { Component } from 'react';
import { Row, Col, Container, Button, FormControl, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'
import { info_upd } from '../../../../actions/user';
import headersDefault from "../../../../fetchDefault"



class ProfileEditorContainer extends Component {
    constructor(props) {
        super(props)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleVerify = this.handleVerify.bind(this)
        this.handleFullVerify = this.handleFullVerify.bind(this)

        this.state = {
            values: {
                email: '',
                login: '',
                name: '',
                surname: '',
                patronymic: '',
                GithubLogin: '',
                MoodleLogin: '',
            },
            errors: {
                login: false,
                email: false,
                name: false,
                surname: false,
                patronymic: '',
                GithubLogin: false,
                MoodleLogin: false,

            },
            rules: {
                email: [
                    v => !v || v.search(/^(([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6})$/g) !== -1 || "Формат почты не верный"
                ],
                login: [
                    v => !v || v.length > 5 || "Логин должен быть длиннее 5 символов.",
                    v => !v || v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "Логин может содержать только символы _ - 0-9 a-z A-Z.",
                    v => !v || v.search(/^[a-zA-Z]/) !== -1 || "Логин может начинаться только на символы a-z A-Z.",
                ],
                name: [
                    v => !v || v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Имя может содержать только символы - а-я А-Я a-z A-Z"
                ],
                surname: [
                    v => !v || v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Фамилия может содержать только символы - а-я А-Я a-z A-Z"
                ],
                patronymic: [
                    v => !v || v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Отчество может содержать только символы - а-я А-Я a-z A-Z"
                ],
                GithubLogin: [
                    v => !v || v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "GithubLogin может содержать только символы _ - 0-9 a-z A-Z.",
                    v => !v || v.search(/^[a-zA-Z]/) !== -1 || "GithubLogin может начинаться только на символы a-z A-Z.",
                ],
                MoodleLogin: [
                    v => !v || v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "MoodleLogin может содержать только символы _ - 0-9 a-z A-Z.",
                    v => !v || v.search(/^[a-zA-Z]/) !== -1 || "MoodleLogin может начинаться только на символы a-z A-Z.",
                ],
            },

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
    async handleFullVerify() {

        await Object.entries(this.state.values).forEach(([key, value]) => {
            this.handleVerify(key, value)
        })
        console.log(JSON.stringify(this.state.errors))
        return Object.values(this.state.errors).every(e => !e)
    }
    handleOnClick() {
        this.handleFullVerify()
            .then(data => {
                if (data)
                    fetch("/profile/editor/updateinfo", {
                        method: 'POST',
                        headers: headersDefault(),

                        body: JSON.stringify({
                            user_id: this.props.user.id,
                            newData: {
                                ...this.state.values
                            }
                        })
                    })
                        .then(data => data.json())
                        .then(data => {
                            if (data.success === true) {
                                this.props.onInfoUpd(data.newInfo)
                            }
                            console.log(data)
                        })
            })
    }

    render() {
        return (
            <Container className="m-3 p-0 col-12">
                <Container className="custom-paper p-3 bg-light">
                    <Col className="col-12 m-2 d-flex flex-column align-items-center">
                        <h5> Редактировать профиль</h5>
                    </Col>
                    <Col>
                        <Row>
                            <p className="mb-0">Сейчас ФИО: <b> {this.props.userInfo.name} {this.props.userInfo.surname} {this.props.userInfo.patronymic}</b></p>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новое Имя</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.name}
                                    name={"name"}
                                    value={this.state.values.name}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новое имя"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.name}
                                </FormControl.Feedback>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новая Фамилия</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.surname}
                                    name={"surname"}
                                    value={this.state.values.surname}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новая фамилия"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.surname}
                                </FormControl.Feedback>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новое Отчество</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.patronymic}
                                    name={"patronymic"}
                                    value={this.state.values.patronymic}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новое отчество"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.patronymic}
                                </FormControl.Feedback>
                            </InputGroup>
                        </Row>
                        <Row>
                            <p className="mb-0">Сейчас Почта: <b>{this.props.userInfo.email}</b></p>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новая Почта</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.email}
                                    name={"email"}
                                    value={this.state.values.email}
                                    onChange={this.handleOnChange}
                                    type="email"
                                    placeholder="Новая почта"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.email}
                                </FormControl.Feedback>
                            </InputGroup>
                        </Row>
                        <Row>
                            <p className="mb-0">Сейчас Логин: <b>{this.props.userInfo.login}</b> </p>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новый Логин</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.login}
                                    name={"login"}
                                    value={this.state.values.login}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новый логин"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.login}
                                </FormControl.Feedback>
                            </InputGroup>
                        </Row>
                        <Row>
                            <p className="mb-0">Сейчас GithubLogin: <b>{this.props.userInfo.GithubLogin}</b></p>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новый GithubLogin</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.GithubLogin}
                                    name={"GithubLogin"}
                                    value={this.state.values.GithubLogin}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новый GithubLogin"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.GithubLogin}
                                </FormControl.Feedback>
                            </InputGroup>
                        </Row>
                        <Row>
                            <p className="mb-0">Сейчас MoodleLogin: <b> {this.props.userInfo.MoodleLogin}</b> </p>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="custom-form">Новый MoodleLogin</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    isInvalid={!!this.state.errors.MoodleLogin}
                                    name={"MoodleLogin"}
                                    value={this.state.values.MoodleLogin}
                                    onChange={this.handleOnChange}
                                    type="text"
                                    placeholder="Новый MoodleLogin"
                                    className="custom-endform"
                                />
                                <FormControl.Feedback type="invalid">
                                    {this.state.errors.MoodleLogin}
                                </FormControl.Feedback>
                            </InputGroup>
                        </Row>
                    </Col>
                    <Link
                        className="btn icon-btn mr-3"
                        to={`/profile/${this.props.user.login}`}>
                        <Button
                            variant="danger"
                            className="custom-btn mr-3 mb-2"
                        >
                            Отмена
                        </Button>
                    </Link>
                    <Link
                        className="btn icon-btn mr-3"
                        to={`/profile/${this.props.user.login}`}>
                        <Button
                            variant="success"
                            className="custom-btn mr-3 mb-2"
                            onClick={this.handleOnClick}
                        >
                            Сохранить
                        </Button>
                    </Link>

                </Container>
            </Container >
        );
    }
}


// export default ProfileEditorContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onInfoUpd: (data) => {
            dispatch(info_upd(data))
        }
    })
)(ProfileEditorContainer)



