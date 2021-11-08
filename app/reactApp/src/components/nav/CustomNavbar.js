
import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { sign_out } from '../../actions/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Image, Nav } from 'react-bootstrap'

import "../styles/styles.css"
// import NavDropdown from 'react-bootstrap/NavDropdown'



function CustomNavbar(props) {

    return (
        <Navbar collapseOnSelect expand="lg" variant="light" className="custom-nav">
            <Link to="/" >
                <Navbar.Brand className="p-0">
                    <Image src="static/img/logo.png" width="45" height="45" className="p-0 mr-3" />
                    <b className="custom-logoname mr-1">El Queue</b>
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                {
                    props.user.isAuth ?
                        <>
                            <Nav className="mr-auto">
                                <Nav.Link className="mr-2" href="#/">Очереди</Nav.Link>
                                {props.user.role !== "student" && <Nav.Link className="mr-2" href="#/addqueue">Создать очередь</Nav.Link>}
                                {props.user.role === "admin" && <Nav.Link className="mr-2" href="#/admindb">Администрирование</Nav.Link>}
                            </Nav>
                            <Nav>
                                <Nav.Link href={`#/profile/${props.user.login}`}>Профиль: {props.user.login}</Nav.Link>
                            </Nav>
                        </>
                        :
                        <>
                            <Nav className="mr-auto" />
                            <Nav>
                                <Nav.Link href="#/auth/signin">Вход</Nav.Link>
                                <Nav.Link href="#/auth/signup">Регистрация</Nav.Link>
                            </Nav>
                        </>
                }
            </Navbar.Collapse>
        </Navbar>
    );
}


// export default CustomNavbar;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onSignOut: (data) => {
            dispatch(sign_out(data))
        }
    })
)(CustomNavbar)