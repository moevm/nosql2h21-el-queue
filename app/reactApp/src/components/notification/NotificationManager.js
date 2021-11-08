
import React, { Component } from 'react';
import Notification from './Notification'
import socket from '../../WebSocket'
import 'bootstrap/dist/css/bootstrap.min.css';


import "../styles/styles.css"


class NotificationManager extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            count: 0,
        }

    }
    componentDidMount() {
        socket.on("notification", (data) => {
            this.setState(prevState => {
                prevState.notifications.unshift(
                    <Notification
                        key={"Notification" + prevState.count}
                        type={data.type || false}
                        message={data.message || false}
                        tags={data.tags || false}
                        link={data.link || false}
                        head={data.head || false}
                    />
                )
                prevState.count++
                return prevState
            })
            var t = setTimeout(() => {
                this.setState(prevState => {
                    prevState.notifications.pop()
                    return prevState
                })
                clearTimeout(t)
            }, 3500)
        }
        )
    }

    componentWillUnmount() {
        socket.removeAllListeners("notification");
    }
    render() {
        return (
            <>
                {this.state.notifications}

            </>
        );
    }
}


export default NotificationManager;