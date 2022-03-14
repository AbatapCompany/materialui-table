import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Hidden from '@mui/material/Hidden';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';
import { MTablePaginationProps } from '../../models/m-table-pagination.models';
import { Theme } from '@mui/material';

class MTableSteppedPagination extends Component<MTablePaginationProps> {

    static defaultProps: Partial<MTablePaginationProps> = {
        localization: {
            previousTooltip: 'Previous Page',
            nextTooltip: 'Next Page',
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

    handleNumberButtonClick(number: number) {
        return () => {
            this.props.onPageChange(number);
        };
    }

    handleLastPageButtonClick = () => {
        this.props.onPageChange(Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
    }

    renderPagesButton(start: number, end: number) {
        const buttons = [];

        for (let p = start; p <= end; p++) {
            const buttonVariant = p === this.props.page ? 'contained' : undefined;
            buttons.push(
                <Button
                    size='small'
                    style={{
                        boxShadow: 'none',
                        maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'
                    }}
                    disabled={p === this.props.page}
                    variant={buttonVariant}
                    onClick={this.handleNumberButtonClick(p)}
                >
                    {p + 1}
                </Button>
            );
        }

        return (
            <span>
                {buttons}
            </span>
        );
    }

    render() {
        const { classes, count, page, rowsPerPage } = this.props;

        const localization = { ...MTableSteppedPagination.defaultProps.localization, ...this.props.localization };
        const maxPages = Math.ceil(count / rowsPerPage) - 1;

        const pageStart = Math.max(page - 1, 0);
        const pageEnd = Math.min(maxPages, page + 1);

        return (
            <div className={classes.root}>
                <Tooltip title={localization.previousTooltip}>
                    <span>
                        <IconButton
                            onClick={this.handleBackButtonClick}
                            disabled={page === 0}
                            aria-label={localization.previousAriaLabel}
                        >
                            <this.props.icons.PreviousPage />
                        </IconButton>
                    </span>
                </Tooltip>
                <Hidden smDown={true}>
                    {this.renderPagesButton(pageStart, pageEnd)}
                </Hidden>
                <Tooltip title={localization.nextTooltip}>
                    <span>
                        <IconButton
                            onClick={this.handleNextButtonClick}
                            disabled={page >= maxPages}
                            aria-label={localization.nextAriaLabel}
                        >
                            <this.props.icons.NextPage />
                        </IconButton>
                    </span>
                </Tooltip>
            </div>
        );
    }
}

const actionsStyles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5)
    }
});

const MTablePagination = withStyles(actionsStyles, { withTheme: true })(MTableSteppedPagination);

export default MTablePagination;
