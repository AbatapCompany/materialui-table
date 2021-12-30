import { Column } from '../../models/material-table.model';

export interface MTableEditFieldProps {
    columnDef: Column;
    rowData: any;
    value: any;

    // TODO unknown
    onChange: any; // function
    onRowDataChange: any; // function
}
