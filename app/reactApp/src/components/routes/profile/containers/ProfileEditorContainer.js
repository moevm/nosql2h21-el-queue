import React, { Component } from 'react';
import ProfileEditorForm from './ProfileEditorForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'
import headersDefault from "../../../../fetchDefault"


class ProfileEditorContainer extends Component {
    constructor(props) {
        super(props)
        this.getInfo = this.getInfo.bind(this)
        this.state = {
            userInfo: {}
        }
    }

    getInfo() {
        fetch("/profile/editor/needinfo", {
            method: 'POST',
            headers: headersDefault(),

            body: JSON.stringify({
                user_id: this.props.user.id,
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.error)
                    console.error(data.error)
                else {
                    this.setState({ userInfo: data.userInfo })

                }
            })
    }

    componentDidMount() {
        this.getInfo()
    }

    render() {
        return (
            <ProfileEditorForm userInfo={this.state.userInfo} />
        );
    }
}


// export default ProfileEditorContainer;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({})
)(ProfileEditorContainer)



