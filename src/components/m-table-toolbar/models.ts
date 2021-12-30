import { CSSProperties } from 'react';
import { Action, Column, Components, HorizontalDirections, Icons, LocalizationToolbar } from '../../models/material-table.model';

export interface MTableToolbarProps {
    actions: Action[];
    classes: Record<string, string>;
    columns: Column[];
    columnsButton?: boolean;
    components: Components;
    data: any;
    datetimeLocaleString?: string;
    exportAllData?: boolean;
    exportButton?: boolean;
    exportCsv?: (columns: Column[], renderData: any[]) => void;
    exportDelimiter?: string;
    exportFileName?: string;
    exportNumericDecimalSeparator?: string;
    exportNumericNullToZero?: boolean;
    exportTotals?: boolean;
    icons: Icons;
    localization: LocalizationToolbar;
    renderData: any;
    search?: boolean;
    searchFieldAlignment?: HorizontalDirections;
    searchFieldStyle?: CSSProperties;
    searchText: string;
    selectedRows: any[];
    showTextRowsSelected?: boolean;
    showTitle?: boolean;
    title: string;
    toolbarButtonAlignment?: HorizontalDirections;

    // TODO unknown props
    getAggregation?: any | null; // function
    getFieldValue?: any; // function
    onSearchChanged?: any; // function
    onColumnsChanged?: any; // function
}
