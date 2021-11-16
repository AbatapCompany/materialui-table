import React from 'react';
import Paper from '@mui/material/Paper';

export default (props: any): JSX.Element => {
    return (
        <Paper elevation={2} {...props}/>
    );
};
