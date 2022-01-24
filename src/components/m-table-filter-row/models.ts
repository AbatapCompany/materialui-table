import { CSSProperties } from 'react';
import { Column, Icons, LocalizationFilterRow } from '../../models/material-table.model';

export interface MTableFilterRowProps {
    actionsColumnIndex?: number;
    columns: Column[];
    emptyCell: boolean;
    filterCellStyle?: CSSProperties;
    fixedColumns?: number;
    hasActions: boolean;
    hasDetailPanel: boolean;
    icons: Icons;
    isTreeData?: boolean;
    localization?: LocalizationFilterRow;
    onFilterChanged: (tableDataId: number, filterValue: any) => void;
    selection?: boolean;
}
