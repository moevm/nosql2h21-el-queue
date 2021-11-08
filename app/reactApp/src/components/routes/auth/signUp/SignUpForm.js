import {Col, Container, Form, Button} from 'react-bootstrap'
import ReCAPTCHA from "react-google-recaptcha";
import headersDefault from '../../../../fetchDefault'
import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

// import socket from '../../../WebSocket'


class SignUpForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFullVerify = this.handleFullVerify.bind(this)
        this.handleVerify = this.handleVerify.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.state = {
            values:{
                login:'',
                email:'',
                password1:'',
                password2:'',
                name:'',
                surname:'',
                role:(props.curr_key && props.curr_key.match(/^curr_key/)) ? 'Преподаватель' : 'Студент',
                group:'',
                secretKey:(props.curr_key && props.curr_key.match(/^curr_key/)) ? props.curr_key.replace(/curr_key/, '') : '',
                GithubLogin:'',
                MoodleLogin:'',
                recaptcha:'',
            },
            errors:{
                login:false,
                email:false,
                password1:false,
                password2:false,
                name:false,
                surname:false,
                role:false,
                group:false,
                secretKey:false,
                GithubLogin:false,
                MoodleLogin:false,
                recaptcha:false,
            },
            rules:{
                email:[v => v.search(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/g) !== -1 || "Формат почты не верный"],
                login:[
                    v => !!v || "Введите логин.",
                    v => v.length > 5 || "Логин должен быть длиннее 5 символов.",
                    v => v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "Логин может содержать только символы _ - 0-9 a-z A-Z.",
                    v => v.search(/^[a-zA-Z]/) !== -1 || "Логин может начинаться только на символы a-z A-Z.",
                ],
                password1:[
                    v => !!v || "Введите пароль.",
                    v => v.length > 8 || "Пароль должен быть длиннее 8 символов.",
                    v => v.search(/(?=.*[0-9])/g) !== -1 || "Пароль должен содержать хотя бы одну цифру.",
                    v => v.search(/(?=.*[!@#$%^&*])/g) !== -1 || "Пароль должен содержать хотя бы один специмвол (!@#$%^&*).",
                    v => v.search(/(?=.*[a-z])/g) !== -1 || "Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре.",
                    v => v.search(/(?=.*[A-Z])/g) !== -1 || "Пароль должен содержать хотя бы одну латинскую букву в верхнем регистре.",
                    v => v.search(/[!@#$%^&*0-9a-zA-Z]/g) !== -1 || "Пароль может содержать только !@#$%^&*0-9a-zA-Z."],
                password2:[
                    v => !!v || "Введите пароль.",
                    v => v === this.password1Input.value || "Пароли не соовпадают."],
                name:[
                    v => !!v || "Введите имя.",
                    v => v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Имя может содержать только символы - а-я А-Я a-z A-Z"],
                surname:[
                    v => v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Фамилия может содержать только символы - а-я А-Я a-z A-Z",
                    v => !!v || "Введите имя."],
                role:[v => !!v || "Выберите тип."],
                group:[
                    v => !!v || "Выберите группу.",
                    v => v.search(/^[0-9]{4}$/) !== -1 || "Группа должна состоять только из 4 цифр",

                ],
                secretKey:[v => !!v || "Введите секретный ключ."],
                GithubLogin:[
                    v => !!v || "Введите GithubLogin.",
                    v => v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "GithubLogin может содержать только символы _ - 0-9 a-z A-Z.",
                    v => v.search(/^[a-zA-Z]/) !== -1 || "GithubLogin может начинаться только на символы a-z A-Z.",
                ],
                MoodleLogin:[
                    v => !!v || "Введите MoodleLogin.",
                    v => v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "MoodleLogin может содержать только символы _ - 0-9 a-z A-Z.",
                    v => v.search(/^[a-zA-Z]/) !== -1 || "MoodleLogin может начинаться только на символы a-z A-Z.",
                ],
                recaptcha:[v => !!v || "Введите recaptcha."],
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
        console.log(this.state.values)
        this.handleFullVerify()
            .then((data) => {
                if (data) {
                    fetch('/signup', {
                        method:'POST',
                        headers:headersDefault(),

                        body:JSON.stringify({
                            ...this.state.values,
                            regType:"USUAL"
                        })
                    })
                        .then(data => data.json())
                        .then(data => {
                            console.log(data)
                            if (data.isReg) {
                                window.location.hash = "#/auth/signin"
                            } else {
                                alert(data.causeOfError)
                            }
                        })
                }
            })
        event.preventDefault();
    }

    render() {
        return (
            <Container className="col-12 col-lg-6 p-3 ">
                <Container className="custom-paper bg-light p-3">
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridLogin" className="col-12 col-lg-6">
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
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail" className="col-12 col-lg-6">
                                    <Form.Label>Почта</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.email}
                                        name={"email"}
                                        value={this.state.values.email}
                                        onChange={this.handleOnChange}
                                        type="email"
                                        placeholder="Введите почту"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridPassword1" className="col-12 col-lg-6">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.password1}
                                        name={"password1"}
                                        value={this.state.values.password1}
                                        onChange={this.handleOnChange}
                                        type="password"
                                        placeholder="Введите пароль"
                                        className="custom-textform"
                                        ref={(input) => this.password1Input = input}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.password1}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPassword2" className="col-12 col-lg-6">
                                    <Form.Label>Повторить пароль</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.password2}
                                        name={"password2"}
                                        value={this.state.values.password2}
                                        onChange={this.handleOnChange}
                                        type="password"
                                        placeholder="Повторите пароль"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.password2}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName" className="col-12 col-lg-6">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.name}
                                        name={"name"}
                                        value={this.state.values.name}
                                        onChange={this.handleOnChange}
                                        type="text"
                                        placeholder="Введите полное имя"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridSurname" className="col-12 col-lg-6">
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.surname}
                                        name={"surname"}
                                        value={this.state.values.surname}
                                        onChange={this.handleOnChange}
                                        type="text"
                                        placeholder="Введите фамилию"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.surname}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridRole">
                                    <Form.Label>Тип пользователя</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.role}
                                        name={"role"}
                                        value={this.state.values.role}
                                        as="select"
                                        className="custom-select"
                                        onChange={event => {
                                            const curr_role = event.target.value
                                            this.setState(prevState => {
                                                if (!(["Преподаватель", "Администратор"].includes(prevState.role) &&
                                                    ["Преподаватель", "Администратор"].includes(curr_role))) {
                                                    prevState.errors.secretKey = false
                                                    prevState.errors.group = false
                                                }
                                                return prevState
                                            })
                                            this.handleOnChange(event)

                                        }}
                                    >
                                        <option className="custom-option">Студент</option>
                                        <option className="custom-option">Преподаватель</option>
                                        <option className="custom-option">Администратор</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.role}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            {
                                this.state.values.role === "Студент" &&
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridGroup">
                                        <Form.Label>Группа</Form.Label>
                                        <Form.Control
                                            isInvalid={!!this.state.errors.group}
                                            name={"group"}
                                            value={this.state.values.group}
                                            onChange={this.handleOnChange}
                                            className="custom-textform"
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.errors.group}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                            }
                            < Form.Group controlId="formGridSecretKey">
                                <Form.Label>Секретный код</Form.Label>
                                <Form.Control
                                    isInvalid={!!this.state.errors.secretKey}
                                    name={"secretKey"}
                                    value={this.state.values.secretKey}
                                    onChange={this.handleOnChange}
                                    placeholder="Введите секретный код"
                                    className="custom-textform"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.secretKey}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridGithubLogin">
                                    <Form.Label>GithubLogin</Form.Label>
                                    <Form.Control
                                        className="custom-textform"
                                        placeholder="Введите GithubLogin"
                                        isInvalid={!!this.state.errors.GithubLogin}
                                        name={"GithubLogin"}
                                        value={this.state.values.GithubLogin}
                                        onChange={this.handleOnChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.GithubLogin}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridMoodleLogin">
                                    <Form.Label>MoodleLogin</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.MoodleLogin}
                                        name={"MoodleLogin"}
                                        value={this.state.values.MoodleLogin}
                                        onChange={this.handleOnChange}
                                        placeholder="Введите MoodleLogin"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.MoodleLogin}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="mb-3">

                                <ReCAPTCHA
                                    sitekey="6LctlLAZAAAAAHE2Zj-yKvioQcPNa1ZBOhqujNdK"
                                    onChange={(value) => {
                                        this.setState(prevState => {
                                            prevState.values.recaptcha = value
                                            return prevState
                                        })
                                        this.handleVerify("recaptcha", value)
                                    }}
                                />
                                {this.state.errors.recaptcha && <label>{this.state.errors.recaptcha}</label>}


                            </Form.Row>
                            <Button
                                variant="primary"
                                type="submit"
                                className="custom-btn mr-3 mb-2"
                            >
                                Зарегистрироваться
                            </Button>
                            <Link
                                className="mr-3"
                                to="/auth/signin">
                                <Button
                                    variant="secondary"
                                    className="custom-btn mr-3 mb-2"
                                >
                                    Вход
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Container>
            </Container>

        );
    }
}


export default SignUpForm;
