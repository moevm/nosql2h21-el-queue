import React, { Component, useState } from 'react';
import { Col, Row, Container, Spinner } from 'react-bootstrap'
import StudentPreview from "./StudentPreview"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import headersDefault from '../../../../fetchDefault'
import 'bootstrap/dist/css/bootstrap.min.css';




class ListQueues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        console.log(result)
        console.log("item id", result.draggableId)
        console.log("from", result.source.index)
        console.log("to", result.destination.index)
        this.moved(result.draggableId, result.destination.index)
    }

    moved(record_id, to) {
        this.setState({
            loading: true
        })
        fetch('/queue/action',
            {
                method: "POST",
                headers: headersDefault(),
                body: JSON.stringify({
                    action: 6,
                    queue_id: window.location.hash.split('/')[2],
                    record_id,
                    to
                })
            })
            .then(data => {
                this.props.updateStudentList()
                this.setState({
                    loading: false
                })
            }
            )
    }


    render() {

        if (this.state.loading)
            return (
                <Container className="col-12 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Container>
            )
        else
            return (
                <Container className="p-3 col-12">
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable
                            droppableId="droppable">
                            {provided => (
                                <Col
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {this.props.studentList && this.props.studentList.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {provided => (
                                                <Row
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >

                                                    <StudentPreview
                                                        key={`QueueContainer_${item.id}`}
                                                        id={item.id}
                                                        name={item.name}
                                                        surname={item.surname}
                                                        login={item.login}
                                                        task={item.task}
                                                        index={item.index}
                                                        tags={item.tags}
                                                        author={item.author}
                                                        group={item.group}
                                                        count={item.count}
                                                        date={item.date}
                                                        updateStudentList={this.updateStudentList}
                                                    />
                                                </Row>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Col>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Container>

            );
    }
}


export default ListQueues;