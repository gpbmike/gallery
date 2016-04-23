import React from 'react';
import FlexGalleryImage from './FlexGalleryImage';

const galleryStyle = {
  display: 'flex',
  flexWrap: 'wrap',
};

const FlexGallery = ({
  items,
}) => (
  <div style={galleryStyle}>
    {items.map((item) => (
      <FlexGalleryImage
        key={item.id}
        id={item.id}
        src={item.thumbnail}
        width={item.width}
        height={item.height}
      />
    ))}
  </div>
);

FlexGallery.propTypes = {
  items: React.PropTypes.array.isRequired,
};

FlexGallery.defaultProps = {
  items: [],
};

export default FlexGallery;
