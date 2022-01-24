import { CSSProperties } from 'react';
import { SortDirection } from '@mui/material';
import { Column, HorizontalDirections, FilterTypes, LocalizationHeader, Icons, Components } from '../../models/material-table.model';

export interface MTableHeaderProps {
    actionsColumnIndex?: number;
    actionsHeaderIndex?: number;
    classes: Record<string, string>;
    columns: Column[];
    components: Components;
    dataCount: number;
    detailPanelColumnAlignment?: HorizontalDirections;
    draggableHeader?: boolean;
    filtering?: boolean;
    filterType?: FilterTypes;
    fixedColumns?: number;
    grouping?: boolean;
    hasDetailPanel: boolean;
    hasSelection?: boolean;
    headerClassName?: string;
    headerStyle?: CSSProperties;
    icons: Icons;
    isTreeData: boolean;
    localization?: LocalizationHeader;
    onFilterChanged: (tableDataId: number, filterValue: any) => void;
    orderBy?: number;
    orderDirection: SortDirection;
    selectedCount: number;
    selection?: boolean;
    showActionsColumn: boolean;
    showSelectAllCheckbox: boolean;
    sorting?: boolean;

    // TODO unknown types
    onAllSelected: any; // function
    onOrderChange: any; // function
}
