import { CSSProperties } from 'react';
import { Column, Icons } from '../../models/material-table.model';

export interface IMTableCellProps {
    columnDef: Column;
    datetimeLocaleString?: string;
    headerFiltering: boolean;
    icons: Icons;
    isFixed: boolean;
    isTotals?: boolean;
    rowData?: any;
    sorting: boolean;
    strictDigits?: boolean;
    style: CSSProperties;
    value: any;
}
