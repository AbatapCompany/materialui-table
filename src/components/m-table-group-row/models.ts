import { Action, Column, Components, Icons, LocalizationGroup, Options } from '../../models/material-table.model';

export interface MTableGroupRowProps {
    actions: Action[];
    columns: Column[];
    components: Components;
    hasAnyEditingRow?: boolean;
    icons: Icons;
    isTreeData: boolean;
    level: number;
    options: Options;
    path: number[];
    localization: LocalizationGroup;

    // TODO unknown props
    detailPanel: any;
    groupData: any;
    groups: any;
    getFieldValue: (data: any, columnDef: Column) => any;
    onEditingApproved: any; // function
    onGroupExpandChanged: any; // function
    onRowClick: any; // function
    onRowSelected: any; // function
    onToggleDetailPanel: any; // function
    onEditingCanceled: any; // function
    onTreeExpandChanged: any; // function
}
