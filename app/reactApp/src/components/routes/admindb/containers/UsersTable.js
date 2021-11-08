import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Button } from 'react-bootstrap';
import ConfiguredTable from './ConfiguredTable'


class UsersTable extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            data: {
                columns: [

                    {
                        label: "Логин",
                        field: 'login',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Почта",
                        field: 'email',
                        sort: 'asc',
                        width: 250,

                    },
                    {
                        label: "Имя",
                        field: 'name',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Фамилия",
                        field: 'surname',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Роль",
                        field: 'role',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "GitHub ID",
                        field: 'githubID',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "GitHub Login",
                        field: 'githubLogin',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "MoodleID",
                        field: 'moodleID',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Moodle Login",
                        field: 'moodleLogin',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Группа",
                        field: 'group',
                        sort: 'asc',
                        width: 150,

                    },
                    {
                        label: "Действия",
                        field: 'action',
                        sort: 'asc',
                        width: 100,

                    },

                ],
                rows: [
                    {
                        login: "fox1209",
                        email: "tiger0776770@gmail.com",
                        name: "Дмитрий",
                        surname: "Переверзев",
                        role: "admin",
                        githubID: "43238696",
                        githubLogin: "Dmitriy129",
                        moodleID: "moodleID",
                        moodleLogin: "moodleLogin",
                        group: "8381",
                        action: <Button>action</Button>
                    },
                    {
                        login: "fox1209",
                        email: "tiger0776770@gmail.com",
                        name: "Дмитрий",
                        surname: "Переверзев",
                        role: "admin",
                        githubID: "43238696",
                        githubLogin: "Dmitriy129",
                        moodleID: "moodleID",
                        moodleLogin: "moodleLogin",
                        group: "8381",
                        action: <Button>action</Button>
                    },
                    {
                        login: "fox1209",
                        email: "tiger0776770@gmail.com",
                        name: "Дмитрий",
                        surname: "Переверзев",
                        role: "admin",
                        githubID: "43238696",
                        githubLogin: "Dmitriy129",
                        moodleID: "moodleID",
                        moodleLogin: "moodleLogin",
                        group: "8381",
                        action: <Button>action</Button>
                    },
                    {
                        login: "fox1209",
                        email: "tiger0776770@gmail.com",
                        name: "Дмитрий",
                        surname: "Переверзев",
                        role: "admin",
                        githubID: "43238696",
                        githubLogin: "Dmitriy129",
                        moodleID: "moodleID",
                        moodleLogin: "moodleLogin",
                        group: "8381",
                        action: <Button>action</Button>
                    },
                ]
            }
        }
    }

    handleClick() {

    }

    render() {
        return (
            <>
                <p>UsersTable</p>
                <p>{this.props.table_name}</p>
                <Container className=" p-3 ">
                    <Container className="custom-paper bg-light p-3">
                        <ConfiguredTable
                            columns={this.state.data.columns}
                            rows={this.state.data.rows}
                        />
                    </Container>
                </Container>
            </>
        );
    }
}


export default UsersTable;
