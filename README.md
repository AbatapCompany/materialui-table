<p align="center" style="box-shadow: 2px 2px;">
  <a href="https://material-table.com" rel="noopener" target="_blank" ><img width="200" src="https://raw.githubusercontent.com/mbrn/material-table.com/master/docs/assets/logo-back.png" alt="material-table"></a></p>
</p>

<h1 align="center">material-table</h1>

<div>

A simple and powerful Datatable for React based on [Material-UI Table](https://material-ui.com/api/table/) with some additional features:
- filter in header
- fixed columns
- summary row
- some new events (onChangeColumnOrder, onChangeColumnHidden)
- and more
</div>

## Key features

- [Actions](https://material-table.com/#/docs/features/actions)
- [Component overriding](https://material-table.com/#/docs/features/component-overriding)
- [Custom column rendering](https://material-table.com/#/docs/features/custom-column-rendering)
- [Detail Panel](https://material-table.com/#/docs/features/detail-panel)
- [Editable](https://material-table.com/#/docs/features/editable)
- [Export](https://material-table.com/#/docs/features/export)
- [Filtering](https://material-table.com/#/docs/features/filtering)
- [Grouping](https://material-table.com/#/docs/features/grouping)
- [Localization](https://material-table.com/#/docs/features/localization)
- [Remote Data](https://material-table.com/#/docs/features/remote-data)
- [Search](https://material-table.com/#/docs/features/search)
- [Selection](https://material-table.com/#/docs/features/selection)
- [Sorting](https://material-table.com/#/docs/features/sorting)
- [Styling](https://material-table.com/#/docs/features/styling)
- [Tree Data](https://material-table.com/#/docs/features/tree-data)
- and more

## Demo and documentation

You can access all code examples and documentation on our site [**material-table.com**](https://material-table.com/).

## Support material-table

To support material-table visit [SUPPORT](https://www.patreon.com/mbrn) page.

## Prerequisites

The minimum `React` version material-table supports is `^16.8.5` since material-table `v1.36.1`. This is due to utilising [`react-beautiful-dnd`](https://github.com/atlassian/react-beautiful-dnd) for drag & drop functionality which uses hooks.

If you use an older version of react we suggest to upgrade your dependencies or use material-table `1.36.0`.

## Installation

#### 1.Install package

To install material-table with `npm`:

    npm install material-table --save

To install material-table with `yarn`:

    yarn add material-table

#### 2.Add material icons

There are two ways to use icons in material-table either import the material icons font via html OR import material icons and use the material-table `icons` prop.

##### HTML

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
```

OR

##### Import Material icons

Icons can be imported to be used in material-table offering more flexibility for customising the look and feel of material table over using a font library.

To install @material-ui/icons with `npm`:

    npm install @material-ui/icons --save

To install @material-ui/icons with `yarn`:

    yarn add @material-ui/icons

If your environment doesn't support tree-shaking, the **recommended** way to import the icons is the following:

```jsx
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
```

If your environment support tree-shaking you can also import the icons this way:

```jsx
import { AddBox, ArrowUpward } from "@material-ui/icons";
```

Note: Importing named exports in this way will result in the code for _every icon_ being included in your project, so is not recommended unless you configure [tree-shaking](https://webpack.js.org/guides/tree-shaking/). It may also impact Hot Module Reload performance. Source: [@material-ui/icons](https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/README.md#imports)

Example

```jsx
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

<MaterialTable
  icons={tableIcons}
  ...
/>
```

## Usage

Here is a basic example of using material-table within a react application.

```jsx
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";

class App extends Component {
  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={[
            { title: "Adı", field: "name" },
            { title: "Soyadı", field: "surname" },
            { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
            {
              title: "Doğum Yeri",
              field: "birthCity",
              lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
            }
          ]}
          data={[
            { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 }
          ]}
          title="Demo Title"
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-div"));
```

## Infinite scroll

Here is a example of using material-table with infinite scroll.
For activating infinite scroll you need to set `maxBodyHeight` less than height of page of content and set `paging: infinite`. Also, you can use callback function `onChangePage` instead of data function, which will be usefull for integration with Redux store.
If `infinityChangePropPolicy` === 'append' (default value) response data is added to the end of the list, otherwise with 'replace' value the data is overwritten

```jsx
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";

class App extends Component {
  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
          <MaterialTable
            title="Infinite Scroll Preview"
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
              maxBodyHeight: 200,
              paging: 'infinite',
              infinityChangePropPolicy: 'append',
            }}
            data={query => new Promise((resolve, reject) => {
              let url = 'https://reqres.in/api/users?'
              url += 'per_page=' + query.pageSize
              url += '&page=' + (query.page + 1)
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
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-div"));
```

## Contributing

We'd love to have your helping hand on `material-table`! See [CONTRIBUTING.md](https://github.com/mbrn/material-table/blob/master/.github/CONTRIBUTING.md) for more information on what we're looking for and how to get started.

If you have any sort of doubt, idea or just want to talk about the project, feel free to join [our chat on Gitter](https://gitter.im/material-table/Lobby) :)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
