import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import { MTablePaginationProps } from '../../models/m-table-pagination.models';
import { Theme } from '@mui/material';

class MTablePaginationInner extends Component<MTablePaginationProps> {
    static defaultProps: Partial<MTablePaginationProps> = {
        showFirstLastPageButtons: true,
        localization: {
            firstTooltip: 'First Page',
            previousTooltip: 'Previous Page',
            nextTooltip: 'Next Page',
            lastTooltip: 'Last Page',
            labelDisplayedRows: '{from}-{to} of {count}',
            labelRowsPerPage: 'Rows per page:'
        }
    }

    handleFirstPageButtonClick = () => {
        this.props.onPageChange(0);
    }

    handleBackButtonClick = () => {
        this.props.onPageChange(this.props.page - 1);
    }

    handleNextButtonClick = () => {
        this.props.onPageChange(this.props.page + 1);
    }

    handleLastPageButtonClick = () => {
        this.props.onPageChange(Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
    }

    render() {
        const { classes, count, page, rowsPerPage, theme, showFirstLastPageButtons } = this.props;
        const localization = { ...MTablePaginationInner.defaultProps.localization, ...this.props.localization };

        return (
            <div className={classes.root}>
                {showFirstLastPageButtons &&
                    <Tooltip title={localization.firstTooltip}>
                        <span>
                            <IconButton
                                onClick={this.handleFirstPageButtonClick}
                                disabled={page === 0}
                                aria-label={localization.firstAriaLabel}
                            >
                                {theme.direction === 'rtl' ? <this.props.icons.LastPage /> : <this.props.icons.FirstPage />}
                            </IconButton>
                        </span>
                    </Tooltip>
                }
                <Tooltip title={localization.previousTooltip}>
                    <span>
                        <IconButton
                            onClick={this.handleBackButtonClick}
                            disabled={page === 0}
                            aria-label={localization.previousAriaLabel}
                        >
                            {theme.direction === 'rtl' ? <this.props.icons.NextPage /> : <this.props.icons.PreviousPage />}
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography variant='caption' style={{ flex: 1, textAlign: 'center', alignSelf: 'center', flexBasis: 'inherit' }} >
                    {localization.labelDisplayedRows
                        .replace('{from}', String((this.props.page * this.props.rowsPerPage) + 1))
                        .replace('{to}', String(Math.min((this.props.page + 1) * this.props.rowsPerPage, this.props.count)))
                        .replace('{count}', String(this.props.count))
                    }
                </Typography>
                <Tooltip title={localization.nextTooltip}>
                    <span>
                        <IconButton
                            onClick={this.handleNextButtonClick}
                            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                            aria-label={localization.nextAriaLabel}
                        >
                            {theme.direction === 'rtl' ? <this.props.icons.PreviousPage /> : <this.props.icons.NextPage />}
                        </IconButton>
                    </span>
                </Tooltip>
                {showFirstLastPageButtons &&
                    <Tooltip title={localization.lastTooltip}>
                        <span>
                            <IconButton
                                onClick={this.handleLastPageButtonClick}
                                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                                aria-label={localization.lastAriaLabel}
                            >
                                {theme.direction === 'rtl' ? <this.props.icons.FirstPage /> : <this.props.icons.LastPage />}
                            </IconButton>
                        </span>
                    </Tooltip>
                }
            </div >
        );
    }
}

const actionsStyles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        display: 'flex',
    // lineHeight: '48px'
    }
});

const MTablePagination = withStyles(actionsStyles, { withTheme: true })(MTablePaginationInner);

export default MTablePagination;
