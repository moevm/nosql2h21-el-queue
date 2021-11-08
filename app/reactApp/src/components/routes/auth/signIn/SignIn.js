
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInForm from './SignInForm'
import OAuthContainer from '../oauth/OAuthContainer'


class SignIn extends Component {

    render() {
        return (
            <>
                <SignInForm />
                <OAuthContainer />
            </>
        );
    }
}


export default SignIn;
