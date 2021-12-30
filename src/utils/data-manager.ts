/* eslint-disable max-lines */
import { SortDirection } from '@mui/material';
import formatDate from 'date-fns/format';
import { Column, InfinityChangePropPolicies, Modes, Pagings } from '../models/material-table.model';
import { byString } from './byString';

export default class DataManager {
    aggregateChilds = true;
    applyFilters = false;
    applySearch = false;
    currentPage = 0;
    detailPanelType = 'multiple'
    lastDetailPanelRow: any = undefined;
    lastEditingRow: any = undefined;
    orderBy = -1;
    orderDirection: SortDirection = false;
    pageSize = 5;
    paging = 'classic';
    infinityChangePropPolicy = 'append';
    parentFunc: any = null;
    searchText = '';
    selectedCount = 0;
    treefiedDataLength = 0;
    treeDataMaxLevel = 0;
    defaultExpanded = false;
    filterChilds = false;
    sortChilds = false;

    data: any[] = [];
    columns: Column[] = [];

    filteredData: any[] = [];
    searchedData: any[] = [];
    groupedData: any[] = [];
    treefiedData: any[] = [];
    sortedData: any[] = [];
    pagedData: any[] = [];
    renderData: any[] = [];

    filtered = false;
    searched = false;
    grouped = false;
    treefied = false;
    sorted = false;
    paged = false;

    rootGroupsIndex = {};

    setData(data: any) {
        this.selectedCount = 0;
        let alreadyEditableRow = null;
        const dataMapped = data.map((row: any, index: number) => {
            row.tableData = { ...row.tableData, id: index + this.data.length };
            if (row.tableData.checked) {
                this.selectedCount++;
            }
            if (
                this.lastEditingRow &&
                row.id !== undefined &&
                row.id === this.lastEditingRow.id &&
                JSON.stringify({ ...row, tableData: null }) === JSON.stringify({ ...this.lastEditingRow, tableData: null })
            ) {
                alreadyEditableRow = row;
            }
            return row;
        });
        if (this.paging === 'infinite' && this.infinityChangePropPolicy === 'append') {
            this.data = this.data.concat(dataMapped);
        }
        else {
            this.data = dataMapped;
        }
        if (alreadyEditableRow) {
            this.changeRowEditing(alreadyEditableRow, 'update');
        }
        else {
            this.changeRowEditing();
        }

        this.filtered = false;
    }

    setColumns(columns: Column[]) {
        this.columns = columns.map((columnDef, index) => {
            columnDef.tableData = {
                columnOrder: index,
                filterValue: columnDef.defaultFilter,
                groupOrder: columnDef.defaultGroupOrder,
                groupSort: columnDef.defaultGroupSort || 'asc',
                ...columnDef.tableData,
                id: index
            };
            return columnDef;
        });
    }

    setDefaultExpanded(expanded: boolean) {
        this.defaultExpanded = expanded;
    }

    setAggregateChilds(aggregateChilds: boolean) {
        this.aggregateChilds = aggregateChilds;
    }

    setFilterChilds(filterChilds: boolean) {
        this.filterChilds = filterChilds;
    }

    setSortChilds(sortChilds: boolean) {
        this.sortChilds = sortChilds;
    }

    changeApplySearch(applySearch: boolean) {
        this.applySearch = applySearch;
        this.searched = false;
    }

    changeApplyFilters(applyFilters: boolean) {
        this.applyFilters = applyFilters;
        this.filtered = false;
    }

    changePaging(paging: Pagings) {
        this.paging = paging;
        this.paged = false;
    }

    changeInfinityType(infinityChangePropPolicy: InfinityChangePropPolicies) {
        this.infinityChangePropPolicy = infinityChangePropPolicy;
    }

    changeCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
        this.paged = false;
    }

    changePageSize(pageSize: number) {
        this.pageSize = pageSize;
        this.paged = false;
    }

    changeParentFunc(parentFunc: (row: any, rows: any[]) => any) {
        this.parentFunc = parentFunc;
    }

    changeFilterValue(columnId: number, value: any) {
        const finded = this.columns.find(column => column.tableData.id === columnId);
        finded.tableData.filterValue = value;
        this.filtered = false;
    }

    changeRowSelected(checked: boolean, path: number[]) {
        const rowData = this.findDataByPath(this.sortedData, path);
        rowData.tableData.checked = checked;
        this.selectedCount = this.selectedCount + (checked ? 1 : -1);

        const checkChildRows = (rowData: any) => {
            if (rowData.tableData.childRows) {
                rowData.tableData.childRows.forEach((childRow: any) => {
                    childRow.tableData.checked = checked;
                    this.selectedCount = this.selectedCount + (checked ? 1 : -1);
                    checkChildRows(childRow);
                });
            }
        };

        checkChildRows(rowData);

        this.filtered = false;
    }

    changeDetailPanelVisibility(path: number[], render: any) {
        const rowData = this.findDataByPath(this.sortedData, path);

        if ((rowData.tableData.showDetailPanel || '').toString() === render.toString()) {
            rowData.tableData.showDetailPanel = undefined;
        }
        else {
            rowData.tableData.showDetailPanel = render;
        }

        if (this.detailPanelType === 'single' && this.lastDetailPanelRow && this.lastDetailPanelRow !== rowData) {
            this.lastDetailPanelRow.tableData.showDetailPanel = undefined;
        }

        this.lastDetailPanelRow = rowData;
    }

    changeGroupExpand(path: number[]) {
        const rowData = this.findDataByPath(this.sortedData, path);
        rowData.isExpanded = !rowData.isExpanded;
    }

    changeSearchText(searchText: string) {
        this.searchText = searchText;
        this.searched = false;
    }

    changeRowEditing(rowData?: any, mode?: Modes) {
        if (rowData) {
            rowData.tableData.editing = mode;

            if (this.lastEditingRow && this.lastEditingRow !== rowData) {
                this.lastEditingRow.tableData.editing = undefined;
            }

            if (mode) {
                this.lastEditingRow = rowData;
            }
            else {
                this.lastEditingRow = undefined;
            }
        }
        else if (this.lastEditingRow) {
            this.lastEditingRow.tableData.editing = undefined;
            this.lastEditingRow = undefined;
        }
    }

    changeAllSelected(checked: boolean) {
        let selectedCount = 0;
        if (this.isDataType('group')) {
            const setCheck = (data: any) => {
                data.forEach((element: any) => {
                    if (element.groups.length > 0) {
                        setCheck(element.groups);
                    }
                    else {
                        element.data.forEach((d: any) => {
                            d.tableData.checked = checked;
                            selectedCount++;
                        });
                    }
                });
            };

            setCheck(this.groupedData);
        }
        else {
            this.searchedData.map(row => {
                row.tableData.checked = checked;
                return row;
            });
            selectedCount = this.searchedData.length;
        }

        this.selectedCount = checked ? selectedCount : 0;
    }

    changeOrder(orderBy: number, orderDirection: SortDirection) {
        this.orderBy = orderBy;
        this.orderDirection = orderDirection;
        this.currentPage = 0;

        this.sorted = false;
    }

    changeGroupOrder(columnId: number) {
        const column = this.columns.find(c => c.tableData.id === columnId);

        if (column.tableData.groupSort === 'asc') {
            column.tableData.groupSort = 'desc';
        }
        else {
            column.tableData.groupSort = 'asc';
        }

        this.sorted = false;

        const groupedResult = this.columns
            .filter(col => col.tableData.groupOrder > -1)
            .sort((col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder)
            .map(item => ({
                field: item.field,
                groupOrder: item.tableData.groupOrder,
                groupSort: item.tableData.groupSort,
            }));

        return groupedResult;
    }

    changeColumnHidden(columnId: number, hidden: boolean) {
        const column = this.columns.find(c => c.tableData.id === columnId);
        column.hidden = hidden;
    }

    changeTreeExpand(path: number[]) {
        const rowData = this.findDataByPath(this.sortedData, path);
        rowData.tableData.isTreeExpanded = !rowData.tableData.isTreeExpanded;
    }

    changeDetailPanelType(type: any) {
        this.detailPanelType = type;
    }

    changeByDrag(result: any) {
        let start = 0;

        let groups = this.columns
            .filter(col => col.tableData.groupOrder > -1)
            .sort((col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder);


        if (result.destination.droppableId === 'groups' && result.source.droppableId === 'groups') {
            start = Math.min(result.destination.index, result.source.index);
            const end = Math.max(result.destination.index, result.source.index);

            groups = groups.slice(start, end + 1);

            if (result.destination.index < result.source.index) {
                // Take last and add as first
                const last = groups.pop();
                groups.unshift(last);
            }
            else {
                // Take first and add as last
                const last = groups.shift();
                groups.push(last);
            }
        }
        else if (result.destination.droppableId === 'groups' && result.source.droppableId === 'headers') {
            const newGroup = this.columns.find(c => c.tableData.id === result.draggableId);

            if (newGroup.grouping === false || !newGroup.field) {
                return;
            }

            groups.splice(result.destination.index, 0, newGroup);
        }
        else if (result.destination.droppableId === 'headers' && result.source.droppableId === 'groups') {
            const removeGroup = this.columns.find(c => c.tableData.id === result.draggableId);
            removeGroup.tableData.groupOrder = undefined;
            groups.splice(result.source.index, 1);
        }
        else if (result.destination.droppableId === 'headers' && result.source.droppableId === 'headers') {
            start = Math.min(result.destination.index, result.source.index);
            // const end = Math.max(result.destination.index, result.source.index);

            const visibleColumns = this.columns
                .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
                .filter(column => column.tableData.groupOrder === undefined && !column.hidden);

            if (result.destination.index < result.source.index) {
                const colsToMov = [visibleColumns[result.source.index], visibleColumns[result.destination.index]];

                const startIndex = this.columns.indexOf(colsToMov[1]);
                colsToMov[0].tableData.columnOrder = startIndex;
                let addon = 1;
                for (let i = startIndex; i < this.columns.length; i++) {
                    if (this.columns[i] !== colsToMov[0]) {
                        this.columns[i].tableData.columnOrder = i + addon;
                    }
                    else {
                        addon = 0;
                    }
                }
            }
            else {
                const colsToMov = [visibleColumns[result.destination.index], visibleColumns[result.source.index]];
                const startIndex = this.columns.indexOf(colsToMov[1]);
                const moveToIndex = this.columns.indexOf(colsToMov[0]);
                this.columns[startIndex].tableData.columnOrder = moveToIndex;
                for (let i = moveToIndex; i > startIndex; i--) {
                    this.columns[i].tableData.columnOrder = i - 1;
                }
            }

            return;
        }
        else {
            return;
        }

        for (let i = 0; i < groups.length; i++) {
            groups[i].tableData.groupOrder = start + i;
        }

        const groupedResult = groups.map(item => ({
            field: item.field,
            groupOrder: item.tableData.groupOrder,
            groupSort: item.tableData.groupSort,
        }));

        this.sorted = this.grouped = false;

        return groupedResult;
    }

    findDataByPath = (renderData: any, path: number[]) => {
        if (this.isDataType('tree')) {
            const node = path.reduce((result: any, current) => {
                return (
                    result &&
                    result.tableData &&
                    result.tableData.childRows &&
                    result.tableData.childRows[current]
                );
            }, { tableData: { childRows: renderData } });

            return node;
        }
        else {
            const data = { groups: renderData };

            const node = path.reduce((result: any, current: any) => {
                if (result.groups.length > 0) {
                    return result.groups[current];
                }
                else if (result.data) {
                    return result.data[current];
                }
                else {
                    return undefined;
                }
            }, data);
            return node;
        }
    }

    findGroupByGroupPath(renderData: any, path: number[]): any {
        let currentGroups = renderData;
        let result = undefined;
        path.forEach((pathItem: any) => {
            result = currentGroups.find((group: any) => group.value === pathItem);
            if (result) {
                currentGroups = result.groups;
            }
            else {
                return undefined;
            }
        });

        // const node = { groups: renderData, groupsIndex: this.rootGroupsIndex };

        // const node = path.reduce((result, current) => {
        //   if (!result) {
        //     return undefined;
        //   }

        //   if (result.groupsIndex[current] !== undefined) {
        //     return result.groups[result.groupsIndex[current]];
        //   }
        //   return undefined;
        //   // const group = result.groups.find(a => a.value === current);
        //   // return group;
        // }, data);
        return result;
    }

    getFieldValue = (rowData: any, columnDef: Column, lookup = true) => {
        let value = (typeof rowData[columnDef.field] !== 'undefined' ? rowData[columnDef.field] : byString(rowData, columnDef.field));
        if (columnDef.lookup && lookup) {
            value = columnDef.lookup[value];
        }

        return value;
    }

    isDataType(type: any) {
        let dataType = 'normal';

        if (this.parentFunc) {
            dataType = 'tree';
        }
        else if (this.columns.find(a => a.tableData.groupOrder > -1)) {
            dataType = 'group';
        }

        return type === dataType;
    }

    sort(a: any, b: any, type: any) {
        if (type === 'numeric') {
            return a - b;
        }
        else {
            if (a !== b) { // to find nulls
                if (!a) {
                    return -1;
                }
                if (!b) {
                    return 1;
                }
            }
            return a < b ? -1 : a > b ? 1 : 0;
        }
    }

    sortList(list: any) {
        const columnDef = this.columns.find(_ => _.tableData.id === this.orderBy);
        let result = list;

        if (columnDef.customSort) {
            if (this.orderDirection === 'desc') {
                result = list.sort((a: any, b: any) => columnDef.customSort(b, a, 'row'));
            }
            else {
                result = list.sort((a: any, b: any) => columnDef.customSort(a, b, 'row'));
            }
        }
        else {
            result = list.sort(
                this.orderDirection === 'desc'
                    ? (a: any, b: any) => this.sort(this.getFieldValue(b, columnDef), this.getFieldValue(a, columnDef), columnDef.type)
                    : (a: any, b: any) => this.sort(this.getFieldValue(a, columnDef), this.getFieldValue(b, columnDef), columnDef.type)
            );
        }

        return result;
    }

    getRenderState = () => {
        if (this.filtered === false) {
            this.filterData();
        }

        if (this.searched === false) {
            this.searchData();
        }

        if (this.grouped === false && this.isDataType('group')) {
            this.groupData();
        }

        if (this.treefied === false && this.isDataType('tree')) {
            this.treefyData();
        }

        if (this.sorted === false) {
            this.sortData();
        }

        if (this.paged === false) {
            this.pageData();
        }

        return {
            columns: this.columns,
            currentPage: this.currentPage,
            data: this.sortedData,
            lastEditingRow: this.lastEditingRow,
            orderBy: this.orderBy,
            orderDirection: this.orderDirection,
            originalData: this.data,
            pageSize: this.pageSize,
            renderData: this.pagedData,
            searchText: this.searchText,
            selectedCount: this.selectedCount,
            treefiedDataLength: this.treefiedDataLength,
            treeDataMaxLevel: this.treeDataMaxLevel
        };
    }

    // =====================================================================================================
    // DATA MANUPULATIONS
    // =====================================================================================================

    filterData = () => {
        this.searched = this.grouped = this.treefied = this.sorted = this.paged = false;

        this.filteredData = [...this.data];

        if (this.applyFilters) {
            this.columns.filter(columnDef => columnDef.tableData.filterValue).forEach(columnDef => {
                const { lookup, type, tableData } = columnDef;
                if (columnDef.customFilterAndSearch) {
                    this.filteredData = this.filteredData.filter(row => {
                        const parent = this.filterChilds ? null : this.getRootParent(row);
                        return !!columnDef.customFilterAndSearch(tableData.filterValue, parent || row, columnDef);
                    });
                }
                else {
                    if (lookup) {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const value = this.getFieldValue(parent || row, columnDef, false);
                            return !tableData.filterValue ||
                    tableData.filterValue.length === 0 ||
                    tableData.filterValue.indexOf(value !== undefined && value !== null && value.toString()) > -1;
                        });
                    }
                    else if (type === 'numeric') {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const term = tableData.filterValue;
                            const value = this.getFieldValue(parent || row, columnDef);
                            if (!term) {
                                return true;
                            }
                            if (term[0] && value < term[0]) {
                                return false;
                            }
                            if (term[1] && value > term[1]) {
                                return false;
                            }
                            return true;
                        });
                    }
                    else if (type === 'boolean' && tableData.filterValue) {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const value = this.getFieldValue(parent || row, columnDef);
                            return (value && tableData.filterValue === 'checked') ||
                    (!value && tableData.filterValue === 'unchecked');
                        });
                    }
                    else if (['date', 'datetime'].includes(type)) {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const value = this.getFieldValue(parent || row, columnDef);

                            const currentDate = value ? new Date(value) : null;

                            if (currentDate && currentDate.toString() !== 'Invalid Date') {
                                const selectedDate = tableData.filterValue;
                                let currentDateToCompare = '';
                                let selectedDateToCompare = '';

                                if (type === 'date') {
                                    currentDateToCompare = formatDate(currentDate, 'MM/dd/yyyy');
                                    selectedDateToCompare = formatDate(selectedDate, 'MM/dd/yyyy');
                                }
                                else if (type === 'datetime') {
                                    currentDateToCompare = formatDate(currentDate, 'MM/dd/yyyy - HH:mm');
                                    selectedDateToCompare = formatDate(selectedDate, 'MM/dd/yyyy - HH:mm');
                                }

                                return currentDateToCompare === selectedDateToCompare;
                            }

                            return true;
                        });
                    }
                    else if (type === 'time') {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const value = this.getFieldValue(parent || row, columnDef);
                            const currentHour = value || null;

                            if (currentHour) {
                                const selectedHour = tableData.filterValue;
                                const currentHourToCompare = formatDate(selectedHour, 'HH:mm');

                                return currentHour === currentHourToCompare;
                            }

                            return true;
                        });
                    }
                    else {
                        this.filteredData = this.filteredData.filter(row => {
                            const parent = this.filterChilds ? null : this.getRootParent(row);
                            const value = this.getFieldValue(parent || row, columnDef);
                            return value && value.toString().toUpperCase().includes(tableData.filterValue.toUpperCase());
                        });
                    }
                }
            });
        }

        this.filtered = true;
    }

    getParent = (row: any) => {
        if (typeof this.parentFunc === 'function') {
            return this.parentFunc(row, this.data);
        }
        return null;
    }

    getRootParent = (row: any) => {
        if (this.parentFunc) {
            let result = null;
            let item = row;
            while (true) {
                item = this.parentFunc(item, this.data);
                if (item) {
                    result = item;
                }
                else {
                    return result;
                }
            }
        }
        return null;
    }

    searchData = () => {
        this.grouped = this.treefied = this.sorted = this.paged = false;

        this.searchedData = [...this.filteredData];

        if (this.searchText && this.applySearch) {
            this.searchedData = this.searchedData.filter(row => {
                return this.columns
                    .filter(columnDef => { return columnDef.searchable === undefined ? !columnDef.hidden : columnDef.searchable; })
                    .some(columnDef => {
                        if (columnDef.customFilterAndSearch) {
                            return !!columnDef.customFilterAndSearch(this.searchText, row, columnDef);
                        }
                        else if (columnDef.field) {
                            const value = this.getFieldValue(row, columnDef);
                            if (value) {
                                return value.toString().toUpperCase().includes(this.searchText.toUpperCase());
                            }
                        }
                    });
            });
        }

        this.searched = true;
    }

    groupData() {
        this.sorted = this.paged = false;

        const tmpData = [...this.searchedData];

        const groups = this.columns
            .filter(col => col.tableData.groupOrder > -1)
            .sort((col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder);

        const subData = tmpData.reduce((result, currentRow) => {
            let object = result;
            object = groups.reduce((o, colDef) => {
                const value = currentRow[colDef.field] || byString(currentRow, colDef.field);
                let group: any = undefined;
                if (o.groupsIndex[value] !== undefined) {
                    group = o.groups[o.groupsIndex[value]];
                }
                if (!group) {
                    const path = [...(o.path || []), value];
                    const oldGroup = this.findGroupByGroupPath(this.groupedData, path) || { isExpanded: (!!this.defaultExpanded) };
                    group = { value, groups: [], groupsIndex: {}, data: [], isExpanded: oldGroup.isExpanded, path };
                    o.groups.push(group);
                    o.groupsIndex[value] = o.groups.length - 1;
                }
                return group;
            }, object);

            object.data.push(currentRow);

            return result;
        }, { groups: [], groupsIndex: {} });

        this.groupedData = subData.groups;
        this.grouped = true;
        this.rootGroupsIndex = subData.groupsIndex;
    }

    treefyData() {
        this.sorted = this.paged = false;
        this.data.forEach((a: any) => {
            a.tableData.childRows = null;
        });
        this.treefiedData = [];
        this.treefiedDataLength = 0;
        this.treeDataMaxLevel = 0;

        const addRow = (rowData: any) => {
            const parent = this.parentFunc(rowData, this.data);

            if (parent) {
                parent.tableData.childRows = parent.tableData.childRows || [];
                const oldParent = parent.tableData.path && this.findDataByPath(this.treefiedData, parent.tableData.path);
                const isDefined = oldParent && oldParent.tableData.isTreeExpanded !== undefined;

                parent.tableData.isTreeExpanded = isDefined ? oldParent.tableData.isTreeExpanded : (!!this.defaultExpanded);
                if (!parent.tableData.childRows.includes(rowData)) {
                    parent.tableData.childRows.push(rowData);
                    this.treefiedDataLength++;
                }

                addRow(parent);

                rowData.tableData.path = [...parent.tableData.path, parent.tableData.childRows.length - 1];
                this.treeDataMaxLevel = Math.max(this.treeDataMaxLevel, rowData.tableData.path.length);
            }
            else {
                if (!this.treefiedData.includes(rowData)) {
                    this.treefiedData.push(rowData);
                    this.treefiedDataLength++;
                    rowData.tableData.path = [this.treefiedData.length - 1];
                }
            }
        };

        this.searchedData.forEach(rowData => {
            addRow(rowData);
        });

        this.treefied = true;
    }

    sortData() {
        this.paged = false;

        if (this.isDataType('group')) {
            this.sortedData = [...this.groupedData];

            const groups = this.columns
                .filter(col => col.tableData.groupOrder > -1)
                .sort((col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder);

            const sortGroups = (list: any, columnDef: Column) => {
                if (columnDef.customSort) {
                    return list.sort(
                        columnDef.tableData.groupSort === 'desc'
                            ? (a: any, b: any) => columnDef.customSort(b.value, a.value, 'group')
                            : (a: any, b: any) => columnDef.customSort(a.value, b.value, 'group')
                    );
                }
                else {
                    return list.sort(
                        columnDef.tableData.groupSort === 'desc'
                            ? (a: any, b: any) => this.sort(b.value, a.value, columnDef.type)
                            : (a: any, b: any) => this.sort(a.value, b.value, columnDef.type)
                    );
                }
            };

            this.sortedData = sortGroups(this.sortedData, groups[0]);

            const sortGroupData = (list: any, level: number) => {
                list.forEach((element: any) => {
                    if (element.groups.length > 0) {
                        const column = groups[level];
                        element.groups = sortGroups(element.groups, column);
                        sortGroupData(element.groups, level + 1);
                    }
                    else {
                        if (this.orderBy >= 0 && this.orderDirection) {
                            element.data = this.sortList(element.data);
                        }
                    }
                });
            };

            sortGroupData(this.sortedData, 1);
        }
        else if (this.isDataType('tree')) {
            this.sortedData = [...this.treefiedData];
            if (this.orderBy !== -1) {
                this.sortedData = this.sortList(this.sortedData);

                const sortTree = (list: any) => {
                    list.forEach((item: any) => {
                        if (item.tableData.childRows) {
                            item.tableData.childRows = this.sortList(item.tableData.childRows);
                            sortTree(item.tableData.childRows);
                        }
                    });
                };

                if (this.sortChilds) {
                    sortTree(this.sortedData);
                }
            }
        }
        else if (this.isDataType('normal')) {
            this.sortedData = [...this.searchedData];
            if (this.orderBy !== -1) {
                this.sortedData = this.sortList(this.sortedData);
            }
        }

        this.sorted = true;
    }

    pageData() {
        this.pagedData = [...this.sortedData];

        if (this.paging === 'classic') {
            const startIndex = this.currentPage * this.pageSize;
            const endIndex = startIndex + this.pageSize;

            this.pagedData = this.pagedData.slice(startIndex, endIndex);
        }

        this.paged = true;
    }

    getAggregation = (data: any, columnDef: Column, lookup = true, fromExport = false) => {
        const filteredData = this.aggregateChilds
            ? data
            : data.filter((item: any) => !this.getParent(item));

        switch (columnDef.aggregation) {
            case 'sum':
                return filteredData
                    .map((x: any) => this.getFieldValue(x, columnDef, lookup))
                    .reduce((prev: number, curr: number) => prev + curr, 0);
            case 'max':
                return filteredData
                    .map((x: any) => this.getFieldValue(x, columnDef, lookup))
                    .reduce((prev: number, curr: number) => curr > prev ? curr : prev, Number.MIN_SAFE_INTEGER);
            case 'min':
                return filteredData
                    .map((x: any) => this.getFieldValue(x, columnDef, lookup))
                    .reduce((prev: number, curr: number) => curr < prev ? curr : prev, Number.MAX_SAFE_INTEGER);
            case 'count':
                return filteredData
                    .map((x: any) => this.getFieldValue(x, columnDef, lookup))
                    .length;
            case 'avg': {
                const items = filteredData
                    .map((x: any) => this.getFieldValue(x, columnDef, lookup));
                return items.reduce((prev: number, curr: number) => prev + curr, 0) / items.length;
            }
            case 'custom':
                return columnDef.render && columnDef.render(filteredData, fromExport ? 'totals_export' : 'totals');
            default:
                return undefined;
        }
    }
}
