import React from 'react';
import appHistory from '../history';
import { fetchMany } from '../actions/ImgurActions';
import { getQueryItems } from '../reducers/ImgurReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlexGallery from '../components/FlexGallery';
import Focused from '../components/Focused';

const subreddits = [
  'EarthPorn',
  'BotanicalPorn',
  'WaterPorn',
];

const sorts = [
  'latest',
  'top',
];

const windows = [
  'day',
  'week',
  'month',
  'year',
  'all',
];

class Imgur extends React.Component {

  static propTypes = {
    sort: React.PropTypes.oneOf(sorts).isRequired,
    subreddit: React.PropTypes.string.isRequired,
    window: React.PropTypes.oneOf(windows).isRequired,
    page: React.PropTypes.number.isRequired,
    fetchMany: React.PropTypes.func.isRequired,
    items: React.PropTypes.array.isRequired,
    focused: React.PropTypes.object,
    prevFocus: React.PropTypes.string,
    nextFocus: React.PropTypes.string,
  };

  defaultProps = {
    sort: 'latest',
    subreddit: 'EarthPorn',
    window: 'week',
    page: 1,
  };

  componentDidMount() {
    this.fetchGallery(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.fetchGallery(nextProps);
    }
  }

  setSubreddit = (event) => {
    this.transition({
      subreddit: event.target.value,
      sort: this.props.sort,
      window: this.props.window,
    });
  };

  setSort = (event) => {
    this.transition({
      subreddit: this.props.subreddit,
      sort: event.target.value,
    });
  };

  setWindow = (event) => {
    this.transition({
      subreddit: this.props.subreddit,
      sort: this.props.sort,
      window: event.target.value,
    });
  };

  transition(params) {
    this.page = 1;
    let path = '/';
    if (params.subreddit) {
      path = path.concat(`${params.subreddit}`);
      if (params.sort) {
        path = path.concat(`/${params.sort}`);
        if (params.window) {
          path = path.concat(`/${params.window}`);
        }
      }
    }
    appHistory.push(path);
  }

  fetchGallery(props) {
    this.props.fetchMany(props);
  }

  handleTextInput = (event) => {
    if (event.keyCode === 13) {
      this.transition({
        subreddit: event.target.value,
        sort: this.props.sort,
        window: this.props.window,
      });
    }
  };

  handleEnd() {
    this.fetchGallery(this.props);
  }

  render() {
    const navStyle = {
      position: 'fixed',
      top: 0,
      height: 25,
    };

    const wrapStyle = {
      marginTop: 25,
    };

    return (
      <div style={wrapStyle}>
        <nav style={navStyle}>
          <input onKeyDown={this.handleTextInput} placeholder="subreddit eg: pics" ref="input" />
          <select defaultValue={this.props.subreddit} onChange={this.setSubreddit}>
            {subreddits.map((subreddit) => (
              <option key={subreddit} value={subreddit}>{subreddit}</option>
            ))}
          </select>
          <select defaultValue={this.props.sort} onChange={this.setSort}>
            {sorts.map((sort) => (
              <option key={sort} value={sort} value={sort}>{sort}</option>
            ))}
          </select>
          {this.props.sort === 'top' && (
            <select defaultValue={this.props.window} onChange={this.setWindow}>
              {windows.map((window) => (
                <option key={window} value={window}>{window}</option>
              ))}
            </select>
          )}
        </nav>
        <FlexGallery items={this.props.items} onEnd={this.handleEnd} />
        {this.props.focused && (
          <Focused
            focused={this.props.focused}
            prev={this.props.prevFocus}
            next={this.props.nextFocus}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = getQueryItems(state.images, ownProps);

  const itemKeys = items.map(({ id }) => id);
  const focused = state.images.items[state.images.focus];
  const focusedIndex = focused && itemKeys.indexOf(state.images.focus);
  const prevFocus = !!~focusedIndex && focusedIndex > 0
    ? itemKeys[focusedIndex - 1]
    : null;
  const nextFocus = !!~focusedIndex && focusedIndex + 1 < itemKeys.length
    ? itemKeys[focusedIndex + 1]
    : null;

  return {
    items,
    focused,
    prevFocus,
    nextFocus,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchMany,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Imgur);
