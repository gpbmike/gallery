import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";
import BaseStore from "./base";

let subreddits = [
  "EarthPorn",
  "BotanicalPorn",
  "WaterPorn",
  "MilitaryPorn"
];

let sorts = [
  "latest",
  "top"
];

let windows = [
  "day",
  "week",
  "month",
  "year",
  "all"
];

let items = [];

let ImgurStore = Object.assign({}, BaseStore, {
  getItems: function(subreddit, options = {}) {
    return items[`${subreddit}/${options.sort}/${options.window}`];
  },
  getSubreddits: function() {
    return subreddits;
  },
  getSorts: function() {
    return sorts;
  },
  getWindows: function() {
    return windows;
  }
});

function parseImgur(results) {
  return results.data.map(function(child) {
    // Let's just handle static images for now, not gifs
    if (/^image\/(jpeg|png)/.test(child.type)) {
      let linkParts = child.link.split(".");
      linkParts[linkParts.length - 2] += "l";
      return {
        original: child.link,
        thumbnail: linkParts.join("."),
        data: child
      };
    } else {
      console.log(`Missing ${child.type} support.`);
    }
  }).filter(function(url) {
    return !!url;
  });
}

function fetchSubreddit(subreddit, options) {

  let itemsKey = `${subreddit}/${options.sort}/${options.window}`;

  let url = `https://api.imgur.com/3/gallery/r/${itemsKey}`;

  if (options.page > 1) {
    url += `/${options.page}`;
  }

  fetch(url, {
    headers: {
      "Authorization": "Client-ID e4df882d90e3ac2"
    }
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    if (options.page > 1) {
      items[itemsKey] = items[itemsKey].concat(parseImgur(json));
    } else {
      items[itemsKey] = parseImgur(json);
    }
    ImgurStore.emitChange();
  }).catch(function(ex) {
    console.log("parsing failed", ex);
  });

}

ImgurStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.IMGUR_FETCH:
      fetchSubreddit(action.data.subreddit, action.data.options);
      break;
  }
});

export default ImgurStore;
