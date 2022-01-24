import { Action, Column, Components, Icons, Options } from '../../models/material-table.model';

export interface MTableTotalsRowProps {
    actions: Action[];
    columns: Column[];
    components: Components;
    hasAnyEditingRow: boolean;
    icons: Icons;
    isTreeData: boolean;
    options: Options;

    // TODO unknown
    renderData: any;
    getAggregation: any;
    detailPanel: any;
}
