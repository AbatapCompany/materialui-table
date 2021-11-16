import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { StyleRules, withStyles } from '@mui/styles';
import omit from 'lodash/omit';

class MTableBodyRow extends Component<any> {
    renderColumns() {
        const mapArr = this.props.columns
            .filter((columnDef: any) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1))
            .sort((a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder)
            .map((columnDef: any, index: number) => {
                const value = this.props.getFieldValue(this.props.data, columnDef);
                return (
                    <this.props.components.Cell
                        strictDigits={this.props.options.strictDigits}
                        icons={this.props.icons}
                        isFixed={index < this.props.options.fixedColumns}
                        columnDef={columnDef}
                        value={value}
                        key={
                            'cell-' + String(this.props.data.tableData.di) + '-' + String(columnDef.tableData.id)
                        }
                        rowData={this.props.data}
                        sorting={!!this.props.options.sorting}
                        datetimeLocaleString={this.props.options.datetimeLocaleString}
                        headerFiltering={this.props.options.filtering && this.props.options.filterType === 'header'}
                    />
                );
            });
        return mapArr;
    }

    renderActions() {
        const actions = this.props.actions.filter((a: any) => !a.isFreeAction && !this.props.options.selection);
        const cellClassName = this.props.options.fixedColumns ? 'cell-fixed' : '';

        return (
            <TableCell padding='none' key='key-actions-column' style={{ width: 42 * actions.length, padding: '0px 5px', ...this.props.options.actionsCellStyle }} className={cellClassName}>
                <div style={{ display: 'flex' }}>
                    <this.props.components.Actions data={this.props.data} actions={actions} components={this.props.components} />
                </div>
            </TableCell>
        );
    }
    renderSelectionColumn() {
        let checkboxProps = this.props.options.selectionProps || {};
        if (typeof checkboxProps === 'function') {
            checkboxProps = checkboxProps(this.props.data);
        }
        const cellClassName = this.props.options.fixedColumns ? 'cell-fixed' : '';

        return (
            <TableCell
                className={cellClassName}
                style={{ width: 42 + (9 * (this.props.treeDataMaxLevel - 1)) }}
                padding='none'
                key='key-selection-column'
            >
                <Checkbox
                    checked={this.props.data.tableData.checked === true}
                    onClick={(e) => e.stopPropagation()}
                    value={this.props.data.tableData.id.toString()}
                    onChange={(event) => this.props.onRowSelected(event, this.props.path, this.props.data)}
                    style={{
                        paddingLeft: 9 + (this.props.level * 9)
                    }}
                    {...checkboxProps}
                />
            </TableCell>
        );
    }

    rotateIconStyle(isOpen: boolean) {
        return {
            transform: isOpen ? 'rotate(90deg)' : 'none'
        };
    }

    renderDetailPanelColumn() {

        const CustomIcon = (props: any) => typeof props.icon === 'string'
            ? <Icon style={props.style}>{props.icon}</Icon>
            : React.createElement(props.icon, { style: props.style });
        const cellClassName = this.props.options.detailPanelColumnAlignment === 'left' && this.props.options.fixedColumns
            ? 'cell-fixed'
            : '';

        if (typeof this.props.detailPanel === 'function') {
            return (
                <TableCell padding='none' key='key-detail-panel-column' style={{ width: 42, textAlign: 'center' }} className={cellClassName}>
                    <IconButton
                        style={{ transition: 'all ease 200ms', ...this.rotateIconStyle(this.props.data.tableData.showDetailPanel) }}
                        onClick={(event) => {
                            this.props.onToggleDetailPanel(this.props.path, this.props.detailPanel);
                            event.stopPropagation();
                        }}
                    >
                        <this.props.icons.DetailPanel />
                    </IconButton>
                </TableCell>
            );
        }
        else {
            return (
                <TableCell padding='none' key='key-detail-panel-column'>
                    <div style={{ width: 42 * this.props.detailPanel.length, textAlign: 'center', display: 'inline-block' }}>
                        {this.props.detailPanel.map((panel: any, index: number) => {

                            if (typeof panel === 'function') {
                                panel = panel(this.props.data);
                            }

                            const isOpen = (this.props.data.tableData.showDetailPanel || '').toString() === panel.render.toString();

                            let iconButton = <this.props.icons.DetailPanel />;
                            let animation = true;
                            if (isOpen) {
                                if (panel.openIcon) {
                                    iconButton = <CustomIcon icon={panel.openIcon} />;
                                    animation = false;
                                }
                                else if (panel.icon) {
                                    iconButton = <CustomIcon icon={panel.icon} />;
                                }
                            }
                            else if (panel.icon) {
                                iconButton = <CustomIcon icon={panel.icon} />;
                                animation = false;
                            }

                            iconButton = (
                                <IconButton
                                    key={`key-detail-panel-${index}`}
                                    style={{ transition: 'all ease 200ms', ...this.rotateIconStyle(animation && isOpen) }}
                                    disabled={panel.disabled}
                                    onClick={(event) => {
                                        this.props.onToggleDetailPanel(this.props.path, panel.render);
                                        event.stopPropagation();
                                    }}
                                >
                                    {iconButton}
                                </IconButton>);

                            if (panel.tooltip) {
                                iconButton = <Tooltip key={`key-detail-panel-${index}`} title={panel.tooltip}>{iconButton}</Tooltip>;
                            }

                            return iconButton;
                        })}
                    </div>
                </TableCell>
            );
        }
    }

    getStyle(index: number) {
        let style = {
            transition: 'all ease 300ms',
            cursor: 'default',
            opacity: 1,
        };

        if (typeof this.props.options.rowStyle === 'function') {
            style = {
                ...style,
                ...this.props.options.rowStyle(this.props.data, index)
            };
        }
        else if (this.props.options.rowStyle) {
            style = {
                ...style,
                ...this.props.options.rowStyle
            };
        }

        if (this.props.onRowClick) {
            style.cursor = 'pointer';
        }

        if (this.props.hasAnyEditingRow) {
            style.opacity = 0.2;
        }

        return style;
    }

    getClassName(index: number) {
        let className = '';
        if (typeof this.props.options.rowClassName === 'function') {
            className = this.props.options.rowClassName(this.props.data, index);
        } else if (this.props.options.rowClassName) {
            className = this.props.options.rowClassName;
        }
        return className;
    }

    render() {
        const cellClassName = this.props.options.fixedColumns ? 'cell-fixed' : '';
        const renderColumns = this.renderColumns();
        if (this.props.options.selection) {
            renderColumns.splice(0, 0, this.renderSelectionColumn());
        }
        if (this.props.actions && this.props.actions.filter((a: any) => !a.isFreeAction && !this.props.options.selection).length > 0) {
            if (this.props.options.actionsColumnIndex === -1) {
                renderColumns.push(this.renderActions());
            } else if (this.props.options.actionsColumnIndex >= 0) {
                let endPos = 0;
                if (this.props.options.selection) {
                    endPos = 1;
                }
                renderColumns.splice(this.props.options.actionsColumnIndex as number + endPos, 0, this.renderActions());
            }
        }

        if (this.props.isTreeData) {
            if (this.props.data.tableData.childRows && this.props.data.tableData.childRows.length > 0) {
                renderColumns.splice(0, 0, (
                    <TableCell padding='none' key={'key-tree-data-column'} style={{ width: 48 + (9 * (this.props.treeDataMaxLevel - 2)) }} className={cellClassName}>
                        <IconButton
                            style={{
                                transition: 'all ease 200ms',
                                marginLeft: this.props.level * 9,
                                ...this.rotateIconStyle(this.props.data.tableData.isTreeExpanded)
                            }}
                            onClick={(event) => {
                                this.props.onTreeExpandChanged(this.props.path, this.props.data);
                                event.stopPropagation();
                            }}
                        >
                            <this.props.icons.DetailPanel />
                        </IconButton>
                    </TableCell>
                ));
            }
            else {
                renderColumns.splice(0, 0, <TableCell padding='none' key={'key-tree-data-column'} className={cellClassName}/>);
            }
        }

        // Lastly we add detail panel icon
        if (this.props.detailPanel) {
            if (this.props.options.detailPanelColumnAlignment === 'right') {
                renderColumns.push(this.renderDetailPanelColumn());
            }
            else {
                renderColumns.splice(0, 0, this.renderDetailPanelColumn());
            }
        }

        this.props.columns
            .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
            .forEach((columnDef: any) => {
                renderColumns.splice(0, 0, <TableCell padding='none' key={'key-group-cell' + String(columnDef.tableData.id)} className={cellClassName} />);
            });

        const {
            detailPanel,
            onRowClick,
            onToggleDetailPanel,
            onEditingCanceled,
            onEditingApproved,
            hasAnyEditingRow,
            treeDataMaxLevel,
            ...rowProps
        } = omit(this.props, [
            'icons',
            'data',
            'columns',
            'columns',
            'components',
            'getFieldValue',
            'isTreeData',
            'onRowSelected',
            'onTreeExpandChanged',
            'options',
        ]);

        return (
            <>
                <TableRow
                    selected={hasAnyEditingRow}
                    {...rowProps}
                    hover={!!onRowClick}
                    style={this.getStyle(this.props.index)}
                    className={this.getClassName(this.props.index)}
                    onClick={(event) => {
                        if (typeof onRowClick === 'function') {
                            onRowClick(event, this.props.data, (panelIndex: number) => {
                                let panel = detailPanel;
                                if (Array.isArray(panel)) {
                                    panel = panel[panelIndex || 0].render;
                                }

                                onToggleDetailPanel(this.props.path, panel);
                            });
                        }
                    }}
                >
                    {renderColumns}
                </TableRow>
                {this.props.data.tableData.childRows && this.props.data.tableData.isTreeExpanded &&
          this.props.data.tableData.childRows.map((data: any, index: number) => {
              if (data.tableData.editing) {
                  return (
                      <this.props.components.EditRow
                          columns={this.props.columns.filter((columnDef: any) => !columnDef.hidden)}
                          components={this.props.components}
                          data={data}
                          icons={this.props.icons}
                          localization={this.props.localization}
                          key={index}
                          mode={data.tableData.editing}
                          options={this.props.options}
                          isTreeData={this.props.isTreeData}
                          detailPanel={this.props.detailPanel}
                          onEditingCanceled={onEditingCanceled}
                          onEditingApproved={onEditingApproved}
                      />
                  );
              }
              else {
                  return (
                      <this.props.components.Row
                          {...this.props}
                          data={data}
                          index={index}
                          key={index}
                          level={this.props.level as number + 1}
                          path={[...this.props.path, index]}
                          onEditingCanceled={onEditingCanceled}
                          onEditingApproved={onEditingApproved}
                          hasAnyEditingRow={this.props.hasAnyEditingRow}
                          treeDataMaxLevel={treeDataMaxLevel}
                      />
                  );
              }
          })
                }
                {this.props.data.tableData && this.props.data.tableData.showDetailPanel &&
          <TableRow
          // selected={this.props.index % 2 === 0}
          >
              <TableCell colSpan={renderColumns.length} padding='none'>
                  {this.props.data.tableData.showDetailPanel(this.props.data)}
              </TableCell>
          </TableRow>
                }
            </>
        );
    }
}

export const styles = (theme: any): StyleRules => ({
    '@global': {
        'tr.MuiTableRow-root': {
            backgroundColor: theme.palette.background.paper, // Change according to theme,
        },
        'tr.MuiTableRow-root.Mui-selected': {
            backgroundColor: theme.palette.background.paper, // Change according to theme,
        }
    }
});

export default withStyles(styles)(MTableBodyRow);
