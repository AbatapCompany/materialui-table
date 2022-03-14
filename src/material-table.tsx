/* eslint-disable max-lines */
import React, { ChangeEvent, Component, ForwardedRef } from 'react';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import Icon from '@mui/material/Icon';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { debounce } from 'debounce';
import omit from 'lodash/omit';
import * as MComponents from './components';
import DataManager from './utils/data-manager';
import { MaterialTableProps, QueryResult } from './models/material-table.model';
import { SortDirection } from '@mui/material';

let tableCounter = 1;

export default class MaterialTable extends Component<MaterialTableProps, any> {

    static defaultProps: Partial<MaterialTableProps> = {
        actions: [],
        classes: {},
        columns: [],
        components: {
            Action: MComponents.MTableAction,
            Actions: MComponents.MTableActions,
            Body: MComponents.MTableBody,
            Cell: MComponents.MTableCell,
            Container: MComponents.MTableContainer,
            EditField: MComponents.MTableEditField,
            EditRow: MComponents.MTableEditRow,
            FilterRow: MComponents.MTableFilterRow,
            Groupbar: MComponents.MTableGroupbar,
            GroupRow: MComponents.MTableGroupRow,
            Header: MComponents.MTableHeader,
            OverlayLoading: MComponents.MTableOverlayLoading,
            Pagination: TablePagination,
            Row: MComponents.MTableBodyRow,
            Toolbar: MComponents.MTableToolbar,
            FilterButton: MComponents.MTableFilterButton,
            Totals: MComponents.MTableTotalsRow
        },
        data: [],
        icons: {
        /* eslint-disable react/display-name */
            Add: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>add_box</Icon>),
            Check: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>check</Icon>),
            Clear: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>clear</Icon>),
            Delete: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>delete_outline</Icon>),
            DetailPanel: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>chevron_right</Icon>),
            Edit: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>edit</Icon>),
            Export: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>save_alt</Icon>),
            Filter: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>filter_list</Icon>),
            FirstPage: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>first_page</Icon>),
            LastPage: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>last_page</Icon>),
            NextPage: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>chevron_right</Icon>),
            PreviousPage: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>chevron_left</Icon>),
            ResetSearch: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>clear</Icon>),
            Search: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>search</Icon>),
            SortArrow: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>arrow_upward</Icon>),
            ThirdStateCheck: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>remove</Icon>),
            ViewColumn: React.forwardRef((props: any, ref: ForwardedRef<unknown>) => <Icon {...props} ref={ref}>view_column</Icon>)
        /* eslint-enable react/display-name */
        },
        isLoading: false,
        title: 'Table Title',
        options: {
            actionsColumnIndex: 0,
            addRowPosition: 'last',
            aggregateChilds: true,
            columnsButton: false,
            detailPanelType: 'multiple',
            debounceInterval: 200,
            doubleHorizontalScroll: false,
            draggableHeader: true,
            emptyRowsWhenPaging: true,
            exportAllData: false,
            exportButton: false,
            exportDelimiter: ',',
            filtering: false,
            filterType: 'row',
            filterChilds: false,
            fixedColumns: 0,
            header: true,
            loadingType: 'overlay',
            paging: 'classic',
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            paginationType: 'normal',
            showEmptyDataSourceMessage: true,
            showFirstLastPageButtons: true,
            showSelectAllCheckbox: true,
            search: true,
            showTitle: true,
            showTextRowsSelected: true,
            toolbarButtonAlignment: 'right',
            searchFieldAlignment: 'right',
            searchFieldStyle: {},
            selection: false,
            selectionProps: {},
            sorting: true,
            sortChilds: true,
            strictDigits: false,
            toolbar: true,
            defaultExpanded: false,
            detailPanelColumnAlignment: 'left'
        },
        localization: {
            grouping: {
                groupedBy: 'Grouped By:',
                placeholder: 'Drag headers here to group by',
            },
            pagination: {
                labelDisplayedRows: '{from}-{to} of {count}',
                labelRowsPerPage: 'Rows per page:',
                labelRowsSelect: 'rows'
            },
            toolbar: {},
            header: {},
            body: {
                filterRow: {},
                editRow: {
                    saveTooltip: 'Save',
                    cancelTooltip: 'Cancel',
                    deleteText: 'Are you sure delete this row?',
                },
                addTooltip: 'Add',
                deleteTooltip: 'Delete',
                editTooltip: 'Edit'
            }
        }
    }

    private dataManager = new DataManager();
    private id: string;

    constructor(props: MaterialTableProps) {
        super(props);
        this.id = `m_table_${tableCounter++}`;

        const calculatedProps = this.getProps(props);
        this.setDataManagerFields(calculatedProps);
        const renderState = this.dataManager.getRenderState();

        this.state = {
            ...renderState,
            query: {
                filters: renderState.columns
                    .filter(a => a.tableData.filterValue)
                    .map(a => ({
                        column: a,
                        operator: '=',
                        value: a.tableData.filterValue
                    })),
                orderBy: renderState.columns.find(a => a.tableData.id === renderState.orderBy),
                orderDirection: renderState.orderDirection,
                page: 0,
                pageSize: calculatedProps.options.pageSize,
                search: renderState.searchText,

                totalCount: 0
            },
            showAddRow: false,
            isDragged: false,
            tableBodyVersion: 0,
        };
    }

    componentDidMount() {
        this.setState(this.dataManager.getRenderState(), () => {
            if (this.isRemoteData()) {
                this.onQueryChange(this.state.query);
            }
        });
    }

    onQueryChange = (queryArg: any, fn?: any) => {
        const query = { ...this.state.query, ...queryArg };

        this.setState({ isLoading: true, tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
            if (typeof this.props.data === 'function') {
                void this.props.data(query)
                    .then((result: QueryResult) => {
                        query.totalCount = result.totalCount;
                        query.page = result.page;
                        this.dataManager.setData(result.data);
                        this.setState({
                            isLoading: false,
                            tableBodyVersion: this.state.tableBodyVersion + 1,
                            ...this.dataManager.getRenderState(),
                            query
                        }, () => {
                            if (typeof fn === 'function') {
                                fn();
                            }
                        });
                    });
            }
        });
    }

    setDataManagerFields = (props: MaterialTableProps, prevProps?: MaterialTableProps) => {
        let defaultSortColumnIndex = -1;
        let defaultSortDirection: SortDirection = false;
        if (props) {
            defaultSortColumnIndex = props.columns.findIndex((a) => a.defaultSort);
            defaultSortDirection = defaultSortColumnIndex > -1 ? props.columns[defaultSortColumnIndex].defaultSort : false;
        }

        this.dataManager.setColumns(props.columns);
        this.dataManager.setDefaultExpanded(props.options.defaultExpanded);
        this.dataManager.setAggregateChilds(props.options.aggregateChilds);
        this.dataManager.setFilterChilds(props.options.filterChilds);
        this.dataManager.setSortChilds(props.options.sortChilds);

        if (this.isRemoteData(props)) {
            this.dataManager.changeApplySearch(false);
            this.dataManager.changeApplyFilters(false);
        }
        else {
            this.dataManager.changeApplySearch(true);
            this.dataManager.changeApplyFilters(true);
            this.dataManager.setData(props.data);
        }

        this.dataManager.changeDetailPanelType(props.options.detailPanelType);

        const isInit = !prevProps || prevProps.name !== props.name;
        if (isInit) {
            this.dataManager.changeOrder(defaultSortColumnIndex, defaultSortDirection);
            this.dataManager.changeCurrentPage(props.options.initialPage ? props.options.initialPage : 0);
            this.dataManager.changePageSize(props.options.pageSize);
            this.dataManager.changePaging(props.options.paging);
            this.dataManager.changeInfinityType(props.options.infinityChangePropPolicy || 'append');
            this.dataManager.changeParentFunc(props.parentChildData);
        }
    }

    UNSAFE_componentWillReceiveProps = (nextProps: any) => {
        const props = this.getProps(nextProps);
        this.setDataManagerFields(props, this.getProps());
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
    }

    isRemoteData = (props?: any) => {
        return !Array.isArray((props || this.props).data);
    }

    getProps = (props?: any) => {
        const calculatedProps = { ...(props || this.props) };

        const localization = calculatedProps.localization.body;

        calculatedProps.actions = [...(calculatedProps.actions || [])];
        if (calculatedProps.editable) {
            if (calculatedProps.editable.onRowAdd) {
                calculatedProps.actions.push({
                    icon: calculatedProps.icons.Add,
                    tooltip: localization.addTooltip,
                    isFreeAction: true,
                    onClick: () => {
                        if (typeof this.props.onClickActionButton === 'function') {
                            this.props.onClickActionButton('addStart');
                        }
                        this.dataManager.changeRowEditing();
                        this.setState({
                            ...this.dataManager.getRenderState(),
                            showAddRow: !this.state.showAddRow
                        });
                    }
                });
            }
            if (calculatedProps.editable.onRowUpdate) {
                calculatedProps.actions.push((rowData: any) => ({
                    icon: calculatedProps.icons.Edit,
                    tooltip: localization.editTooltip,
                    disabled: calculatedProps.editable.isEditable && !calculatedProps.editable.isEditable(rowData),
                    onClick: (_event: any, rowData: any) => {
                        if (this.dataManager.lastEditingRow) {
                            return;
                        }
                        if (typeof this.props.onClickActionButton === 'function') {
                            this.props.onClickActionButton('updateStart', rowData);
                        }
                        this.dataManager.changeRowEditing(rowData, 'update');
                        this.setState({
                            ...this.dataManager.getRenderState(),
                            showAddRow: false
                        });
                    }
                }));
            }
            if (calculatedProps.editable.onRowDelete) {
                calculatedProps.actions.push((rowData: any) => ({
                    icon: calculatedProps.icons.Delete,
                    tooltip: localization.deleteTooltip,
                    disabled: calculatedProps.editable.isDeletable && !calculatedProps.editable.isDeletable(rowData),
                    onClick: (_event: any, rowData: any) => {
                        if (this.dataManager.lastEditingRow) {
                            return;
                        }
                        if (typeof this.props.onClickActionButton === 'function') {
                            this.props.onClickActionButton('deleteStart', rowData);
                        }
                        this.dataManager.changeRowEditing(rowData, 'delete');
                        this.setState({
                            ...this.dataManager.getRenderState(),
                            showAddRow: false
                        });
                    }
                }));
            }
        }

        calculatedProps.components = { ...MaterialTable.defaultProps.components, ...calculatedProps.components };
        calculatedProps.icons = { ...MaterialTable.defaultProps.icons, ...calculatedProps.icons };
        calculatedProps.options = { ...MaterialTable.defaultProps.options, ...calculatedProps.options };

        return calculatedProps;
    }

    onAllSelected = (checked: any) => {
        this.dataManager.changeAllSelected(checked);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
            this.onSelectionChange();
        });
    }

    onChangeColumnHidden = (columnId: any, hidden: any) => {
        this.dataManager.changeColumnHidden(columnId, hidden);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });

        if (this.props.onChangeColumnHidden) {
            this.props.onChangeColumnHidden(columnId, hidden, this.state.columns.sort((a: any, b: any) =>
                (a.tableData.columnOrder > b.tableData.columnOrder) ? 1 : -1));
        }
    }

    onChangeGroupOrder = (groupedColumn: any) => {
        const groupedResult = this.dataManager.changeGroupOrder(groupedColumn.tableData.id);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });

        if (groupedResult !== undefined && this.props.onChangeColumnGroups) {
            this.props.onChangeColumnGroups(groupedResult);
        }
    }

    onChangeOrder = (orderBy: any, orderDirection: any) => {
        this.dataManager.changeOrder(orderBy, orderDirection);

        if (this.isRemoteData()) {
            const query = { ...this.state.query };
            query.page = 0;
            query.orderBy = this.state.columns.find((a: any) => {
                return a.tableData.id === orderBy;
            });
            query.orderDirection = orderDirection;
            this.onQueryChange(query, () => {
                if (this.props.onOrderChange) {
                    this.props.onOrderChange(orderBy, orderDirection);
                }
            });
        }
        else {
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                if (this.props.onOrderChange) {
                    this.props.onOrderChange(orderBy, orderDirection);
                }
            });
        }
    }

    onPageChange = (page: number) => {
        if (this.isRemoteData()) {
            const query = { ...this.state.query };
            query.page = page;
            this.onQueryChange(query, () => {
                if (this.props.onPageChange) {
                    this.props.onPageChange(page);
                }
            });
        }
        else {
            this.dataManager.changeCurrentPage(page);
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                if (typeof this.props.onPageChange === 'function') {
                    this.props.onPageChange(page);
                }
            });
        }
    }

    onRowsPerPageChange = (event: any) => {
        const pageSize = event.target.value;

        this.dataManager.changePageSize(pageSize);

        if (this.isRemoteData()) {
            const query = { ...this.state.query };
            query.pageSize = event.target.value;
            query.page = 0;
            this.onQueryChange(query, () => {
                if (this.props.onRowsPerPageChange) {
                    this.props.onRowsPerPageChange(pageSize);
                }
            });
        }
        else {
            this.dataManager.changeCurrentPage(0);
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                if (this.props.onRowsPerPageChange) {
                    this.props.onRowsPerPageChange(pageSize);
                }
            });
        }
    }

    onDragStart = () => {
        this.setState({
            isDragged: true,
        });

    }

    onDragEnd = (result: any) => {
        if (result && result.destination && result.destination.index < this.props.options.fixedColumns && result.destination.droppableId === 'headers') {
            return;
        }

        const groupedResult = this.dataManager.changeByDrag(result);
        this.setState({ ...this.dataManager.getRenderState(), isDragged: false, tableBodyVersion: this.state.tableBodyVersion + 1 });

        if (result && result.destination && result.destination.droppableId === 'headers'
        && result.source && result.source.droppableId === result.destination.droppableId
        && this.props.onChangeColumnOrder) {
            this.props.onChangeColumnOrder(this.state.columns.sort((a: any, b: any) =>
                (a.tableData.columnOrder > b.tableData.columnOrder) ? 1 : -1));

        }

        if (groupedResult !== undefined && this.props.onChangeColumnGroups) {
            this.props.onChangeColumnGroups(groupedResult);
        }
    }

    onGroupExpandChanged = (path: number[]) => {
        this.dataManager.changeGroupExpand(path);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
    }

    onGroupRemoved = (groupedColumn: any, index: any) => {
        const result: any = {
            combine: null,
            destination: { droppableId: 'headers', index: 0 },
            draggableId: groupedColumn.tableData.id,
            mode: 'FLUID',
            reason: 'DROP',
            source: { index, droppableId: 'groups' },
            type: 'DEFAULT'
        };
        const groupedResult = this.dataManager.changeByDrag(result);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
        if (groupedResult !== undefined && this.props.onChangeColumnGroups) {
            this.props.onChangeColumnGroups(groupedResult);
        }
    }

    onEditingApproved = (mode: any, newData: any, oldData: any) => {
        if (this.props.onClickActionButton) {
            this.props.onClickActionButton(mode + 'Approved', newData, oldData);
        }
        if (mode === 'add') {
            this.setState({ isLoading: true, tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                this.props.editable.onRowAdd(newData)
                    .then(() => {
                        if (this.props.onClickActionButton) {
                            this.props.onClickActionButton(mode + 'End', newData);
                        }
                        this.setState({ isLoading: false, showAddRow: false, tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                            if (this.isRemoteData()) {
                                this.onQueryChange(this.state.query);
                            }
                        });
                    })
                    .catch(() => {
                        this.setState({ isLoading: false, tableBodyVersion: this.state.tableBodyVersion + 1 });
                    });
            });
        } else if (mode === 'update') {
            this.setState({ isLoading: true, tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                this.props.editable.onRowUpdate(newData, oldData)
                    .then(() => {
                        if (this.props.onClickActionButton) {
                            this.props.onClickActionButton(mode + 'End', newData, oldData);
                        }
                        this.dataManager.changeRowEditing(oldData);
                        this.setState({
                            isLoading: false,
                            tableBodyVersion: this.state.tableBodyVersion + 1,
                            ...this.dataManager.getRenderState()
                        }, () => {
                            if (this.isRemoteData()) {
                                this.onQueryChange(this.state.query);
                            }
                        });
                    })
                    .catch(() => {
                        this.setState({ isLoading: false, tableBodyVersion: this.state.tableBodyVersion + 1 });
                    });
            });

        } else if (mode === 'delete') {
            this.setState({ isLoading: true, tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
                this.props.editable.onRowDelete(oldData)
                    .then(() => {
                        if (this.props.onClickActionButton) {
                            this.props.onClickActionButton(mode + 'End', oldData);
                        }
                        this.dataManager.changeRowEditing(oldData);
                        this.setState({
                            isLoading: false,
                            tableBodyVersion: this.state.tableBodyVersion + 1,
                            ...this.dataManager.getRenderState()
                        }, () => {
                            if (this.isRemoteData()) {
                                this.onQueryChange(this.state.query);
                            }
                        });
                    })
                    .catch(() => {
                        this.setState({ isLoading: false, tableBodyVersion: this.state.tableBodyVersion + 1 });
                    });
            });
        }
    }

    onEditingCanceled = (mode: any, rowData: any) => {
        if (this.props.onClickActionButton) {
            this.props.onClickActionButton(mode + 'Cancel', rowData);
        }
        if (mode === 'add') {
            this.setState({ showAddRow: false, tableBodyVersion: this.state.tableBodyVersion + 1 });
        }
        else if (mode === 'update' || mode === 'delete') {
            this.dataManager.changeRowEditing(rowData);
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
        }
    }

    onRowSelected = (event: ChangeEvent<HTMLInputElement>, path: number[], dataClicked: any) => {
        this.dataManager.changeRowSelected(event.target.checked, path);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
            this.onSelectionChange(dataClicked);
        });
    }

    onSelectionChange = (dataClicked?: any) => {
        if (this.props.onSelectionChange) {
            const selectedRows: unknown[] = [];

            const findSelecteds = (list: any) => {
                list.forEach((row: any) => {
                    if (row.tableData.checked) {
                        selectedRows.push(row);
                    }

                    if (row.tableData.childRows) {
                        findSelecteds(row.tableData.childRows);
                    }
                });
            };

            findSelecteds(this.state.originalData);
            this.props.onSelectionChange(selectedRows, dataClicked);
        }
    }

    onSearchChange = (searchText: any) => {
        this.setState({ searchText }, this.onSearchChangeDebounce);
    }

    onSearchChangeDebounce = debounce(() => {
        this.dataManager.changeSearchText(this.state.searchText);

        if (this.isRemoteData()) {
            const query = { ...this.state.query };
            query.page = 0;
            query.search = this.state.searchText;

            this.onQueryChange(query);
        }
        else {
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
        }
    }, this.props.options.debounceInterval)

    onFilterChange = (columnId: number, value: any) => {
        this.dataManager.changeFilterValue(columnId, value);
        this.setState({}, this.onFilterChangeDebounce);
    }

    onFilterChangeDebounce = debounce(() => {
        if (this.isRemoteData()) {
            const query = { ...this.state.query };
            query.filters = this.state.columns
                .filter((a: any) => a.tableData.filterValue)
                .map((a: any) => ({
                    column: a,
                    operator: '=',
                    value: a.tableData.filterValue
                }));

            this.onQueryChange(query);
        }
        else {
            this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
        }

        if (this.props.onChangeFilter) {
            this.props.onChangeFilter(this.state.columns
                .filter((item: any) => item.tableData.filterValue !== null && item.tableData.filterValue !== undefined)
                .map((item: any) => ({
                    field: item.field,
                    filterValue: item.tableData.filterValue,
                })));
        }
    }, this.props.options.debounceInterval)

    onTreeExpandChanged = (path: any, data: any) => {
        this.dataManager.changeTreeExpand(path);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 }, () => {
            if (this.props.onTreeExpandChange) {
                this.props.onTreeExpandChange(data, data.tableData.isTreeExpanded);
            }
        });
    }

    onToggleDetailPanel = (path: number[], render: any) => {
        this.dataManager.changeDetailPanelVisibility(path, render);
        this.setState({ ...this.dataManager.getRenderState(), tableBodyVersion: this.state.tableBodyVersion + 1 });
    }

    renderFooter = () => {
        const props = this.getProps();

        if (props.options.paging === 'classic') {
            const localization = { ...MaterialTable.defaultProps.localization.pagination, ...this.props.localization.pagination };
            return (
                <Table>
                    <TableFooter style={{ display: 'grid' }}>
                        <TableRow>
                            <props.components.Pagination
                                classes={{
                                    root: props.classes.paginationRoot,
                                    toolbar: props.classes.paginationToolbar,
                                    caption: props.classes.paginationCaption,
                                    selectRoot: props.classes.paginationSelectRoot,
                                }}
                                style={{ float: props.theme.direction === 'rtl' ? '' : 'right', overflowX: 'auto', borderBottom: 'none', }}
                                colSpan={3}
                                count={this.isRemoteData() ? this.state.query.totalCount : this.state.data.length}
                                icons={props.icons}
                                rowsPerPage={this.state.pageSize}
                                rowsPerPageOptions={props.options.pageSizeOptions}
                                SelectProps={{
                                    renderValue: (value: any) => <div style={{ padding: '0px 5px' }}>{value + ' ' + localization.labelRowsSelect + ' '}</div>
                                }}
                                page={this.isRemoteData() ? this.state.query.page : this.state.currentPage}
                                onPageChange={this.onPageChange}
                                onRowsPerPageChange={this.onRowsPerPageChange}
                                ActionsComponent={(subProps: TablePaginationActionsProps) => {
                                    const paginationProps = omit(subProps, 'onPageChange');
                                    return props.options.paginationType === 'normal'
                                        ? <MComponents.MTablePaginationInner
                                            {...paginationProps}
                                            onPageChange={this.onPageChange}
                                            icons={props.icons}
                                            localization={localization}
                                            showFirstLastPageButtons={props.options.showFirstLastPageButtons}
                                        />
                                        : <MComponents.MTableSteppedPagination
                                            {...paginationProps}
                                            onPageChange={this.onPageChange}
                                            icons={props.icons}
                                            localization={localization}
                                        />;
                                }}
                                labelDisplayedRows={(row: any) => localization.labelDisplayedRows.replace('{from}', row.from).replace('{to}', row.to).replace('{count}', row.count)}
                                labelRowsPerPage={localization.labelRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            );
        }
    }

    renderTable = () => {
        const props = this.getProps();

        return <Table id={this.id}>
            {props.options.header &&
                <props.components.Header
                    localization={{ ...MaterialTable.defaultProps.localization.header, ...this.props.localization.header, ...this.props.localization.filter }}
                    columns={this.state.columns}
                    draggableHeader={props.options.draggableHeader}
                    hasSelection={props.options.selection}
                    headerClassName={`${props.options.headerClassName || ''}${this.state.isDragged ? ' is-dragged' : ''}`}
                    headerStyle={props.options.headerStyle}
                    selectedCount={this.state.selectedCount}
                    dataCount={props.parentChildData ? this.state.treefiedDataLength : this.state.data.length}
                    hasDetailPanel={!!props.detailPanel}
                    detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
                    showActionsColumn={props.actions && props.actions.filter((a: any) => !a.isFreeAction && !this.props.options.selection).length > 0}
                    showSelectAllCheckbox={props.options.showSelectAllCheckbox}
                    orderBy={this.state.orderBy}
                    orderDirection={this.state.orderDirection}
                    onAllSelected={this.onAllSelected}
                    onOrderChange={this.onChangeOrder}
                    actionsHeaderIndex={props.options.actionsColumnIndex}
                    sorting={props.options.sorting}
                    grouping={props.options.grouping}
                    filtering={props.options.filtering}
                    filterType={props.options.filterType}
                    isTreeData={this.props.parentChildData !== undefined}
                    icons={this.props.icons}
                    onFilterChanged={this.onFilterChange}
                    components={props.components}
                    fixedColumns={props.options.fixedColumns}
                />
            }
            <props.components.Body
                actions={props.actions}
                components={props.components}
                icons={props.icons}
                renderData={this.state.renderData}
                currentPage={this.state.currentPage}
                initialFormData={props.initialFormData}
                pageSize={this.state.pageSize}
                columns={this.state.columns}
                detailPanel={props.detailPanel}
                options={props.options}
                getFieldValue={this.dataManager.getFieldValue}
                isTreeData={this.props.parentChildData !== undefined}
                onFilterChanged={this.onFilterChange}
                onRowSelected={this.onRowSelected}
                onToggleDetailPanel={this.onToggleDetailPanel}
                onGroupExpandChanged={this.onGroupExpandChanged}
                onTreeExpandChanged={this.onTreeExpandChanged}
                onEditingCanceled={this.onEditingCanceled}
                onEditingApproved={this.onEditingApproved}
                localization={{ ...MaterialTable.defaultProps.localization.body, ...this.props.localization.body }}
                onRowClick={this.props.onRowClick}
                showAddRow={this.state.showAddRow}
                hasAnyEditingRow={!!(this.state.lastEditingRow || this.state.showAddRow)}
                hasDetailPanel={!!props.detailPanel}
                treeDataMaxLevel={this.state.treeDataMaxLevel}
                version={this.state.tableBodyVersion}
            />
            {this.props.options.aggregation && !!this.dataManager.filteredData && !!this.dataManager.filteredData.length &&
            <TableFooter>
                <props.components.Totals
                    components={props.components}
                    icons={props.icons}
                    renderData={this.dataManager.filteredData}
                    options={props.options}
                    getAggregation={this.dataManager.getAggregation}
                    columns={props.columns}
                    isTreeData={this.props.parentChildData !== undefined}
                    detailPanel={props.detailPanel}
                    actions={props.actions}
                    hasAnyEditingRow={!!(this.state.lastEditingRow || this.state.showAddRow)}
                />
            </TableFooter>
            }
        </Table>;
    }

    render = () => {
        const props = this.getProps();

        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <props.components.Container style={{ position: 'relative', ...props.style }}>
                    {props.options.toolbar &&
                <props.components.Toolbar
                    actions={props.actions}
                    components={props.components}
                    selectedRows={this.state.selectedCount > 0 ? this.state.originalData.filter((a: any) => a.tableData.checked) : []}
                    columns={this.state.columns}
                    columnsButton={props.options.columnsButton}
                    icons={props.icons}
                    datetimeLocaleString={props.options.datetimeLocaleString}
                    exportAllData={props.options.exportAllData}
                    exportButton={props.options.exportButton}
                    exportDelimiter={props.options.exportDelimiter}
                    exportFileName={props.options.exportFileName}
                    exportNumericDecimalSeparator={props.options.exportNumericDecimalSeparator}
                    exportNumericNullToZero={props.options.exportNumericNullToZero}
                    exportTotals={props.options.exportTotals}
                    getAggregation={this.props.options.aggregation
                        ? this.dataManager.getAggregation
                        : null}
                    exportCsv={props.options.exportCsv}
                    getFieldValue={this.dataManager.getFieldValue}
                    data={this.state.data}
                    renderData={this.state.renderData}
                    search={props.options.search}
                    showTitle={props.options.showTitle}
                    showTextRowsSelected={props.options.showTextRowsSelected}
                    toolbarButtonAlignment={props.options.toolbarButtonAlignment}
                    searchFieldAlignment={props.options.searchFieldAlignment}
                    searchText={this.state.searchText}
                    searchFieldStyle={props.options.searchFieldStyle}
                    title={props.title}
                    onSearchChanged={this.onSearchChange}
                    onColumnsChanged={this.onChangeColumnHidden}
                    localization={{ ...MaterialTable.defaultProps.localization.toolbar, ...this.props.localization.toolbar }}
                />
                    }
                    {props.options.grouping &&
                <props.components.Groupbar
                    icons={props.icons}
                    localization={{ ...MaterialTable.defaultProps.localization.grouping, ...props.localization.grouping }}
                    groupColumns={this.state.columns
                        .filter((col: any) => col.tableData.groupOrder > -1)
                        .sort((col1: any, col2: any) => col1.tableData.groupOrder - col2.tableData.groupOrder)
                    }
                    onSortChanged={this.onChangeGroupOrder}
                    onGroupRemoved={this.onGroupRemoved}
                />
                    }

                    <MComponents.MTAbleScrollBar double={props.options.doubleHorizontalScroll} tableId={this.id}>
                        <Droppable droppableId='headers' direction='horizontal'>
                            {(provided) => (
                                <div ref={provided.innerRef}>
                                    <MComponents.MTableInfinite
                                        paging={props.options.paging}
                                        maxBodyHeight={props.options.maxBodyHeight}
                                        currentPage={this.isRemoteData() ? this.state.query.page : this.state.currentPage}
                                        pageSize={this.state.pageSize}
                                        totalCount={this.isRemoteData() ? this.state.query.totalCount : this.state.data.length}
                                        onPageChange={this.onPageChange}
                                    >
                                        {this.renderTable()}
                                    </MComponents.MTableInfinite>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </MComponents.MTAbleScrollBar>

                    {(this.state.isLoading || props.isLoading) && props.options.loadingType === 'linear' &&
                        <div style={{ position: 'relative', width: '100%' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
                                <LinearProgress />
                            </div>
                        </div>
                    }
                    {this.renderFooter()}

                    {(this.state.isLoading || props.isLoading) && props.options.loadingType === 'overlay' &&
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', zIndex: 11 }}>
                            <props.components.OverlayLoading theme={props.theme} />
                        </div>
                    }
                </props.components.Container>
                <style>{
                    `.totals-row td.MuiTableCell-footer:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: -1px;
                        width: 100%;
                        border-bottom: 1px solid rgba(224, 224, 224, 1);
                    }
                    tbody td.cell-fixed:after,  thead th.MuiTableCell-head:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: -1px;
                        width: 100%;
                        border-bottom: 1px solid rgba(224, 224, 224, 1);
                    }`
                }</style>
            </DragDropContext>
        );
    }
}
