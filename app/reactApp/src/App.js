import React, { Component, Suspense } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import {
    local_auth_check,
    info_upd,
    sign_out
} from './actions/user';
import { connect } from 'react-redux'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import AddQueue from './components/routes/addqueue/AddQueue'
import AllQueues from './components/routes/allqueues/AllQueues'
import Queue from './components/routes/queue/Queue'
import Stats from './components/routes/stats/Stats'
import Profile from './components/routes/profile/Profile'
import ProfileEditor from './components/routes/profile/ProfileEditor'
import CustomNavbar from "./components/nav/CustomNavbar"
import SignIn from './components/routes/auth/signIn/SignIn'
import SignUp from './components/routes/auth/signUp/SignUp'
import NotificationManager from './components/notification/NotificationManager';
import headersDefault from './fetchDefault'

const AdminDB = React.lazy(() => import('./components/routes/admindb/AdminDB'));


class App extends Component {
    componentDidMount() {
        /*this.props.onLocalAuthCheck()
        fetch('/auth/check',
            {
                headers: headersDefault(),
            })
            .then(data => data.json())
            .then(data => {
                if (data.isAuth === true)
                    this.props.onInfoUpdate(data)
                else if (data.isAuth === false)
                    this.props.sign_out()
                else
                    console.log("hm hmm... error... but why?")
                    
            })*/

    }
    render() {
        return (

            <Router basename='/'  >
                <CustomNavbar />
                {this.props.user.isAuth ?
                    <Switch>
                        <Route exact path="/">
                            <AllQueues />
                        </Route>
                        {
                            this.props.user.role !== "student" &&
                            < Route path="/addqueue" component={AddQueue} />
                        }
                        <Route path="/queue/:curr_id" component={Queue} />
                        <Route path="/profile/editor/" component={ProfileEditor} />
                        <Route path="/profile/:curr_login" component={Profile} />
                        <Route path="/stats" component={Stats} />
                        <Route path="/admindb">
                            {
                                this.props.user.role === "admin" &&
                                <Suspense
                                    fallback={
                                        <div></div>
                                    }
                                >
                                    <AdminDB />
                                </Suspense>
                            }
                        </Route>
                        <Redirect strict to="/" />
                    </Switch >
                    :
                    <>
                        <Switch>
                            <Route exact path="/">
                                <Redirect strict to="auth/signin" />
                            </Route>
                            <Route path="/auth/signin" component={SignIn} />
                            <Route path="/auth/signup/:curr_key" component={SignUp} />
                            <Route path="/auth/signup/" component={SignUp} />
                            <Redirect strict to="/" />
                        </Switch >
                    </>
                }

                <NotificationManager />
            </Router >
        );


    }
}


// export default App;
export default connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        onLocalAuthCheck: (data) => {
            dispatch(local_auth_check(data))
        },
        onInfoUpdate: (data) => {
            dispatch(info_upd(data))
        },
        onSignOut: (data) => {
            dispatch(sign_out(data))
        },
    })
)(App)



