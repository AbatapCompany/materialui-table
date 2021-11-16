import React, { Component } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyleRules, withStyles } from '@mui/styles';

class MTableTotalsRow extends Component<any> {

    getStyle = (value: any, columnDef: any) => {
        let cellStyle = {};

        if (typeof columnDef.cellStyle === 'function') {
            cellStyle = { ...cellStyle, ...columnDef.cellStyle(value, undefined) };
        }
        else {
            cellStyle = { ...cellStyle, ...columnDef.cellStyle };
        }

        return { ...cellStyle };
    }

    getClassName = (value: any, columnDef: any) => {
        let cellClassName = '';

        if (typeof columnDef.cellClassName === 'function') {
            cellClassName = columnDef.cellClassName(value, undefined);
        }
        else {
            cellClassName = columnDef.cellClassName;
        }

        return cellClassName || '';
    }

    renderColumns() {
        const mapArr = this.props.columns.filter((columnDef: any) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1))
            .sort((a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder)
            .map((columnDef: any, index: number) => {
                const cellClassName = index < this.props.options.fixedColumns ? 'cell-fixed' : '';
                const value = this.props.getAggregation(this.props.renderData, columnDef);

                return value === undefined
                    ? <TableCell
                        key={`cell-total-${columnDef.tableData.id}`}
                        style={this.getStyle(value, columnDef)}
                        className={`${cellClassName} ${this.getClassName(value, columnDef)}`}
                    />
                    : <this.props.components.Cell
                        strictDigits={this.props.options.strictDigits}
                        icons={this.props.icons}
                        isFixed={index < this.props.options.fixedColumns}
                        datetimeLocaleString={this.props.options.datetimeLocaleString}
                        isTotals
                        columnDef={columnDef}
                        value={value}
                        key={'cell-total-' + columnDef.tableData.id}
                        // rowData={undefined}
                        sorting={!!this.props.options.sorting}
                        headerFiltering={this.props.options.filtering && this.props.options.filterType === 'header'}
                    />;
            });
        return mapArr;
    }

    rotateIconStyle(isOpen: any) {
        return {
            transform: isOpen ? 'rotate(90deg)' : 'none'
        };
    }

    render() {
        const cellClassName = this.props.options.fixedColumns ? 'cell-fixed' : '';
        const renderColumns = this.renderColumns();
        let columnId = 0;
        const emptyCell = () => <TableCell padding='none' key={`key-column-${++columnId}`} className={cellClassName} />;

        if (this.props.options.selection) {
            renderColumns.splice(0, 0, emptyCell());
        }
        if (this.props.actions && this.props.actions.filter((a: any) => !a.isFreeAction && !this.props.options.selection).length > 0) {
            if (this.props.options.actionsColumnIndex === -1) {
                renderColumns.push(emptyCell());
            } else if (this.props.options.actionsColumnIndex >= 0) {
                let endPos = 0;
                if (this.props.options.selection) {
                    endPos = 1;
                }
                renderColumns.splice(this.props.options.actionsColumnIndex + endPos, 0, emptyCell());
            }
        }
        if (this.props.isTreeData) {
            renderColumns.splice(0, 0, <TableCell padding='none' key={'key-tree-data-column'} className={cellClassName}/>);
        }

        this.props.columns
            .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
            .forEach((columnDef: any) => {
                renderColumns.splice(0, 0, <TableCell padding='none' key={'key-group-cell' + columnDef.tableData.id} className={cellClassName} />);
            });

        return <TableRow className='totals-row'>
            {renderColumns}
        </TableRow>;
    }
}

export const styles = (theme: any): StyleRules => ({
    '@global': {
        '.totals-row td.MuiTableCell-footer': {
            position: 'sticky',
            bottom: 0,
            backgroundColor: theme.palette.background.paper, // Change according to theme,
            color: theme.palette.grey['900'],
            fontWeight: 'bold',
            fontSize: '0.875rem'
        }
    }
});

export default withStyles(styles)(MTableTotalsRow);
