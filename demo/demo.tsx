/* eslint-disable @typescript-eslint/no-floating-promises */
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import MaterialTable from '../src';
import { Column, FilterTypes } from 'models/material-table.model';

const theme = createTheme();

const sexColumnRender = (data: any, type: any) => {
    if (type === 'totals') {
        const result = [];
        const map = data.reduce((prev: any, curr: any) => {
            if (!prev[curr.type]) {
                prev[curr.type] = [];
            }

            prev[curr.type].push(curr);
            return prev;
        }, {});
        for (const type in map) {
            const maleCount = map[type].filter((x: any) => x.sex === 'Male').length;
            const femaleCount = map[type].filter((x: any) => x.sex === 'Female').length;

            result.push(<div key={type}>{`${type}: ${maleCount}/${femaleCount}`}</div>);
        }

        return result;
    } else if (type === 'export') {
        return data.sex + '_export!';
    } else if (type === 'totals_export') {
        return 'totals_export!!!';
    }

    return data.sex + '!';
};

const salaryColumnRender = (data: any, type: any) => {
    if (type === 'totals') {
        const result = data.reduce((state: number, curr: any) => {
            return state + curr.salary;
        }, 0);

        return result;
    }
    return data.salary;
};

const bigData = [];
for (let i = 0; i < 1; i++) {
    const d = {
        id: i + 1,
        name: 'Name' + i,
        surname: 'Surname' + Math.round(i / 10),
        isMarried: !!(i % 2),
        birthDate: new Date(1987, 1, 1),
        birthCity: 0,
        sex: i % 2 ? 'Male' : 'Female',
        type: 'adult',
        insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
        time: new Date(1900, 1, 1, 14, 23, 35)
    };
    bigData.push(d);
}

interface DemoState {
    actionsAlign: string;
    filterType: string;
    text: string;
    selecteds: number;
    isLoading: boolean;
    data: any[];
    columns: Column[];
    remoteColumns: Column[];
}

const App = () => {
    const tableRef = React.createRef<any>();
    const tableInfiniteReplaceRef = React.createRef<any>();

    const [filterType, setFilterType] = React.useState<FilterTypes>('header');

    const salaryBackgroundStyle = { backgroundColor: 'lightGrey' };
    const rootSalariesHeader = (<span style = {salaryBackgroundStyle}>Salaries, $</span>);
    const [state, setState] = React.useState<DemoState>({
        actionsAlign: 'right',
        filterType: 'header',
        text: 'text',
        selecteds: 0,
        isLoading: true,
        data: [],
        columns: [
            {
                title: (
                    <span>
                        {'Adı'}
                    </span>
                ),
                field: 'name',
                editComponent: (props: any) => {
                    return (
                        <input
                            value={props.value}
                            onChange={e => {
                                const data = { ...props.rowData };
                                data.name = e.target.value;
                                data.surname = e.target.value.toLocaleUpperCase();
                                props.onRowDataChange(data);
                            }}
                        />
                    );
                },
                aggregation: 'count'
            },
            {
                title: 'Soyadı',
                field: 'surname',
                editComponent: (props: any) => {
                    return (
                        <input
                            value={props.value}
                            onChange={e => props.onChange(e.target.value)}
                        />
                    );
                },
            },
            { title: 'Evli', field: 'isMarried', type: 'boolean', cellStyle: salaryBackgroundStyle, cellClassName: 'salary-cell' },
            { title: 'Cinsiyet', field: 'sex', disableClick: true, editable: 'onAdd', aggregation: 'custom', render: sexColumnRender },
            { title: 'Tipi', field: 'type', removable: false, editable: 'never', export: false, },
            { title: 'Kayıt Tarihi', field: 'insertDateTime', type: 'datetime', rootTitle: 'Times' },
            { title: 'Zaman', field: 'time', type: 'time', rootTitle: 'Times' },
            { title: 'Salary, $', field: 'salary', type: 'numeric', digits: 2, cellStyle: salaryBackgroundStyle, cellClassName: 'salary-cell', headerClassName: 'salary-header', headerStyle: salaryBackgroundStyle, aggregation: 'custom', render: salaryColumnRender, defaultSort: 'desc', rootTitle: rootSalariesHeader },
            { title: 'Salary 0', field: 'salary', type: 'numeric', digits: 0, cellStyle: salaryBackgroundStyle, cellClassName: 'salary-cell', headerClassName: 'salary-header', headerStyle: salaryBackgroundStyle, aggregation: 'sum', rootTitle: rootSalariesHeader },
            { title: 'Salary 2', field: 'salary', type: 'numeric', digits: 2, cellStyle: salaryBackgroundStyle, cellClassName: 'salary-cell', headerClassName: 'salary-header', headerStyle: salaryBackgroundStyle, aggregation: 'sum', rootTitle: rootSalariesHeader },
            { title: 'Doğum Yılı', field: 'birthDate', type: 'date', filtering: false, aggregation: 'max' },
            { title: 'Doğum Yeri', field: 'birthCity', lookup: { 34: 'İstanbul', 0: 'Şanlıurfa', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19' } },
        ],
        remoteColumns: [
            { title: 'Avatar', field: 'avatar', render: (rowData: any) => <img style={{ height: 36, borderRadius: '50%' }} src={rowData.avatar} /> },
            { title: 'Id', field: 'id', aggregation: 'count' },
            { title: 'First Name', field: 'first_name', defaultFilter: 'De' },
            { title: 'Last Name', field: 'last_name' },
        ]
    });

    React.useEffect(() => {
        setTimeout(() => {
            setState(Object.assign({ ...state }, {
                isLoading: false,
                data: [
                    { id: 1, name: 'A1', surname: '"BSSSSSSSSSSSSSSSSSSSS"', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 0, sex: 'Male', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 5000.312321 },
                    { id: 2, name: 'A2', surname: 'B', isMarried: false, birthDate: new Date(1987, 1, 1), birthCity: null, sex: 'Female', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 2000.3, parentId: 1 },
                    { id: 3, name: 'A3', surname: 'B', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 3000, parentId: 1 },
                    { id: 4, name: 'A4', surname: 'C', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 4000, parentId: 3 },
                    { id: 5, name: 'A5', surname: 'C', isMarried: false, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 5000 },
                    { id: 6, name: 'A6', surname: 'C', isMarried: true, birthDate: new Date(1989, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 6000, parentId: 5 },
                    { id: 7, name: 'A1', surname: '+D', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 0, sex: 'Male', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 0.18819 },
                    { id: 8, name: 'A11', surname: '++D', isMarried: false, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 0 },
                ]
            }));
        }, 100);
    }, []);


    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid component='label' container alignItems='center' spacing={1}>
                    <Grid item>Filter type: Header</Grid>
                    <Grid item>
                        <Switch
                            checked={filterType !== 'header'}
                            onChange={event => {
                                setFilterType(event.target.checked ? 'row' : 'header' );
                            }}
                        />
                    </Grid>
                    <Grid item>Row</Grid>
                </Grid>
                <div style={{ maxWidth: '100%', direction: 'ltr' }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <MaterialTable
                                title='Demo Title'
                                isLoading={state.isLoading}
                                tableRef={tableRef}
                                columns={state.columns}
                                data={state.data}
                                localization={{
                                    filter: {
                                        clearFilter: 'Очистить',
                                        selectAll: 'Выбрать все',
                                    }
                                }}
                                options={{
                                    aggregation: true,
                                    aggregateChilds: false,
                                    columnsButton: true,
                                    selection: true,
                                    grouping: false,
                                    filtering: true,
                                    filterType,
                                    filterChilds: false,
                                    sortChilds: false,
                                    defaultExpanded: false,
                                    fixedColumns: 3,
                                    maxBodyHeight: '400px',
                                    exportButton: true,
                                    exportDelimiter: ';',
                                    exportNumericDecimalSeparator: ',',
                                    exportNumericNullToZero: true,
                                    exportTotals: true,
                                    datetimeLocaleString: 'ru-RU',
                                    strictDigits: true,
                                    headerClassName: 'custom-header-class',
                                }}
                                parentChildData={(row: any, rows: any) => (row.parentId && rows.find((a: any) => a.id === row.parentId)) || null}
                                onChangeFilter={(items: any) => { console.log('onChangeFilter', items); } }
                            />
                        </Grid>
                    </Grid>
                    {state.text}
                    <button onClick={() => tableRef.current.onAllSelected(true)} style={{ margin: 10 }}>
            Select
                    </button>
                    <MaterialTable
                        title='Remote Data Preview'
                        columns={[
                            {
                                title: 'Avatar',
                                field: 'avatar',
                                render: (rowData: any) => (
                                    <img
                                        style={{ height: 36, borderRadius: '50%' }}
                                        src={rowData.avatar}
                                    />
                                ),
                            },
                            { title: 'Id', field: 'id' },
                            { title: 'First Name', field: 'first_name' },
                            { title: 'Last Name', field: 'last_name' },
                        ]}
                        options={{
                            grouping: true,
                            // filtering: true,
                            columnsButton: true,
                        }}
                        data={(query: any) => new Promise((resolve) => {
                            let url = 'https://reqres.in/api/users?';
                            url += 'per_page=' + query.pageSize;
                            url += '&page=' + (query.page + 1);
                            fetch(url)
                                .then((response: any) => response.json())
                                .then((result: any) => {
                                    resolve({
                                        data: result.data,
                                        page: result.page - 1,
                                        totalCount: result.total,
                                    });
                                });
                        })}
                    />
                    <button onClick={() => tableInfiniteReplaceRef.current.onQueryChange()}>Refresh infinite table</button>
                    <MaterialTable
                        title='Infinite Scroll Preview Replace'
                        tableRef={tableInfiniteReplaceRef}
                        columns={[
                            {
                                title: 'Avatar',
                                field: 'avatar',
                                render: (rowData: any) => (
                                    <img
                                        style={{ height: 36, borderRadius: '50%' }}
                                        src={rowData.avatar}
                                    />
                                ),
                            },
                            { title: 'Id', field: 'id' },
                            { title: 'First Name', field: 'first_name' },
                            { title: 'Last Name', field: 'last_name' },
                        ]}
                        options={{
                            maxBodyHeight: 200,
                            paging: 'infinite',
                            infinityChangePropPolicy: 'replace',
                        }}
                        data={(query: any) => new Promise((resolve) => {
                            let url = 'https://reqres.in/api/users?';
                            url += 'per_page=' + ((query.page + 2) * query.pageSize);
                            url += '&page=1';
                            url += '&delay=3';
                            fetch(url)
                                .then((response: any) => response.json())
                                .then((result: any) => {
                                    resolve({
                                        data: result.data,
                                        page: result.page - 1,
                                        totalCount: result.total,
                                    });
                                });
                        })}
                    />
                    <MaterialTable
                        title='Basic Tree Data Preview'
                        data={[
                            {
                                id: 1,
                                name: 'a',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 63,
                                sex: 'Male',
                                type: 'adult',
                            },
                            {
                                id: 2,
                                name: 'b',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 34,
                                sex: 'Female',
                                type: 'adult',
                                parentId: 1,
                            },
                            {
                                id: 3,
                                name: 'c',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 34,
                                sex: 'Female',
                                type: 'child',
                                parentId: 1,
                            },
                            {
                                id: 4,
                                name: 'd',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 34,
                                sex: 'Female',
                                type: 'child',
                                parentId: 3,
                            },
                            {
                                id: 5,
                                name: 'e',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 34,
                                sex: 'Female',
                                type: 'child',
                            },
                            {
                                id: 6,
                                name: 'f',
                                surname: 'Baran',
                                birthYear: 1987,
                                birthCity: 34,
                                sex: 'Female',
                                type: 'child',
                                parentId: 5,
                            },
                        ]}
                        columns={[
                            { title: 'Adı', field: 'name' },
                            { title: 'Soyadı', field: 'surname' },
                            { title: 'Cinsiyet', field: 'sex', defaultGroupOrder: 0 },
                            { title: 'Tipi', field: 'type', removable: false },
                            { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
                            {
                                title: 'Doğum Yeri',
                                field: 'birthCity',
                                lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                            },
                        ]}
                        options={{
                            grouping: true,
                            selection: true,
                            fixedColumns: 2
                        }}
                    />
                    <MaterialTable
                        title='Editable Preview'
                        columns={state.columns}
                        data={state.data}
                        editable={{
                            onRowAdd: (newData: any) => {
                                return new Promise<void>((resolve) => {
                                    console.log('data for save', newData);
                                    setTimeout(resolve, 1000);
                                });
                            },
                            onRowUpdate: () => {
                                return new Promise<void>((resolve) => {
                                    setTimeout(resolve, 1000);
                                });
                            },
                            onRowDelete: () => {
                                return new Promise<void>((resolve) => {
                                    setTimeout(resolve, 1000);
                                });
                            },
                        }}
                        options={{
                            addRowPosition: state.actionsAlign === 'left' ? 'first' : 'last',
                            aggregation: true,
                            fixedColumns: 1,
                            grouping: true,
                            rowStyle: (data: any) => {
                                if (data.sex === 'Male') {
                                    return {
                                        backgroundColor: 'red',
                                    };
                                }
                            },
                            rowClassName: (data: any) => {
                                if (data.sex === 'Male') {
                                    return 'male-class';
                                }
                            }
                        }}
                        onChangeColumnGroups={(items: any) => { console.log('onChangeColumnGroups', items); } }
                    />
                </div>
            </ThemeProvider>
        </>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
