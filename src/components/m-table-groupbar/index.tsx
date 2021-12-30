import React, { Component, CSSProperties } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MTableGroupbarProps } from './models';

export default class MTableGroupbar extends Component<MTableGroupbarProps> {

    getItemStyle(_isDragging: boolean, draggableStyle: CSSProperties): CSSProperties {
        return {
            // some basic styles to make the items look a bit nicer
            userSelect: 'none',
            // padding: '8px 16px',
            margin: `0 ${8}px 0 0`,

            // change background colour if dragging
            // background: isDragging ? 'lightgreen' : 'grey',

            // styles we need to apply on draggables
            ...draggableStyle,
        };
    }

    getListStyle(): CSSProperties {
        return {
            // background: isDraggingOver ? 'lightblue' : '#0000000a',
            background: '#0000000a',
            display: 'flex',
            width: '100%',
            padding: 8,
            overflow: 'auto',
            border: '1px solid #ccc',
            borderStyle: 'dashed'
        };
    }

    render() {
        return (
            <Toolbar style={{ padding: 0, minHeight: 'unset' }}>
                <Droppable droppableId='groups' direction='horizontal'>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle()}
                        >
                            {this.props.groupColumns.length > 0 &&
                                <Typography variant='caption' style={{ padding: 8 }}>
                                    {this.props.localization.groupedBy}
                                </Typography>
                            }
                            {this.props.groupColumns.map((columnDef, index) => {
                                return (
                                    <Draggable
                                        key={columnDef.tableData.id}
                                        draggableId={columnDef.tableData.id.toString()}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                <Chip
                                                    {...provided.dragHandleProps}
                                                    onClick={() => this.props.onSortChanged(columnDef)}
                                                    label={
                                                        <div>
                                                            <div style={{ float: 'left' }}>{columnDef.title}</div>
                                                            {columnDef.tableData.groupSort &&
                                                                <this.props.icons.SortArrow
                                                                    style={{
                                                                        transition: '300ms ease all',
                                                                        transform: columnDef.tableData.groupSort === 'desc' ? 'rotate(-180deg)' : 'none',
                                                                        fontSize: 18
                                                                    }}
                                                                />
                                                            }
                                                        </div>
                                                    }
                                                    style={{ boxShadow: 'none', textTransform: 'none' }}
                                                    onDelete={() => this.props.onGroupRemoved(columnDef, index)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {this.props.groupColumns.length === 0 &&
                                <Typography variant='caption' style={{ padding: 8 }}>
                                    {this.props.localization.placeholder}
                                </Typography>
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Toolbar>
        );
    }
}
