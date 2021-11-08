
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileContainer from './containers/ProfileContainer'


class Profile extends Component {
    render() {
        return (
            <ProfileContainer curr_login={this.props.match.params.curr_login} />
        );
    }
}


export default Profile;

