import React, {Component} from 'react';
import { Col, Row, Container } from 'react-bootstrap'
import QueuePreview from "./QueuePreview"
import 'bootstrap/dist/css/bootstrap.min.css';
import headersDefault from "../../fetchDefault";


class ListQueues extends Component {
    constructor(props) {
        super(props);
        this.deleteQueue = this.deleteQueue.bind(this)
    }

    deleteQueue(user_id, queue_id) {
        this.props.deleteQueue(user_id, queue_id)
    }

    render() {
        return (
            <Container className="mt-3 p-1 bg-light col-12" >
                <Row>
                    {this.props.queuesList && this.props.queuesList.map(elem =>
                        <Col
                            className="col-12 col-lg-6"
                            key={`RowQueueContainer_${elem.id}`}
                        >
                            <QueuePreview
                                key={`QueueContainer_${elem.id}`}
                                id={elem.id}
                                discipline={elem.discipline}
                                teacher={elem.teacher}
                                description={elem.description}
                                author={elem.author}
                                date={elem.date}
                                groups={elem.groups}
                                time={elem.time}
                                index={elem.index}
                                tags={elem.tags}
                                custom_start={elem.custom_start}
                                start_date={elem.start_date}
                                start_time={elem.start_time}
                                started={elem.started}
                                user={this.props.user}
                                deleteQueue={this.deleteQueue}
                                delete={true}
                            />
                        </Col>
                    )}
                </Row>

            </Container >
        )
    }
}

export default ListQueues;