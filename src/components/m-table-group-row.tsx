import React, { Component } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

export default class MTableGroupRow extends Component<any, any> {

    rotateIconStyle(isOpen: boolean) {
        return {
            transform: isOpen ? 'rotate(90deg)' : 'none'
        };
    }

    render() {
        let colSpan = this.props.columns.filter((columnDef: any) => !columnDef.hidden).length;
        this.props.options.selection && colSpan++;
        this.props.detailPanel && colSpan++;
        this.props.actions && this.props.actions.length > 0 && colSpan++;
        const column = this.props.groups[this.props.level];

        let detail;
        if (this.props.groupData.isExpanded) {
            if (this.props.groups.length > (this.props.level + 1)) { // Is there another group
                detail = this.props.groupData.groups.map((groupData: any, index: number) => {

                    const key = (groupData.path && groupData.path.length > 0)
                        ? groupData.path.reduce((val: string, item: any) => (`${val}_${item}`), '')
                        : ('' + String(index));
                    return (
                        <this.props.components.GroupRow
                            actions={this.props.actions}
                            key={key}
                            columns={this.props.columns}
                            components={this.props.components}
                            detailPanel={this.props.detailPanel}
                            getFieldValue={this.props.getFieldValue}
                            groupData={groupData}
                            groups={this.props.groups}
                            icons={this.props.icons}
                            level={this.props.level + 1}
                            path={[...this.props.path, index]}
                            onGroupExpandChanged={this.props.onGroupExpandChanged}
                            onRowSelected={this.props.onRowSelected}
                            onRowClick={this.props.onRowClick}
                            onToggleDetailPanel={this.props.onToggleDetailPanel}
                            onTreeExpandChanged={this.props.onTreeExpandChanged}
                            onEditingCanceled={this.props.onEditingCanceled}
                            onEditingApproved={this.props.onEditingApproved}
                            options={this.props.options}
                            localization={this.props.localization}
                            hasAnyEditingRow={this.props.hasAnyEditingRow}
                            isTreeData={this.props.isTreeData}
                        />
                    );
                });
            }
            else {
                detail = this.props.groupData.data.map((rowData: any, index: number) => {
                    if (rowData.tableData.editing) {
                        return (
                            <this.props.components.EditRow
                                columns={this.props.columns}
                                components={this.props.components}
                                data={rowData}
                                icons={this.props.icons}
                                localization={this.props.localization}
                                key={index}
                                mode={rowData.tableData.editing}
                                options={this.props.options}
                                isTreeData={this.props.isTreeData}
                                detailPanel={this.props.detailPanel}
                                onEditingCanceled={this.props.onEditingCanceled}
                                onEditingApproved={this.props.onEditingApproved}
                            />
                        );
                    }
                    else {
                        return (
                            <this.props.components.Row
                                actions={this.props.actions}
                                key={index}
                                columns={this.props.columns}
                                components={this.props.components}
                                data={rowData}
                                detailPanel={this.props.detailPanel}
                                getFieldValue={this.props.getFieldValue}
                                icons={this.props.icons}
                                path={[...this.props.path, index]}
                                onRowSelected={this.props.onRowSelected}
                                onRowClick={this.props.onRowClick}
                                onToggleDetailPanel={this.props.onToggleDetailPanel}
                                options={this.props.options}
                                isTreeData={this.props.isTreeData}
                                onTreeExpandChanged={this.props.onTreeExpandChanged}
                                onEditingCanceled={this.props.onEditingCanceled}
                                onEditingApproved={this.props.onEditingApproved}
                                hasAnyEditingRow={this.props.hasAnyEditingRow}
                            />
                        );
                    }
                });
            }
        }

        const cellClassName = this.props.options.fixedColumns ? 'cell-fixed' : '';
        const freeCells = [];
        for (let i = 0; i < this.props.level; i++) {
            freeCells.push(<TableCell padding='checkbox' className={cellClassName}/>);
        }

        let value = this.props.groupData.value;
        if (column.lookup) {
            value = column.lookup[value];
        }

        return (
            <>
                <TableRow>
                    {freeCells}
                    <this.props.components.Cell
                        strictDigits={this.props.options.strictDigits}
                        isFixed={!!this.props.options.fixedColumns}
                        datetimeLocaleString={this.props.options.datetimeLocaleString}
                        colSpan={colSpan}
                        padding='none'
                        columnDef={column}
                        value={value}
                        icons={this.props.icons}
                        sorting={!!this.props.options.sorting}
                        headerFiltering={this.props.options.filtering && this.props.options.filterType === 'header'}
                    >
                        <IconButton
                            style={{ transition: 'all ease 200ms', ...this.rotateIconStyle(this.props.groupData.isExpanded) }}
                            onClick={() => {
                                this.props.onGroupExpandChanged(this.props.path);
                            }}
                        >
                            <this.props.icons.DetailPanel />
                        </IconButton>
                        <b>{column.title + ': '}</b>
                    </this.props.components.Cell>
                </TableRow>
                {detail}
            </>
        );
    }
}
