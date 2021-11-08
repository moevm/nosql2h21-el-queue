import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Button, Row, Form} from 'react-bootstrap';
import ConfiguredTable from './ConfiguredTable'
import headersDefault from '../../../../fetchDefault'


class TableContainer extends Component {
    constructor(props) {
        super(props)
        this.updateTable = this.updateTable.bind(this)
        this.editTable = this.editTable.bind(this)
        this.state = {
            table:{},
            isLoading:true
        }
    }

    updateTable() {
        this.setState({isLoading:true})
        fetch(`/db/${this.props.match.params.table_name}`, {
            headers:headersDefault(),

        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({isLoading:false})
                if (data.success) {
                    this.setState({table:{columns:data.table.columns, data:data.table.data}})
                } else {
                    alert(data.causeOfError)
                }
            })
    }

    editTable(task, data) {
        this.setState({isLoading:true})
        fetch(`/db/${this.props.match.params.table_name}`, {
            method:"POST",
            headers:headersDefault(),

            body:JSON.stringify({
                task,
                data
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({isLoading:false})

                if (data.success) {
                    this.updateTable()
                } else {
                    alert(data.causeOfError)
                }
            })
    }

    componentDidMount() {
        this.updateTable()
        console.log(111)

    }

    render() {
        return (
            <>
                <Container className="p-3">
                    {

                        this.props.match.params.table_name === "secretkeys" &&
                        <Container className="custom-paper mb-2 p-3">
                            <Form className="mb-0" onSubmit={(event) => {
                                this.editTable("GEN_RECORD", {num:event.currentTarget.num.value})
                                event.preventDefault();
                                event.stopPropagation();

                            }}><Form.Row>

                                <Form.Group className="mb-0">
                                    <Form.Control
                                        name="num"
                                        type="number"
                                        placeholder="Введите количество"
                                        min="0"
                                        defaultValue="0"
                                        className="custom-textform"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="btn custom-btn ml-3 mb-auto">
                                    Сгенерировать
                                </Button>
                            </Form.Row>
                            </Form>
                        </Container>
                    }
                    <ConfiguredTable
                        isLoading={this.state.isLoading}
                        editTable={this.editTable}
                        table_name={this.props.match.params.table_name}
                        columns={this.state.table.columns}
                        data={this.state.table.data}
                    />
                </Container>
            </>
        )
    }
}

export default TableContainer;
