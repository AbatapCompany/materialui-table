import React, { Component, MouseEvent } from 'react';
import TableCell from '@mui/material/TableCell';
import omit from 'lodash/omit';
import { IMTableCellProps } from './models';
import { Column } from 'models/material-table.model';

export default class MTableCell extends Component<IMTableCellProps> {

    getRenderValue() {
        if (this.props.columnDef.emptyValue !== undefined && (this.props.value === undefined || this.props.value === null)) {
            return this.getEmptyValue(this.props.columnDef.emptyValue);
        }
        if (this.props.columnDef.render && !this.props.isTotals) {
            if (this.props.rowData) {
                return this.props.columnDef.render(this.props.rowData, 'row');
            }
            else {
                return this.props.columnDef.render(this.props.value, 'group');
            }

        } else if (this.props.columnDef.type === 'boolean') {
            const style = { textAlign: 'left', verticalAlign: 'middle', width: 48 };
            if (this.props.value && this.props.icons.Check) {
                return <this.props.icons.Check style={style} />;
            }
            else {
                return <this.props.icons.ThirdStateCheck style={style} />;
            }
        } else if (this.props.columnDef.type === 'date') {
            if (this.props.value instanceof Date) {
                return this.props.value.toLocaleDateString(this.props.datetimeLocaleString);
            }
            else {
                return this.props.value;
            }
        } else if (this.props.columnDef.type === 'time') {
            if (this.props.value instanceof Date) {
                return this.props.value.toLocaleTimeString(this.props.datetimeLocaleString);
            }
            else {
                return this.props.value;
            }
        } else if (this.props.columnDef.type === 'datetime') {
            if (this.props.value instanceof Date) {
                return this.props.value.toLocaleString(this.props.datetimeLocaleString);
            }
            else {
                return this.props.value;
            }
        } else if (this.props.columnDef.type === 'currency') {
            return this.getCurrencyValue(this.props.columnDef.currencySetting, this.props.value);
        } else if (this.props.columnDef.type === 'numeric') {
            if (this.props.columnDef.digits !== undefined) {

                let normalizedValue = (this.props.value && this.props.value.toFixed)
                    ? this.props.value
                        .toFixed(this.props.columnDef.digits)
                    : null;

                const strictDigits = (this.props.columnDef.strictDigits !== undefined)
                    ? this.props.columnDef.strictDigits
                    : this.props.strictDigits;

                if (
                    normalizedValue &&
                    normalizedValue.indexOf('.') !== -1 &&
                    !strictDigits
                ) {
                    normalizedValue = normalizedValue.replace(/[0]+$/, '').replace(/[.]+$/, '');
                }

                return (normalizedValue === null) ? this.props.value : normalizedValue;
            }

            return this.props.value;
        }

        return this.props.value;
    }

    getEmptyValue(emptyValue: Column['emptyValue']) {
        if (typeof emptyValue === 'function') {
            return emptyValue(this.props.rowData);
        }
        else {
            return emptyValue;
        }
    }

    getCurrencyValue(currencySetting: any, value: any) {
        if (currencySetting !== undefined) {
            return new Intl.NumberFormat((currencySetting.locale !== undefined) ? currencySetting.locale : 'en-US', {
                style: 'currency',
                currency: (currencySetting.currencyCode !== undefined) ? currencySetting.currencyCode : 'USD',
                minimumFractionDigits: (currencySetting.minimumFractionDigits !== undefined) ? currencySetting.minimumFractionDigits : 2,
                maximumFractionDigits: (currencySetting.maximumFractionDigits !== undefined) ? currencySetting.maximumFractionDigits : 2
            }).format((value !== undefined) ? value : 0);
        }
        else {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((value !== undefined) ? value : 0);
        }
    }

    handleClickCell = (event: MouseEvent) => {
        if (this.props.columnDef.disableClick) {
            event.stopPropagation();
        }
    }

    getStyle = () => {
        let cellStyle = {};

        if (typeof this.props.columnDef.cellStyle === 'function') {
            cellStyle = { ...cellStyle, ...this.props.columnDef.cellStyle(this.props.value, this.props.rowData) };
        }
        else {
            cellStyle = { ...cellStyle, ...this.props.columnDef.cellStyle };
        }

        if (this.props.columnDef.disableClick) {
            cellStyle = { ...cellStyle, cursor: 'default' };
        }

        return { ...this.props.style, ...cellStyle };
    }

    getClassName = () => {
        let cellClassName = '';

        if (typeof this.props.columnDef.cellClassName === 'function') {
            cellClassName = this.props.columnDef.cellClassName(this.props.value, this.props.rowData);
        }
        if (typeof this.props.columnDef.cellClassName === 'string') {
            cellClassName = this.props.columnDef.cellClassName;
        }

        return cellClassName;
    }

    render() {
        const cellProps = omit(this.props, 'icons', 'columnDef', 'rowData', 'isFixed', 'value', 'sorting', 'headerFiltering', 'isTotals', 'datetimeLocaleString', 'strictDigits');
        let padding = 0;

        if (this.props.columnDef.type === 'numeric') {
            if (this.props.columnDef.sorting !== false && this.props.sorting) {
                padding += 26;
            }
            if (this.props.headerFiltering) {
                padding += 24;
            }
        }

        const className = this.getClassName();
        const align = ['numeric'].indexOf(this.props.columnDef.type ?? '') !== -1 ? 'right' : 'left';

        return (
            <TableCell
                {...cellProps}
                className={(this.props.isFixed ? 'cell-fixed ' : '') + className}
                style={this.getStyle()}
                align={align}
                onClick={this.handleClickCell}
            >
                <span style={{ paddingRight: `${padding}px` }}>
                    {this.props.children}
                    {this.getRenderValue()}
                </span>
            </TableCell>
        );
    }
}
