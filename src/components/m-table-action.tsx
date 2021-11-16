import React, { Component, MouseEvent } from 'react';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default class MTableAction extends Component<any> {
    render() {
        let action: any | null = null;

        if (typeof this.props.action === 'function') {
            action = this.props.action(this.props.data);
        }
        else {
            action = this.props.action;
        }

        if (action === null) {
            return null;
        }

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
                        : (<action.icon {...action.iconProps} disabled={action.disabled}/>)
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
