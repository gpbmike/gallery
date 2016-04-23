import {
  IMGUR_FETCH_MANY_SUCCESS,
  IMGUR_FOCUS,
} from '../actions/ImgurActions';

const updateItems = (prevItems, items) => (
  Object.assign({}, prevItems, items.reduce((itemsObject, item) => (
    Object.assign({}, itemsObject, { [item.id]: item })
  ), {}))
);

const updateQueries = (prevQueries, query, updates) => {
  const queryKey = `${query.subreddit}/${query.sort}/${query.window}`;
  const prevItems = prevQueries[queryKey] && prevQueries[queryKey].items;
  const items = (prevItems || []).concat(updates.items);
  const uniqueItems = items.reduce((p, c) => {
    if (p.indexOf(c) < 0) {
      p.push(c);
    }
    return p;
  }, []);
  return Object.assign({}, prevQueries, {
    [queryKey]: {
      items: uniqueItems,
    },
  });
};

export const getQueryItems = (state, queryParams) => {
  const queryKey = `${queryParams.subreddit}/${queryParams.sort}/${queryParams.window}`;
  const query = state.queries[queryKey];
  if (!query) {
    return [];
  }
  return query.items.map((id) => state.items[id]);
};

const initialState = {
  items: {},
  queries: {},
  focus: null,
};

function imgurReducer(state = initialState, action) {
  switch (action.type) {
    case IMGUR_FETCH_MANY_SUCCESS:
      return Object.assign({}, state, {
        items: updateItems(state.items, action.items),
        queries: updateQueries(state.queries, action.query, {
          items: action.items.map((i) => i.id),
        }),
      });

    case IMGUR_FOCUS:
      return Object.assign({}, state, {
        focus: action.id,
      });

    default:
      return state;
  }
}

export default imgurReducer;
