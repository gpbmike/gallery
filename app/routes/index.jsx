import React from 'react';
import DocumentTitle from 'react-document-title';

import Imgur from '../components/imgur';

const IndexRoute = ({
  params: {
    subreddit = 'EarthPorn',
    sort = 'latest',
    window = 'week',
    page = 1,
  },
}) => (
  <DocumentTitle title="Gallery Thing">
    <Imgur subreddit={subreddit} sort={sort} window={window} page={page}/>
  </DocumentTitle>
);

export default IndexRoute;
