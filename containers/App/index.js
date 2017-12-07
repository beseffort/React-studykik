/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SideNavBar from 'components/SideNavBar';
import TopHeaderBar from 'components/TopHeaderBar';
import LoadingSpinner from 'components/LoadingSpinner';
import GlobalNotifications from 'containers/GlobalNotifications';
import { fetchMeFromToken } from './actions';
import { selectAuthState, selectCurrentUser, selectEvents } from './selectors';

import './styles.less';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    isLoggedIn: React.PropTypes.bool,
    userDataFetched: React.PropTypes.object,
    pageEvents: React.PropTypes.any,
    fetchMeFromToken: React.PropTypes.func,
  };

  componentWillMount() {
    // Always load user details from the localStorage Token
    this.props.fetchMeFromToken();
  }

  componentWillReceiveProps() {}

  render() {
    const { isLoggedIn, userDataFetched, pageEvents } = this.props;

    if (!isLoggedIn) {
      return (
        <div className="container-fluid">
          {React.Children.toArray(this.props.children)}
        </div>
      );
    }

    if (!userDataFetched) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 text-center spinner-container">
              <LoadingSpinner showOnlyIcon />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="wrapper">
        <TopHeaderBar />
        <SideNavBar />

        <main id="main">
          {React.Children.toArray(this.props.children)}
        </main>
        <GlobalNotifications {...this.props} events={pageEvents} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectAuthState(),
  userDataFetched: selectCurrentUser(),
  pageEvents: selectEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchMeFromToken: () => dispatch(fetchMeFromToken()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
