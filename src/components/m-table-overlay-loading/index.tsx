import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import { MTableOverlayLoadingProps } from './model';

export default function(props: MTableOverlayLoadingProps): JSX.Element {
    return (
        <div style={{ display: 'table', width: '100%', height: '100%', backgroundColor: alpha(props.theme.palette.background.paper, 0.7) }}>
            <div style={{ display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
                <CircularProgress />
            </div>
        </div>
    );
}
