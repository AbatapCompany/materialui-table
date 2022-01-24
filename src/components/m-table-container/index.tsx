import React from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';

export default (props: PaperProps): JSX.Element => {
    return (
        <Paper elevation={2} {...props}/>
    );
};
