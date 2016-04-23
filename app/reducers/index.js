import { combineReducers } from 'redux';
import images from './ImgurReducer';

const galleryApp = combineReducers({
  images,
});

export default galleryApp;
