export const IMGUR_FETCH_MANY = 'IMGUR_FETCH_MANY';
export const IMGUR_FETCH_MANY_SUCCESS = 'IMGUR_FETCH_MANY_SUCCESS';
export const IMGUR_FETCH_MANY_FAILURE = 'IMGUR_FETCH_MANY_FAILURE';
export const IMGUR_FOCUS = 'IMGUR_FOCUS';

export function fetchManySuccess(allItems, query) {
  const items = allItems.map((item) => {
    // We need a width and height
    if (!item.width || !item.height) {
      return undefined;
    }

    // Only handle static images
    if (/^image\/(jpeg|png)/.test(item.type)) {
      const linkParts = item.link.split('.');
      linkParts[linkParts.length - 2] += 'l';
      return Object.assign({}, item, { thumbnail: linkParts.join('.') });
    }
    return undefined;
  }).filter((item) => !!item);
  return {
    type: IMGUR_FETCH_MANY_SUCCESS,
    items,
    query,
  };
}

export function fetchManyFailure(error, query) {
  return {
    type: IMGUR_FETCH_MANY_FAILURE,
    query,
    error,
  };
}

export function fetchMany(query) {
  return (dispatch) => {
    dispatch({
      type: IMGUR_FETCH_MANY,
      query,
    });

    const itemsKey = `${query.subreddit}/${query.sort}/${query.window}/${query.page}`;

    const url = `https://api.imgur.com/3/gallery/r/${itemsKey}`;

    return fetch(url, {
      headers: {
        Authorization: 'Client-ID e4df882d90e3ac2',
      },
    })
      .then((response) => response.json())
      .then(({ data }) => dispatch(fetchManySuccess(data, query)))
      .catch((error) => dispatch(fetchManyFailure(error, query)));
  };
}

export function focus(id) {
  return {
    type: IMGUR_FOCUS,
    id,
  };
}
