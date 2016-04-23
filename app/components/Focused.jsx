import React from 'react';
import { connect } from 'react-redux';
import { focus } from '../actions/ImgurActions';

class Focused extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37: // left
        if (this.props.prev) {
          this.props.setFocus(this.props.prev);
        }
        break;

      case 39: // right
        if (this.props.next) {
          this.props.setFocus(this.props.next);
        }
        break;

      default:
        // nothing
    }
  }

  render() {
    const {
      focused,
      clearFocus,
    } = this.props;

    const focusedStyle = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    const imgStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
    };

    return (
      <div style={focusedStyle} onClick={clearFocus}>
        {[<img key={focused.link} src={focused.link} style={imgStyle} />]}
      </div>
    );
  }
}

Focused.propTypes = {
  focused: React.PropTypes.object.isRequired,
  prev: React.PropTypes.string,
  next: React.PropTypes.string,
  clearFocus: React.PropTypes.func.isRequired,
  setFocus: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setFocus: (id) => dispatch(focus(id)),
  clearFocus: () => dispatch(focus(null)),
});

export default connect(null, mapDispatchToProps)(Focused);
