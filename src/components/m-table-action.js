import * as React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

class MTableAction extends React.Component {
  render() {
    let action = this.props.action;
    if (typeof action === 'function') {
      action = action(this.props.data);
      if (!action) {
        return null;
      }
    }

    if(action.hidden) {
      return null;
    }

    const handleOnClick = event => {
      if (action.onClick) {
        action.onClick(event, this.props.data);
        event.stopPropagation();
      }
    };

    const button = (
      <span>
        <IconButton
          disabled={action.disabled}
          onClick={(event) => handleOnClick(event)}
        >
          {typeof action.icon === "string" ? (
            <Icon {...action.iconProps} fontSize="small">{action.icon}</Icon>
          ) : (
              <action.icon
                {...action.iconProps}
                disabled={action.disabled}
              />
            )
          }
        </IconButton>
      </span>
    );

    if (action.tooltip) {
      return <Tooltip title={action.tooltip}>{button}</Tooltip>;
    } else {
      return button;
    }
  }
}

MTableAction.defaultProps = {
  action: {},
  data: {}
};

MTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

export default MTableAction;
