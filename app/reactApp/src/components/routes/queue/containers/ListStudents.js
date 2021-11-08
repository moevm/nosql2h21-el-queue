import React from 'react';
import { Col, Row, Container } from 'react-bootstrap'
import StudentPreview from "./StudentPreview"
import 'bootstrap/dist/css/bootstrap.min.css';


function ListQueues(props) {
    return (
        <Container className="p-3 col-12" >
            <Col>
                {props.studentList && props.studentList.map(elem =>
                    <Row
                        key={`RowQueueContainer_${elem.id}`}
                    >
                        <StudentPreview
                            key={`QueueContainer_${elem.id}`}
                            id={elem.id}
                            name={elem.name}
                            surname={elem.surname}
                            login={elem.login}
                            task={elem.task}
                            index={elem.index}
                            tags={elem.tags}
                            author={elem.author}
                            group={elem.group}
                            count={elem.count}
                            date={elem.date}
                            updateStudentList={props.updateStudentList}
                        />
                    </Row>
                )}
            </Col>

        </Container >
    )
}

export default ListQueues;