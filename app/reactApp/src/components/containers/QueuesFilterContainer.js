
import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap'
import QueueFilterForm from './QueueFilterForm'
import 'bootstrap/dist/css/bootstrap.min.css'

// import socket from '../../../../WebSocket'

class QueuesFilterContainer extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.state = {
            filterFlag: false,
        }
    }
    handleChange() {
        this.setState({ filterFlag: this.filerStatus.checked })
        if (this.filerStatus.checked === false)
            this.props.sendConfig({})
    }

    render() {
        return (
            <>
                <Container className="p-3 bg-white custom-block col-12">
                    <Form.Group>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Фильтрация"
                            // checked="true"
                            ref={(input) => this.filerStatus = input}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    {this.state.filterFlag &&
                        <QueueFilterForm
                            discipline={this.props.discipline}
                            teacher={this.props.teacher}
                            sendConfig={this.props.sendConfig}
                        />
                    }
                </Container>
            </>
        );
    }
}


export default QueuesFilterContainer;
