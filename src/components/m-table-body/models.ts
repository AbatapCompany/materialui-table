import { Action, Column, Components, Icons, LocalizationBody, Modes, Options } from '../../models/material-table.model';

export interface MTableBodyProps {
    actions: Action[];
    columns: Column[];
    components: Components;
    currentPage: number;
    hasAnyEditingRow: boolean;
    hasDetailPanel: boolean;
    icons: Icons;
    isTreeData: boolean;
    localization: LocalizationBody;
    options: Options;
    pageSize: number;
    showAddRow: boolean;
    treeDataMaxLevel: number;
    version: number;

    // TODO unknown
    renderData: any;
    detailPanel?: any;
    initialFormData?: any;
    selection?: any;

    getFieldValue: any; // function
    onFilterChanged: (tableDataId: number, filterValue: any) => void;
    onRowSelected: any; // function
    onToggleDetailPanel: any; // function
    onGroupExpandChanged: any; // function
    onTreeExpandChanged: any; // function
    onEditingApproved: (mode: Modes, stateData: any, propsData: any) => void;
    onEditingCanceled: (mode: Modes, propsData: any) => void;
    onRowClick: any; // function
}
