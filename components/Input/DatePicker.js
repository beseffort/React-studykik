/**
*
* Input for react-select
*
*/

import React, { Component, PropTypes } from 'react';
import { Calendar } from 'react-date-range';
import { Modal } from 'react-bootstrap';
import CenteredModal from '../CenteredModal/index';

import moment from 'moment';
import _ from 'lodash';

export default class DatePicker extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    initialDate: PropTypes.object.isRequired,
    dateStyle: PropTypes.string,
  }

  static defaultProps = {
    dateStyle: 'MM/DD/YY',
  }

  constructor(props) {
    super(props);

    const { initialDate } = props;
    this.handleInit = this.handleInit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.navigateToday = this.navigateToday.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.state = {
      date: initialDate,
      modalVisible: false,
    };
  }

  componentWillMount() {
    this.handleInit(this.props.initialDate);
  }

  setToBeDetermined = () => {
    this.setState({
      date: null,
    });
    this.props.input.onBlur(null);
  }

  handleInit(date) {
    this.setState({
      date,
    });
    this.props.input.onBlur(date);
  }

  handleSelect(date) {
    this.toggleModal(false);
    this.setState({
      date,
    });
    this.props.input.onBlur(date);
  }

  navigateToday() {
    const today = moment();
    const todayYear = today.year();
    const todayMonth = today.month();
    const calendarYear = this.calendar.getShownDate().year();
    const calendarMonth = this.calendar.getShownDate().month();
    const monthDiff = ((todayYear - calendarYear) * 12) + (todayMonth - calendarMonth);

    this.calendar.changeMonth(monthDiff, { preventDefault: _.noop });
    this.handleSelect(today);
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { name, className, dateStyle, ...rest } = this.props;
    const { date, modalVisible } = this.state;

    const currentDate = moment();
    delete rest.input;
    delete rest.meta;
    delete rest.initialDate;
    const inputValue = (date === null) ? 'To Be Determined' : moment(date).format(dateStyle);
    const inputComponent = (
      <input
        type="text"
        name={name}
        readOnly
        value={inputValue}
        {...rest}
      />
    );
    const modalComponent = (
      <Modal
        className="datepicker-modal"
        dialogComponentClass={CenteredModal}
        show={modalVisible}
        onHide={() => {
          this.toggleModal(false);
        }}
        backdrop
        keyboard
      >
        <Modal.Header>
          <Modal.Title>Choose Start Date</Modal.Title>
          <a className="lightbox-close close" onClick={() => { this.toggleModal(false); }}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <Calendar
            date={date}
            onChange={this.handleSelect}
            className="calendar custom-calendar"
            ref={(calendar) => { this.calendar = calendar; }}
          />
          <div className="current-date" onClick={this.navigateToday}>
            Today: {currentDate.format('dddd, MMMM Do, YYYY')}
          </div>
          <div className="link-holder text-center">
            <a onClick={() => { this.setToBeDetermined(); this.toggleModal(false); }}>To Be Determined</a>
          </div>
        </Modal.Body>
      </Modal>
    );

    return (
      <div className={className} onClick={() => { this.toggleModal(true); }}>
        { inputComponent }
        { modalComponent }
      </div>
    );
  }
}
