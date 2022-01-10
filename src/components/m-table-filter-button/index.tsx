import React, { Component, MouseEvent } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TimePicker from '@mui/lab/TimePicker';
import { Styles, withStyles } from '@mui/styles';
import { Column } from '../../models/material-table.model';
import { MTableFilterButtonProps } from './models';

class MTableFilterButton extends Component<MTableFilterButtonProps, any> {

    static defaultProps: Partial<MTableFilterButtonProps> = {
        localization: {
            clearFilter: 'Clear',
            selectAll: 'Select all'
        }
    }

    constructor(props: MTableFilterButtonProps) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }
    handleOpenPopoverButtonClick(event: MouseEvent<HTMLButtonElement>) {
        this.setState({
            anchorEl: event.currentTarget
        });
    }
    handlePopoverClose = () => {
        this.setState({
            anchorEl: null
        });
    }
    handleLookupCheckboxToggle(columnDef: Column, key: string) {
        let filterValue = (columnDef.tableData.filterValue || []).slice();
        const elementIndex = filterValue.indexOf(key);
        if (elementIndex === -1) {
            filterValue.push(key);
        }
        else {
            filterValue.splice(elementIndex, 1);
        }
        if (filterValue.length === 0) {
            filterValue = undefined;
        }
        this.props.onFilterChanged(columnDef.tableData.id, filterValue);
    }

    handleCheckboxToggle(columnDef: Column) {
        let val = '';
        if (columnDef.tableData.filterValue === undefined) {
            val = 'checked';
        }
        else if (columnDef.tableData.filterValue === 'checked') {
            val = 'unchecked';
        }
        this.props.onFilterChanged(columnDef.tableData.id, val);
    }

    handleFilterNumericChange(columnDef: Column, value: any, index: number) {
        let filterValue = columnDef.tableData.filterValue;
        //if both value are undef => filterValue = undef
        if (!value && filterValue && !filterValue[Math.abs(index - 1)]) {
            filterValue = undefined;
        }
        else {
            if (filterValue === undefined) {
                filterValue = [undefined, undefined];
            }
            filterValue[index] = value;
        }
        this.props.onFilterChanged(columnDef.tableData.id, filterValue);
    }

    getFilterTitle() {
        const columnDef = this.props.columnDef;

        if (columnDef.field || columnDef.customFilterAndSearch) {
            if (columnDef.lookup) {
                const lookupResult = Object.keys(columnDef.lookup)
                    .filter(key => columnDef.tableData.filterValue && columnDef.tableData.filterValue.indexOf(key.toString()) > -1)
                    .map(key => columnDef.lookup[key])
                    .join(', ');
                return lookupResult;
            }
            else if (columnDef.tableData.filterValue) {
                if (columnDef.type === 'numeric') {
                    const isEmpty = (val: any) => val === undefined || val === null || val === '';
                    if (isEmpty(columnDef.tableData.filterValue[0])) {
                        return `[..., ${columnDef.tableData.filterValue[1]}]`;
                    }
                    else if (isEmpty(columnDef.tableData.filterValue[1])) {
                        return `[${columnDef.tableData.filterValue[0]}, ...]`;
                    }
                    else {
                        return `[${columnDef.tableData.filterValue[0]}, ${columnDef.tableData.filterValue[1]}]`;
                    }
                }
            }
            return columnDef.tableData.filterValue;
        }
        return null;
    }
    renderFilterBody(columnDef: Column) {
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
            else if (columnDef.type === 'numeric') {
                return this.renderNumericFilter(columnDef);
            }
            else {
                return this.renderDefaultFilter(columnDef);
            }
        }
        return null;
    }
    renderLookupFilter = (columnDef: Column) => {
        const { classes } = this.props;
        const localization = { ...MTableFilterButton.defaultProps.localization, ...this.props.localization };
        const isChecked = (key: string) => {
            if (columnDef.tableData.filterValue) {
                return columnDef.tableData.filterValue.indexOf(key.toString()) > -1;
            }
            return false;
        };
        return (
            <FormControl style={{ width: '100%' }}>
                <List className={classes.filterList}>
                    {Object.keys(columnDef.lookup)
                        .sort((k1, k2) => (`${columnDef.lookup[k1]}`.localeCompare(`${columnDef.lookup[k2]}`)))
                        .map((key: string) => (
                            <ListItem
                                className={classes.filterListItem}
                                key={key}
                                role={undefined}
                                dense={true}
                                button={true}
                                onClick={() => this.handleLookupCheckboxToggle(columnDef, key)}
                            >
                                <Checkbox
                                    className={classes.filterCheckbox}
                                    checked={isChecked(key)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={columnDef.lookup[key]} className={classes.filterText} />
                            </ListItem>
                        ))}
                </List>
                <div className={classes.filterListFooter}>
                    <Divider />
                    {
                        !!columnDef.tableData.filterValue &&
                        <Link
                            className={classes.filterListClearLink}
                            onClick={() => this.props.onFilterChanged(columnDef.tableData.id, undefined)}
                        >
                            {localization.clearFilter}
                        </Link>
                    }
                    {
                        !columnDef.tableData.filterValue &&
                        <Link
                            className={classes.filterListClearLink}
                            onClick={() => this.props.onFilterChanged(columnDef.tableData.id, Object.keys(columnDef.lookup))}
                        >
                            {localization.selectAll}
                        </Link>
                    }
                </div>
            </FormControl>
        );
    }
    renderBooleanFilter(columnDef: Column) {
        const { classes } = this.props;
        return (
            <Checkbox
                className={classes.filterCheckbox}
                indeterminate={columnDef.tableData.filterValue === undefined}
                checked={columnDef.tableData.filterValue === 'checked'}
                onChange={() => this.handleCheckboxToggle(columnDef)}
            />
        );
    }
    renderNumericFilter(columnDef: Column) {
        const { classes } = this.props;
        return (
            <>
                <TextField
                    autoFocus
                    type='number'
                    className={classes.filterNumericFrom}
                    value={(columnDef.tableData.filterValue && columnDef.tableData.filterValue[0]) || ''}
                    onChange={(event) => this.handleFilterNumericChange(columnDef, event.target.value, 0)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start' className={classes.startAdornment}>
                                [
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {
                                    ((columnDef.tableData.filterValue && columnDef.tableData.filterValue[0]) || '') !== '' &&
                                    <InputAdornment position='end' className={classes.endAdornment}>
                                        <IconButton className={classes.clearIcon} onClick={() => this.handleFilterNumericChange(columnDef, '', 0)}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            </>
                        )
                    }}
                />
                <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
            ,
                </span>
                <TextField
                    type='number'
                    className={classes.filterNumericTo}
                    value={(columnDef.tableData.filterValue && columnDef.tableData.filterValue[1]) || ''}
                    onChange={(event) => this.handleFilterNumericChange(columnDef, event.target.value, 1)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end' className={classes.endAdornment}>
                                {
                                    ((columnDef.tableData.filterValue && columnDef.tableData.filterValue[1]) || '') !== '' &&
                                    <IconButton className={classes.clearIcon} onClick={() => this.handleFilterNumericChange(columnDef, '', 1)}>
                                        <ClearIcon />
                                    </IconButton>
                                }
                                <Typography component='p' variant='body1' >
                                    ]
                                </Typography>
                            </InputAdornment>
                        )
                    }}
                />
            </>
        );
    }
    renderDefaultFilter = (columnDef: Column) => {
        const { classes } = this.props;

        return (
            <TextField
                autoFocus
                style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
                type={columnDef.type === 'numeric' ? 'number' : 'text'}
                value={columnDef.tableData.filterValue || ''}
                onChange={(event) => {
                    this.props.onFilterChanged(columnDef.tableData.id, event.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <></>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <>
                            {
                                (columnDef.tableData.filterValue || '') !== '' &&
                    <InputAdornment position='end' className={classes.endAdornment}>
                        <IconButton className={classes.clearIcon} onClick={() => this.props.onFilterChanged(columnDef.tableData.id, '')}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                            }
                        </>
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
                    renderInput={(params) => <TextField {...params} />}
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
                    renderInput={(params) => <TextField {...params} />}
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
                    renderInput={(params) => <TextField {...params} />}
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

    render() {
        const { columnDef, classes } = this.props;
        if (columnDef.filtering === false) {
            return null;
        }
        const popoverOpened = this.state.anchorEl !== null;
        return (
            <span title={this.getFilterTitle()} className={classes.filterIconWrapper}>
                <this.props.icons.Filter
                    className={(
                        columnDef.tableData.filterValue
                            ? classes.filterIconFilled
                            : (popoverOpened ? '' : 'empty-header-filter-button ') + classes.filterIconEmpty
                    )}
                    aria-owns={popoverOpened ? 'filter-popover' : undefined}
                    aria-haspopup='true'
                    variant='contained'
                    onClick={(event: MouseEvent<HTMLButtonElement>) => this.handleOpenPopoverButtonClick(event)}
                />
                <Popover
                    id='filter-popover'
                    open={popoverOpened}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={classes.filterBody}>
                        {this.renderFilterBody(columnDef)}
                    </div>
                </Popover>
            </span>
        );
    }
}

export const styles: Styles<any, any, string> = {
    clearIcon: {
        width: 22,
        height: 22,
        padding: 4,

        '& svg': {
            width: 16,
            height: 16
        }
    },
    filterIconWrapper: {
        width: 24,
        height: 24
    },
    filterIconFilled: {
        verticalAlign: 'middle',
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 1)'
    },
    filterIconEmpty: {
        verticalAlign: 'middle',
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.2)',
    },
    filterBody: {
        padding: 4
    },
    filterCheckbox: {
        padding: 12
    },
    filterList: {
        padding: '0'
    },
    filterListItem: {
        marginRight: 14
    },
    filterListFooter: {
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white'
    },
    filterListClearLink: {
        marginTop: 10,
        marginBottom: 10,
        cursor: 'pointer',
        display: 'block',
        textAlign: 'center',
        width: '100%',
    },
    filterText: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: '1.5em'
    },
    filterNumericFrom: {
        width: 80,
        marginRight: 5
    },
    filterNumericTo: {
        width: 80,
        marginLeft: 5
    },
    startAdornment: {
        marginRight: 0
    },
    endAdornment: {
        marginLeft: 0
    }
};

export default withStyles(styles)(MTableFilterButton);
