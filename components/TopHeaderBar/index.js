import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import Button from 'react-bootstrap/lib/Button';

import studykikLogo from 'assets/images/logo.svg';
import AddCreditsModal from 'components/AddCreditsModal';
import GlobalPMSModal from 'components/GlobalPMSModal';

import NotificationBox from './NotificationBox';
import AvatarMenu from './AvatarMenu';

import { fetchSitePatients, fetchClientCredits } from 'containers/App/actions';
import { logout } from 'containers/LoginPage/actions';

import {
  selectCurrentUser,
  selectSitePatients,
  selectClientCredits,
} from 'containers/App/selectors';

import { sumBy } from 'lodash';

class TopHeaderBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    currentUser: PropTypes.any,
    sitePatients: React.PropTypes.object,
    clientCredits: React.PropTypes.object,
    fetchSitePatients: React.PropTypes.func,
    fetchClientCredits: React.PropTypes.func,
    logout: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.showAddCreditsModal = this.showAddCreditsModal.bind(this);
    this.closeAddCreditsModal = this.closeAddCreditsModal.bind(this);
    this.showGlobalPMSModal = this.showGlobalPMSModal.bind(this);
    this.closeGlobalPMSModal = this.closeGlobalPMSModal.bind(this);

    this.state = {
      showAddCreditsModal: false,
      showGlobalPMSModal: false,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (!currentUser) {
      console.error('Something is wrong with session');
      return;
    }
    this.props.fetchSitePatients(currentUser.id);
    this.props.fetchClientCredits(currentUser.id);
  }

  handleLogoutClick() {
    this.props.logout();
  }

  showAddCreditsModal() {
    this.setState({ showAddCreditsModal: true });
  }

  closeAddCreditsModal() {
    this.setState({ showAddCreditsModal: false });
  }

  showGlobalPMSModal() {
    this.setState({ showGlobalPMSModal: true });
  }

  closeGlobalPMSModal() {
    this.setState({ showGlobalPMSModal: false });
  }

  render() {
    const unreadMessagesCount = sumBy(this.props.sitePatients.details, (item) => parseInt(item.count_unread ? item.count_unread : 0));
    const credits = this.props.clientCredits.details.customerCredits || 0;
    return (
      <header id="header">
        <div className="container-fluid">

          <h1 className="logo pull-left"><Link to="/"><img src={studykikLogo} width="214" height="31" alt="logo" /></Link></h1>

          <NotificationBox currentUser={this.props.currentUser} />

          <div className="emails pull-left">
            <a className="opener" data-toggle="tooltip" data-placement="bottom" title="Coming Soon">
              <i className="icomoon-envelop" />
              <span className="counter">1</span>
            </a>
          </div>

          <div className="open-close help-drop pull-left">
            <a className="link-help pull-left opener">?</a>
          </div>

          <a
            className={classNames('opener pull-left btn-chat-popup', { active: this.state.showGlobalPMSModal })}
            onClick={this.showGlobalPMSModal}
          >
            {unreadMessagesCount > 0
              ? <span className="counter">{unreadMessagesCount}</span>
              : ''
            }
            <i className="icomoon-credit" />
          </a>

          <div className="get-credits pull-left">
            <span>{credits} Credits</span>
            <Button onClick={this.showAddCreditsModal}>+ ADD CREDITS</Button>
          </div>

          <AvatarMenu handleLogoutClick={this.handleLogoutClick} currentUser={this.props.currentUser} />

        </div>
        <AddCreditsModal
          currentUser={this.props.currentUser}
          showModal={this.state.showAddCreditsModal}
          closeModal={this.closeAddCreditsModal}
        />
        <GlobalPMSModal
          showModal={this.state.showGlobalPMSModal}
          closeModal={this.closeGlobalPMSModal}
        />
      </header>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  sitePatients: selectSitePatients(),
  clientCredits: selectClientCredits(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchSitePatients: (userId) => dispatch(fetchSitePatients(userId)),
    fetchClientCredits: (userId) => dispatch(fetchClientCredits(userId)),
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeaderBar);
