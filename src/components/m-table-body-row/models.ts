import { Action, Column, Components, Icons, LocalizationBodyEditRow, Options } from '../../models/material-table.model';

export interface IMTableBodyRowProps {
    actions?: Action[];
    columns: Column[];
    components: Components;
    data: any;
    hasAnyEditingRow?: boolean;
    icons: Icons;
    index: number;
    isTreeData?: boolean;
    level: number;
    localization: LocalizationBodyEditRow;
    options: Options;
    path: number[];
    treeDataMaxLevel: number;

    // TODO Unknown props
    detailPanel?: any;
    getFieldValue: any; // functions
    onToggleDetailPanel: any; // functions
    onRowSelected?: any; // functions
    onRowClick?: any; // functions
    onEditingApproved?: any; // functions
    onEditingCanceled?: any; // functions
    onTreeExpandChanged?: any; // functions
}
