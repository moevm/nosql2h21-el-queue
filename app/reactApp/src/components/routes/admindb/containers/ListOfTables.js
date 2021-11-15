import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col, Button, Form, Tooltip, Image, OverlayTrigger} from 'react-bootstrap';
import DescriptionContainer from './DescriptionContainer'
import {saveAs} from "file-saver";
import headersDefault from "../../../../fetchDefault";

class ListOfTables extends Component {
    constructor(props) {
        super(props)
        this.handleDownload = this.handleDownload.bind(this)
        this.uploadDisciplines = this.uploadDisciplines.bind(this)
    }

    handleDownload() {
        fetch(`/db/download`, {
            headers:headersDefault(),
        })
            .then(data => data.json())
            .then(json => {
                console.log(json)
                let blob = new Blob([JSON.stringify(json, null, 2)], {type:"text/json"})
                saveAs(blob, "elqueue_db.json")
            })
    }

    uploadDisciplines() {
        const input = document.getElementById('fileinput')
        const formData = new FormData();
        formData.append("file", input.files[0]);
        fetch(`/db/upload/disciplines`, {
            method:"POST",
            headers:{
                Authorization:"JWT " + localStorage.getItem("accesstoken"),
            },
            body:formData
        })
            .then(data => data.json())
    }

    render() {
        return (
            <>
                <Container className="custom-paper bg-light p-3 col-12 col-lg-10">
                    <Row>
                        <DescriptionContainer
                            header={"Список созданных пользователей"}
                            description={[
                                "Просмотр списка созданных пользователей",
                                "Удаление",
                                "Добавление",
                                "Редактирование",
                            ]}
                            to="/users"
                        />
                        <DescriptionContainer
                            header={"Список занятий"}
                            description={[
                                "Просмотр списка занятий",
                                "Удаление",
                                "Добавление",
                            ]}
                            to="/classes"
                            className="custom-block"
                        />
                        <DescriptionContainer
                            header={"Список доступных дисциплин"}
                            description={[
                                "Просмотр списка возможных дисциплин",
                                "Удаление",
                                "Добавление",
                                "Редактирование",
                            ]}
                            to="/disciplines"
                        />
                        <DescriptionContainer
                            header={"Секретные ключи"}
                            description={[
                                "Управение ключами",
                                "Удаление",
                                "Добавление",
                            ]}
                            to="/secretkeys"
                        />
                        <Col md={4}>
                            <div className="custom-card mb-4 shadow-sm">
                                <center className="pt-3">
                                    <h4>Импорт Базы Данных</h4>
                                </center>
                                <hr/>
                                <div className="card-body">
                                    <input type="file" id="fileinput" className="mb-3 p-3 custom-card bg-white"
                                           accept=".json"/>
                                    <div className="d-flex justify-content-between">
                                        <Button className="custom-btn btn-info"
                                                onClick={this.uploadDisciplines}>Загрузить</Button>
                                        <div className="mr-0 mr-lg-3">
                                            <Image src="static/img/info.svg" width="24"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="custom-card mb-4 shadow-sm">
                                <center className="pt-3">
                                    <h4>Скачать базу данных</h4>
                                </center>
                                <hr/>
                                <div className="card-body">
                                    <Button onClick={this.handleDownload} className="custom-btn btn-info">JSON</Button>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </>
        );
    }
}


export default ListOfTables;
