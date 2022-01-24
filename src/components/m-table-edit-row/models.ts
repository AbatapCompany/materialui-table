import { Action, Column, Components, Icons, LocalizationBodyEditRow, Modes, Options } from '../../models/material-table.model';

export interface MTableEditRowProps {
    actions: Action[];
    columns: Column[];
    components: Components;
    data: any;
    icons: Icons;
    index: number;
    isTreeData?: boolean;
    localization: LocalizationBodyEditRow;
    mode: Modes;
    onEditingApproved: (mode: Modes, stateData: any, propsData: any) => void;
    onEditingCanceled: (mode: Modes, propsData: any) => void;
    options: Options;
    path: number[];

    // TODO unknown props
    detailPanel?: any;
}
