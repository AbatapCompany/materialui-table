import React, { Component } from 'react';
import { MTableActionsProps } from './models';

export default class MTableActions extends Component<MTableActionsProps> {
    render() {
        const Action = this.props.components.Action;
        if (Array.isArray(this.props.actions) && Action !== undefined) {
            return this.props.actions.map((action, index) => {
                return (
                    <Action
                        action={action}
                        data={this.props.data}
                        key={`action-${index}`}
                    />
                );
            });
        }
        return null;
    }
}
