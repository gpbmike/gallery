import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import appHistory from './history';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import galleryApp from './reducers';

import App from './routes/app';
import Index from './routes/index';

const store = createStore(galleryApp, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

ReactDOM.render((
	<Provider store={store}>
		<Router history={appHistory}>
			<Route component={App}>
				<Route component={Index} path="/(:subreddit)(/:sort)(/:window)"/>
			</Route>
		</Router>
	</Provider>
), document.getElementById('gallery'));
