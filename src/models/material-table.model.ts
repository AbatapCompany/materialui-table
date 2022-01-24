import React, { ForwardRefExoticComponent, CSSProperties } from 'react';
import { IconProps } from '@mui/material/Icon';
import { SortDirection } from '@mui/material';

export type ActionProperty = ((rowData: any) => Action) | Action;
export type Aggregations = 'avg' | 'sum' | 'min' | 'max' | 'count' | 'custom';
export type Editables = 'always' | 'onUpdate' | 'onAdd' | 'never';
export type Modes = 'add' | 'update' | 'delete';
export type ColumnTypes = 'string' | 'boolean' | 'numeric' | 'date' | 'datetime' | 'time' | 'currency';
export type Pagings = 'classic' | 'infinite' | 'disabled';
export type PaginationTypes = 'normal' | 'stepped';
export type FilterTypes = 'row' | 'header';
export type InfinityChangePropPolicies = 'append' | 'replace';
export type HorizontalDirections = 'left' | 'right';
export type DetailPanelTypes = 'single' | 'multiple';
export type LoadingTypes = 'overlay' | 'linear';
export type AddRowsPositions = 'first' | 'last';

export interface MaterialTableProps {
    actions?: ActionProperty[];
    columns: Column[];
    components?: Components;
    classes?: Record<string, string>;
    data: any[] | ((query: Query) => Promise<QueryResult>);
    detailPanel?: ((rowData: any) => React.ReactNode) | (DetailPanel | ((rowData: any) => DetailPanel))[];
    editable?: {
        isEditable?: (rowData: any) => boolean;
        isDeletable?: (rowData: any) => boolean;
        onRowAdd?: (newData: any) => Promise<void>;
        onRowUpdate?: (newData: any, oldData?: any) => Promise<void>;
        onRowDelete?: (oldData: any) => Promise<void>;
    }
    icons?: Icons;
    isLoading?: boolean;
    title?: string | React.ReactElement<any>;
    options?: Options;
    name?: string;
    parentChildData?: (row: any, rows: any[]) => any;
    localization?: Localization;
    onRowsPerPageChange?: (pageSize: number) => void;
    onPageChange?: (page: number) => void;
    onOrderChange?: (orderBy: number, orderDirection: (SortDirection)) => void;
    onRowClick?: (event?: React.MouseEvent, rowData?: any, toggleDetailPanel?: (panelIndex?: number) => void) => void;
    onRowSelected?: (rowData: any) => void;
    onSelectionChange?: (data: any[], rowData?: any) => void;
    onTreeExpandChange?: (data: any, isExpanded: boolean) => void;
    onClickActionButton?: any;
    style?: CSSProperties;
    tableRef?: any;
    onChangeColumnGroups?: (groups: {
        field: string;
        groupOrder: any;
        groupSort: string;
    }[]) => void;
    onChangeFilter?: (filters: {
        field: string;
        filterValue: any;
    }[]) => void;
    onChangeColumnOrder?: (columns: Column[]) => void;
    onChangeColumnHidden?: (columnId: number, hidden: boolean, columns: Column[]) => void;
}

export interface Filter {
    column: Column;
    operator: '=';
    value: any;
}

export interface Query {
    filters: Filter[];
    page: number;
    pageSize: number;
    search: string;
    orderBy: Column;
    orderDirection: SortDirection;
}

export interface QueryResult {
    data: any[];
    page: number;
    totalCount: number;
}

export interface DetailPanel {
    disabled?: boolean;
    icon?: string | React.ReactElement<any>;
    openIcon?: string | React.ReactElement<any>;
    tooltip?: string;
    render: (rowData: any) => string | React.ReactNode;
}

export interface Action {
    disabled?: boolean;
    icon: string | ((props: IconProps) => JSX.Element);
    isFreeAction?: boolean;
    tooltip?: string;
    onClick: (event: any, data: any) => void;
    iconProps?: IconProps;
    hidden?: boolean;
}

export interface EditComponentProps {
    rowData: any;
    value: any;
    onChange: (newValue: any) => void;
    columnDef: EditCellColumnDef;
}

export interface EditCellColumnDef {
    field: string,
    title: string,
    tableData: {
        filterValue: any,
        groupOrder: any,
        groupSort: string,
        id: number,
    }
}

export interface Column {
    aggregation?: Aggregations;
    cellClassName?: string | ((data: any, rowData: any) => string);
    cellStyle?: CSSProperties | ((data: any, rowData: any) => CSSProperties);
    currencySetting?: { locale?: string, currencyCode?: string, minimumFractionDigits?: number, maximumFractionDigits?: number };
    customFilterAndSearch?: (filter: any, rowData: any, columnDef: Column) => boolean;
    customSort?: (data1: any, data2: any, type: (('row' | 'group' | 'totals'))) => number;
    defaultFilter?: any;
    defaultGroupOrder?: number;
    defaultGroupSort?: SortDirection;
    defaultSort?: SortDirection;
    digits?: number;
    disableClick?: boolean;
    editable?: Editables;
    editComponent?: ((props: EditComponentProps) => React.ReactElement<any>);
    emptyValue?: string | React.ReactElement<any> | ((data: any) => React.ReactElement<any> | string);
    export?: boolean;
    field?: string;
    filtering?: boolean;
    filterCellStyle?: CSSProperties;
    grouping?: boolean;
    headerClassName?: string;
    headerStyle?: CSSProperties;
    hidden?: boolean;
    lookup?: object;
    removable?: boolean;
    render?: (data: any, type: ('row' | 'group' | 'totals' | 'export' | 'totals_export')) => any;
    rootTitle?: string | React.ReactElement<any>;
    searchable?: boolean;
    sorting?: boolean;
    strictDigits?: boolean;
    tableData?: any;
    title?: string | React.ReactElement<any>;
    type?: ColumnTypes;
}

export interface Components {
    Action?: React.ComponentType<any>;
    Actions?: React.ComponentType<any>;
    Body?: React.ComponentType<any>;
    Cell?: React.ComponentType<any>;
    Container?: React.ComponentType<any>;
    EditField?: React.ComponentType<any>;
    EditRow?: React.ComponentType<any>;
    FilterRow?: React.ComponentType<any>;
    FilterButton?: React.ComponentType<any>;
    Groupbar?: React.ComponentType<any>;
    GroupRow?: React.ComponentType<any>;
    Header?: React.ComponentType<any>;
    Pagination?: React.ComponentType<any>;
    OverlayLoading?: React.ComponentType<any>;
    Row?: React.ComponentType<any>;
    Toolbar?: React.ComponentType<any>;
    Totals?: React.ComponentType<any>;
}

// export const MTableAction: () => React.ReactElement<any>;
// export const MTableActions: () => React.ReactElement<any>;
// export const MTableBody: () => React.ReactElement<any>;
// export const MTableBodyRow: () => React.ReactElement<any>;
// export const MTableCell: () => React.ReactElement<any>;
// export const MTableEditField: () => React.ReactElement<any>;
// export const MTableEditRow: () => React.ReactElement<any>;
// export const MTableFilterRow: () => React.ReactElement<any>;
// export const MTableGroupbar: () => React.ReactElement<any>;
// export const MTableGroupRow: () => React.ReactElement<any>;
// export const MTableHeader: () => React.ReactElement<any>;
// export const MTablePagination: () => React.ReactElement<any>;
// export const MTableToolbar: () => React.ReactElement<any>;
// export const MTableFilterButton: () => React.ReactElement<any>;


export interface Icons {
    Add?: ForwardRefExoticComponent<any>;
    Check?: ForwardRefExoticComponent<any>;
    Clear?: ForwardRefExoticComponent<any>;
    Delete?: ForwardRefExoticComponent<any>;
    DetailPanel?: ForwardRefExoticComponent<any>;
    Edit?: ForwardRefExoticComponent<any>;
    Export?: ForwardRefExoticComponent<any>;
    Filter?: ForwardRefExoticComponent<any>;
    FirstPage?: ForwardRefExoticComponent<any>;
    SortArrow?: ForwardRefExoticComponent<any>;
    LastPage?: ForwardRefExoticComponent<any>;
    NextPage?: ForwardRefExoticComponent<any>;
    PreviousPage?: ForwardRefExoticComponent<any>;
    ResetSearch?: ForwardRefExoticComponent<any>;
    Search?: ForwardRefExoticComponent<any>;
    ThirdStateCheck?: ForwardRefExoticComponent<any>;
    ViewColumn?: ForwardRefExoticComponent<any>;
}

export interface Options {
    actionsCellStyle?: CSSProperties;
    actionsColumnIndex?: number;
    addRowPosition?: AddRowsPositions;
    aggregateChilds?: boolean;
    aggregation?: boolean;
    columnsButton?: boolean;
    datetimeLocaleString?: string;
    defaultExpanded?: boolean;
    debounceInterval?: number;
    detailPanelType?: DetailPanelTypes;
    doubleHorizontalScroll?: boolean;
    draggableHeader?: boolean;
    emptyRowsWhenPaging?: boolean;
    exportAllData?: boolean;
    exportButton?: boolean;
    exportDelimiter?: string;
    exportFileName?: string;
    exportNumericDecimalSeparator?: string;
    exportNumericNullToZero?: boolean;
    exportTotals?: boolean;
    exportCsv?: (columns: Column[], renderData: any[]) => void;
    filtering?: boolean;
    filterType?: FilterTypes;
    filterCellStyle?: CSSProperties;
    filterChilds?: boolean;
    fixedColumns?: number;
    header?: boolean;
    headerClassName?: string;
    headerStyle?: CSSProperties;
    initialPage?: number;
    loadingType?: LoadingTypes;
    maxBodyHeight?: number | string;
    paging?: Pagings;
    infinityChangePropPolicy?: InfinityChangePropPolicies;
    grouping?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    paginationType?: PaginationTypes;
    rowClassName?: string | ((data: any, index: number) => string);
    rowStyle?: CSSProperties | ((data: any, index: number) => CSSProperties);
    showEmptyDataSourceMessage?: boolean;
    showFirstLastPageButtons?: boolean;
    showSelectAllCheckbox?: boolean;
    showTitle?: boolean;
    showTextRowsSelected?:boolean;
    search?: boolean;
    searchFieldAlignment?: HorizontalDirections;
    searchFieldStyle?: CSSProperties;
    selection?: boolean;
    selectionProps?: any | ((data: any) => any);
    sorting?: boolean;
    sortChilds?: boolean;
    strictDigits?: boolean;
    toolbar?: boolean;
    toolbarButtonAlignment?: HorizontalDirections;
    detailPanelColumnAlignment?: HorizontalDirections;
}

export interface LocalizationBodyEditRow {
    saveTooltip?: string;
    cancelTooltip?: string;
    deleteText?: string;
}

export interface LocalizationFilterRow {
    filterTooltip?: string;
}

export interface LocalizationBody {
    emptyDataSourceMessage?: string;
    filterRow?: LocalizationFilterRow;
    editRow?: LocalizationBodyEditRow,
    addTooltip?: string;
    deleteTooltip?: string;
    editTooltip?: string;
}

export interface LocalizationHeader {
    actions?: string;
}

export interface LocalizationFilter {
    clearFilter?: string;
    selectAll?: string;
}

export interface LocalizationGroup {
    groupedBy?: string;
    placeholder?: string;
}

export interface LocalizationPagination {
    firstTooltip?: string;
    firstAriaLabel?: string;
    previousAriaLabel?: string;
    previousTooltip?: string;
    nextTooltip?: string;
    nextAriaLabel?: string;
    labelDisplayedRows?: string;
    labelRowsPerPage?: string;
    lastTooltip?: string;
    lastAriaLabel?: string;
    labelRowsSelect?: string;
}

export interface LocalizationToolbar {
    addRemoveColumns?: string;
    nRowsSelected?: string;
    showColumnsTitle?: string;
    showColumnsAriaLabel?: string;
    exportTitle?: string;
    exportAriaLabel?: string;
    exportName?: string;
    searchTooltip?: string;
    searchPlaceholder?: string;
}

export interface Localization {
    body?: LocalizationBody;
    header?: LocalizationHeader;
    filter?: LocalizationFilter;
    grouping?: LocalizationGroup;
    pagination?: LocalizationPagination;
    toolbar?: LocalizationToolbar;
}
