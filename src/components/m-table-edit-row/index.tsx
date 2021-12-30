import React, { Component } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { byString } from '../../utils/byString';
import { setByString } from '../../utils/setByString';
import { MTableEditRowProps } from './models';
import { Column } from '../../models/material-table.model';

export default class MTableEditRow extends Component<MTableEditRowProps, any> {

    static defaultProps: Partial<MTableEditRowProps> = {
        actions: [],
        index: 0,
        options: {},
        path: [],
        localization: {
            saveTooltip: 'Save',
            cancelTooltip: 'Cancel',
            deleteText: 'Are you sure delete this row?',
        }
    }

    constructor(props: MTableEditRowProps) {
        super(props);

        this.state = {
            data: props.data ? JSON.parse(JSON.stringify(props.data)) : {}
        };
    }

    renderColumns() {
        const mapArr = this.props.columns
            .filter((columnDef) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1))
            .map((columnDef, index) => {
                let value = (typeof this.state.data[columnDef.field] !== 'undefined' ? this.state.data[columnDef.field] : byString(this.state.data, columnDef.field));
                const cellClassName = (index: number) => index < this.props.options.fixedColumns ? 'cell-fixed' : '';
                // let style: any = {};
                // if (index === 0) {
                //     style = { ...style, paddingLeft: 24 + (this.props.level * 20) };
                // }

                let allowEditing = false;

                if (columnDef.editable === undefined) {
                    allowEditing = true;
                }
                if (columnDef.editable === 'always') {
                    allowEditing = true;
                }
                if (columnDef.editable === 'onAdd' && this.props.mode === 'add') {
                    allowEditing = true;
                }
                if (columnDef.editable === 'onUpdate' && this.props.mode === 'update') {
                    allowEditing = true;
                }

                if (!columnDef.field || !allowEditing) {
                    if (columnDef.lookup) {
                        value = columnDef.lookup[value];
                    }
                    return (
                        <this.props.components.Cell
                            strictDigits={this.props.options.strictDigits}
                            icons={this.props.icons}
                            columnDef={columnDef}
                            value={value}
                            key={columnDef.tableData.id}
                            rowData={this.props.data}
                            isFixed={index < Number(this.props.options.fixedColumns)}
                            datetimeLocaleString={this.props.options.datetimeLocaleString}
                            sorting={!!this.props.options.sorting}
                            headerFiltering={this.props.options.filtering && this.props.options.filterType === 'header'}
                        />
                    );
                }
                else {
                    const { editComponent, ...cellProps } = columnDef;
                    const EditComponent: any = editComponent || this.props.components.EditField;
                    return (
                        <TableCell
                            key={columnDef.tableData.id}
                            align={['numeric'].indexOf(columnDef.type) !== -1 ? 'right' : 'left'}
                            className={cellClassName(index)}
                        >
                            <EditComponent
                                key={columnDef.tableData.id}
                                columnDef={cellProps}
                                value={value}
                                rowData={this.state.data}
                                onChange={(v: number) => {
                                    const data = { ...this.state.data };
                                    const value = v && cellProps.lookup && !isNaN(v) ? +v : v;
                                    setByString(data, columnDef.field, value);
                                    // data[columnDef.field] = value;
                                    this.setState({ data });
                                }}
                                onRowDataChange={(data: any) => {
                                    this.setState({ data });
                                }}
                            />
                        </TableCell>
                    );
                }
            });
        return mapArr;
    }

    renderActions() {
        const localization = { ...MTableEditRow.defaultProps.localization, ...this.props.localization };
        const actions = [
            {
                icon: this.props.icons.Check,
                tooltip: localization.saveTooltip,
                onClick: () => {
                    const newData = this.state.data;
                    delete newData.tableData;
                    this.props.onEditingApproved(this.props.mode, this.state.data, this.props.data);
                }
            },
            {
                icon: this.props.icons.Clear,
                tooltip: localization.cancelTooltip,
                onClick: () => {
                    this.props.onEditingCanceled(this.props.mode, this.props.data);
                }
            }
        ];
        const cellClassName = Number(this.props.options.actionsColumnIndex) < Number(this.props.options.fixedColumns) ? 'cell-fixed' : '';

        return (
            <TableCell padding='none' key='key-actions-column' style={{ width: 42 * actions.length, padding: '0px 5px' }} className={cellClassName}>
                <div style={{ display: 'flex' }}>
                    <this.props.components.Actions data={this.props.data} actions={actions} components={this.props.components} />
                </div>
            </TableCell>
        );
    }

    getStyle() {
        const style = {
        // boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
            borderBottom: '1px solid red'
        };

        return style;
    }

    render() {
        const localization = { ...MTableEditRow.defaultProps.localization, ...this.props.localization };
        const cellClassName = (index: number) => index < Number(this.props.options.fixedColumns) ? 'cell-fixed' : '';

        let columns: JSX.Element[] = [];
        if (this.props.mode === 'add' || this.props.mode === 'update') {
            columns = this.renderColumns();
        }
        else {
            const colSpan = this.props.columns.filter((columnDef) => {
                return !columnDef.hidden && !(columnDef.tableData.groupOrder > -1);
            }).length;
            columns = [
                <TableCell
                    padding={this.props.options.actionsColumnIndex === 0 ? 'none' : undefined}
                    key='key-selection-cell'
                    className={cellClassName(0)}
                    colSpan={colSpan}>
                    <Typography variant='h6'>
                        {localization.deleteText}
                    </Typography>
                </TableCell>
            ];
        }


        if (this.props.options.selection) {
            columns.splice(0, 0, <TableCell padding='none' key='key-selection-cell' className={cellClassName(0)} />);
        }
        if (this.props.isTreeData) {
            columns.splice(0, 0, <TableCell padding='none' key='key-tree-data-cell' className={cellClassName(0)} />);
        }

        if (this.props.options.actionsColumnIndex === -1) {
            columns.push(this.renderActions());
        } else if (Number(this.props.options.actionsColumnIndex) >= 0) {
            let endPos = 0;
            if (this.props.options.selection) {
                endPos = 1;
            }
            if (this.props.isTreeData) {
                endPos = 1;
                if (this.props.options.selection) {
                    columns.splice(1, 1);
                }
            }
            columns.splice(this.props.options.actionsColumnIndex + endPos, 0, this.renderActions());
        }

        // Lastly we add detail panel icon
        if (this.props.detailPanel) {
            columns.splice(0, 0, <TableCell padding='none' key='key-detail-panel-cell' className={cellClassName(0)} />);
        }

        this.props.columns
            .filter((columnDef) => columnDef.tableData.groupOrder > -1)
            .forEach((columnDef) => {
                columns.splice(0, 0, <TableCell padding='none' key={'key-group-cell' + String(columnDef.tableData.id)} className={cellClassName(0)} />);
            });

        return (
            <>
                <TableRow
                    {...this.props}
                    style={this.getStyle()}
                >
                    {columns}
                </TableRow>
            </>
        );
    }
}
