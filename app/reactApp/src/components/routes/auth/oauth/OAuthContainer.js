import { Container, Button, Image } from 'react-bootstrap'
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// import socket from '../../../WebSocket'


class OAuthContainer extends Component {

    constructor(props) {
        super(props);
        this.handleGitLogIn = this.handleGitLogIn.bind(this)
        this.state = {
        }
    }
    handleGitLogIn() {
        fetch('/githubauth', { mode: "no-cors" })
            .then(data => {
                if (data.status === 302)
                    return data.json()
            })
            .then(data => {
                document.location = data.auth_url;
            })
        // not completed
    }


    render() {
        return (
            <Container className="col-12 col-lg-3 p-3 " >
                <Container className="p-3 d-flex justify-content-center">
                    <Button className="custom-btn bg-white text-secondary custom-block pr-3 pl-3" onClick={this.handleGitLogIn}>
                        <Image src="static/img/profile/github.png" className="mr-2" width="30" height="30" />
                        Войти через GitHub
                    </Button>
                </Container>
            </Container>

        );
    }
}


export default OAuthContainer;
