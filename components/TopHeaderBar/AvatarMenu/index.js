import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import enhanceWithClickOutside from 'react-click-outside';

import './styles.less';

import defaultImage from 'assets/images/Default-User-Img-Dr.png';

class AvatarMenu extends React.Component {
  static propTypes = {
    handleLogoutClick: PropTypes.func.isRequired,
    currentUser: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      avatarMenuOpen: false,
    };
    this.toggleAvatarMenuHandle = this.toggleAvatarMenuHandle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleAvatarMenuHandle() {
    this.setState({
      avatarMenuOpen: !this.state.avatarMenuOpen,
    });
  }

  handleClickOutside() {
    this.setState({ avatarMenuOpen: false });
  }

  render() {
    const avatarMenuClassName = this.state.avatarMenuOpen ? 'avatar-menu-open' : 'avatar-menu-close';

    return (
      <div className="logged-user-area open-close pull-right">
        <a className={classNames('opener', { active: this.state.avatarMenuOpen })} onClick={this.toggleAvatarMenuHandle}>
          <div className="img-circle">
            <img src={this.props.currentUser.profileImageURL || defaultImage} width="43" height="43" alt="Bruce Wayne" />
          </div>
          <span className="text margin-left-5px margin-right-5px">Bruce Wayne</span>
          <i className="caret" />
        </a>
        <div className={`logged-user-drop avatar-menu ${avatarMenuClassName}`}>
          <div className="well">
            <ul className="list-unstyled">
              <li><Link to="/me/profile" onClick={() => this.handleClickOutside()}>PROFILE</Link></li>
              <li><Link to="/payment-information" onClick={() => this.handleClickOutside()}>PAYMENT INFORMATION</Link></li>
              <li><Link to="/receipts" onClick={() => this.handleClickOutside()}>RECEIPTS</Link></li>
              <li><Link to="/proposals" onClick={() => this.handleClickOutside()}>PROPOSALS</Link></li>
              <a
                onClick={() => {
                  this.props.handleLogoutClick();
                  this.handleClickOutside();
                }}
              >
                LOG OUT
              </a>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default enhanceWithClickOutside(AvatarMenu);
