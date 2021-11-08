import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import MaterialTable from 'material-table';


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


function ConfiguredTable(props) {

    return (
        <>
            <MaterialTable
                style={{
                    fontFamily:'Nunito',
                    borderRadius:20,
                    boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                    animation:'appear .6s'
                }}
                isLoading={props.isLoading}
                localization={localization}
                title={props.table_name}
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
        </>
    )
}


export default ConfiguredTable;
