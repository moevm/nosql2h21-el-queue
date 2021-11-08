import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap'
import QueuePreview from "../../../containers/QueuePreview"
import 'bootstrap/dist/css/bootstrap.min.css';


function AllQueuesListContainer(props) {
    console.log(props.queuesList)
    return (
        <Container className="float-lg-right mt-3 p-2 bg-light rounded" >
            <Col>
                {props.queuesList && props.queuesList.map(elem =>
                    <Row
                        key={`RowQueueContainer_${elem.id}`}
                    >
                        <QueuePreview
                            key={`QueueContainer_${elem.id}`}
                            id={elem.id}
                            discipline={elem.discipline}
                            teacher={elem.teacher}
                            description={elem.description}
                            date={elem.date}
                            index={elem.index}
                            tags={elem.tags}
                            groups={elem.groups}
                        />
                    </Row>
                )}
            </Col>

        </Container >
    )
}

export default AllQueuesListContainer;