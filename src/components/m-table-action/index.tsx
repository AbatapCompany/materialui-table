import React, { Component, MouseEvent } from 'react';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MTableActionProps } from './models';

export default class MTableAction extends Component<MTableActionProps> {
    render() {
        const action = typeof this.props.action === 'function'
            ? this.props.action(this.props.data)
            : this.props.action;

        if (action.hidden) {
            return null;
        }

        const handleOnClick = (event: MouseEvent<HTMLElement>): void => {
            if (typeof action.onClick === 'function') {
                action.onClick(event, this.props.data);
                event.stopPropagation();
            }
        };

        const button = (
            <span>
                <IconButton
                    disabled={action.disabled}
                    onClick={handleOnClick}
                >
                    {typeof action.icon === 'string'
                        ? (<Icon {...action.iconProps} fontSize='small'>{action.icon}</Icon>)
                        : (<action.icon {...action.iconProps}/>)
                    }
                </IconButton>
            </span>
        );

        if (typeof action.tooltip === 'string') {
            return (
                <Tooltip title={action.tooltip}>
                    {button}
                </Tooltip>
            );
        }

        return button;
    }
}
