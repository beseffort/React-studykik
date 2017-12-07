import React from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import classNames from 'classnames';

class StudyStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(event) {
    event.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <div className={classNames('stats', { active: this.state.open })}>
        <div className="head">
          <h2>STATS</h2>
          <span className="opener" onClick={this.onToggle} />
        </div>
        <Collapse className="infoarea" in={this.state.open}>
          <div className="row">
            <div className="col-xs-4">
              <div className="box same-height-left" style={{ height: '103px ' }}>
                <i className="icomoon-open-eye" />
                <strong className="number">3,450</strong>
                <h3>TOTAL STUDY VIEWS</h3>
              </div>
              <div className="box same-height-left" style={{ height: '103px' }}>
                <i className="icomoon-user-in" />
                <strong className="number">685</strong>
                <h3>TOTAL PATIENT REFERRALS</h3>
              </div>
            </div>
            <div className="col-xs-4 green">
              <div className="box" style={{ height: '103px' }}>
                <i className="icomoon-phone" />
                <strong className="number">948</strong>
                <h3>CALLS PLACED</h3>
              </div>
              <div className="box" style={{ height: '103px' }}>
                <i className="icomoon-icon_clock_alt" />
                <strong className="number">32:41:15</strong>
                <h3>CALLS DURATION</h3>
              </div>
            </div>
            <div className="col-xs-4 orange">
              <div className="box same-height-right" style={{ height: '103px' }}>
                <i className="icomoon-chat-up" />
                <strong className="number">52,711</strong>
                <h3>TEXTS SENT</h3>
              </div>
              <div className="box same-height-right" style={{ height: '103px' }}>
                <i className="icomoon-chat-down" />
                <strong className="number">18,374</strong>
                <h3>TEXTS RECEIVED</h3>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default StudyStats;
