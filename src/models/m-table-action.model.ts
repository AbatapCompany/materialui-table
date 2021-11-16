import { ElementType, MouseEvent } from 'react';
import { IconProps } from '@mui/material/Icon';

export type MTableActionData = Record<string, unknown> | Array<Record<string, unknown>>;

export interface IMTableAction {
    icon: string | ElementType;
    hidden?: boolean;
    disabled?: boolean;
    iconProps?: IconProps;
    tooltip?: string;
    onClick?: (event: MouseEvent<HTMLElement>, data: MTableActionData) => void;
}

export interface MTableActionProps {
    action: (data: MTableActionData) => IMTableAction | IMTableAction;
    data: Record<string, unknown> | Array<Record<string, unknown>>;
}
