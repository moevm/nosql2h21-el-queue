import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'
import { Col, Button } from 'react-bootstrap';


function DescriptionContainer(props) {
    return (
        <Col md={4}>
            <div class="custom-card mb-4 shadow-sm">
                <center className="pt-3">
                    <h4>{props.header}</h4>
                </center>
                <hr />
                <div class="card-body">
                    {props.description.map(e => <p className="card-text">{e}</p>)}
                    <Link to={props.to}>
                        <Button className="custom-btn" >Перейти</Button>
                    </Link>
                </div>
            </div>
        </Col>
    )
}

export default DescriptionContainer
