import React from 'react';
import { Container, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


function GoToEnqueueContainer(props) {

    return (
        <Container className="mb-2 p-2 d-flex col-lg-6 flex-row align-items-center justify-content-between bg-light custom-paper" >
            <h4>Встать в новую очередь</h4>
            <Link className="btn custom-btn icon-btn mr-3" to={`/enqueue`}>
                <Image src="static/img/plusBlack.svg" />

            </Link>


        </Container >
    );

}


export default GoToEnqueueContainer;
