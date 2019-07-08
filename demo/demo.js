import { Grid, MuiThemeProvider, Button, Switch } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MaterialTable from '../src';

let direction = 'ltr';
// direction = 'rtl';
const theme = createMuiTheme({
  direction: direction,
  palette: {
    type: 'light'
  }
});

const sexColumnRender = (data, type) => {
  if (type === 'totals') {
    const result = [];
    const map = data.reduce((prev, curr) => {
      if (!prev[curr.type]) {
        prev[curr.type] = [];
      }

      prev[curr.type].push(curr);
      return prev;
    }, {});
    for (const type in map) {
      const maleCount = map[type].filter(x => x.sex === 'Male').length;
      const femaleCount = map[type].filter(x => x.sex === 'Female').length;

      result.push(<div key={type}>{`${type}: ${maleCount}/${femaleCount}`}</div>);
    }

    return result;
  }

  return data.sex;
};

const salaryColumnRender = (data, type) => {
  if (type === 'totals') {
    const result = data.reduce((state, curr) => {
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
    isMarried: i % 2 ? true : false,
    birthDate: new Date(1987, 1, 1),
    birthCity: 0,
    sex: i % 2 ? 'Male' : 'Female',
    type: 'adult',
    insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
    time: new Date(1900, 1, 1, 14, 23, 35)
  };
  bigData.push(d);
}

const App = () => {
  const tableRef = React.createRef();

  const [ filterType, setFilterType ] = React.useState('header');
  const [ state, setState ] = React.useState({
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
      ), field: 'name', editComponent: props => {
          return (
            <input
              value={props.value}
              onChange={e => {
                var data = { ...props.rowData };
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
        title: 'Soyadı', field: 'surname', editComponent: props => {
          return (
            <input
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
            />
          )
        },
        export: false,
      },
      { title: 'Evli', field: 'isMarried', type: 'boolean' },
      { title: 'Cinsiyet', field: 'sex', disableClick: true, editable: 'onAdd', aggregation: 'custom', render: sexColumnRender },
      { title: 'Tipi', field: 'type', removable: false, editable: 'never' },
      { title: 'Doğum Yılı', field: 'birthDate', type: 'date', filtering: false, aggregation: 'max' },
      { title: 'Doğum Yeri', field: 'birthCity', lookup: { 34: 'İstanbul', 0: 'Şanlıurfa', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19' } },
      { title: 'Kayıt Tarihi', field: 'insertDateTime', type: 'datetime' },
      { title: 'Zaman', field: 'time', type: 'time' },
      { title: 'Salary, $', field: 'salary', type: 'numeric', digits: 2,  aggregation: 'custom', render: salaryColumnRender, defaultSort: 'desc' },
      { title: 'Salary 0', field: 'salary', type: 'numeric', digits: 0,  aggregation: 'sum' },
      { title: 'Salary 2', field: 'salary', type: 'numeric', digits: 2,  aggregation: 'sum' },
    ],
    remoteColumns: [
      { title: 'Avatar', field: 'avatar', render: rowData => <img style={{ height: 36, borderRadius: '50%' }} src={rowData.avatar} /> },
      { title: 'Id', field: 'id', aggregation: 'count' },
      { title: 'First Name', field: 'first_name', defaultFilter: 'De' },
      { title: 'Last Name', field: 'last_name' },
    ]
  });

  React.useEffect(() => {
    setTimeout(() => {
      setState(Object.assign({...state}, {
        isLoading: false,
        data:  [
          { id: 1, name: 'A1', surname: 'BSSSSSSSSSSSSSSSSSSSS', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 0, sex: 'Male', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 5000.312321 },
          { id: 2, name: 'A2', surname: 'B', isMarried: false, birthDate: new Date(1987, 1, 1), birthCity: null, sex: 'Female', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 2000.3, parentId: 1 },
          { id: 3, name: 'A3', surname: 'B', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 3000, parentId: 1 },
          { id: 4, name: 'A4', surname: 'C', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 4000, parentId: 3 },
          { id: 5, name: 'A5', surname: 'C', isMarried: false, birthDate: new Date(1987, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 5000 },
          { id: 6, name: 'A6', surname: 'C', isMarried: true, birthDate: new Date(1989, 1, 1), birthCity: 34, sex: 'Female', type: 'child', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 6000, parentId: 5 },
          { id: 7, name: 'A1', surname: 'D', isMarried: true, birthDate: new Date(1987, 1, 1), birthCity: 0, sex: 'Male', type: 'adult', insertDateTime: new Date(2018, 1, 1, 12, 23, 44), time: new Date(1900, 1, 1, 14, 23, 35), salary: 0.1819 },
        ]
      }));
    }, 100);
  }, []);


  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Grid component="label" container alignItems="center" spacing={1}>
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
        <div style={{ maxWidth: '100%', direction }}>
          <Grid container>
            <Grid item xs={12}>
              <MaterialTable
                isLoading={state.isLoading}
                tableRef={tableRef}
                columns={state.columns}
                data={state.data}
                title="Demo Title"
                localization={{
                  filter: {
                    clearFilter: 'Очистить',
                    selectAll: 'Выбрать все',
                  }
                }}
                options={{
                  aggregation: true,
                  columnsButton: true,
                  selection: true,
                  grouping: true,
                  filtering: true,
                  filterType: filterType,
                  filterChilds: false,
                  sortChilds: false,
                  defaultExpanded: false,
                  fixedColumns: 3,
                  maxBodyHeight: '500px',
                  exportButton: true,
                  exportDelimiter: ';',
                  exportNumericDecimalSeparator: ',',
                  exportNumericNullToZero: true,
                  exportTotals: true,
                  datetimeLocaleString: 'ru-RU',
                }}
                parentChildData={(row, rows) => row.parentId && rows.find((a) => a.id === row.parentId) || null}
              />
            </Grid>
          </Grid>
          {state.text}
          <button onClick={() => tableRef.current.onAllSelected(true)} style={{ margin: 10 }}>
            Select
          </button>
          <MaterialTable
            title="Remote Data Preview"
            columns={[
              {
                title: 'Avatar',
                field: 'avatar',
                render: rowData => (
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
              filtering: true
            }}
            data={query => new Promise((resolve, reject) => {
              let url = 'https://reqres.in/api/users?'
              url += 'per_page=' + query.pageSize
              url += '&page=' + (query.page + 1)
              console.log(query);
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  resolve({
                    data: result.data,
                    page: result.page - 1,
                    totalCount: result.total,
                  })
                })
            })}
          />
          <MaterialTable
            title="Basic Tree Data Preview"
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
              { title: 'Cinsiyet', field: 'sex' },
              { title: 'Tipi', field: 'type', removable: false },
              { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
              {
                title: 'Doğum Yeri',
                field: 'birthCity',
                lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
              },
            ]}
            parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
            options={{
              selection: true,
              fixedColumns: 2
            }}
          />
          <MaterialTable
            title="Editable Preview"
            columns={state.columns}
            data={state.data}
            editable={{
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                /* const data = this.state.data;
                                data.push(newData);
                                this.setState({ data }, () => resolve()); */
                            }
                            resolve();
                        }, 1000);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                /* const data = this.state.data;
                                const index = data.indexOf(oldData);
                                data[index] = newData;                
                                this.setState({ data }, () => resolve()); */
                            }
                            resolve();
                        }, 1000);
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                /* let data = this.state.data;
                                const index = data.indexOf(oldData);
                                data.splice(index, 1);
                                this.setState({ data }, () => resolve()); */
                            }
                            resolve();
                        }, 1000);
                    })
            }}
            options={{
              actionsAlign: state.actionsAlign,
              addRowPosition: state.actionsAlign === 'left' ? '' : 'last',
              aggregation: true,
              fixedColumns: 1,
            }}
          />
        </div>
      </MuiThemeProvider>
    </>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
