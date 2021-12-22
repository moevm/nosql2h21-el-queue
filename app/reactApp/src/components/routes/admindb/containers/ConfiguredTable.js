import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import MaterialTable from 'material-table';
import { Calendar, Views } from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from "moment";

let local = localizer(moment)

let allViews = Object.keys(Views).map(k => Views[k])

const localization = {
    body:{
        emptyDataSourceMessage:'Нет записей',
        addTooltip:'Добавить',
        deleteTooltip:'Удалить',
        editTooltip:'Изменить',
        filterRow:{
            filterTooltip:'Фильтр'
        },
        editRow:{
            deleteText:'Вы действительно хотите удалить запись?',
            cancelTooltip:'Отменить',
            saveTooltip:'Подтвердить'
        }
    },
    grouping:{
        placeholder:'Перемещение колонок ...',
        groupedBy:'Сгруппирован по:'
    },
    header:{
        actions:'Действия'
    },
    pagination:{
        labelDisplayedRows:'{from}-{to} из {count}',
        labelRowsSelect:'Строк',
        labelRowsPerPage:'Строк на странице:',
        firstAriaLabel:'Первая страница',
        firstTooltip:'Первая страница',
        previousAriaLabel:'Предыдущая страница',
        previousTooltip:'Предыдущая страница',
        nextAriaLabel:'Следующая страница',
        nextTooltip:'Следующая страница',
        lastAriaLabel:'Последняя страница',
        lastTooltip:'Последняя страница'
    },
    toolbar:{
        addRemoveColumns:'Добавить/удалить столбец',
        nRowsSelected:'{0} Строк выбрано',
        showColumnsTitle:'Показать колонки',
        showColumnsAriaLabel:'Показать колонки',
        exportTitle:'Экспортировать',
        exportAriaLabel:'Экспортировать',
        exportName:'Экспортировать как CSV',
        searchTooltip:'Поиск',
        searchPlaceholder:'Поиск'
    }
}

function getManyDates(data) {
    let classes = []
    let idx = 0;
    data.forEach(el => {
        for (let i = 0; i < 150; i ++) {
            let start = new Date(el.datetime)
            start.setDate(start.getDate() + i * el.repeatTime)
            classes.push({
                id: i * idx + idx,
                title: el.disciplineName + " " + el.description,
                start: start,
                end: new Date(start + 60000 * 90)
            })
        }
        idx++;
    })
    return classes;
}


function ConfiguredTable(props) {

    return (
        <>
            {props.table_name === 'users' ?
                <MaterialTable
                    style={{
                        fontFamily:'Nunito',
                        borderRadius:20,
                        boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                        animation:'appear .6s'
                    }}
                    isLoading={props.isLoading}
                    localization={localization}
                    title={props.table_name.toUpperCase()}
                    options={{
                        filtering:true
                    }}
                    columns={props.columns}
                    data={props.data}
                    detailPanel={rowData => {
                        return (
                            <>
                                <div className="p-3">
                                    <table className="table">
                                        <tr>
                                            <th>Действие</th>
                                            <th>Дата</th>
                                        </tr>
                                        {rowData.telemetry.map(el => <tr>
                                            <td>{el.description}</td>
                                            <td>{el.timestamp}</td>
                                        </tr>)}
                                    </table>
                                </div>
                            </>
                        )
                    }}
                    editable={{
                        onRowAdd:(newData) =>
                            new Promise((resolve) => {
                                resolve();
                                props.editTable("ADD_RECORD", newData)
                            }),
                        onRowUpdate:(newData, prevData) =>
                            new Promise((resolve) => {
                                resolve();
                                let prevData_ = Object.assign({}, prevData)
                                delete prevData_.tableData
                                if (JSON.stringify(newData) !== JSON.stringify(prevData_))
                                    props.editTable("UPD_RECORD", newData)

                            }),
                        onRowDelete:(newData) =>
                            new Promise((resolve) => {
                                resolve();
                                let newData_ = Object.assign({}, newData)
                                delete newData_.tableData
                                props.editTable("DEL_RECORD", newData)
                            }),
                    }}
                />
                :
                <MaterialTable
                    style={{
                        fontFamily:'Nunito',
                        borderRadius:20,
                        boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                        animation:'appear .6s'
                    }}
                    isLoading={props.isLoading}
                    localization={localization}
                    title={props.table_name.toUpperCase()}
                    options={{
                        filtering:true
                    }}
                    columns={props.columns}
                    data={props.data}
                    editable={{
                        onRowAdd:(newData) =>
                            new Promise((resolve) => {
                                resolve();
                                props.editTable("ADD_RECORD", newData)
                            }),
                        onRowUpdate:(newData, prevData) =>
                            new Promise((resolve) => {
                                resolve();
                                let prevData_ = Object.assign({}, prevData)
                                delete prevData_.tableData
                                if (JSON.stringify(newData) !== JSON.stringify(prevData_))
                                    props.editTable("UPD_RECORD", newData)

                            }),
                        onRowDelete:(newData) =>
                            new Promise((resolve) => {
                                resolve();
                                let newData_ = Object.assign({}, newData)
                                delete newData_.tableData
                                props.editTable("DEL_RECORD", newData)
                            }),
                    }}
                />
            }
            {(props.table_name === "classes" && props.data) &&
                <div className="custom-paper p-3 col-12 mt-3">
                    <Calendar
                        step={60}
                        views={allViews}
                        events={getManyDates(props.data)}
                        localizer={local}
                    >
                    </Calendar>
                </div>
            }
        </>
    )
}


export default ConfiguredTable;
