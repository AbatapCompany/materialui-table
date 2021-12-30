import { Pagings } from '../../models/material-table.model';

export interface MTableInfiniteProps {
    children?: JSX.Element;
    currentPage: number;
    maxBodyHeight: string | number;
    onPageChange: (page: number) => void;
    pageSize: number;
    paging: Pagings;
    threshold?: number;
    totalCount: number;
}
