import React from 'react';
import { connect } from 'react-redux';
import { focus } from '../actions/ImgurActions';

const FlexGalleryImage = ({
  width,
  height,
  src,
  focusID,
}) => {
  const style = {
    height: 200,
    width: width / height * 200,
    background: `url(${src}) center no-repeat`,
    backgroundSize: 'cover',
    flex: 'auto',
  };
  return (
    <div style={style} onClick={focusID} />
  );
};

FlexGalleryImage.propTypes = {
  id: React.PropTypes.string.isRequired,
  src: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

const mapDispatchToProps = (dispatch, { id }) => ({
  focusID: () => dispatch(focus(id)),
});

export default connect(null, mapDispatchToProps)(FlexGalleryImage);
