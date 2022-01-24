import React, { Component } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TimePicker from '@mui/lab/TimePicker';
import { MTableFilterRowProps } from './models';
import { Column } from '../../models/material-table.model';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default class MTableFilterRow extends Component<MTableFilterRowProps> {

    static defaultProps: Partial<MTableFilterRowProps> = {
        emptyCell: false,
        columns: [],
        selection: false,
        hasActions: false,
        localization: {
            filterTooltip: 'Filter'
        }
    }

    renderLookupFilter = (columnDef: Column) => (
        <FormControl style={{ width: '100%' }}>
            <Select
                multiple
                value={columnDef.tableData.filterValue || []}
                onChange={event => {
                    this.props.onFilterChanged(columnDef.tableData.id, event.target.value);
                }}
                input={<Input id='select-multiple-checkbox' />}
                renderValue={(selecteds: any[]) => selecteds.map((selected: any) => columnDef.lookup[selected]).join(', ')}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: (ITEM_HEIGHT * 4.5) + ITEM_PADDING_TOP,
                            width: 250
                        }
                    }
                }}
            >
                {
                    Object.keys(columnDef.lookup).map(key => (
                        <MenuItem key={key} value={key}>
                            <Checkbox
                                checked={columnDef.tableData.filterValue
                                    ? columnDef.tableData.filterValue.indexOf(key.toString()) > -1
                                    : false
                                }
                            />
                            <ListItemText primary={columnDef.lookup[key]} />
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )

    renderBooleanFilter = (columnDef: Column) => (
        <Checkbox
            indeterminate={columnDef.tableData.filterValue === undefined}
            checked={columnDef.tableData.filterValue === 'checked'}
            onChange={() => {
                let val = '';
                if (columnDef.tableData.filterValue === undefined) {
                    val = 'checked';
                }
                else if (columnDef.tableData.filterValue === 'checked') {
                    val = 'unchecked';
                }

                this.props.onFilterChanged(columnDef.tableData.id, val);
            }}
        />
    )

    renderDefaultFilter = (columnDef: Column) => {
        const localization = { ...MTableFilterRow.defaultProps.localization, ...this.props.localization };
        const FilterIcon = this.props.icons.Filter;
        return (
            <TextField
                variant='standard'
                style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
                type={columnDef.type === 'numeric' ? 'number' : 'text'}
                value={columnDef.tableData.filterValue || ''}
                onChange={(event) => {
                    this.props.onFilterChanged(columnDef.tableData.id, event.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Tooltip title={localization.filterTooltip}>
                                <FilterIcon />
                            </Tooltip>
                        </InputAdornment>
                    )
                }}
            />
        );
    }

    renderDateTypeFilter = (columnDef: Column) => {
        let dateInputElement = null;
        const onDateInputChange = (date: any) => this.props.onFilterChanged(columnDef.tableData.id, date);

        if (columnDef.type === 'date') {
            dateInputElement = (
                <DatePicker
                    label=''
                    value={columnDef.tableData.filterValue || null}
                    onChange={onDateInputChange}
                    renderInput={(params) => (
                        <TextField
                            variant='standard'
                            {...params}
                        />
                    )}
                    clearable
                />
            );
        }
        else if (columnDef.type === 'datetime') {
            dateInputElement = (
                <DateTimePicker
                    label=''
                    value={columnDef.tableData.filterValue || null}
                    onChange={onDateInputChange}
                    renderInput={(params) => (
                        <TextField
                            variant='standard'
                            {...params}
                        />
                    )}
                    clearable
                />
            );
        }
        else if (columnDef.type === 'time') {
            dateInputElement = (
                <TimePicker
                    label=''
                    value={columnDef.tableData.filterValue || null}
                    onChange={onDateInputChange}
                    renderInput={(params) => (
                        <TextField
                            variant='standard'
                            {...params}
                        />
                    )}
                    clearable
                />
            );
        }

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>
                {dateInputElement}
            </LocalizationProvider>
        );
    }

    getComponentForColumn(columnDef: Column) {
        if (columnDef.filtering === false) {
            return null;
        }

        if (columnDef.field || columnDef.customFilterAndSearch) {
            if (columnDef.lookup) {
                return this.renderLookupFilter(columnDef);
            }
            else if (columnDef.type === 'boolean') {
                return this.renderBooleanFilter(columnDef);
            }
            else if (['date', 'datetime', 'time'].includes(columnDef.type)) {
                return this.renderDateTypeFilter(columnDef);
            }
            else {
                return this.renderDefaultFilter(columnDef);
            }
        }
    }

    render() {
        const cellClassName = (index: number) => index < this.props.fixedColumns ? 'cell-fixed' : '';

        const columns = this.props.columns
            .filter((columnDef) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1))
            .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
            .map((columnDef, index) => (
                <TableCell
                    className={cellClassName(index)}
                    style={{ ...this.props.filterCellStyle, ...columnDef.filterCellStyle }}
                    key={columnDef.tableData.id}
                >
                    {this.getComponentForColumn(columnDef)}
                </TableCell>
            ));

        if (this.props.selection) {
            columns.splice(0, 0, <TableCell padding='none' key='key-selection-column' className={cellClassName(0)}/>);
        }

        if (this.props.emptyCell && this.props.hasActions) {
            if (this.props.actionsColumnIndex === -1) {
                columns.push(<TableCell key='key-action-column' />);
            }
            else {
                let endPos = 0;
                if (this.props.selection) {
                    endPos = 1;
                }
                columns.splice(
                    this.props.actionsColumnIndex + endPos, 0,
                    <TableCell
                        key='key-action-column'
                        className={cellClassName(this.props.actionsColumnIndex + endPos)}
                    />
                );
            }
        }

        if (this.props.hasDetailPanel) {
            columns.splice(0, 0, <TableCell padding='none' key='key-detail-panel-column' className={cellClassName(0)} />);
        }

        if (this.props.isTreeData) {
            columns.splice(0, 0,
                <TableCell
                    padding='none'
                    key={'key-tree-data-filter'}
                />
            );
        }

        this.props.columns
            .filter((columnDef) => columnDef.tableData.groupOrder > -1)
            .forEach((columnDef) => {
                columns.splice(0, 0, <TableCell
                    className={cellClassName(0)}
                    padding='checkbox'
                    key={'key-group-filter' + String(columnDef.tableData.id)}
                />);
            });

        return (
            <TableRow style={{ height: 10 }}>
                {columns}
            </TableRow>
        );
    }
}
