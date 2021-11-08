
import React, { Component } from 'react';
import {
    Row,
    Col,
    Container,
    Form,
    InputGroup,
    FormControl,
    Button,
    Tooltip,
    Image,
    OverlayTrigger
} from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux'
import QueuePreview from '../../../containers/QueuePreview'
import headersDefault from '../../../../fetchDefault'
// import socket from '../../../../WebSocket'
class AddQueueForm extends Component {
    constructor(props) {
        super(props);

        this.getTeachersList = this.getTeachersList.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFullVerify = this.handleFullVerify.bind(this)
        this.handleVerify = this.handleVerify.bind(this)
        this.state = {
            config: {
                teachers: [''],
                disciplines: [''],
            },
            values: {
                discipline: "",
                date: `${(new Date()).getFullYear()}-${String((new Date()).getMonth() + 1).padStart(2, '0')}-${String((new Date()).getDate()).padStart(2, '0')}`,
                time: `${String((new Date()).getHours()).padStart(2, '0')}:${String((new Date()).getMinutes()).padStart(2, '0')}`,
                teacher: "",
                groups: "all",
                description: "",
                custom_start: false,
                start_date: `${(new Date()).getFullYear()}-${String((new Date()).getMonth()).padStart(2, '0')}-${String((new Date()).getDate()).padStart(2, '0')}`,
                start_time: `${String((new Date()).getHours()).padStart(2, '0')}:${String((new Date()).getMinutes()).padStart(2, '0')}`
            },
            errors: {
                discipline: false,
                date: false,
                time: false,
                teacher: false,
                groups: false,
                description: false,
                start_date: false,
                start_time: false,
                custom_start: false,
            },
            rules: {
                discipline: [v => !!v || "Введите дисциплину."],
                date: [v => !!v || "Введите дату."],
                time: [v => !!v || "Введите время."],
                start_date: [v => !!v || "Введите дату."],
                start_time: [v => !!v || "Введите время."],
                custom_start: [],
                teacher: [v => !!v || "Введите преподаватля."],
                groups: [v => !!v || "Введите группы."],
                description: [
                    v => !!v || "Введите описание.",
                    v => v.length < 50 || "Максимальный размер описания 50 символов."
                ],
            },
            advconfig: {
                prevQueueId: false,
                saveStudents: false,

            },
            success: false,
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
            if (key === "teacher" && this.props.user.role !== "admin")
                return
            else
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
                    console.log(this.state.values)
                    fetch('/addNewQueue', {
                        method: 'POST',
                        headers: headersDefault(),

                        body: JSON.stringify({
                            ...this.state.values,
                            user_id: this.props.user.id,
                            advconfig: this.state.advconfig,
                        })
                    })
                        .then(data => data.json())
                        .then(data => {
                            console.log(data)

                            if (data.success) {
                                this.setState({ success: true })
                            }
                            else {
                                alert(data.causeOfError)
                            }
                        })
                }
            })
        event.preventDefault();
    }

    getTeachersList() {
        fetch('/config/teachers')
            .then(data => data.json())
            .then((data) => this.setState(prevState => ({
                config: {
                    ...prevState.config,
                    teachers: data
                },
                values: {
                    ...prevState.values,
                    teacher: prevState.values.teacher || data[0],
                }
            })))
    }

    getDisciplinesList() {
        fetch('/config/disciplines')
            .then(data => data.json())
            .then((data) => this.setState(prevState => ({
                config: {
                    ...prevState.config,
                    disciplines: data
                },
                values: {
                    ...prevState.values,
                    discipline: prevState.values.discipline || data[0],
                }
            })))
    }

    getUrlParams() {
        let hash = window.location.hash
        let paramsStr = hash.slice(hash.indexOf('?') + 1)
        paramsStr = decodeURI(paramsStr)
        var paramsObj = {}
        paramsStr.split('&').forEach(elem => paramsObj[elem.split('=')[0]] = elem.split('=')[1])
        debugger
        this.setState(prevState => {
            let nextValues = prevState.values
            Object.keys(paramsObj).forEach(key => { if (prevState.values.hasOwnProperty(key)) nextValues[key] = paramsObj[key] })
            return { ...prevState, values: nextValues }
        })
        if (paramsObj.hasOwnProperty("prevQueueId"))
            this.setState(prevState => {
                prevState.advconfig.prevQueueId = paramsObj.prevQueueId
                return prevState
            })

    }

    componentDidMount() {
        if (this.props.user.role === "admin")
            this.getTeachersList()
        this.getDisciplinesList()
        this.getUrlParams();
    }

    render() {
        if (this.state.success)
            return (<Redirect to="/" />)
        return (
            <>

                <Container className="p-3 bg-light custom-paper">
                    <p className="h5 mb-3">Выберите конфигурацию для очереди</p>
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Row className="mb-2">
                                <Form.Group as={Col} controlId="formGridDiscipline" className="col-12 col-lg-4">

                                    <Form.Label className="m-1">Предмет</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.discipline}
                                        name={"discipline"}
                                        placeholder="Введите предмет"
                                        className="custom-select"
                                        // type="text"
                                        as="select"
                                        onChange={this.handleOnChange}
                                        value={this.state.values.discipline}>
                                        {this.state.config.disciplines.map((elem) => <option
                                            key={"disciplineOption_" + elem}>{elem}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.discipline}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {
                                    this.props.user.role === "admin" &&
                                    <Form.Group as={Col} controlId="formGridTeacher" className="col-12 col-lg-4">
                                        <Form.Label className="m-1">Преподаватель</Form.Label>
                                        <Form.Control

                                            isInvalid={!!this.state.errors.teacher}
                                            name={"teacher"}
                                            as="select"
                                            className="custom-select"
                                            onChange={this.handleOnChange}
                                            value={this.state.values.teacher}>
                                            >
                                            {this.state.config.teachers.map((elem) => <option
                                                key={"teacherOption_" + elem}>{elem}</option>)}

                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.errors.teacher}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                }
                                <Form.Group as={Col} controlId="formGridGroup" className=" col-12 col-lg-4">
                                    <Form.Label className="m-1">Группы</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="Date-addon1" className="custom-form">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-people-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                                </svg>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            isInvalid={!!this.state.errors.groups}
                                            name={"groups"}
                                            placeholder="Группы"
                                            className="custom-endform"
                                            type="text"
                                            value={this.state.values.groups}
                                            onChange={this.handleOnChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.errors.groups}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formGridGroup" className=" col-12 col-md-6 col-lg-4">

                                    <Form.Label className="m-1">Дата занятия</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="Date-addon1" className="custom-form">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-calendar-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                                    <path fillRule="evenodd" d="M7.5 9.5A.5.5 0 0 1 8 9h2a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0v-2z" />
                                                    <path fillRule="evenodd" d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
                                                    <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            isInvalid={!!this.state.errors.date}
                                            name={"date"}
                                            placeholder="Date"
                                            className="custom-form"
                                            aria-label="date"
                                            type="date"
                                            value={this.state.values.date}
                                            onChange={this.handleOnChange}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.date}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridTime" className=" col-12 col-md-6 col-lg-4">
                                    <Form.Label className="m-1">Время начала</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="Time-addon1" className="custom-form">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                    className="bi bi-clock" fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm8-7A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                                    <path fillRule="evenodd"
                                                        d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            isInvalid={!!this.state.errors.time}
                                            name={"time"}
                                            placeholder="Time"
                                            className="custom-form"
                                            aria-label="time"
                                            type="time"
                                            value={this.state.values.time}
                                            onChange={this.handleOnChange}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.time}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            {this.state.advconfig.prevQueueId &&
                                <Row>
                                    <Container className="col-12">
                                        <Form.Group className="d-flex">
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch1"
                                                label="Перенести студентов с прошлой очереди"
                                                name="saveStudents"
                                                value={this.state.advconfig.saveStudents}
                                                onChange={(event) => {
                                                    var value = event.target.checked
                                                    this.setState(prevState => {
                                                        debugger
                                                        prevState.advconfig.saveStudents = value
                                                        return prevState
                                                    })
                                                }}
                                            />
                                        </Form.Group>
                                    </Container>
                                </Row>
                            }
                            <Row>
                                <Container className="col-12">
                                    <Form.Group className="d-flex">
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch2"
                                            label="Отдельное время для открытия записи"
                                            name="custom_start"
                                            value={this.state.values.custom_start}
                                            onChange={(event) => {
                                                var value = event.target.checked
                                                this.setState(prevState => {
                                                    debugger
                                                    prevState.values['custom_start'] = value
                                                    return prevState
                                                })
                                            }}
                                        />
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Если выключено, запись в очередь будет доступна с даты начала занятия</Tooltip>}>
                                            <div className="ml-2 ml-lg-3">
                                                <Image src="static/img/info.svg" width="20" />
                                            </div>
                                        </OverlayTrigger>
                                    </Form.Group>
                                    {this.state.values.custom_start === true &&
                                        <Row>
                                            <Form.Group as={Col} controlId="formGridGroup" className=" col-12 col-md-6 col-lg-4">
                                                <Form.Label className="m-1">Дата открытия</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="Date-addon1" className="custom-form">
                                                            <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                                className="bi bi-calendar-plus" fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd"
                                                                    d="M8 7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                                                <path fillRule="evenodd"
                                                                    d="M7.5 9.5A.5.5 0 0 1 8 9h2a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0v-2z" />
                                                                <path fillRule="evenodd"
                                                                    d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
                                                                <path fillRule="evenodd"
                                                                    d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z" />
                                                            </svg>
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        isInvalid={!!this.state.errors.start_date}
                                                        name={"start_date"}
                                                        placeholder="Date"
                                                        className="custom-form"
                                                        aria-label="date"
                                                        value={this.state.values.start_date}
                                                        onChange={this.handleOnChange}
                                                        type="date"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formGridTime" className=" col-12 col-md-6 col-lg-4">
                                                <Form.Label className="m-1">Время</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="Time-addon1" className="custom-form">
                                                            <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                                className="bi bi-clock" fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd"
                                                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm8-7A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                                                <path fillRule="evenodd"
                                                                    d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                                                            </svg>
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        isInvalid={!!this.state.errors.start_time}
                                                        name={"start_time"}
                                                        placeholder="Time"
                                                        className="custom-form"
                                                        aria-label="time"
                                                        value={this.state.values.start_time}
                                                        onChange={this.handleOnChange}
                                                        type="time"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                    }
                                </Container>

                            </Row>
                            <Form.Group controlId="formGridDescription">
                                <Form.Label>Описание</Form.Label>
                                <Form.Control
                                    isInvalid={!!this.state.errors.description}
                                    name={"description"}
                                    as="textarea"
                                    className="custom-form"
                                    rows="3"
                                    placeholder="Описание"
                                    value={this.state.values.description}
                                    onChange={this.handleOnChange} />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.description}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button className="mt-3 custom-btn" type="submit">
                                Создать очередь
                            </Button>
                        </Form>
                    </Col>

                </Container >
                <Container className="mt-3 p-3 bg-light custom-paper">
                    <Row>
                        <Col>
                            <h5>Предпросмотр:</h5>
                            <QueuePreview
                                id={false}
                                discipline={this.state.values.discipline}
                                teacher={this.state.values.teacher}
                                groups={this.state.values.groups.split(',')}
                                date={this.state.values.date.split('-').reverse().join(' : ')}
                                time={this.state.values.time}
                                description={this.state.values.description}
                                user={this.props.user}
                                delete={false}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}


// export default AddQueueForm;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
    })
)(AddQueueForm)



