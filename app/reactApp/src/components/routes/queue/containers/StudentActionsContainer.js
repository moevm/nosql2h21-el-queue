import React from 'react';
import {Dropdown, Image, Popover} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import headersDefault from '../../../../fetchDefault'

function StudentActionsContainer(props) {

    function action(actionType) {
        console.log(actionType)
        fetch('/queue/action',
            {
                method:"POST",
                headers:headersDefault(),

                body:JSON.stringify({
                    action:actionType,
                    queue_id:window.location.hash.split('/')[2],
                    record_id:props.record_id
                })
            })
            .then(data => data.json())
            .then(data => {
                props.updateStudentList()
            })
    }

    return (
        <>
            {
                props.allowMove &&
                <Dropdown className={"mr-2"}>
                    <Dropdown.Toggle variant="success" id="dropdown-down"
                                     className="btn btn-light custom-btn icon-btn drop" as="Button">
                        <Image src="static/img/arrowBoth.svg" width="28"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="drop-menu">
                        <Dropdown.Item className="drop-item" onClick={() => action(1)}>
                            В начало <Image src="/static/img/arrowTop.svg" width="25"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drop-item" onClick={() => action(2)}>
                            Выше на 1 <Image src="/static/img/arrowUp.svg" width="20"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drop-item" onClick={() => action(3)}>
                            Ниже на 1 <Image src="/static/img/arrowDown.svg" width="20"/>
                        </Dropdown.Item>
                        <Dropdown.Item className="drop-item" onClick={() => action(4)}>
                            В конец <Image src="/static/img/arrowLast.svg" width="23"/>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
            {
                props.allowDelete &&
                <Dropdown className={"mr-2"}>
                    <Dropdown.Toggle variant="success" id="dropdown-down"
                                     className="btn btn-light custom-btn icon-btn drop" as="Button">
                        <Image src="static/img/delete.svg" className="big-icon" width="26"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="drop-menu">
                        <Popover.Title as="h4"><b>Подтвердите действие</b></Popover.Title>
                        <Dropdown.Item className="drop-item mt-2" onClick={() => action(5)}>
                            Удалить запись <Image src="/static/img/delete.svg" className="big-icon" width="20"/>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </>

    );
}


export default StudentActionsContainer;
