import { Column, Icons } from '../../models/material-table.model';

export interface MTableGroupbarProps {
    icons: Icons;
    groupColumns: Column[];

    // TODO unknown
    localization: any;
    onGroupRemoved: any; // function
    onSortChanged: any; // function
}
