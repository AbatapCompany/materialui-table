import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Hidden from '@mui/material/Hidden';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';

class MTablePaginationInner extends Component<any, any> {
    static defaultProps: any = {
        localization: {
            previousTooltip: 'Previous Page',
            nextTooltip: 'Next Page',
            labelDisplayedRows: '{from}-{to} of {count}',
            labelRowsPerPage: 'Rows per page:'
        }
    }
    handleFirstPageButtonClick(event: any) {
        this.props.onPageChange(event, 0);
    }

    handleBackButtonClick(event: any) {
        this.props.onPageChange(event, this.props.page - 1);
    }

    handleNextButtonClick(event: any) {
        this.props.onPageChange(event, this.props.page + 1);
    }

    handleNumberButtonClick(number: any) {
        return (event: any) => {
            this.props.onPageChange(event, number);
        };
    }

    handleLastPageButtonClick(event: any) {
        this.props.onPageChange(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
        );
    }

    renderPagesButton(start: any, end: any) {
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

        return <span>{buttons}</span>;
    }

    render() {
        const { classes, count, page, rowsPerPage } = this.props;

        const localization = { ...MTablePaginationInner.defaultProps.localization, ...this.props.localization };
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

const actionsStyles = (theme: any) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5)
    }
});

const MTablePagination = withStyles(actionsStyles, { withTheme: true })(MTablePaginationInner);

export default MTablePagination;
