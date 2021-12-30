import { Theme } from '@mui/material';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import { Icons, LocalizationPagination } from './material-table.model';

export interface MTablePaginationProps extends TablePaginationActionsProps {
    classes: Record<string, string>;
    icons: Icons;
    localization: LocalizationPagination;
    showFirstLastPageButtons?: boolean;
    theme: Theme;
}
