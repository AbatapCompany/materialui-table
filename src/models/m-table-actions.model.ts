import { ReactElement } from 'react';
import { IMTableAction, MTableActionData } from './m-table-action.model';

export interface MTableActionsProps {
    components: ReactElement[];
    actions?: IMTableAction[];
    data?: MTableActionData;
}
