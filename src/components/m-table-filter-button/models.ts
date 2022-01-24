import { Column, Icons, LocalizationFilter } from '../../models/material-table.model';

export interface MTableFilterButtonProps {
    classes: Record<string, string>;
    columnDef: Column;
    icons: Icons;
    localization: LocalizationFilter;
    onFilterChanged: (tableDataId: number, filterValue: any) => void;
}
