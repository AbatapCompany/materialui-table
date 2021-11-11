import * as React from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TimePicker from '@mui/lab/TimePicker';
import PropTypes from 'prop-types';

class MTableEditField extends React.Component {
  getProps() {
    const { columnDef, rowData, onRowDataChange, ...props } = this.props;
    return props;
  }

  renderLookupField() {
    return (
      <Select
        {...this.getProps()}
        value={this.props.value === undefined ? '' : this.props.value}
        onChange={event => this.props.onChange(event.target.value)}
        style={{
          fontSize: 13,
        }}
      >
        {Object.keys(this.props.columnDef.lookup).map(key => (
          <MenuItem key={key} value={key}>{this.props.columnDef.lookup[key]}</MenuItem>)
        )}
      </Select>
    );

  }

  renderBooleanField() {
    return (
      <Checkbox
        {...this.getProps()}
        value={String(this.props.value)}
        checked={Boolean(this.props.value)}
        onChange={event => this.props.onChange(event.target.checked)}
        style={{
          paddingLeft: 0,
          paddingTop: 0,
          paddingBottom: 0
        }}
      />
    );
  }

  renderDateField() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          {...this.getProps()}
          format="dd.MM.yyyy"
          value={this.props.value || null}
          onChange={this.props.onChange}
          renderInput={(params) => <TextField {...params} />}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            }
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTimeField() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          {...this.getProps()}
          format="HH:mm:ss"
          value={this.props.value || null}
          onChange={this.props.onChange}
          renderInput={(params) => <TextField {...params} />}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            }
          }}
        />
      </LocalizationProvider>
    );
  }

  renderDateTimeField() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          {...this.getProps()}
          format="dd.MM.yyyy HH:mm:ss"
          value={this.props.value || null}
          onChange={this.props.onChange}
          renderInput={(params) => <TextField {...params} />}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            }
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTextField() {
    return (
      <TextField
        {...this.getProps()}
        style={this.props.columnDef.type === 'numeric' ? { float: 'right' } : {}}
        type={this.props.columnDef.type === 'numeric' ? 'number' : 'text'}
        placeholder={this.props.columnDef.title}
        value={this.props.value === undefined ? '' : this.props.value}
        onChange={event => this.props.onChange(event.target.value)}
        InputProps={{
          style: {
            fontSize: 13,
          }
        }}
      />
    );
  }

  renderCurrencyField() {
    return "ok";
  }

  render() {
    let component = "ok";

    if (this.props.columnDef.lookup) {
      component = this.renderLookupField();
    }
    else if (this.props.columnDef.type === "boolean") {
      component = this.renderBooleanField();
    }
    else if (this.props.columnDef.type === "date") {
      component = this.renderDateField();
    }
    else if (this.props.columnDef.type === "time") {
      component = this.renderTimeField();
    }
    else if (this.props.columnDef.type === "datetime") {
      component = this.renderDateTimeField();
    }
    else if (this.props.columnDef.type === "currency") {
      component = this.renderCurrencyField();
    }
    else {
      component = this.renderTextField();
    }

    return component;

  }
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired
};

export default MTableEditField;
