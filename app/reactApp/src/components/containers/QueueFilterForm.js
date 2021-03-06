
import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

class QueueFilterForm extends Component {

    constructor(props) {
        super(props);

        this.getTeachersList = this.getTeachersList.bind(this)
        this.getDisciplinesList = this.getDisciplinesList.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            config: {
                teachers: [""],
                disciplines: [""]
            },
            selected: {
                discipline: "",
                teacher: ""
            }
        }
    }
    handleChange(event) {
        const name = event.target.name
        const value = event.target.value


        this.setState((prevState) => {
            prevState.selected[name] = value
            return prevState
        })
    }
    handleSubmit(event) {
        this.props.sendConfig(this.state.selected)
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
                selected: {
                    ...prevState.selected,
                    teacher: data[0],
                }
            })))
            .catch(console.log)
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
                    ...prevState.selected,
                    discipline: data[0],
                }
            })))
    }

    componentDidMount() {
        if (this.props.teacher)
            this.getTeachersList()
        if (this.props.discipline)
            this.getDisciplinesList()
    }


    render() {
        return (
            <>
                <Col>
                    <Form onSubmit={this.handleSubmit}>
                        <Row className="mb-2">
                            {
                                this.props.discipline &&
                                <Form.Group className="col-12 col-lg-4">
                                    <Form.Label className="m-1">????????????????????</Form.Label>
                                    <Form.Control
                                        className="custom-select"
                                        name={"discipline"}
                                        as="select"
                                        onChange={this.handleChange}
                                        value={this.state.selected.discipline}
                                    >
                                        {this.state.config.disciplines.map((elem) => <option
                                            key={"disciplineOption_" + elem}>{elem}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            }
                            {
                                this.props.teacher &&
                                <Form.Group className="col-12 col-lg-4">
                                    <Form.Label className="m-1">??????????????????????????</Form.Label>
                                    <Form.Control
                                        className="custom-select"
                                        name={"teacher"}
                                        as="select"
                                        onChange={this.handleChange}
                                        value={this.state.selected.teacher}>
                                        >
                                        {this.state.config.teachers.map((elem) => <option
                                            key={"teacherOption_" + elem}>{elem}</option>)}

                                    </Form.Control>
                                </Form.Group>
                            }
                        </Row>
                        <Button className="mt-3 custom-btn" type="submit">
                            ??????????????????????????
                        </Button>
                    </Form>
                </Col>
            </>
        );
    }
}


export default QueueFilterForm;
