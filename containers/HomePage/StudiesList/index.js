import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Modal } from 'react-bootstrap';
import _, { countBy, find, filter, sumBy } from 'lodash';
import { touch } from 'redux-form';

import CenteredModal from '../../../components/CenteredModal/index';
import { fetchLevels } from 'containers/App/actions';
import { selectCurrentUser, selectStudyLevels, selectCurrentUserStripeCustomerId, selectSitePatients } from 'containers/App/selectors';
import { CAMPAIGN_LENGTH_LIST, MESSAGING_SUITE_PRICE, CALL_TRACKING_PRICE } from 'common/constants';
import { selectStudies, selectSelectedIndicationLevelPrice, selectRenewedStudy,
  selectUpgradedStudy, selectEditedStudy, selectPaginationOptions } from 'containers/HomePage/selectors';
import { ACTIVE_STATUS_VALUE, INACTIVE_STATUS_VALUE } from 'containers/HomePage/constants';
import { fetchIndicationLevelPrice, clearIndicationLevelPrice, renewStudy, upgradeStudy, editStudy, setActiveSort, sortSuccess } from 'containers/HomePage/actions';
import { selectRenewStudyFormValues, selectRenewStudyFormError } from 'containers/HomePage/RenewStudyForm/selectors';
import { selectUpgradeStudyFormValues, selectUpgradeStudyFormError } from 'containers/HomePage/UpgradeStudyForm/selectors';
import StudyItem from './StudyItem';
import RenewStudyForm from 'containers/HomePage/RenewStudyForm';
import UpgradeStudyForm from 'containers/HomePage/UpgradeStudyForm';
import EditStudyForm from 'containers/HomePage/EditStudyForm';
import ShoppingCartForm from 'components/ShoppingCartForm';
import { selectShoppingCartFormError, selectShoppingCartFormValues } from 'components/ShoppingCartForm/selectors';
import { shoppingCartFields } from 'components/ShoppingCartForm/validator';
import { upgradeStudyFields } from '../UpgradeStudyForm/validator';

class StudiesList extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    currentUserStripeCustomerId: PropTypes.string,
    currentUser: PropTypes.object,
    studies: PropTypes.object,
    studyLevels: PropTypes.array,
    selectedIndicationLevelPrice: PropTypes.object,
    renewStudyFormValues: PropTypes.object,
    renewStudyFormError: PropTypes.bool,
    upgradeStudyFormValues: PropTypes.object,
    upgradeStudyFormError: PropTypes.bool,
    renewedStudy: PropTypes.object,
    upgradedStudy: PropTypes.object,
    editedStudy: PropTypes.object,
    fetchLevels: PropTypes.func,
    fetchIndicationLevelPrice: PropTypes.func,
    clearIndicationLevelPrice: PropTypes.func,
    renewStudy: PropTypes.func,
    upgradeStudy: PropTypes.func,
    editStudy: PropTypes.func,
    sitePatients: React.PropTypes.object,
    paginationOptions: React.PropTypes.object,
    setActiveSort: PropTypes.func,
    sortSuccess: PropTypes.func,
    shoppingCartFormError: PropTypes.object,
    shoppingCartFormValues: PropTypes.object,
    touchUpgradeStudy: PropTypes.func,
    touchShoppingCart: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      renewModalOpen: false,
      upgradeModalOpen: false,
      editModalOpen: false,
      selectedStudyId: null,
      selectedIndicationId: null,
      selectedCampaign: null,
    };

    this.openRenewModal = this.openRenewModal.bind(this);
    this.openUpgradeModal = this.openUpgradeModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeRenewModal = this.closeRenewModal.bind(this);
    this.closeUpgradeModal = this.closeUpgradeModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.handleRenewStudyFormSubmit = this.handleRenewStudyFormSubmit.bind(this);
    this.handleUpgradeStudyFormSubmit = this.handleUpgradeStudyFormSubmit.bind(this);
    this.handleEditStudyFormSubmit = this.handleEditStudyFormSubmit.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    this.props.fetchLevels();
  }

  componentWillReceiveProps(newProps) {
    const newRenewedStudy = newProps.renewedStudy;
    const oldRenewedStudy = this.props.renewedStudy;
    const newUpgradedStudy = newProps.upgradedStudy;
    const oldUpgradedStudy = this.props.upgradedStudy;
    const newEditedStudy = newProps.editedStudy;
    const oldEditedStudy = this.props.editedStudy;
    const newExposureLevelOfRenewStudy = newProps.renewStudyFormValues.exposureLevel;
    const oldExposureLevelOfRenewStudy = this.props.renewStudyFormValues.exposureLevel;
    const newLevelOfUpgradeStudy = newProps.upgradeStudyFormValues.level;
    const oldLevelOfUpgradeStudy = this.props.upgradeStudyFormValues.level;

    if (!newRenewedStudy.submitting && oldRenewedStudy.submitting) {
      this.closeRenewModal();
    }

    if (!newUpgradedStudy.submitting && oldUpgradedStudy.submitting) {
      this.closeUpgradeModal();
    }

    if (!newEditedStudy.submitting && oldEditedStudy.submitting) {
      this.closeEditModal();
    }

    if (newExposureLevelOfRenewStudy !== oldExposureLevelOfRenewStudy) {
      if (newExposureLevelOfRenewStudy) {
        this.props.fetchIndicationLevelPrice(newExposureLevelOfRenewStudy, this.state.selectedIndicationId);
      } else {
        this.props.clearIndicationLevelPrice();
      }
    }

    if (newLevelOfUpgradeStudy !== oldLevelOfUpgradeStudy) {
      if (newLevelOfUpgradeStudy) {
        this.props.fetchIndicationLevelPrice(newLevelOfUpgradeStudy, this.state.selectedIndicationId);
      } else {
        this.props.clearIndicationLevelPrice();
      }
    }
  }

  openRenewModal(studyId, indicationId, campaign) {
    this.setState({
      renewModalOpen: true,
      selectedStudyId: studyId,
      selectedIndicationId: indicationId,
      selectedCampaign: campaign,
    });
  }

  openUpgradeModal(studyId, indicationId, campaign) {
    this.setState({
      upgradeModalOpen: true,
      selectedStudyId: studyId,
      selectedIndicationId: indicationId,
      selectedCampaign: campaign,
    });
  }

  openEditModal(studyId, siteUsers) {
    this.setState({
      editModalOpen: true,
      selectedStudyId: studyId,
      selectedSiteUsers: siteUsers,
    });
  }

  closeRenewModal() {
    this.setState({
      renewModalOpen: false,
      selectedStudyId: null,
      selectedIndicationId: null,
    });
  }

  closeUpgradeModal() {
    this.setState({
      upgradeModalOpen: false,
      selectedStudyId: null,
      selectedIndicationId: null,
      selectedCampaign: null,
    });
  }

  closeEditModal() {
    this.setState({
      editModalOpen: false,
      selectedStudyId: null,
      selectedSiteUsers: null,
    });
  }

  handleRenewStudyFormSubmit(cartParams) {
    const { currentUserStripeCustomerId, renewStudyFormValues, renewStudy } = this.props;

    renewStudy(this.state.selectedStudyId, cartParams, {
      ...renewStudyFormValues,
      stripeCustomerId: currentUserStripeCustomerId,
      selectedIndicationId: this.state.selectedIndicationId,
      selectedSiteId: this.state.selectedCampaign.site_id,
      username: this.props.currentUser.username,
    });
  }

  handleUpgradeStudyFormSubmit() {
    const { shoppingCartFormError, shoppingCartFormValues, upgradeStudyFormError, touchUpgradeStudy, touchShoppingCart,
      currentUserStripeCustomerId, upgradeStudyFormValues, upgradeStudy } = this.props;

    if (upgradeStudyFormError || shoppingCartFormError) {
      touchUpgradeStudy();
      touchShoppingCart();
      return;
    }

    upgradeStudy(this.state.selectedStudyId, shoppingCartFormValues, {
      ...upgradeStudyFormValues,
      stripeCustomerId: currentUserStripeCustomerId,
      selectedIndicationId: this.state.selectedIndicationId,
      selectedCampaignId: this.state.selectedCampaign.id,
      selectedSiteId: this.state.selectedCampaign.site_id,
      username: this.props.currentUser.username,
    });
  }

  handleEditStudyFormSubmit(infoParams) {
    this.props.editStudy(this.state.selectedStudyId, infoParams);
  }

  generateRenewStudyShoppingCartAddOns() {
    const { studyLevels, selectedIndicationLevelPrice } = this.props;
    const { exposureLevel, campaignLength, condenseToTwoWeeks,
      patientMessagingSuite, callTracking } = this.props.renewStudyFormValues;
    const addOns = [];

    if (exposureLevel && campaignLength) {
      if (!selectedIndicationLevelPrice.fetching && selectedIndicationLevelPrice.details) {
        const foundExposureLevel = find(studyLevels, { id: exposureLevel });
        const monthLength = find(CAMPAIGN_LENGTH_LIST, { value: campaignLength });
        const durationString = (condenseToTwoWeeks) ? '2 Weeks' : monthLength.label;

        addOns.push({
          title: `${durationString} ${foundExposureLevel.type}`,
          price: selectedIndicationLevelPrice.details,
          quantity: monthLength.value,
          total: selectedIndicationLevelPrice.details * monthLength.value,
        });
      }
    }
    if (patientMessagingSuite) {
      addOns.push({
        title: 'Patient Messaging Suite',
        price: MESSAGING_SUITE_PRICE,
        quantity: 1,
        total: MESSAGING_SUITE_PRICE,
      });
    }
    if (callTracking) {
      addOns.push({
        title: 'Call Tracking',
        price: CALL_TRACKING_PRICE,
        quantity: 1,
        total: CALL_TRACKING_PRICE,
      });
    }

    return addOns;
  }

  generateUpgradeStudyShoppingCartAddOns() {
    const { studyLevels, selectedIndicationLevelPrice } = this.props;
    const { level, patientMessagingSuite, callTracking } = this.props.upgradeStudyFormValues;
    const addOns = [];

    if (level) {
      if (!selectedIndicationLevelPrice.fetching && selectedIndicationLevelPrice.details) {
        const foundLevel = find(studyLevels, { id: level });
        const monthLength = find(CAMPAIGN_LENGTH_LIST, { value: 1 });
        const durationString = monthLength.label;

        addOns.push({
          title: `${durationString} ${foundLevel.type}`,
          price: selectedIndicationLevelPrice.details,
          quantity: 1,
          total: selectedIndicationLevelPrice.details,
        });
      }
    }
    if (patientMessagingSuite) {
      addOns.push({
        title: 'Patient Messaging Suite',
        price: MESSAGING_SUITE_PRICE,
        quantity: 1,
        total: MESSAGING_SUITE_PRICE,
      });
    }
    if (callTracking) {
      addOns.push({
        title: 'Call Tracking',
        price: CALL_TRACKING_PRICE,
        quantity: 1,
        total: CALL_TRACKING_PRICE,
      });
    }

    return addOns;
  }

  sortBy(ev) {
    ev.preventDefault();
    let sort = ev.currentTarget.dataset.sort;
    let direction = 'up';
    const defaultSort = 'orderNumber';

    if (ev.currentTarget.className && ev.currentTarget.className.indexOf('up') !== -1) {
      direction = 'down';
    } else if (ev.currentTarget.className && ev.currentTarget.className.indexOf('down') !== -1) {
      direction = null;
      sort = null;
    }

    this.props.setActiveSort(sort, direction);

    const dir = ((direction === 'down') ? 'desc' : 'asc');
    const sorted = _.orderBy(this.props.studies.details, [function (o) {
      if (sort === 'indication') {
        return o.indication.name;
      }
      return o[(sort || defaultSort)];
    }], [dir]);
    this.props.sortSuccess(sorted);
  }

  render() {
    const { studies, renewStudyFormError, sitePatients } = this.props;
    const countResult = countBy(studies.details, entityIterator => entityIterator.status);
    const activeCount = countResult[ACTIVE_STATUS_VALUE] || 0;
    const inactiveCount = countResult[INACTIVE_STATUS_VALUE] || 0;
    const totalCount = studies.details.length;

    const studiesListContents = studies.details.map((item, index) => {
      const unreadMessageCount = sumBy(filter(sitePatients.details, { study_id: item.studyId }), (sitePatient) => {
        if (sitePatient.count_unread == null) {
          return 0;
        }
        return parseInt(sitePatient.count_unread);
      });

      return (
        <StudyItem
          {...item}
          key={index}
          index={index}
          unreadMessageCount={unreadMessageCount}
          onRenew={this.openRenewModal}
          onUpgrade={this.openUpgradeModal}
          onEdit={this.openEditModal}
        />
      );
    });
    let addOns = [];
    if (this.state.renewModalOpen) {
      addOns = this.generateRenewStudyShoppingCartAddOns();
    } else if (this.state.upgradeModalOpen) {
      addOns = this.generateUpgradeStudyShoppingCartAddOns();
    }

    return (
      <div className="studies">
        <div className="row">
          <div className="col-sm-12">
            <div className="table-responsive">
              <table className="table">
                <caption>
                  <span className="pull-left">Study Status</span>
                  <span className="pull-right">
                    <span className="inner-info">
                      <span className="info-label">ACTIVE</span>
                      <span className="info-value">{activeCount}</span>
                    </span>
                    <span className="inner-info">
                      <span className="info-label">INACTIVE</span>
                      <span className="info-value">{inactiveCount}</span>
                    </span>
                    <span className="inner-info">
                      <span className="info-label">TOTAL</span>
                      <span className="info-value">{totalCount}</span>
                    </span>
                  </span>
                </caption>
                <thead>
                  <tr>
                    <th onClick={this.sortBy} data-sort="orderNumber" className={(this.props.paginationOptions.activeSort === 'orderNumber') ? this.props.paginationOptions.activeDirection : ''}>#<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="indication" className={(this.props.paginationOptions.activeSort === 'indication') ? this.props.paginationOptions.activeDirection : ''}>INDICATION<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="location" className={(this.props.paginationOptions.activeSort === 'location') ? this.props.paginationOptions.activeDirection : ''}>LOCATION<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="sponsor" className={(this.props.paginationOptions.activeSort === 'sponsor') ? this.props.paginationOptions.activeDirection : ''}>SPONSOR<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="protocol" className={(this.props.paginationOptions.activeSort === 'protocol') ? this.props.paginationOptions.activeDirection : ''}>PROTOCOL<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="patientMessagingSuite" className={(this.props.paginationOptions.activeSort === 'patientMessagingSuite') ? this.props.paginationOptions.activeDirection : ''}>
                      <span className="icomoon-credit" data-original-title="Patient Messaging Suite" />
                      <i className="caret-arrow" />
                    </th>
                    <th onClick={this.sortBy} data-sort="status" className={(this.props.paginationOptions.activeSort === 'status') ? this.props.paginationOptions.activeDirection : ''}>STATUS<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="startDate" className={(this.props.paginationOptions.activeSort === 'startDate') ? this.props.paginationOptions.activeDirection : ''}>START DATE<i className="caret-arrow" /></th>
                    <th onClick={this.sortBy} data-sort="endDate" className={(this.props.paginationOptions.activeSort === 'endDate') ? this.props.paginationOptions.activeDirection : ''}>END DATE<i className="caret-arrow" /></th>
                  </tr>
                </thead>
                <tbody>
                  {studies.details.length > 0 && studiesListContents}
                </tbody>
              </table>
            </div>
            <Modal
              className="renew-study-modal"
              id="renew-study"
              dialogComponentClass={CenteredModal}
              show={this.state.renewModalOpen}
              onHide={this.closeRenewModal}
              backdrop
              keyboard
            >
              <Modal.Header>
                <Modal.Title>Renew Study</Modal.Title>
                <a className="lightbox-close close" onClick={this.closeRenewModal}>
                  <i className="icomoon-icon_close" />
                </a>
              </Modal.Header>
              <Modal.Body>
                <div className="form-study">
                  <div className="pull-left col">
                    <div className="scroll jcf--scrollable">
                      <div className="holder-inner">
                        <RenewStudyForm />
                      </div>
                    </div>
                  </div>
                  <div className="pull-left col">
                    <ShoppingCartForm
                      showCards
                      noBorder
                      addOns={addOns}
                      disableSubmit={renewStudyFormError}
                      onSubmit={this.handleRenewStudyFormSubmit}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              className="upgrade-study-modal"
              id="upgrade-study"
              dialogComponentClass={CenteredModal}
              show={this.state.upgradeModalOpen}
              onHide={this.closeUpgradeModal}
              backdrop
              keyboard
            >
              <Modal.Header>
                <Modal.Title>Upgrade Study</Modal.Title>
                <a className="lightbox-close close" onClick={this.closeUpgradeModal}>
                  <i className="icomoon-icon_close" />
                </a>
              </Modal.Header>
              <Modal.Body>
                <div className="form-study">
                  <div className="pull-left col">
                    <div className="scroll jcf--scrollable">
                      <div className="holder-inner">
                        <UpgradeStudyForm />
                      </div>
                    </div>
                  </div>
                  <div className="pull-left col">
                    <ShoppingCartForm
                      showCards
                      noBorder
                      addOns={addOns}
                      validateAndSubmit={this.handleUpgradeStudyFormSubmit}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              className="edit-study-modal"
              id="edit-study"
              dialogComponentClass={CenteredModal}
              show={this.state.editModalOpen}
              onHide={this.closeEditModal}
              backdrop
              keyboard
            >
              <Modal.Header>
                <Modal.Title>Edit Information</Modal.Title>
                <a className="lightbox-close close" onClick={this.closeEditModal}>
                  <i className="icomoon-icon_close" />
                </a>
              </Modal.Header>
              <Modal.Body>
                <div className="form-study">
                  <div className="scroll jcf--scrollable">
                    <div className="holder-inner">
                      <EditStudyForm siteUsers={this.state.selectedSiteUsers} onSubmit={this.handleEditStudyFormSubmit} />
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  currentUserStripeCustomerId: selectCurrentUserStripeCustomerId(),
  studies: selectStudies(),
  studyLevels: selectStudyLevels(),
  selectedIndicationLevelPrice: selectSelectedIndicationLevelPrice(),
  renewStudyFormValues: selectRenewStudyFormValues(),
  renewStudyFormError: selectRenewStudyFormError(),
  upgradeStudyFormValues: selectUpgradeStudyFormValues(),
  upgradeStudyFormError: selectUpgradeStudyFormError(),
  renewedStudy: selectRenewedStudy(),
  upgradedStudy: selectUpgradedStudy(),
  editedStudy: selectEditedStudy(),
  sitePatients: selectSitePatients(),
  paginationOptions: selectPaginationOptions(),
  shoppingCartFormError: selectShoppingCartFormError(),
  shoppingCartFormValues: selectShoppingCartFormValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchLevels: () => dispatch(fetchLevels()),
    fetchIndicationLevelPrice: (levelId, indicationId) => dispatch(fetchIndicationLevelPrice(levelId, indicationId)),
    clearIndicationLevelPrice: () => dispatch(clearIndicationLevelPrice()),
    renewStudy: (studyId, cartValues, formValues) => dispatch(renewStudy(studyId, cartValues, formValues)),
    upgradeStudy: (studyId, cartValues, formValues) => dispatch(upgradeStudy(studyId, cartValues, formValues)),
    editStudy: (formValues) => dispatch(editStudy(formValues)),
    setActiveSort: (sort, direction) => dispatch(setActiveSort(sort, direction)),
    sortSuccess: (payload) => dispatch(sortSuccess(payload)),
    touchUpgradeStudy: () => dispatch(touch('upgradeStudy', ...upgradeStudyFields)),
    touchShoppingCart: () => dispatch(touch('shoppingCart', ...shoppingCartFields)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesList);
