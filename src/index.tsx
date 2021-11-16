import React from 'react';
import MaterialTable from './material-table';
import { withStyles } from '@mui/styles';
// import { MaterialTableProps } from 'models/matrial-table.model';

const styles = () => ({
    paginationRoot: {
        width: '100%'
    },
    paginationToolbar: {
        padding: 0,
        width: '100%'
    },
    paginationCaption: {
        display: 'none'
    },
    paginationSelectRoot: {
        margin: 0
    },
    '@global': {
        '.MuiTableCell-body.cell-fixed': {
            backgroundColor: 'inherit', // theme.palette.background.paper,
            position: 'sticky',
            zIndex: 1
        },
        '.MuiTableCell-head.cell-fixed, .MuiTableCell-footer.cell-fixed': {
            zIndex: 11,
            position: 'sticky',
        },
        'tfoot.MuiTableFooter-root td': {
            border: 'none'
        },
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            /* display: none; <- Crashes Chrome on hover */
            WebkitAppearance: 'none',
            margin: 0, /* <-- Apparently some margin are still there even though it's hidden */
        },
        'input[type=number]': {
            MozAppearance: 'textfield', /* Firefox */
        }
    }
});


export default withStyles(styles, { withTheme: true })((props: any) => <MaterialTable {...props} ref={props.tableRef} />);
export * from './components';
