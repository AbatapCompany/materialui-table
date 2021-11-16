import React, { Component } from 'react';

export default class MTableActions extends Component<any> {
    render() {
        if (this.props.actions) {
            return this.props.actions.map((action: any, index: number) => {
                return (
                    <this.props.components.Action
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
